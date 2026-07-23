import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { COLLECTIONS, firestoreDb } from "@/firebase/firestore";
import { nextReviewDate } from "@/constants/spacedRepetition";
import type { ReviewCard } from "@/types/flashcard.types";

export const FlashcardService = {
  /** Chamado automaticamente pela Conversação toda vez que a IA corrige o aluno. */
  async createFromCorrection(
    uid: string,
    front: string,
    back: string,
    explanation: string
  ): Promise<void> {
    await addDoc(collection(firestoreDb, COLLECTIONS.reviews), {
      uid,
      front,
      back,
      explanation,
      boxLevel: 0,
      nextReviewAt: new Date().toISOString(), // já nasce disponível pra revisão
      createdAt: serverTimestamp(),
    });
  },

  async getDueCards(uid: string): Promise<ReviewCard[]> {
    const nowIso = new Date().toISOString();
    const dueQuery = query(
      collection(firestoreDb, COLLECTIONS.reviews),
      where("uid", "==", uid),
      where("nextReviewAt", "<=", nowIso)
    );
    const snapshot = await getDocs(dueQuery);
    return snapshot.docs.map((docSnapshot) => ({
      id: docSnapshot.id,
      ...(docSnapshot.data() as Omit<ReviewCard, "id">),
    }));
  },

  async recordReview(cardId: string, currentBoxLevel: number, wasEasy: boolean): Promise<void> {
    const newBoxLevel = wasEasy ? currentBoxLevel + 1 : 0;
    const ref = doc(firestoreDb, COLLECTIONS.reviews, cardId);
    await updateDoc(ref, {
      boxLevel: newBoxLevel,
      nextReviewAt: nextReviewDate(newBoxLevel).toISOString(),
    });
  },
};
