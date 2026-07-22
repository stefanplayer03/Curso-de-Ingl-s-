import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "@/firebase/app";

export const firestoreDb = getFirestore(firebaseApp);

/**
 * Nomes de coleções centralizados — evita strings mágicas espalhadas
 * pelo app e documenta o modelo de dados num único lugar.
 * Conforme prompt mestre: users, progress, lessons, units, words, reviews,
 * badges, streaks, conversations, settings, statistics, missions, achievements.
 */
export const COLLECTIONS = {
  users: "users",
  progress: "progress",
  lessons: "lessons",
  units: "units",
  words: "words",
  reviews: "reviews",
  badges: "badges",
  streaks: "streaks",
  conversations: "conversations",
  settings: "settings",
  statistics: "statistics",
  missions: "missions",
  achievements: "achievements",
} as const;
