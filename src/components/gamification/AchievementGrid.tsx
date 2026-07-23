import { Flame, MessageCircle, Sparkles, Trophy, Target, Lock } from "lucide-react";
import type { AchievementDefinition } from "@/types/gamification.types";

const ICONS = {
  message: MessageCircle,
  flame: Flame,
  sparkles: Sparkles,
  trophy: Trophy,
  target: Target,
};

interface AchievementGridProps {
  achievements: AchievementDefinition[];
  unlockedIds: string[];
}

export function AchievementGrid({ achievements, unlockedIds }: AchievementGridProps) {
  return (
    <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
      {achievements.map((achievement) => {
        const isUnlocked = unlockedIds.includes(achievement.id);
        const Icon = ICONS[achievement.icon];

        return (
          <div
            key={achievement.id}
            className={`flex flex-col items-center gap-2 rounded-xl2 px-4 py-5 text-center transition-opacity ${
              isUnlocked
                ? "bg-white shadow-soft dark:bg-white/10"
                : "bg-white/30 opacity-50 dark:bg-white/5"
            }`}
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                isUnlocked ? "bg-amber-500" : "bg-ink/10 dark:bg-white/10"
              }`}
            >
              {isUnlocked ? (
                <Icon className="h-5 w-5 text-ink" />
              ) : (
                <Lock className="h-4 w-4 text-ink-soft dark:text-ink-dark/60" />
              )}
            </span>
            <p className="font-body text-xs font-medium text-ink dark:text-ink-dark">
              {achievement.title}
            </p>
          </div>
        );
      })}
    </div>
  );
}
