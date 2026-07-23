interface ConversationWaveProps {
  className?: string;
}

/**
 * Elemento-assinatura do English AI Master: uma onda sonora estilizada,
 * representando a conversa entre aluno e IA — o coração do produto.
 * Duas "vozes" (barras teal e âmbar) se entrelaçam em alturas irregulares,
 * como um diálogo real, não um equalizador genérico simétrico.
 */
export function ConversationWave({ className = "" }: ConversationWaveProps) {
  const studentBars = [18, 34, 22, 46, 28, 52, 24, 38, 20];
  const tutorBars = [30, 20, 44, 26, 50, 24, 40, 22, 32];

  return (
    <svg
      viewBox="0 0 360 120"
      className={className}
      role="img"
      aria-label="Onda representando uma conversa entre aluno e IA"
    >
      {studentBars.map((height, i) => (
        <rect
          key={`s-${i}`}
          x={i * 40 + 6}
          y={60 - height / 2}
          width="10"
          height={height}
          rx="5"
          className="fill-brand-500 dark:fill-brand-300"
        />
      ))}
      {tutorBars.map((height, i) => (
        <rect
          key={`t-${i}`}
          x={i * 40 + 20}
          y={60 - height / 2}
          width="10"
          height={height}
          rx="5"
          className="fill-amber-500"
          opacity="0.85"
        />
      ))}
    </svg>
  );
}
