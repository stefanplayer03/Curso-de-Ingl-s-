/** Níveis do CEFR usados em todo o app (testes, lições, progresso). */
export type CefrLevel = "A0" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface UserGoal {
  id: string;
  label: string; // ex: "Viajar", "Entrevistas de emprego", "Assistir filmes"
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoUrl?: string;
  level: CefrLevel;
  hasCompletedPlacementTest: boolean;
  immersionMode: boolean;
  goals: UserGoal[];
  createdAt: string; // ISO date
  lastActiveAt: string; // ISO date
  streakCount: number;
  xp: number;
}
