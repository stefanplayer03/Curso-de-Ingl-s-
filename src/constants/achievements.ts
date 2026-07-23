import type { AchievementDefinition } from "@/types/gamification.types";

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "first-conversation",
    title: "Primeira conversa",
    description: "Você teve sua primeira conversa com a professora.",
    icon: "message",
  },
  {
    id: "first-shadowing",
    title: "Primeira pronúncia",
    description: "Você praticou shadowing pela primeira vez.",
    icon: "target",
  },
  {
    id: "first-lesson",
    title: "Primeira lição",
    description: "Você concluiu sua primeira lição estruturada.",
    icon: "sparkles",
  },
  {
    id: "streak-3",
    title: "Sequência de 3 dias",
    description: "Estudou 3 dias seguidos. Continue assim!",
    icon: "flame",
  },
  {
    id: "streak-7",
    title: "Sequência de 7 dias",
    description: "Uma semana inteira sem faltar.",
    icon: "flame",
  },
  {
    id: "xp-100",
    title: "100 XP",
    description: "Acumulou 100 pontos de experiência.",
    icon: "trophy",
  },
  {
    id: "xp-500",
    title: "500 XP",
    description: "Acumulou 500 pontos de experiência. Impressionante!",
    icon: "trophy",
  },
];

export const XP_PER_MESSAGE = 10;
