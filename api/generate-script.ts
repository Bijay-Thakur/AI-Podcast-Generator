// Generate podcast script using Gemini or OpenAI
import type { VercelRequest, VercelResponse } from '@vercel/node';

interface ScriptRequest {
  topic: string;
  provider: 'gemini' | 'chatgpt';
  length: string;
  person1Gender: 'male' | 'female';
  person2Gender: 'male' | 'female';
}

interface ErrorResponse {
  error: {
    message: string;
    code: string;
  };
}

// Simple input validation
function validateRequest(body: any): body is ScriptRequest {
  return (
    typeof body === 'object' &&
    typeof body.topic === 'string' &&
    body.topic.trim().length > 0 &&
    (body.provider === 'gemini' || body.provider === 'chatgpt') &&
    typeof body.length === 'string' &&
    (body.person1Gender === 'male' || body.person1Gender === 'female') &&
    (body.person2Gender === 'male' || body.person2Gender === 'female')
  );
}

// Helper: Sleep function
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  // Add delay before Gemini requests to prevent rate limiting
  await sleep(1000); // 1 second delay

  const models = ['gemini-1.5-flash', 'gemini-2.0-flash-exp'];
  
  for (const model of models) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.9,
              topP: 0.95,
              topK: 40,
              maxOutputTokens: 8192,
            },
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorText = '';
        let errorData: any = null;
        
        try {
          errorText = await response.text();
          errorData = JSON.parse(errorText);
        } catch {
          // If parsing fails, use raw text
        }
        
        // Handle rate limiting (429) - Gemini specific
        if (response.status === 429) {
          const retryAfter = response.headers.get('retry-after') || '60';
          const errorMsg = errorData?.error?.message || errorText || 'Rate limit exceeded';
          throw new Error(`Gemini API rate limit exceeded. Please wait ${retryAfter} seconds. Error: ${errorMsg.substring(0, 100)}`);
        }
        
        // Handle quota exceeded (429 can also mean quota)
        if (errorData?.error?.message?.toLowerCase().includes('quota') || 
            errorData?.error?.message?.toLowerCase().includes('billing')) {
          throw new Error('Gemini API quota exceeded. Please check your billing or upgrade your plan.');
        }
        
        if (model === models[models.length - 1]) {
          throw new Error(`Gemini API error: ${response.status} - ${(errorData?.error?.message || errorText).substring(0, 200)}`);
        }
        continue;
      }

      const data = await response.json();
      
      if (data.error) {
        // Check for rate limit in error object
        if (data.error.message?.toLowerCase().includes('rate') || 
            data.error.message?.toLowerCase().includes('quota') ||
            data.error.code === 429) {
          throw new Error(`Gemini API rate limit: ${data.error.message}`);
        }
        throw new Error(`Gemini API error: ${data.error.message || JSON.stringify(data.error)}`);
      }
      
      const candidate = data?.candidates?.[0];
      if (!candidate) {
        throw new Error('No candidates returned from Gemini API');
      }

      const parts = candidate.content?.parts || [];
      const text = parts
        .map((part: { text?: string }) => part?.text)
        .filter(Boolean)
        .join('\n\n');

      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from Gemini API');
      }

      return text.trim();
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      // If it's a rate limit error, don't try next model
      if (error.message?.includes('rate limit') || 
          error.message?.includes('quota') || 
          error.message?.includes('429')) {
        throw error;
      }
      
      if (model === models[models.length - 1] || !error.message?.includes('404')) {
        throw error;
      }
      continue;
    }
  }
  
  throw new Error('All Gemini models failed');
}

async function callOpenAI(prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.9,
        messages: [
          {
            role: 'system',
            content: 'You are a professional podcast script writer. Create natural, engaging, and warm conversational scripts.',
          },
          { role: 'user', content: prompt },
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText.substring(0, 200)}`);
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content?.trim() || '';
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
): Promise<void> {
  // CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: { message: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' } });
  }

  // Validate request size
  const contentLength = request.headers['content-length'];
  if (contentLength && parseInt(contentLength) > 100000) { // 100KB limit
    return response.status(413).json({ error: { message: 'Request too large', code: 'PAYLOAD_TOO_LARGE' } });
  }

  try {
    // Validate input
    if (!validateRequest(request.body)) {
      return response.status(400).json({ error: { message: 'Invalid request body', code: 'VALIDATION_ERROR' } });
    }

    const { topic, provider, length, person1Gender, person2Gender } = request.body;

    // Generate appropriate names based on gender
    const hostName = person1Gender === 'male' ? 'Alex' : 'Sarah';
    const guestName = person2Gender === 'male' ? 'Michael' : 'Emma';
    
    const prompt = `Create a professional podcast script for "VoxGen AI Podcast Studio" between two people discussing: ${topic}

Requirements:
- Duration: ${length} minutes
- Show Name: ALWAYS use "VoxGen AI Podcast Studio" - never change this name, never use any other show name
- Host: ${hostName} (${person1Gender}) - the host of the show
- Guest: ${guestName} (${person2Gender}) - the guest on the show
- Format: A conversation between ${hostName} (the host) and ${guestName} (the guest)
- Tone: Natural, warm, conversational - like a real podcast
- Structure: 
  1. Introduction where ${hostName} introduces the show "VoxGen AI Podcast Studio" and welcomes ${guestName}
  2. ${hostName} and ${guestName} introduce themselves (${hostName} as host, ${guestName} as guest)
  3. Main discussion about the topic
  4. Conclusion
- IMPORTANT: Format each line EXACTLY as "${hostName}: [dialogue]" or "${guestName}: [dialogue]" on separate lines
- Each person's dialogue should be on its own line starting with "${hostName}:" or "${guestName}:" followed by a colon and space
- NEVER use "Person 1" or "Person 2" - always use the actual names ${hostName} and ${guestName}
- Make it engaging, informative, and natural-sounding
- Target word count: approximately ${parseInt(length) * 150} words per minute
- Alternate between ${hostName} and ${guestName} for a natural conversation flow

Example format:
${hostName}: Welcome to VoxGen AI Podcast Studio. I'm ${hostName}, your host for today's show.
${guestName}: Thank you for having me, ${hostName}. I'm ${guestName}, and I'm excited to be here.
${hostName}: Absolutely. Let's dive right into today's topic...

Generate the complete script following this exact format:`;

    let script: string;
    if (provider === 'gemini') {
      script = await callGemini(prompt);
    } else {
      script = await callOpenAI(prompt);
    }

    response.status(200).json({ script });
  } catch (error: any) {
    console.error('Script generation error:', error.message); // Never log secrets
    
    // Check if it's a rate limit error
    if (error.message?.includes('Rate limit') || 
        error.message?.includes('rate limit') ||
        error.message?.includes('429') ||
        error.message?.includes('quota')) {
      const errorResponse: ErrorResponse = {
        error: {
          message: error.message || 'Rate limit exceeded. Please wait before trying again.',
          code: 'RATE_LIMIT_EXCEEDED',
        },
      };
      return response.status(429).json(errorResponse);
    }
    
    const errorResponse: ErrorResponse = {
      error: {
        message: error.message || 'Failed to generate script',
        code: 'GENERATION_ERROR',
      },
    };
    response.status(500).json(errorResponse);
  }
}

