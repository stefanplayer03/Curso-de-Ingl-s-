/**
 * Camada única de acesso às variáveis de ambiente.
 * Nenhum outro arquivo deve chamar import.meta.env diretamente —
 * isso mantém o projeto fácil de migrar (ex: para Vertex AI) sem caça a strings soltas.
 */
function requireEnv(key: string, value: string | undefined): string {
  if (!value || value.length === 0) {
    // Em desenvolvimento apenas avisamos; em produção isso deveria falhar o build.
    console.warn(`[env] Variável ${key} não definida. Configure seu .env.local`);
  }
  return value ?? "";
}

export const env = {
  firebase: {
    apiKey: requireEnv("VITE_FIREBASE_API_KEY", import.meta.env.VITE_FIREBASE_API_KEY),
    authDomain: requireEnv("VITE_FIREBASE_AUTH_DOMAIN", import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
    projectId: requireEnv("VITE_FIREBASE_PROJECT_ID", import.meta.env.VITE_FIREBASE_PROJECT_ID),
    storageBucket: requireEnv("VITE_FIREBASE_STORAGE_BUCKET", import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
    messagingSenderId: requireEnv(
      "VITE_FIREBASE_MESSAGING_SENDER_ID",
      import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID
    ),
    appId: requireEnv("VITE_FIREBASE_APP_ID", import.meta.env.VITE_FIREBASE_APP_ID),
  },
  ai: {
    provider: (import.meta.env.VITE_AI_PROVIDER ?? "mock") as "gemini" | "vertex" | "mock",
    apiKey: import.meta.env.VITE_AI_API_KEY ?? "",
  },
} as const;
