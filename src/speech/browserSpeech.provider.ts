import type { SpeechRecognizer, SpeechSynthesizer, SpeechRecognitionResult } from "@/speech/speech.types";

/**
 * Implementação usando as Web Speech APIs nativas do navegador — sem custo,
 * disponível desde o primeiro dia. Pode ser substituída por um serviço mais
 * robusto (ex: Google Speech-to-Text) implementando os mesmos contratos.
 */
export class BrowserSpeechRecognizer implements SpeechRecognizer {
  private recognition: SpeechRecognition | null = null;

  start(onResult: (result: SpeechRecognitionResult) => void): void {
    const SpeechRecognitionCtor =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      console.warn("[speech] Reconhecimento de fala não suportado neste navegador.");
      return;
    }

    this.recognition = new SpeechRecognitionCtor();
    this.recognition!.lang = "en-US";
    this.recognition!.continuous = false;
    this.recognition!.interimResults = false;

    this.recognition!.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0][0];
      onResult({ transcript: result.transcript, confidence: result.confidence });
    };

    this.recognition!.start();
  }

  stop(): void {
    this.recognition?.stop();
  }
}

export class BrowserSpeechSynthesizer implements SpeechSynthesizer {
  speak(text: string, lang = "en-US"): Promise<void> {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.onend = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  }

  cancel(): void {
    window.speechSynthesis.cancel();
  }
}
