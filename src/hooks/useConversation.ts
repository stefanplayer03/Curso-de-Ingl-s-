import { useCallback, useRef, useState } from "react";
import { aiTutorProvider } from "@/ai/ai.provider";
import { BrowserSpeechRecognizer, BrowserSpeechSynthesizer } from "@/speech/browserSpeech.provider";
import { ConversationService } from "@/services/conversation.service";
import { FlashcardService } from "@/services/flashcard.service";
import type { ConversationMessage } from "@/types/conversation.types";

/**
 * Hook central do módulo de Conversação. Componentes de UI usam apenas isto —
 * nunca importam aiTutorProvider, o SDK de voz ou o ConversationService direto.
 */
export function useConversation(uid: string, level: string, topic: string, immersionMode = false) {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const sessionIdRef = useRef<string | null>(null);
  const recognizerRef = useRef(new BrowserSpeechRecognizer());
  const synthesizerRef = useRef(new BrowserSpeechSynthesizer());

  async function ensureSession(): Promise<string> {
    if (sessionIdRef.current) return sessionIdRef.current;
    const id = await ConversationService.createSession(uid, topic, level);
    sessionIdRef.current = id;
    return id;
  }

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      const studentMessage: ConversationMessage = {
        id: crypto.randomUUID(),
        role: "student",
        content,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, studentMessage]);
      setIsThinking(true);

      try {
        const sessionId = await ensureSession();
        await ConversationService.appendMessage(sessionId, studentMessage);

        const history = [...messages, studentMessage].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        let response;
        try {
          response = await aiTutorProvider.converse(history, level, { immersionMode });
        } catch (error) {
          console.error("[conversation] Falha ao consultar a IA:", error);
          response = {
            reply:
              "Hmm, tive um probleminha para responder agora. Pode tentar de novo em alguns segundos?",
            corrections: [],
          };
        }

        const tutorMessage: ConversationMessage = {
          id: crypto.randomUUID(),
          role: "tutor",
          content: response.reply,
          corrections: response.corrections,
          createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, tutorMessage]);
        await ConversationService.appendMessage(sessionId, tutorMessage);

        // Cada correção vira um flashcard de revisão espaçada — Active Recall
        // automático, sem o aluno precisar fazer nada.
        for (const correction of response.corrections) {
          FlashcardService.createFromCorrection(
            uid,
            correction.original,
            correction.corrected,
            correction.explanation
          ).catch((error) => console.error("[conversation] Falha ao criar flashcard:", error));
        }

        // A professora "fala" a resposta em voz alta — reforça o par escuta+leitura.
        synthesizerRef.current.speak(response.reply).catch(() => {
          /* síntese de voz é um extra — falha silenciosa não deve travar o chat */
        });
      } finally {
        setIsThinking(false);
      }
    },
    [messages, level, immersionMode]
  );

  const startListening = useCallback((onTranscript: (text: string) => void) => {
    setIsListening(true);
    recognizerRef.current.start((result) => {
      setIsListening(false);
      onTranscript(result.transcript);
    });
  }, []);

  const stopListening = useCallback(() => {
    recognizerRef.current.stop();
    setIsListening(false);
  }, []);

  return { messages, isThinking, isListening, sendMessage, startListening, stopListening };
}
