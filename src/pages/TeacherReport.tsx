import { Printer } from "lucide-react";
import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/Button";
import { AchievementGrid } from "@/components/gamification/AchievementGrid";
import { XpTrendChart } from "@/components/statistics/XpTrendChart";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useStatistics } from "@/hooks/useStatistics";
import { useCurriculum } from "@/hooks/useCurriculum";
import { useGamification } from "@/hooks/useGamification";
import { CEFR_LEVELS } from "@/constants/levels";

export function TeacherReportPage() {
  const { firebaseUser } = useAuth();
  const { profile } = useUserProfile();
  const { dailyStats } = useStatistics(30);
  const { units, completedLessonIds } = useCurriculum();
  const { achievements, unlockedIds } = useGamification();

  const levelInfo = profile ? CEFR_LEVELS.find((l) => l.value === profile.level) : null;
  const totalLessons = units.reduce((sum, unit) => sum + unit.lessons.length, 0);

  return (
    <AppLayout>
      <div className="mx-auto flex max-w-2xl flex-col gap-8 py-16">
        <div className="no-print flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark">
            Relatório do aluno
          </h1>
          <Button variant="ghost" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Imprimir / salvar PDF
          </Button>
        </div>

        <div className="rounded-xl2 bg-white/60 p-6 shadow-soft dark:bg-white/5">
          <h2 className="font-display text-lg font-semibold text-ink dark:text-ink-dark">
            {firebaseUser?.displayName ?? "Aluno"}
          </h2>
          <p className="font-body text-sm text-ink-soft dark:text-ink-dark/70">
            Nível {profile?.level} · {levelInfo?.label} — {levelInfo?.description}
          </p>
          {profile && profile.goals.length > 0 && (
            <p className="mt-2 font-body text-sm text-ink-soft dark:text-ink-dark/70">
              Objetivos: {profile.goals.map((goal) => goal.label).join(", ")}
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl2 bg-white/60 p-4 shadow-soft dark:bg-white/5">
            <span className="font-display text-2xl font-semibold text-ink dark:text-ink-dark">
              {profile?.xp ?? 0}
            </span>
            <p className="font-body text-xs text-ink-soft dark:text-ink-dark/60">XP total</p>
          </div>
          <div className="rounded-xl2 bg-white/60 p-4 shadow-soft dark:bg-white/5">
            <span className="font-display text-2xl font-semibold text-ink dark:text-ink-dark">
              {profile?.streakCount ?? 0}
            </span>
            <p className="font-body text-xs text-ink-soft dark:text-ink-dark/60">
              Sequência (dias)
            </p>
          </div>
          <div className="rounded-xl2 bg-white/60 p-4 shadow-soft dark:bg-white/5">
            <span className="font-display text-2xl font-semibold text-ink dark:text-ink-dark">
              {completedLessonIds.length}/{totalLessons}
            </span>
            <p className="font-body text-xs text-ink-soft dark:text-ink-dark/60">
              Lições concluídas
            </p>
          </div>
        </div>

        <div className="rounded-xl2 bg-white/50 p-6 shadow-soft dark:bg-white/5">
          <h3 className="mb-2 font-display text-sm font-semibold uppercase tracking-wider text-brand-500 dark:text-brand-300">
            XP nos últimos 30 dias
          </h3>
          <XpTrendChart data={dailyStats} />
        </div>

        <div>
          <h3 className="mb-3 font-display text-lg font-semibold text-ink dark:text-ink-dark">
            Progresso por unidade
          </h3>
          <div className="flex flex-col gap-2">
            {units.map((unit) => {
              const done = unit.lessons.filter((lesson) =>
                completedLessonIds.includes(lesson.id)
              ).length;
              return (
                <div
                  key={unit.id}
                  className="flex items-center justify-between rounded-xl2 bg-white/60 px-4 py-3 shadow-soft dark:bg-white/5"
                >
                  <span className="font-body text-sm font-medium text-ink dark:text-ink-dark">
                    {unit.title} (Nível {unit.level})
                  </span>
                  <span className="font-mono text-xs text-ink-soft dark:text-ink-dark/60">
                    {done}/{unit.lessons.length}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-center font-display text-lg font-semibold text-ink dark:text-ink-dark">
            Conquistas
          </h3>
          <AchievementGrid achievements={achievements} unlockedIds={unlockedIds} />
        </div>
      </div>
    </AppLayout>
  );
}
