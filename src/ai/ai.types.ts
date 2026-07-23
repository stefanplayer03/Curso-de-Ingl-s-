export interface AiChatMessage {
  role: "student" | "tutor";
  content: string;
}

export interface AiCorrection {
  original: string;
  corrected: string;
  explanation: string; // sempre em tom encorajador, nunca ríspido
}

export interface AiTutorResponse {
  reply: string;
  corrections: AiCorrection[];
  suggestedFollowUp?: string;
}

export interface AiConverseOptions {
  /** Modo Imersão: a IA nunca responde em português, nunca traduz. */
  immersionMode?: boolean;
}

/**
 * Contrato que qualquer provedor de IA (Gemini, Vertex, mock local) precisa cumprir.
 * Nada no app deve depender de um provedor específico — apenas desta interface.
 */
export interface AiTutorProvider {
  converse(
    history: AiChatMessage[],
    studentLevel: string,
    options?: AiConverseOptions
  ): Promise<AiTutorResponse>;
}
