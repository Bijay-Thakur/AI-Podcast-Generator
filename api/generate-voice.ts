// Generate voice audio using ElevenLabs
import type { VercelRequest, VercelResponse } from '@vercel/node';

interface VoiceRequest {
  text: string;
  voiceId: string;
}

interface ErrorResponse {
  error: {
    message: string;
    code: string;
  };
}

function validateRequest(body: any): body is VoiceRequest {
  return (
    typeof body === 'object' &&
    typeof body.text === 'string' &&
    body.text.trim().length >= 3 &&
    body.text.trim().length <= 5000 &&
    typeof body.voiceId === 'string' &&
    body.voiceId.trim().length > 0
  );
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
): Promise<void> {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: { message: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' } });
  }

  const contentLength = request.headers['content-length'];
  if (contentLength && parseInt(contentLength) > 10000) { // 10KB limit for text
    return response.status(413).json({ error: { message: 'Request too large', code: 'PAYLOAD_TOO_LARGE' } });
  }

  try {
    if (!validateRequest(request.body)) {
      return response.status(400).json({ error: { message: 'Invalid request body', code: 'VALIDATION_ERROR' } });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return response.status(500).json({ error: { message: 'ELEVENLABS_API_KEY is not configured', code: 'CONFIG_ERROR' } });
    }

    const { text, voiceId } = request.body;

    // Clean text
    let cleanText = text.trim();
    cleanText = cleanText.replace(/^Person\s+[12]\s*[:\-]\s*/gmi, '').trim();

    if (cleanText.length < 3) {
      return response.status(400).json({ error: { message: 'Text is too short (minimum 3 characters)', code: 'VALIDATION_ERROR' } });
    }

    if (cleanText.length > 5000) {
      cleanText = cleanText.substring(0, 5000);
    }

    // Call ElevenLabs API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout for TTS

    const elevenLabsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text: cleanText,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
          },
          model_id: 'eleven_multilingual_v2',
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!elevenLabsResponse.ok) {
      const errorText = await elevenLabsResponse.text();
      console.error('ElevenLabs API error:', { status: elevenLabsResponse.status, error: errorText.substring(0, 200) });
      return response.status(elevenLabsResponse.status).json({
        error: {
          message: `ElevenLabs API error (${elevenLabsResponse.status}): ${errorText.substring(0, 200)}`,
          code: 'ELEVENLABS_ERROR',
        },
      });
    }

    const contentType = elevenLabsResponse.headers.get('content-type');
    if (!contentType || !contentType.includes('audio')) {
      const errorText = await elevenLabsResponse.text();
      return response.status(500).json({
        error: {
          message: `Unexpected response type: ${contentType}`,
          code: 'INVALID_RESPONSE',
        },
      });
    }

    // Convert audio to base64
    const arrayBuffer = await elevenLabsResponse.arrayBuffer();
    
    if (arrayBuffer.byteLength < 1000) {
      return response.status(500).json({
        error: {
          message: 'Audio response is too short. This usually means the API key or voice ID is incorrect.',
          code: 'INVALID_AUDIO',
        },
      });
    }

    // Convert to base64
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    response.status(200).json({
      audio: base64,
      mimeType: 'audio/mpeg',
      size: arrayBuffer.byteLength,
    });
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return response.status(504).json({ error: { message: 'Request timeout', code: 'TIMEOUT' } });
    }
    console.error('Voice generation error:', error.message);
    const errorResponse: ErrorResponse = {
      error: {
        message: error.message || 'Failed to generate voice',
        code: 'GENERATION_ERROR',
      },
    };
    response.status(500).json(errorResponse);
  }
}

