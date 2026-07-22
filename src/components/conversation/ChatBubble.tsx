import { Sparkles } from "lucide-react";
import type { ConversationMessage } from "@/types/conversation.types";

export function ChatBubble({ message }: { message: ConversationMessage }) {
  const isTutor = message.role === "tutor";

  return (
    <div className={`flex ${isTutor ? "justify-start" : "justify-end"}`}>
      <div className="flex max-w-[80%] flex-col gap-2">
        <div
          className={`rounded-xl2 px-4 py-3 font-body text-sm shadow-soft ${
            isTutor
              ? "bg-white text-ink dark:bg-white/10 dark:text-ink-dark"
              : "bg-brand-700 text-paper"
          }`}
        >
          {message.content}
        </div>

        {message.corrections && message.corrections.length > 0 && (
          <div className="flex flex-col gap-1.5 rounded-xl2 border border-amber-500/30 bg-amber-500/10 px-4 py-3">
            {message.corrections.map((correction, i) => (
              <div key={i} className="flex items-start gap-2 font-body text-xs text-ink dark:text-ink-dark">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700" aria-hidden />
                <span>
                  <span className="line-through opacity-60">{correction.original}</span>
                  {" → "}
                  <span className="font-semibold">{correction.corrected}</span>
                  <span className="block text-ink-soft dark:text-ink-dark/70">
                    {correction.explanation}
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
