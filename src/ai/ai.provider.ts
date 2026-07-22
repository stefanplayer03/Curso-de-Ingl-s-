import { env } from "@/config/env";
import type { AiTutorProvider } from "@/ai/ai.types";
import { MockAiTutorProvider } from "@/ai/providers/mock.provider";

/**
 * Ponto único de decisão de qual provedor de IA usar.
 * Quando o provider "gemini" ou "vertex" for implementado, basta criar
 * o arquivo em ai/providers/ e adicionar o case aqui — nada mais muda no app.
 */
function createAiProvider(): AiTutorProvider {
  switch (env.ai.provider) {
    case "gemini":
    case "vertex":
      // TODO: plugar o provider real quando a integração for implementada.
      console.warn(`[ai] Provider "${env.ai.provider}" ainda não implementado. Usando mock.`);
      return new MockAiTutorProvider();
    case "mock":
    default:
      return new MockAiTutorProvider();
  }
}

export const aiTutorProvider: AiTutorProvider = createAiProvider();
