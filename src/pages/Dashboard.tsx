import { Link } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { ConversationWave } from "@/components/ui/ConversationWave";
import { Button } from "@/components/ui/Button";
import { AchievementGrid } from "@/components/gamification/AchievementGrid";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useGamification } from "@/hooks/useGamification";
import { CEFR_LEVELS } from "@/constants/levels";
import { ROUTES } from "@/constants/routes";

/**
 * Dashboard: convite à conversação + painel de conquistas.
 * Próximas missões e ranking (Fase futura) entram aqui também,
 * junto com as coleções já modeladas no Firestore (missions).
 */
export function DashboardPage() {
  const { firebaseUser } = useAuth();
  const { profile } = useUserProfile();
  const { achievements, unlockedIds } = useGamification();
  const levelInfo = profile ? CEFR_LEVELS.find((l) => l.value === profile.level) : null;
  const firstName = firebaseUser?.displayName?.split(" ")[0];

  return (
    <AppLayout>
      <div className="mx-auto flex max-w-lg flex-col items-center gap-6 py-16 text-center">
        <ConversationWave className="w-48" />
        <h1 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark">
          {firstName ? `Pronto para conversar, ${firstName}?` : "Pronto para conversar?"}
        </h1>
        {levelInfo && (
          <span className="font-mono text-xs uppercase tracking-wider text-brand-500 dark:text-brand-300">
            Nível atual: {levelInfo.value} · {levelInfo.label}
          </span>
        )}
        <p className="font-body text-sm text-ink-soft dark:text-ink-dark/70">
          Sua professora de IA está esperando. Comece uma conversa e ela adapta as
          correções ao seu nível.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to={ROUTES.conversation}>
            <Button>Começar a conversar</Button>
          </Link>
          <Link to={ROUTES.lessons}>
            <Button variant="secondary">Ver lições</Button>
          </Link>
          <Link to={ROUTES.shadowing}>
            <Button variant="secondary">Praticar pronúncia</Button>
          </Link>
          <Link to={ROUTES.review}>
            <Button variant="ghost">Revisar cartões</Button>
          </Link>
          <Link to={ROUTES.statistics}>
            <Button variant="ghost">Ver progresso</Button>
          </Link>
          <Link to={ROUTES.report}>
            <Button variant="ghost">Relatório completo</Button>
          </Link>
        </div>

        <div className="mt-8 w-full text-left">
          <h2 className="mb-4 text-center font-display text-lg font-semibold text-ink dark:text-ink-dark">
            Conquistas
          </h2>
          <AchievementGrid achievements={achievements} unlockedIds={unlockedIds} />
        </div>
      </div>
    </AppLayout>
  );
}
