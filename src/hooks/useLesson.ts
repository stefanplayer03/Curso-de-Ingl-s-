import { useMemo, useState } from "react";
import { CurriculumService } from "@/services/curriculum.service";
import type { Lesson } from "@/types/curriculum.types";

type LessonPhase = "teaching" | "exercises" | "done";

export function useLesson(lesson: Lesson) {
  const [phase, setPhase] = useState<LessonPhase>("teaching");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentExercise = lesson.exercises[currentIndex];
  const isLastExercise = currentIndex === lesson.exercises.length - 1;

  function startExercises() {
    setPhase("exercises");
  }

  function answer(selectedIndex: number) {
    if (currentExercise && selectedIndex === currentExercise.correctIndex) {
      setCorrectCount((c) => c + 1);
    }
    if (isLastExercise) {
      setPhase("done");
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  const scorePercent = useMemo(() => {
    if (lesson.exercises.length === 0) return 0;
    return Math.round((correctCount / lesson.exercises.length) * 100);
  }, [correctCount, lesson.exercises.length]);

  async function complete(uid: string) {
    setIsSubmitting(true);
    try {
      await CurriculumService.markLessonComplete(uid, lesson.id, scorePercent);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    phase,
    currentExercise,
    currentIndex,
    total: lesson.exercises.length,
    scorePercent,
    startExercises,
    answer,
    complete,
    isSubmitting,
  };
}
