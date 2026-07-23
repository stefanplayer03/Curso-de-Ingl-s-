import { env } from "@/config/env";
import type { AiTutorProvider } from "@/ai/ai.types";
import { MockAiTutorProvider } from "@/ai/providers/mock.provider";
import { GeminiTutorProvider } from "@/ai/providers/gemini.provider";
import { GroqTutorProvider } from "@/ai/providers/groq.provider";

/**
 * Ponto único de decisão de qual provedor de IA usar.
 * Quando o Vertex AI for implementado, basta criar o arquivo em
 * ai/providers/ e adicionar o case aqui — nada mais muda no app.
 */
function createAiProvider(): AiTutorProvider {
  switch (env.ai.provider) {
    case "gemini":
      return new GeminiTutorProvider();
    case "groq":
      return new GroqTutorProvider();
    case "vertex":
      // TODO: plugar o Vertex AI quando a integração for implementada.
      console.warn(`[ai] Provider "vertex" ainda não implementado. Usando mock.`);
      return new MockAiTutorProvider();
    case "mock":
    default:
      return new MockAiTutorProvider();
  }
}

export const aiTutorProvider: AiTutorProvider = createAiProvider();
