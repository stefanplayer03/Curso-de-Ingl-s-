import { AppLayout } from "@/layouts/AppLayout";
import { Flashcard } from "@/components/flashcards/Flashcard";
import { Button } from "@/components/ui/Button";
import { ConversationWave } from "@/components/ui/ConversationWave";
import { useFlashcards } from "@/hooks/useFlashcards";

export function ReviewPage() {
  const { cards, isLoading, reviewCard } = useFlashcards();
  const currentCard = cards[0];

  return (
    <AppLayout>
      <div className="mx-auto flex max-w-md flex-col items-center gap-6 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark">
          Revisão
        </h1>

        {isLoading && (
          <p className="font-body text-sm text-ink-soft dark:text-ink-dark/70">Carregando…</p>
        )}

        {!isLoading && !currentCard && (
          <div className="flex flex-col items-center gap-4 py-12">
            <ConversationWave className="w-40" />
            <p className="font-body text-sm text-ink-soft dark:text-ink-dark/70">
              Nada pra revisar agora! Volte depois de conversar mais um pouco com a professora —
              cada correção dela vira um cartão aqui.
            </p>
          </div>
        )}

        {currentCard && (
          <>
            <span className="font-mono text-xs text-ink-soft dark:text-ink-dark/60">
              {cards.length} card{cards.length > 1 ? "s" : ""} pra revisar
            </span>

            <Flashcard card={currentCard} />

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => reviewCard(currentCard, false)}>
                Ainda não sei
              </Button>
              <Button onClick={() => reviewCard(currentCard, true)}>Já sei essa!</Button>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
