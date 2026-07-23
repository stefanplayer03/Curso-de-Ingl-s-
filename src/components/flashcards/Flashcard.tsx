import { useState } from "react";
import { motion } from "framer-motion";
import type { ReviewCard } from "@/types/flashcard.types";

export function Flashcard({ card }: { card: ReviewCard }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full [perspective:1000px]" onClick={() => setIsFlipped((f) => !f)}>
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.4 }}
        className="relative h-56 w-full cursor-pointer [transform-style:preserve-3d]"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl2 bg-white p-6 text-center shadow-soft [backface-visibility:hidden] dark:bg-white/10">
          <span className="font-mono text-xs uppercase tracking-wider text-brand-500 dark:text-brand-300">
            Você escreveu
          </span>
          <p className="mt-3 font-display text-xl font-medium text-ink dark:text-ink-dark">
            {card.front}
          </p>
          <span className="mt-4 font-body text-xs text-ink-soft dark:text-ink-dark/60">
            Toque para ver a correção
          </span>
        </div>

        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-xl2 bg-brand-700 p-6 text-center shadow-soft [backface-visibility:hidden]"
          style={{ transform: "rotateY(180deg)" }}
        >
          <span className="font-mono text-xs uppercase tracking-wider text-amber-300">
            Forma correta
          </span>
          <p className="mt-3 font-display text-xl font-medium text-paper">{card.back}</p>
          <p className="mt-3 font-body text-xs text-brand-100">{card.explanation}</p>
        </div>
      </motion.div>
    </div>
  );
}
