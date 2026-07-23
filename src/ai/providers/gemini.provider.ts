import type { AiChatMessage, AiConverseOptions, AiTutorProvider, AiTutorResponse } from "@/ai/ai.types";

/**
 * Implementação real de produção. Note que isto NUNCA chama a API do Gemini
 * diretamente — sempre passa pela função serverless (`/api/chat`), que é a
 * única peça que conhece a chave de API. Isso mantém a chave fora do bundle
 * do navegador (ver netlify/functions/chat.ts).
 */
export class GeminiTutorProvider implements AiTutorProvider {
  async converse(
    history: AiChatMessage[],
    studentLevel: string,
    options?: AiConverseOptions
  ): Promise<AiTutorResponse> {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        history,
        level: studentLevel,
        immersionMode: options?.immersionMode ?? false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Falha ao conversar com a IA (status ${response.status})`);
    }

    const data = await response.json();
    return {
      reply: data.reply ?? "Sorry, could you say that again?",
      corrections: data.corrections ?? [],
      suggestedFollowUp: data.suggestedFollowUp,
    };
  }
}
