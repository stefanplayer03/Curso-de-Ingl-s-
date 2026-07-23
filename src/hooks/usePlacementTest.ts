import { useMemo, useState } from "react";
import { PLACEMENT_QUESTIONS } from "@/constants/placementQuestions";
import { UserProfileService } from "@/services/userProfile.service";
import type { CefrLevel } from "@/types/user.types";
import type { PlacementAnswer } from "@/types/placementTest.types";

/** Mapeia a proporção de acertos para um nível CEFR. Simples e previsível de propósito. */
function levelFromScore(score: number, total: number): CefrLevel {
  const ratio = score / total;
  if (ratio <= 0.15) return "A0";
  if (ratio <= 0.35) return "A1";
  if (ratio <= 0.55) return "A2";
  if (ratio <= 0.75) return "B1";
  if (ratio <= 0.95) return "B2";
  return "C1";
}

export function usePlacementTest() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<PlacementAnswer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = PLACEMENT_QUESTIONS[currentIndex];
  const isLastQuestion = currentIndex === PLACEMENT_QUESTIONS.length - 1;
  const isFinished = answers.length === PLACEMENT_QUESTIONS.length;

  const score = useMemo(() => answers.filter((a) => a.isCorrect).length, [answers]);

  function answer(selectedIndex: number) {
    const isCorrect = selectedIndex === currentQuestion.correctIndex;
    setAnswers((prev) => [...prev, { questionId: currentQuestion.id, selectedIndex, isCorrect }]);
    if (!isLastQuestion) {
      setCurrentIndex((i) => i + 1);
    }
  }

  const resultLevel = useMemo(
    () => (isFinished ? levelFromScore(score, PLACEMENT_QUESTIONS.length) : null),
    [isFinished, score]
  );

  async function submit(uid: string) {
    if (!resultLevel) return;
    setIsSubmitting(true);
    try {
      await UserProfileService.completePlacementTest(uid, resultLevel);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    currentQuestion,
    currentIndex,
    total: PLACEMENT_QUESTIONS.length,
    isFinished,
    resultLevel,
    score,
    answer,
    submit,
    isSubmitting,
  };
}
