import { useMemo, useRef, useState } from "react";
import { SHADOWING_PHRASES } from "@/constants/shadowingPhrases";
import { scorePronunciation } from "@/utils/textSimilarity";
import { BrowserSpeechRecognizer, BrowserSpeechSynthesizer } from "@/speech/browserSpeech.provider";
import type { CefrLevel } from "@/types/user.types";

/**
 * Componentes de UI usam só isto — nunca tocam o BrowserSpeechRecognizer/
 * Synthesizer ou scorePronunciation diretamente.
 */
export function useShadowing(level: CefrLevel) {
  const phrasesForLevel = useMemo(() => {
    const filtered = SHADOWING_PHRASES.filter((p) => p.level === level);
    // Sem frases pro nível exato (ex: A0 raramente tem material completo), cai pra A1.
    return filtered.length > 0 ? filtered : SHADOWING_PHRASES.filter((p) => p.level === "A1");
  }, [level]);

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [score, setScore] = useState<number | null>(null);

  const recognizerRef = useRef(new BrowserSpeechRecognizer());
  const synthesizerRef = useRef(new BrowserSpeechSynthesizer());

  const currentPhrase = phrasesForLevel[phraseIndex % phrasesForLevel.length];

  function listen() {
    setTranscript("");
    setScore(null);
    setIsListening(true);
    recognizerRef.current.start((result) => {
      setIsListening(false);
      setTranscript(result.transcript);
      setScore(scorePronunciation(currentPhrase.text, result.transcript));
    });
  }

  function stopListening() {
    recognizerRef.current.stop();
    setIsListening(false);
  }

  function playTarget() {
    synthesizerRef.current.speak(currentPhrase.text);
  }

  function nextPhrase() {
    setPhraseIndex((i) => i + 1);
    setTranscript("");
    setScore(null);
  }

  return { currentPhrase, isListening, transcript, score, listen, stopListening, playTarget, nextPhrase };
}
