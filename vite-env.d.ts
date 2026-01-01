/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_OPENAI_API_KEY: string;
  readonly VITE_OPENAI_MODEL?: string;
  readonly VITE_ELEVENLABS_API_KEY: string;
  readonly VITE_ELEVENLABS_VOICE_MALE: string;
  readonly VITE_ELEVENLABS_VOICE_FEMALE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
