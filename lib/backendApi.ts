// Backend API client - single source of truth for all API calls
// This replaces direct calls to Gemini/OpenAI/ElevenLabs

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || '/api';

interface ApiError {
  error: {
    message: string;
    code: string;
  };
}

class BackendApiError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'BackendApiError';
    this.code = code;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: ApiError;
    try {
      errorData = await response.json();
    } catch {
      // Handle 429 specifically
      if (response.status === 429) {
        throw new BackendApiError(
          'Rate limit exceeded. Please wait a moment before trying again.',
          'RATE_LIMIT_EXCEEDED'
        );
      }
      throw new BackendApiError(`HTTP ${response.status}: ${response.statusText}`, 'HTTP_ERROR');
    }

    // Check for rate limit error
    if (response.status === 429 || errorData.error?.code === 'RATE_LIMIT_EXCEEDED') {
      throw new BackendApiError(
        errorData.error?.message || 'Rate limit exceeded. Please wait before trying again.',
        'RATE_LIMIT_EXCEEDED'
      );
    }

    throw new BackendApiError(
      errorData.error?.message || `Request failed with status ${response.status}`,
      errorData.error?.code || 'UNKNOWN_ERROR'
    );
  }

  return response.json();
}

// Health check
export async function checkHealth(): Promise<{
  status: string;
  timestamp: string;
  env: {
    hasGemini: boolean;
    hasOpenAI: boolean;
    hasElevenLabs: boolean;
    hasVoiceMale: boolean;
    hasVoiceFemale: boolean;
  };
}> {
  const response = await fetch(`${API_BASE_URL}/health`);
  return handleResponse(response);
}

// Script generation
export interface ScriptGenerationParams {
  topic: string;
  provider: 'gemini' | 'chatgpt';
  length: string;
  person1Gender: 'male' | 'female';
  person2Gender: 'male' | 'female';
}

export interface ScriptResponse {
  script: string;
}

export async function generateScript(params: ScriptGenerationParams): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/generate-script`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  const data = await handleResponse<ScriptResponse>(response);
  return data.script;
}

// Script refinement
export interface RefineScriptParams {
  script: string;
  provider: 'gemini' | 'chatgpt';
  instruction?: string;
}

export async function refineScript(params: RefineScriptParams): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/refine-script`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  const data = await handleResponse<ScriptResponse>(response);
  return data.script;
}

// Voice generation
export interface VoiceGenerationParams {
  text: string;
  voiceId: string;
}

export interface VoiceResponse {
  audio: string; // base64 encoded
  mimeType: string;
  size: number;
}

export async function generateVoice(params: VoiceGenerationParams): Promise<ArrayBuffer> {
  const response = await fetch(`${API_BASE_URL}/generate-voice`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  const data = await handleResponse<VoiceResponse>(response);
  
  // Convert base64 to ArrayBuffer
  const binaryString = atob(data.audio);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Get voice IDs
export interface VoiceIdsResponse {
  male: string;
  female: string;
}

export async function getVoiceIds(): Promise<VoiceIdsResponse> {
  const response = await fetch(`${API_BASE_URL}/get-voice-ids`);
  return handleResponse<VoiceIdsResponse>(response);
}

