import { createContext, useEffect, useState, type ReactNode } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import { AuthService } from "@/services/auth.service";
import type { AuthState } from "@/types/auth.types";

interface AuthContextValue {
  firebaseUser: FirebaseUser | null;
  authState: AuthState;
}

export const AuthContext = createContext<AuthContextValue>({
  firebaseUser: null,
  authState: { status: "idle" },
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authState, setAuthState] = useState<AuthState>({ status: "loading" });

  useEffect(() => {
    // Escuta mudanças de sessão (login, logout, expiração de token) uma única vez,
    // no topo da árvore. Nenhum outro componente deve chamar onAuthStateChanged.
    const unsubscribe = AuthService.onAuthChange((user) => {
      setFirebaseUser(user);
      setAuthState({ status: user ? "authenticated" : "unauthenticated" });
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ firebaseUser, authState }}>{children}</AuthContext.Provider>
  );
}
