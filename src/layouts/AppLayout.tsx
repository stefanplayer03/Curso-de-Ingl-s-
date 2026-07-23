import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, LogOut, Settings } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useGamification } from "@/hooks/useGamification";
import { GamificationBadge } from "@/components/gamification/GamificationBadge";
import { AchievementToast } from "@/components/gamification/AchievementToast";
import { ROUTES } from "@/constants/routes";

export function AppLayout({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const { firebaseUser, logout } = useAuth();
  const { profile } = useUserProfile();
  const { justUnlocked, dismissUnlocked } = useGamification();

  return (
    <div className="min-h-screen bg-paper dark:bg-paper-dark">
      <AchievementToast achievement={justUnlocked} onDismiss={dismissUnlocked} />

      <header className="flex items-center justify-between border-b border-ink/5 px-6 py-4 no-print dark:border-white/5">
        <span className="font-display text-lg font-semibold text-ink dark:text-ink-dark">
          English AI Master
        </span>

        <div className="flex items-center gap-4">
          {profile && <GamificationBadge xp={profile.xp} streakCount={profile.streakCount} />}

          <span className="font-body text-sm text-ink-soft dark:text-ink-dark/70">
            {firebaseUser?.displayName}
          </span>

          <Link
            to={ROUTES.settings}
            aria-label="Configurações"
            className="rounded-full p-2 text-ink-soft hover:bg-ink/5 dark:text-ink-dark/70 dark:hover:bg-white/10"
          >
            <Settings className="h-4 w-4" />
          </Link>

          <button
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
            className="rounded-full p-2 text-ink-soft hover:bg-ink/5 dark:text-ink-dark/70 dark:hover:bg-white/10"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          <button
            onClick={() => logout()}
            aria-label="Sair da conta"
            className="rounded-full p-2 text-ink-soft hover:bg-ink/5 dark:text-ink-dark/70 dark:hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="px-6 py-8">{children}</main>
    </div>
  );
}
