import { Link } from "react-router-dom";
import { CheckCircle2, Circle } from "lucide-react";
import { AppLayout } from "@/layouts/AppLayout";
import { useCurriculum } from "@/hooks/useCurriculum";
import { CEFR_LEVELS } from "@/constants/levels";
import { ROUTES } from "@/constants/routes";

export function LessonsPage() {
  const { units, completedLessonIds, isLoading } = useCurriculum();

  return (
    <AppLayout>
      <div className="mx-auto flex max-w-xl flex-col gap-8 py-16">
        <h1 className="text-center font-display text-2xl font-semibold text-ink dark:text-ink-dark">
          Lições
        </h1>

        {isLoading && (
          <p className="text-center font-body text-sm text-ink-soft dark:text-ink-dark/70">
            Carregando…
          </p>
        )}

        {!isLoading &&
          units.map((unit) => {
            const levelInfo = CEFR_LEVELS.find((l) => l.value === unit.level);
            return (
              <div key={unit.id}>
                <div className="mb-3">
                  <span className="font-mono text-xs uppercase tracking-wider text-brand-500 dark:text-brand-300">
                    Nível {unit.level} · {levelInfo?.label}
                  </span>
                  <h2 className="font-display text-lg font-semibold text-ink dark:text-ink-dark">
                    {unit.title}
                  </h2>
                  <p className="font-body text-sm text-ink-soft dark:text-ink-dark/70">
                    {unit.description}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {unit.lessons.map((lesson) => {
                    const isDone = completedLessonIds.includes(lesson.id);
                    return (
                      <Link
                        key={lesson.id}
                        to={`${ROUTES.lessons}/${lesson.id}`}
                        className="flex items-center gap-3 rounded-xl2 bg-white/60 px-4 py-3 shadow-soft transition-colors hover:bg-brand-50 dark:bg-white/5 dark:hover:bg-white/10"
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                        ) : (
                          <Circle className="h-5 w-5 shrink-0 text-ink-soft/40 dark:text-ink-dark/30" />
                        )}
                        <span className="font-body text-sm font-medium text-ink dark:text-ink-dark">
                          {lesson.title}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </AppLayout>
  );
}
