import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ROUTES } from "@/constants/routes";
import { ConversationWave } from "@/components/ui/ConversationWave";

/**
 * Envolve rotas que exigem nível já calibrado (Dashboard, Conversação).
 * Não deve envolver a própria página do teste, ou vira loop de redirect.
 */
export function RequirePlacementTest({ children }: { children: ReactNode }) {
  const { profile, isLoading } = useUserProfile();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper dark:bg-paper-dark">
        <ConversationWave className="w-40 animate-pulse opacity-60" />
      </div>
    );
  }

  if (profile && !profile.hasCompletedPlacementTest) {
    return <Navigate to={ROUTES.placementTest} replace />;
  }

  return <>{children}</>;
}
