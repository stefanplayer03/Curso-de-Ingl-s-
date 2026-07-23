import { doc, onSnapshot, updateDoc, type Unsubscribe } from "firebase/firestore";
import { COLLECTIONS, firestoreDb } from "@/firebase/firestore";
import type { CefrLevel, UserGoal, UserProfile } from "@/types/user.types";

/**
 * UserProfileService: única porta de entrada para ler/atualizar o documento
 * de perfil do usuário no Firestore (coleção `users`).
 */
export const UserProfileService = {
  /** Assina o documento em tempo real — útil aqui e, mais à frente, para XP/streak ao vivo. */
  subscribe(uid: string, callback: (profile: UserProfile | null) => void): Unsubscribe {
    const ref = doc(firestoreDb, COLLECTIONS.users, uid);
    return onSnapshot(ref, (snapshot) => {
      callback(snapshot.exists() ? (snapshot.data() as UserProfile) : null);
    });
  },

  async completePlacementTest(uid: string, level: CefrLevel): Promise<void> {
    const ref = doc(firestoreDb, COLLECTIONS.users, uid);
    await updateDoc(ref, { level, hasCompletedPlacementTest: true });
  },

  async updateGoals(uid: string, goals: UserGoal[]): Promise<void> {
    const ref = doc(firestoreDb, COLLECTIONS.users, uid);
    await updateDoc(ref, { goals });
  },

  async updateImmersionMode(uid: string, immersionMode: boolean): Promise<void> {
    const ref = doc(firestoreDb, COLLECTIONS.users, uid);
    await updateDoc(ref, { immersionMode });
  },
};
