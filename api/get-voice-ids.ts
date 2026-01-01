// Get voice IDs for male/female (without exposing API keys)
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(
  request: VercelRequest,
  response: VercelResponse,
): void {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'GET') {
    return response.status(405).json({ error: { message: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' } });
  }

  // Return voice IDs (these are not secrets, just identifiers)
  response.status(200).json({
    male: process.env.ELEVENLABS_VOICE_MALE || '',
    female: process.env.ELEVENLABS_VOICE_FEMALE || '',
  });
}

