interface StatCardProps {
  label: string;
  value: string | number;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl2 bg-white p-4 text-center shadow-soft dark:bg-white/10">
      <span className="font-display text-2xl font-semibold text-ink dark:text-ink-dark">
        {value}
      </span>
      <span className="font-body text-xs text-ink-soft dark:text-ink-dark/60">{label}</span>
    </div>
  );
}
