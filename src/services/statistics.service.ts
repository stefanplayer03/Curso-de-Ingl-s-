import { collection, doc, getDocs, increment, query, setDoc, where } from "firebase/firestore";
import { COLLECTIONS, firestoreDb } from "@/firebase/firestore";
import type { DailyStat } from "@/types/statistics.types";

function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

export const StatisticsService = {
  /**
   * Registra atividade do dia (XP ganho, mensagens, shadowing, revisões, lições).
   * Um doc por usuário por dia (`uid_YYYY-MM-DD`), com merge — chamado várias vezes
   * ao longo do dia, sempre somando (nunca sobrescrevendo).
   */
  async logActivity(
    uid: string,
    delta: Partial<Pick<DailyStat, "xp" | "messages" | "shadowing" | "reviews" | "lessons">>
  ): Promise<void> {
    const today = new Date();
    const dateStr = dateKey(today);
    const ref = doc(firestoreDb, COLLECTIONS.statistics, `${uid}_${dateStr}`);

    await setDoc(
      ref,
      {
        uid,
        date: dateStr,
        xp: increment(delta.xp ?? 0),
        messages: increment(delta.messages ?? 0),
        shadowing: increment(delta.shadowing ?? 0),
        reviews: increment(delta.reviews ?? 0),
        lessons: increment(delta.lessons ?? 0),
      },
      { merge: true }
    );
  },

  async getLastNDays(uid: string, days: number): Promise<DailyStat[]> {
    const since = new Date();
    since.setDate(since.getDate() - (days - 1));
    const sinceStr = dateKey(since);

    const statsQuery = query(
      collection(firestoreDb, COLLECTIONS.statistics),
      where("uid", "==", uid),
      where("date", ">=", sinceStr)
    );
    const snapshot = await getDocs(statsQuery);

    const byDate = new Map<string, DailyStat>();
    snapshot.docs.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      byDate.set(data.date, {
        date: data.date,
        xp: data.xp ?? 0,
        messages: data.messages ?? 0,
        shadowing: data.shadowing ?? 0,
        reviews: data.reviews ?? 0,
        lessons: data.lessons ?? 0,
      });
    });

    // Preenche os dias sem atividade com zero, pro gráfico não ter buracos.
    const result: DailyStat[] = [];
    for (let i = 0; i < days; i++) {
      const day = new Date(since);
      day.setDate(day.getDate() + i);
      const key = dateKey(day);
      result.push(
        byDate.get(key) ?? { date: key, xp: 0, messages: 0, shadowing: 0, reviews: 0, lessons: 0 }
      );
    }
    return result;
  },
};
