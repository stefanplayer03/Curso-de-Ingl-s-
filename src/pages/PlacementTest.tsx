import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AppLayout } from "@/layouts/AppLayout";
import { QuestionCard } from "@/components/placement/QuestionCard";
import { Button } from "@/components/ui/Button";
import { ConversationWave } from "@/components/ui/ConversationWave";
import { CEFR_LEVELS } from "@/constants/levels";
import { useAuth } from "@/hooks/useAuth";
import { usePlacementTest } from "@/hooks/usePlacementTest";
import { ROUTES } from "@/constants/routes";

export function PlacementTestPage() {
  const navigate = useNavigate();
  const { firebaseUser } = useAuth();
  const {
    currentQuestion,
    currentIndex,
    total,
    isFinished,
    resultLevel,
    answer,
    submit,
    isSubmitting,
  } = usePlacementTest();

  async function handleContinue() {
    if (!firebaseUser) return;
    await submit(firebaseUser.uid);
    navigate(ROUTES.dashboard);
  }

  const levelInfo = resultLevel ? CEFR_LEVELS.find((l) => l.value === resultLevel) : null;

  return (
    <AppLayout>
      <div className="mx-auto flex max-w-xl flex-col items-center gap-8 py-16">
        {!isFinished && (
          <div className="w-full text-center">
            <h1 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark">
              Vamos descobrir seu nível
            </h1>
            <p className="mt-2 font-body text-sm text-ink-soft dark:text-ink-dark/70">
              Sem pressão — errar faz parte. É só pra calibrar suas primeiras aulas.
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!isFinished && currentQuestion && (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              className="w-full text-left"
            >
              <span className="font-mono text-xs uppercase tracking-wider text-brand-500 dark:text-brand-300">
                Pergunta {currentIndex + 1} de {total}
              </span>
              <div className="mt-3 rounded-xl2 bg-white/50 p-6 shadow-soft dark:bg-white/5">
                <QuestionCard
                  prompt={currentQuestion.prompt}
                  options={currentQuestion.options}
                  onSelect={answer}
                />
              </div>
            </motion.div>
          )}

          {isFinished && levelInfo && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <ConversationWave className="w-40" />
              <span className="font-mono text-xs uppercase tracking-wider text-brand-500 dark:text-brand-300">
                Resultado
              </span>
              <h1 className="font-display text-3xl font-semibold text-ink dark:text-ink-dark">
                Seu nível é {levelInfo.value} — {levelInfo.label}
              </h1>
              <p className="max-w-sm font-body text-sm text-ink-soft dark:text-ink-dark/70">
                {levelInfo.description}. A partir de agora, sua professora adapta cada conversa a
                esse nível.
              </p>
              <Button onClick={handleContinue} isLoading={isSubmitting} className="mt-2">
                Começar a aprender
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
