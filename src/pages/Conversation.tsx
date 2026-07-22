import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { AppLayout } from "@/layouts/AppLayout";
import { ChatBubble } from "@/components/conversation/ChatBubble";
import { MicButton } from "@/components/conversation/MicButton";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useConversation } from "@/hooks/useConversation";

/**
 * Módulo de Conversação: o coração pedagógico do English AI Master.
 * O aluno digita ou fala; a IA responde, corrige com gentileza (nunca
 * critica) e a resposta é lida em voz alta — reforçando escuta + leitura.
 */
export function ConversationPage() {
  const { firebaseUser } = useAuth();
  const { profile } = useUserProfile();
  const level = profile?.level ?? "A1";
  const topic = "Daily routine";

  const { messages, isThinking, isListening, sendMessage, startListening, stopListening } =
    useConversation(firebaseUser?.uid ?? "anon", level, topic);

  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = draft;
    setDraft("");
    await sendMessage(text);
  }

  return (
    <AppLayout>
      <div className="mx-auto flex h-[calc(100vh-9rem)] max-w-2xl flex-col">
        <div className="mb-4">
          <span className="font-mono text-xs uppercase tracking-wider text-brand-500 dark:text-brand-300">
            Nível {level} · {topic}
          </span>
          <h1 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark">
            Vamos conversar
          </h1>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto pr-1">
          {messages.length === 0 && (
            <p className="font-body text-sm text-ink-soft dark:text-ink-dark/70">
              Diga "oi" pra começar — pode ser em inglês ou português, a professora te ajuda.
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
