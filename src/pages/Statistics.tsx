import { AppLayout } from "@/layouts/AppLayout";
import { StatCard } from "@/components/statistics/StatCard";
import { XpTrendChart } from "@/components/statistics/XpTrendChart";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useStatistics } from "@/hooks/useStatistics";

export function StatisticsPage() {
  const { profile } = useUserProfile();
  const { dailyStats, isLoading } = useStatistics(7);

  const weekTotals = dailyStats.reduce(
    (acc, day) => ({
      messages: acc.messages + day.messages,
      shadowing: acc.shadowing + day.shadowing,
      reviews: acc.reviews + day.reviews,
      lessons: acc.lessons + day.lessons,
    }),
    { messages: 0, shadowing: 0, reviews: 0, lessons: 0 }
  );

  return (
    <AppLayout>
      <div className="mx-auto flex max-w-xl flex-col gap-6 py-16">
        <h1 className="text-center font-display text-2xl font-semibold text-ink dark:text-ink-dark">
          Seu progresso
        </h1>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <StatCard label="Sequência" value={profile?.streakCount ?? 0} />
          <StatCard label="XP total" value={profile?.xp ?? 0} />
          <StatCard label="Conversas (7d)" value={weekTotals.messages} />
          <StatCard label="Pronúncias (7d)" value={weekTotals.shadowing} />
          <StatCard label="Lições (7d)" value={weekTotals.lessons} />
        </div>

        <div className="rounded-xl2 bg-white/50 p-6 shadow-soft dark:bg-white/5">
          <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-wider text-brand-500 dark:text-brand-300">
            XP nos últimos 7 dias
          </h2>
          {isLoading ? (
            <p className="font-body text-sm text-ink-soft dark:text-ink-dark/70">Carregando…</p>
          ) : (
            <XpTrendChart data={dailyStats} />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
