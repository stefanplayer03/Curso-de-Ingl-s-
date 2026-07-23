export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

/** Contrato para qualquer motor de reconhecimento de fala (nativo do navegador, ou serviço externo). */
export interface SpeechRecognizer {
  start(onResult: (result: SpeechRecognitionResult) => void): void;
  stop(): void;
}

/** Contrato para qualquer motor de síntese de fala (voz da IA falando com o aluno). */
export interface SpeechSynthesizer {
  speak(text: string, lang?: string): Promise<void>;
  cancel(): void;
}
