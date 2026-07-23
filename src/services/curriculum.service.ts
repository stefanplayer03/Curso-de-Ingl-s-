import { collection, doc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { COLLECTIONS, firestoreDb } from "@/firebase/firestore";

export const CurriculumService = {
  async getCompletedLessonIds(uid: string): Promise<string[]> {
    const progressQuery = query(collection(firestoreDb, COLLECTIONS.progress), where("uid", "==", uid));
    const snapshot = await getDocs(progressQuery);
    return snapshot.docs.map((docSnapshot) => docSnapshot.data().lessonId as string);
  },

  async markLessonComplete(uid: string, lessonId: string, score: number): Promise<void> {
    const ref = doc(firestoreDb, COLLECTIONS.progress, `${uid}_${lessonId}`);
    await setDoc(ref, { uid, lessonId, score, completedAt: serverTimestamp() });
  },
};
