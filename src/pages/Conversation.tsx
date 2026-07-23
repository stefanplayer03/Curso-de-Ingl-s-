import { useEffect, useRef, useState } from "react";
import { Send, Waves } from "lucide-react";
import { AppLayout } from "@/layouts/AppLayout";
import { ChatBubble } from "@/components/conversation/ChatBubble";
import { MicButton } from "@/components/conversation/MicButton";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useConversation } from "@/hooks/useConversation";
import { useGamification } from "@/hooks/useGamification";
import { StatisticsService } from "@/services/statistics.service";
import { XP_PER_MESSAGE } from "@/constants/achievements";
import { GOAL_OPTIONS } from "@/constants/goals";

/**
 * Módulo de Conversação: o coração pedagógico do English AI Master.
 * O aluno digita ou fala; a IA responde, corrige com gentileza (nunca
 * critica) e a resposta é lida em voz alta — reforçando escuta + leitura.
 */
export function ConversationPage() {
  const { firebaseUser } = useAuth();
  const { profile } = useUserProfile();
  const level = profile?.level ?? "A1";
  // O tema da conversa segue o primeiro objetivo escolhido pelo aluno nas Configurações
  // (ex: "Viajar" → conversa sobre viagens). Sem objetivo definido, cai num tema neutro.
  const primaryGoalId = profile?.goals?.[0]?.id;
  const topic = GOAL_OPTIONS.find((g) => g.id === primaryGoalId)?.topic ?? "Daily routine";

  const { messages, isThinking, isListening, sendMessage, startListening, stopListening } =
    useConversation(firebaseUser?.uid ?? "anon", level, topic, profile?.immersionMode ?? false);
  const { awardXp, unlock } = useGamification();

  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const isFirstMessageRef = useRef(true);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = draft;
    setDraft("");
    const wasFirstMessage = isFirstMessageRef.current;
    isFirstMessageRef.current = false;

    await sendMessage(text);
    await awardXp(XP_PER_MESSAGE);
    if (firebaseUser) {
      StatisticsService.logActivity(firebaseUser.uid, { messages: 1 }).catch((error) =>
        console.error("[conversation] Falha ao registrar estatística:", error)
      );
    }
    if (wasFirstMessage) {
      await unlock("first-conversation");
    }
  }

  return (
    <AppLayout>
      <div className="mx-auto flex h-[calc(100vh-9rem)] max-w-2xl flex-col">
        <div className="mb-4">
          <span className="font-mono text-xs uppercase tracking-wider text-brand-500 dark:text-brand-300">
            Nível {level} · {topic}
          </span>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark">
              Vamos conversar
            </h1>
            {profile?.immersionMode && (
              <span className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-amber-700 dark:text-amber-300">
                <Waves className="h-3 w-3" /> Imersão
              </span>
            )}
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto pr-1">
          {messages.length === 0 && (
            <p className="font-body text-sm text-ink-soft dark:text-ink-dark/70">
              {profile?.immersionMode
                ? 'Say "hi" to start — the teacher will only reply in English from now on.'
                : 'Diga "oi" pra começar — pode ser em inglês ou português, a professora te ajuda.'}
            </p>
          )}
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
          {isThinking && (
            <p className="font-body text-xs text-ink-soft dark:text-ink-dark/60">
              A professora está digitando…
            </p>
          )}
        </div>

        <div className="mt-4 flex items-end gap-3">
          <MicButton
            isListening={isListening}
            onStart={() => startListening((text) => setDraft(text))}
            onStop={stopListening}
          />

          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={1}
            placeholder="Escreva em inglês (ou português, sem medo)…"
            className="flex-1 resize-none rounded-xl2 border border-ink/10 bg-white/60 px-4 py-3 font-body text-sm text-ink outline-none focus:border-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-ink-dark"
          />

          <Button onClick={handleSend} disabled={!draft.trim() || isThinking} aria-label="Enviar mensagem">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
