import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { GamificationService } from "@/services/gamification.service";
import { StatisticsService } from "@/services/statistics.service";
import { ACHIEVEMENTS } from "@/constants/achievements";
import type { AchievementDefinition } from "@/types/gamification.types";

/**
 * Hook central de gamificação. Componentes de UI usam só isto —
 * nunca chamam GamificationService diretamente.
 *
 * Cuida de três coisas:
 * 1. Registrar a atividade do dia (streak), uma vez por sessão.
 * 2. Expor `awardXp` para dar pontos (ex: por mensagem na conversação).
 * 3. Desbloquear conquistas — automaticamente por limiar de XP/streak
 *    (reage às mudanças vindas do Firestore em tempo real via useUserProfile),
 *    ou manualmente via `unlock()` para conquistas por evento (ex: 1ª conversa).
 */
export function useGamification() {
  const { firebaseUser } = useAuth();
  const { profile } = useUserProfile();
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [justUnlocked, setJustUnlocked] = useState<AchievementDefinition | null>(null);
  const hasRegisteredStreakToday = useRef(false);
  const hasLoadedUnlocked = useRef(false);

  useEffect(() => {
    if (!firebaseUser || hasLoadedUnlocked.current) return;
    hasLoadedUnlocked.current = true;
    GamificationService.getUnlockedAchievementIds(firebaseUser.uid).then(setUnlockedIds);
  }, [firebaseUser]);

  useEffect(() => {
    if (!firebaseUser || !profile || hasRegisteredStreakToday.current) return;
    hasRegisteredStreakToday.current = true;
    GamificationService.registerDailyActivity(firebaseUser.uid, profile.streakCount, profile.lastActiveAt);
  }, [firebaseUser, profile]);

  const unlock = useCallback(
    async (achievementId: string) => {
      if (!firebaseUser || unlockedIds.includes(achievementId)) return;
      await GamificationService.unlockAchievement(firebaseUser.uid, achievementId);
      setUnlockedIds((prev) => [...prev, achievementId]);
      const definition = ACHIEVEMENTS.find((a) => a.id === achievementId);
      if (definition) setJustUnlocked(definition);
    },
    [firebaseUser, unlockedIds]
  );

  // Conquistas de limiar: reagem automaticamente sempre que XP/streak mudam no Firestore.
  useEffect(() => {
    if (!profile) return;
    if (profile.xp >= 100) unlock("xp-100");
    if (profile.xp >= 500) unlock("xp-500");
    if (profile.streakCount >= 3) unlock("streak-3");
    if (profile.streakCount >= 7) unlock("streak-7");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.xp, profile?.streakCount]);

  async function awardXp(amount: number) {
    if (!firebaseUser) return;
    await GamificationService.awardXp(firebaseUser.uid, amount);
    StatisticsService.logActivity(firebaseUser.uid, { xp: amount }).catch((error) =>
      console.error("[gamification] Falha ao registrar estatística de XP:", error)
    );
  }

  function dismissUnlocked() {
    setJustUnlocked(null);
  }

  return {
    achievements: ACHIEVEMENTS,
    unlockedIds,
    justUnlocked,
    awardXp,
    unlock,
    dismissUnlocked,
  };
}
