interface PronunciationScoreProps {
  score: number;
}

function feedbackFor(score: number): string {
  if (score >= 90) return "Impecável! Quase perfeito.";
  if (score >= 70) return "Muito bom! Só pequenos ajustes.";
  if (score >= 50) return "Bom começo — vamos tentar mais uma vez?";
  return "Sem problemas, pronúncia é treino. Tenta de novo!";
}

function colorFor(score: number): string {
  if (score >= 90) return "text-success";
  if (score >= 70) return "text-brand-500 dark:text-brand-300";
  if (score >= 50) return "text-amber-500";
  return "text-danger";
}

export function PronunciationScore({ score }: PronunciationScoreProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className={`font-display text-4xl font-semibold ${colorFor(score)}`}>{score}%</span>
      <p className="font-body text-sm text-ink-soft dark:text-ink-dark/70">{feedbackFor(score)}</p>
    </div>
  );
}
