import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, MessageCircle, Sparkles, Trophy, Target } from "lucide-react";
import type { AchievementDefinition } from "@/types/gamification.types";

const ICONS = {
  message: MessageCircle,
  flame: Flame,
  sparkles: Sparkles,
  trophy: Trophy,
  target: Target,
};

interface AchievementToastProps {
  achievement: AchievementDefinition | null;
  onDismiss: () => void;
}

export function AchievementToast({ achievement, onDismiss }: AchievementToastProps) {
  useEffect(() => {
    if (!achievement) return;
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [achievement, onDismiss]);

  const Icon = achievement ? ICONS[achievement.icon] : null;

  return (
    <AnimatePresence>
      {achievement && Icon && (
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.95 }}
          className="fixed left-1/2 top-6 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl2 bg-brand-700 px-5 py-3 text-paper shadow-soft"
          role="status"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500">
            <Icon className="h-5 w-5 text-ink" />
          </span>
          <div>
            <p className="font-display text-sm font-semibold">{achievement.title}</p>
            <p className="font-body text-xs text-brand-100">{achievement.description}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
