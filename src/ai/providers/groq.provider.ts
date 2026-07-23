import type { AiChatMessage, AiConverseOptions, AiTutorProvider, AiTutorResponse } from "@/ai/ai.types";

/**
 * Assim como o GeminiTutorProvider, nunca chama a API do Groq direto do
 * navegador — sempre passa pela função serverless (`/api/chat-groq`), que é
 * a única peça que conhece a chave (ver netlify/functions/chat-groq.ts).
 */
export class GroqTutorProvider implements AiTutorProvider {
  async converse(
    history: AiChatMessage[],
    studentLevel: string,
    options?: AiConverseOptions
  ): Promise<AiTutorResponse> {
    const response = await fetch("/api/chat-groq", {
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
