interface QuestionCardProps {
  prompt: string;
  options: string[];
  onSelect: (index: number) => void;
}

export function QuestionCard({ prompt, options, onSelect }: QuestionCardProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-display text-xl font-medium text-ink dark:text-ink-dark">{prompt}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            className="rounded-xl2 border border-ink/10 bg-white/60 px-4 py-3 text-left font-body text-sm text-ink transition-colors hover:border-brand-500 hover:bg-brand-50 dark:border-white/10 dark:bg-white/5 dark:text-ink-dark dark:hover:bg-white/10"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
