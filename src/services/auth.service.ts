import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { firebaseAuth } from "@/firebase/auth";
import { COLLECTIONS, firestoreDb } from "@/firebase/firestore";
import type { LoginCredentials, RegisterCredentials } from "@/types/auth.types";

/**
 * AuthService: única porta de entrada para operações de autenticação.
 * Componentes e contexts nunca devem chamar o SDK do Firebase diretamente —
 * isso mantém a troca de provedor (ou testes com mocks) simples.
 */
export const AuthService = {
  async login({ email, password }: LoginCredentials): Promise<FirebaseUser> {
    const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    return credential.user;
  },

  async register({ name, email, password }: RegisterCredentials): Promise<FirebaseUser> {
    const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    await updateProfile(credential.user, { displayName: name });

    // Cria o documento inicial de perfil no Firestore, já com valores default
    // consistentes com o modelo pedagógico (nível A0, sem streak, sem xp).
    await setDoc(doc(firestoreDb, COLLECTIONS.users, credential.user.uid), {
      uid: credential.user.uid,
      displayName: name,
      email,
      level: "A0",
      hasCompletedPlacementTest: false,
      immersionMode: false,
      goals: [],
      xp: 0,
      streakCount: 0,
      createdAt: serverTimestamp(),
      lastActiveAt: serverTimestamp(),
    });

    return credential.user;
  },

  async logout(): Promise<void> {
    await signOut(firebaseAuth);
  },

  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(firebaseAuth, email);
  },

  onAuthChange(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(firebaseAuth, callback);
  },
};
