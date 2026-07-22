import { Mic, Square } from "lucide-react";

interface MicButtonProps {
  isListening: boolean;
  onStart: () => void;
  onStop: () => void;
}

export function MicButton({ isListening, onStart, onStop }: MicButtonProps) {
  return (
    <button
      type="button"
      onClick={isListening ? onStop : onStart}
      aria-label={isListening ? "Parar gravação" : "Falar em inglês"}
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors ${
        isListening
          ? "bg-danger text-paper animate-pulse"
          : "bg-brand-700 text-paper hover:bg-brand-500"
      }`}
    >
      {isListening ? <Square className="h-4 w-4" /> : <Mic className="h-5 w-5" />}
    </button>
  );
}
