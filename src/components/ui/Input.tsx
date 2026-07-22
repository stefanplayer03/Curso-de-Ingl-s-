import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="font-body text-sm font-medium text-ink/80 dark:text-ink-dark/80">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`rounded-xl2 border bg-white/60 px-4 py-3 font-body text-sm text-ink outline-none transition-colors focus:border-brand-500 dark:bg-white/5 dark:text-ink-dark ${
            error ? "border-danger" : "border-ink/10 dark:border-white/10"
          } ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <span id={`${inputId}-error`} className="font-body text-xs text-danger">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
