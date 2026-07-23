import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { COLLECTIONS, firestoreDb } from "@/firebase/firestore";
import type { ConversationMessage } from "@/types/conversation.types";

/**
 * ConversationService: única porta de entrada para persistir conversas.
 * Mantém o histórico do aluno no Firestore para a IA usar como memória
 * de longo prazo (erros recorrentes, vocabulário já visto, etc — conforme
 * a seção "IA deverá lembrar" do prompt mestre).
 */
export const ConversationService = {
  async createSession(uid: string, topic: string, level: string): Promise<string> {
    const docRef = await addDoc(collection(firestoreDb, COLLECTIONS.conversations), {
      uid,
      topic,
      level,
      messages: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async appendMessage(sessionId: string, message: ConversationMessage): Promise<void> {
    const sessionRef = doc(firestoreDb, COLLECTIONS.conversations, sessionId);
    await updateDoc(sessionRef, {
      messages: arrayUnion(message),
      updatedAt: serverTimestamp(),
    });
  },
};
