import type { CefrLevel } from "@/types/user.types";

export const CEFR_LEVELS: { value: CefrLevel; label: string; description: string }[] = [
  { value: "A0", label: "Iniciante", description: "Primeiras palavras e frases" },
  { value: "A1", label: "Básico", description: "Situações do dia a dia" },
  { value: "A2", label: "Pré-intermediário", description: "Conversas simples" },
  { value: "B1", label: "Intermediário", description: "Se vira em viagens e trabalho" },
  { value: "B2", label: "Intermediário avançado", description: "Fluência em temas variados" },
  { value: "C1", label: "Avançado", description: "Quase nativo" },
  { value: "C2", label: "Proficiente", description: "Domínio completo" },
];
