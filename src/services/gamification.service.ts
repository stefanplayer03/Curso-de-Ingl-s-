import {
  collection,
  doc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { COLLECTIONS, firestoreDb } from "@/firebase/firestore";

/** Diferença em dias de calendário entre duas datas (ignora hora). */
function daysBetween(earlier: Date, later: Date): number {
  const utcEarlier = Date.UTC(earlier.getFullYear(), earlier.getMonth(), earlier.getDate());
  const utcLater = Date.UTC(later.getFullYear(), later.getMonth(), later.getDate());
  return Math.round((utcLater - utcEarlier) / 86_400_000);
}

export const GamificationService = {
  async awardXp(uid: string, amount: number): Promise<void> {
    const ref = doc(firestoreDb, COLLECTIONS.users, uid);
    await updateDoc(ref, { xp: increment(amount) });
  },

  /**
   * Chamado uma vez por sessão de estudo. Se o aluno já tinha estudado ontem,
   * a sequência aumenta; se pulou um dia ou mais, reseta para 1; se é o
   * mesmo dia de novo, mantém. Retorna a nova contagem de streak.
   */
  async registerDailyActivity(
    uid: string,
    currentStreak: number,
    lastActiveAt: string | undefined
  ): Promise<number> {
    const today = new Date();
    const last = lastActiveAt ? new Date(lastActiveAt) : null;
    const diff = last ? daysBetween(last, today) : Infinity;

    let newStreak = currentStreak;
    if (diff === 0) {
      newStreak = Math.max(currentStreak, 1);
    } else if (diff === 1) {
      newStreak = currentStreak + 1;
    } else {
      newStreak = 1;
    }

    const ref = doc(firestoreDb, COLLECTIONS.users, uid);
    await updateDoc(ref, { streakCount: newStreak, lastActiveAt: serverTimestamp() });
    return newStreak;
  },

  async getUnlockedAchievementIds(uid: string): Promise<string[]> {
    const achievementsQuery = query(
      collection(firestoreDb, COLLECTIONS.achievements),
      where("uid", "==", uid)
    );
    const snapshot = await getDocs(achievementsQuery);
    return snapshot.docs.map((docSnapshot) => docSnapshot.data().achievementId as string);
  },

  async unlockAchievement(uid: string, achievementId: string): Promise<void> {
    // ID determinístico (uid + conquista) evita duplicatas mesmo com chamadas concorrentes.
    const ref = doc(firestoreDb, COLLECTIONS.achievements, `${uid}_${achievementId}`);
    await setDoc(ref, { uid, achievementId, unlockedAt: serverTimestamp() });
  },
};
