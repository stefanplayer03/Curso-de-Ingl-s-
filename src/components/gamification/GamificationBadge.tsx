import { Flame, Zap } from "lucide-react";

interface GamificationBadgeProps {
  xp: number;
  streakCount: number;
}

export function GamificationBadge({ xp, streakCount }: GamificationBadgeProps) {
  return (
    <div className="flex items-center gap-3 font-mono text-xs text-ink-soft dark:text-ink-dark/70">
      <span className="flex items-center gap-1" title="Sequência de dias estudando">
        <Flame className="h-3.5 w-3.5 text-amber-500" aria-hidden />
        {streakCount}
      </span>
      <span className="flex items-center gap-1" title="Pontos de experiência">
        <Zap className="h-3.5 w-3.5 text-brand-500 dark:text-brand-300" aria-hidden />
        {xp} XP
      </span>
    </div>
  );
}
