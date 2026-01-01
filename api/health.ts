// Health check endpoint for debugging
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'GET') {
    return response.status(405).json({ error: { message: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' } });
  }

  // Check if required env vars are set (without exposing values)
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  const hasElevenLabs = !!process.env.ELEVENLABS_API_KEY;
  const hasVoiceMale = !!process.env.ELEVENLABS_VOICE_MALE;
  const hasVoiceFemale = !!process.env.ELEVENLABS_VOICE_FEMALE;

  response.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      hasGemini,
      hasOpenAI,
      hasElevenLabs,
      hasVoiceMale,
      hasVoiceFemale,
    },
  });
}

