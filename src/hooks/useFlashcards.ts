import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { FlashcardService } from "@/services/flashcard.service";
import { StatisticsService } from "@/services/statistics.service";
import type { ReviewCard } from "@/types/flashcard.types";

export function useFlashcards() {
  const { firebaseUser } = useAuth();
  const [cards, setCards] = useState<ReviewCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDueCards = useCallback(async () => {
    if (!firebaseUser) return;
    setIsLoading(true);
    const dueCards = await FlashcardService.getDueCards(firebaseUser.uid);
    setCards(dueCards);
    setIsLoading(false);
  }, [firebaseUser]);

  useEffect(() => {
    loadDueCards();
  }, [loadDueCards]);

  async function reviewCard(card: ReviewCard, wasEasy: boolean) {
    await FlashcardService.recordReview(card.id, card.boxLevel, wasEasy);
    setCards((prev) => prev.filter((c) => c.id !== card.id));
    if (firebaseUser) {
      StatisticsService.logActivity(firebaseUser.uid, { reviews: 1 }).catch((error) =>
        console.error("[flashcards] Falha ao registrar estatística:", error)
      );
    }
  }

  return { cards, isLoading, reviewCard, refresh: loadDueCards };
}
