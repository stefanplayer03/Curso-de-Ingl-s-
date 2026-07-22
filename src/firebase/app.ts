import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { env } from "@/config/env";

/**
 * Ponto único de inicialização do Firebase.
 * Todo o resto do app (auth.ts, firestore.ts, storage.ts) deve importar
 * `firebaseApp` daqui — nunca chamar initializeApp em outro lugar.
 */
const firebaseConfig = {
  apiKey: env.firebase.apiKey,
  authDomain: env.firebase.authDomain,
  projectId: env.firebase.projectId,
  storageBucket: env.firebase.storageBucket,
  messagingSenderId: env.firebase.messagingSenderId,
  appId: env.firebase.appId,
};

export const firebaseApp: FirebaseApp =
  getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
