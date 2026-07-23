export type AchievementIcon = "message" | "flame" | "sparkles" | "trophy" | "target";

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: AchievementIcon;
}
