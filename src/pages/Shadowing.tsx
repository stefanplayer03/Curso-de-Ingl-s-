import { useEffect, useRef } from "react";
import { Volume2 } from "lucide-react";
import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/Button";
import { MicButton } from "@/components/conversation/MicButton";
import { PronunciationScore } from "@/components/shadowing/PronunciationScore";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useShadowing } from "@/hooks/useShadowing";
import { useGamification } from "@/hooks/useGamification";
import { StatisticsService } from "@/services/statistics.service";

const XP_PER_SHADOWING_ATTEMPT = 5;

export function ShadowingPage() {
  const { firebaseUser } = useAuth();
  const { profile } = useUserProfile();
  const level = profile?.level ?? "A1";
  const {
    currentPhrase,
    isListening,
    transcript,
    score,
    listen,
    stopListening,
    playTarget,
    nextPhrase,
  } = useShadowing(level);
  const { awardXp, unlock } = useGamification();
  const hasAwardedRef = useRef(false);

  useEffect(() => {
    if (score === null || hasAwardedRef.current) return;
    hasAwardedRef.current = true;
    awardXp(XP_PER_SHADOWING_ATTEMPT);
    unlock("first-shadowing");
    if (firebaseUser) {
      StatisticsService.logActivity(firebaseUser.uid, { shadowing: 1 }).catch((error) =>
        console.error("[shadowing] Falha ao registrar estatística:", error)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  function handleNext() {
    hasAwardedRef.current = false;
    nextPhrase();
  }

  return (
    <AppLayout>
      <div className="mx-auto flex max-w-md flex-col items-center gap-6 py-16 text-center">
        <span className="font-mono text-xs uppercase tracking-wider text-brand-500 dark:text-brand-300">
          Shadowing · Nível {level}
        </span>
        <h1 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark">
          Repita depois da professora
        </h1>

        <div className="w-full rounded-xl2 bg-white p-6 shadow-soft dark:bg-white/10">
          <p className="font-display text-xl font-medium text-ink dark:text-ink-dark">
            "{currentPhrase.text}"
          </p>
          <button
            onClick={playTarget}
            className="mt-4 inline-flex items-center gap-2 font-body text-sm text-brand-500 hover:underline dark:text-brand-300"
          >
            <Volume2 className="h-4 w-4" /> Ouvir novamente
          </button>
        </div>

        <MicButton isListening={isListening} onStart={listen} onStop={stopListening} />

        {transcript && (
          <p className="font-body text-sm text-ink-soft dark:text-ink-dark/70">
            Você disse:{" "}
            <span className="font-medium text-ink dark:text-ink-dark">"{transcript}"</span>
          </p>
        )}

        {score !== null && <PronunciationScore score={score} />}

        {score !== null && (
          <Button onClick={handleNext} variant="secondary">
            Próxima frase
          </Button>
        )}
      </div>
    </AppLayout>
  );
}
