import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AppLayout } from "@/layouts/AppLayout";
import { QuestionCard } from "@/components/placement/QuestionCard";
import { Button } from "@/components/ui/Button";
import { ConversationWave } from "@/components/ui/ConversationWave";
import { useAuth } from "@/hooks/useAuth";
import { useGamification } from "@/hooks/useGamification";
import { useLesson } from "@/hooks/useLesson";
import { StatisticsService } from "@/services/statistics.service";
import { findLessonById } from "@/constants/curriculum";
import { ROUTES } from "@/constants/routes";
import type { Lesson } from "@/types/curriculum.types";

const XP_PER_LESSON = 20;

// Lição vazia usada só enquanto o id da URL não corresponde a nada real —
// evita chamar hooks condicionalmente (ver useEffect de redirecionamento abaixo).
const FALLBACK_LESSON: Lesson = {
  id: "",
  title: "",
  teachingSentence: "",
  teachingNote: "",
  exercises: [],
};

export function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { firebaseUser } = useAuth();
  const { awardXp, unlock } = useGamification();
  const hasCompletedRef = useRef(false);

  const lessonExists = Boolean(lessonId && findLessonById(lessonId));
  const lesson = (lessonId ? findLessonById(lessonId) : undefined) ?? FALLBACK_LESSON;

  const {
    phase,
    currentExercise,
    currentIndex,
    total,
    scorePercent,
    startExercises,
    answer,
    complete,
  } = useLesson(lesson);

  useEffect(() => {
    if (!lessonExists) navigate(ROUTES.lessons, { replace: true });
  }, [lessonExists, navigate]);

  useEffect(() => {
    if (phase !== "done" || hasCompletedRef.current || !firebaseUser || !lessonExists) return;
    hasCompletedRef.current = true;
    complete(firebaseUser.uid);
    awardXp(XP_PER_LESSON);
    unlock("first-lesson");
    StatisticsService.logActivity(firebaseUser.uid, { lessons: 1 }).catch((error) =>
      console.error("[lesson] Falha ao registrar estatística:", error)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (!lessonExists) return null;

  return (
    <AppLayout>
      <div className="mx-auto flex max-w-xl flex-col items-center gap-8 py-16">
        <AnimatePresence mode="wait">
          {phase === "teaching" && (
            <motion.div
              key="teaching"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="w-full text-center"
            >
              <span className="font-mono text-xs uppercase tracking-wider text-brand-500 dark:text-brand-300">
                {lesson.title}
              </span>
              <div className="mt-4 rounded-xl2 bg-white/50 p-6 shadow-soft dark:bg-white/5">
                <p className="font-display text-xl font-medium text-ink dark:text-ink-dark">
                  "{lesson.teachingSentence}"
                </p>
                <p className="mt-4 font-body text-sm text-ink-soft dark:text-ink-dark/70">
                  {lesson.teachingNote}
                </p>
              </div>
              <Button onClick={startExercises} className="mt-6">
                Praticar
              </Button>
            </motion.div>
          )}

          {phase === "exercises" && currentExercise && (
            <motion.div
              key={currentExercise.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              className="w-full text-left"
            >
              <span className="font-mono text-xs uppercase tracking-wider text-brand-500 dark:text-brand-300">
                Exercício {currentIndex + 1} de {total}
              </span>
              <div className="mt-3 rounded-xl2 bg-white/50 p-6 shadow-soft dark:bg-white/5">
                <QuestionCard
                  prompt={currentExercise.prompt}
                  options={currentExercise.options}
                  onSelect={answer}
                />
              </div>
            </motion.div>
          )}

          {phase === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <ConversationWave className="w-40" />
              <h1 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark">
                Lição concluída! {scorePercent}% de acerto
              </h1>
              <p className="font-body text-sm text-ink-soft dark:text-ink-dark/70">
                +{XP_PER_LESSON} XP na conta.
              </p>
              <Button onClick={() => navigate(ROUTES.lessons)}>Voltar pras lições</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
