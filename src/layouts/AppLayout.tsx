import type { ReactNode } from "react";
import { Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";

export function AppLayout({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const { firebaseUser, logout } = useAuth();

  return (
    <div className="min-h-screen bg-paper dark:bg-paper-dark">
      <header className="flex items-center justify-between border-b border-ink/5 px-6 py-4 dark:border-white/5">
        <span className="font-display text-lg font-semibold text-ink dark:text-ink-dark">
          English AI Master
        </span>

        <div className="flex items-center gap-3">
          <span className="font-body text-sm text-ink-soft dark:text-ink-dark/70">
            {firebaseUser?.displayName}
          </span>

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
