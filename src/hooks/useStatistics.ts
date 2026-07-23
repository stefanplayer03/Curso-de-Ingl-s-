import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { StatisticsService } from "@/services/statistics.service";
import type { DailyStat } from "@/types/statistics.types";

export function useStatistics(days = 7) {
  const { firebaseUser } = useAuth();
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!firebaseUser) return;
    setIsLoading(true);
    StatisticsService.getLastNDays(firebaseUser.uid, days).then((stats) => {
      setDailyStats(stats);
      setIsLoading(false);
    });
  }, [firebaseUser, days]);

  return { dailyStats, isLoading };
}
