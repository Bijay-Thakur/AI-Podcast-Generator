/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Optional: Only needed if backend is on a different domain
  readonly VITE_BACKEND_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
