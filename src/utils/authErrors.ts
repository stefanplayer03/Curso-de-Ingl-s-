/**
 * Traduz códigos de erro do Firebase Auth em mensagens amigáveis e motivadoras,
 * seguindo o perfil da IA definido no prompt mestre: nunca ríspida, sempre clara.
 */
const FRIENDLY_MESSAGES: Record<string, string> = {
  "auth/invalid-email": "Esse e-mail não parece válido. Confere pra gente aí?",
  "auth/user-not-found": "Não encontramos uma conta com esse e-mail.",
  "auth/wrong-password": "Senha incorreta. Tenta de novo?",
  "auth/invalid-credential": "E-mail ou senha incorretos. Tenta de novo?",
  "auth/email-already-in-use": "Já existe uma conta com esse e-mail. Que tal fazer login?",
  "auth/weak-password": "Sua senha precisa ter pelo menos 6 caracteres.",
  "auth/too-many-requests": "Muitas tentativas seguidas. Espera um instante e tenta de novo.",
  "auth/network-request-failed": "Sem conexão com a internet no momento.",
};

export function getFriendlyAuthError(error: unknown): string {
  const code = (error as { code?: string })?.code;
  if (code && FRIENDLY_MESSAGES[code]) {
    return FRIENDLY_MESSAGES[code];
  }
  return "Algo deu errado. Vamos tentar novamente?";
}
