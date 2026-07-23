import { Plane, Briefcase, Film, Music, Home, Laptop, GraduationCap, Users, Check } from "lucide-react";
import { GOAL_OPTIONS } from "@/constants/goals";

const ICONS = {
  plane: Plane,
  briefcase: Briefcase,
  film: Film,
  music: Music,
  home: Home,
  laptop: Laptop,
  "graduation-cap": GraduationCap,
  users: Users,
};

interface GoalSelectorProps {
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export function GoalSelector({ selectedIds, onToggle }: GoalSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {GOAL_OPTIONS.map((goal) => {
        const Icon = ICONS[goal.icon];
        const isSelected = selectedIds.includes(goal.id);

        return (
          <button
            key={goal.id}
            type="button"
            onClick={() => onToggle(goal.id)}
            className={`relative flex flex-col items-center gap-2 rounded-xl2 px-3 py-4 text-center transition-colors ${
              isSelected
                ? "bg-brand-700 text-paper"
                : "bg-white/60 text-ink hover:bg-brand-50 dark:bg-white/5 dark:text-ink-dark dark:hover:bg-white/10"
            }`}
          >
            {isSelected && (
              <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500">
                <Check className="h-3 w-3 text-ink" />
              </span>
            )}
            <Icon className="h-5 w-5" />
            <span className="font-body text-xs font-medium">{goal.label}</span>
          </button>
        );
      })}
    </div>
  );
}
