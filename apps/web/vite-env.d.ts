/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REMOTE_APP1: string;
  readonly VITE_REMOTE_APP2: string;
  // 可以添加其他环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
