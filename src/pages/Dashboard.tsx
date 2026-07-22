import { Link } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { ConversationWave } from "@/components/ui/ConversationWave";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { CEFR_LEVELS } from "@/constants/levels";
import { ROUTES } from "@/constants/routes";

/**
 * Dashboard simples: por enquanto, um convite direto à conversação
 * (o módulo pedagógico central). XP, streak e missões entram na
 * Fase 4 (gamificação), junto com as coleções já modeladas no Firestore.
 */
export function DashboardPage() {
  const { firebaseUser } = useAuth();
  const { profile } = useUserProfile();
  const levelInfo = profile ? CEFR_LEVELS.find((l) => l.value === profile.level) : null;
  const firstName = firebaseUser?.displayName?.split(" ")[0];

  return (
    <AppLayout>
      <div className="mx-auto flex max-w-lg flex-col items-center gap-6 py-24 text-center">
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
        <Link to={ROUTES.conversation}>
          <Button>Começar a conversar</Button>
        </Link>
      </div>
    </AppLayout>
  );
}
