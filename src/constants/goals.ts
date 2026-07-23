export type GoalIcon =
  | "plane"
  | "briefcase"
  | "film"
  | "music"
  | "home"
  | "laptop"
  | "graduation-cap"
  | "users";

export interface GoalOption {
  id: string;
  label: string;
  icon: GoalIcon;
  /** Tema de conversação sugerido quando este é o objetivo principal do aluno. */
  topic: string;
}

export const GOAL_OPTIONS: GoalOption[] = [
  { id: "travel", label: "Viajar", icon: "plane", topic: "Travel and tourism" },
  {
    id: "job-interviews",
    label: "Entrevistas de emprego",
    icon: "briefcase",
    topic: "Job interviews",
  },
  { id: "movies", label: "Assistir filmes", icon: "film", topic: "Movies and TV shows" },
  { id: "music", label: "Entender músicas", icon: "music", topic: "Music and lyrics" },
  { id: "living-abroad", label: "Morar no exterior", icon: "home", topic: "Daily life abroad" },
  {
    id: "remote-work",
    label: "Trabalho remoto",
    icon: "laptop",
    topic: "Remote work and meetings",
  },
  {
    id: "exams",
    label: "Provas (IELTS/TOEFL)",
    icon: "graduation-cap",
    topic: "Academic English",
  },
  { id: "friends", label: "Conversar com amigos", icon: "users", topic: "Casual conversation with friends" },
];
