import type { PlacementQuestion } from "@/types/placementTest.types";

/**
 * 10 perguntas, dificuldade crescente (aprox. A1 → C1).
 * Simples e objetivo de propósito: o objetivo é calibrar rápido, não
 * substituir uma avaliação completa. Pontuação define o nível em usePlacementTest.
 */
export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  {
    id: "p1",
    prompt: 'I ___ from Brazil.',
    options: ["am", "is", "are", "be"],
    correctIndex: 0,
  },
  {
    id: "p2",
    prompt: "She ___ to school every day.",
    options: ["go", "goes", "going", "went"],
    correctIndex: 1,
  },
  {
    id: "p3",
    prompt: "They ___ dinner right now.",
    options: ["cook", "cooks", "are cooking", "cooked"],
    correctIndex: 2,
  },
  {
    id: "p4",
    prompt: "The opposite of \"generous\" is ___.",
    options: ["kind", "stingy", "happy", "tall"],
    correctIndex: 1,
  },
  {
    id: "p5",
    prompt: "If I ___ more time, I would travel more.",
    options: ["have", "had", "has", "having"],
    correctIndex: 1,
  },
  {
    id: "p6",
    prompt: "I wish I ___ how to swim.",
    options: ["know", "knew", "had known", "knowing"],
    correctIndex: 1,
  },
  {
    id: "p7",
    prompt: "The report needs to be ___ by Friday.",
    options: ["finish", "finished", "finishing", "finishes"],
    correctIndex: 1,
  },
  {
    id: "p8",
    prompt: "She's been ___ at that company for five years.",
    options: ["work", "working", "worked", "works"],
    correctIndex: 1,
  },
  {
    id: "p9",
    prompt: "By next year, she ___ here for a decade.",
    options: ["will live", "will have lived", "lives", "lived"],
    correctIndex: 1,
  },
  {
    id: "p10",
    prompt: "Hardly ___ arrived when the phone rang.",
    options: ["I had", "had I", "I have", "have I"],
    correctIndex: 1,
  },
];
