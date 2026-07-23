import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import { ConversationWave } from "@/components/ui/ConversationWave";

/**
 * Envolve rotas privadas. Enquanto o Firebase resolve a sessão, mostra um
 * estado de carregamento silencioso — nunca pisca a tela de login à toa.
 */
export function PrivateRoute({ children }: { children: ReactNode }) {
  const { authState } = useAuth();

  if (authState.status === "loading" || authState.status === "idle") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper dark:bg-paper-dark">
        <ConversationWave className="w-40 animate-pulse opacity-60" />
      </div>
    );
  }

  if (authState.status === "unauthenticated") {
    return <Navigate to={ROUTES.login} replace />;
  }

  return <>{children}</>;
}
