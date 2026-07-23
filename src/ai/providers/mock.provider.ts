import type { AiChatMessage, AiTutorProvider, AiTutorResponse } from "@/ai/ai.types";

/**
 * Provider local, sem custo, usado em desenvolvimento e testes.
 * Serve para validar toda a UI de conversação antes de plugar Gemini/Vertex.
 */
export class MockAiTutorProvider implements AiTutorProvider {
  async converse(history: AiChatMessage[], _studentLevel?: string, _options?: unknown): Promise<AiTutorResponse> {
    const lastMessage = history[history.length - 1]?.content ?? "";

    return {
      reply: `Great job! Tell me more about "${lastMessage}".`,
      corrections: [],
      suggestedFollowUp: "What do you usually do next?",
    };
  }
}
