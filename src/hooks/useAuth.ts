import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { AuthService } from "@/services/auth.service";
import { getFriendlyAuthError } from "@/utils/authErrors";
import type { LoginCredentials, RegisterCredentials } from "@/types/auth.types";

/**
 * Hook de acesso à autenticação. Componentes de UI usam apenas isto —
 * nunca importam AuthService ou o SDK do Firebase diretamente.
 */
export function useAuth() {
  const { firebaseUser, authState } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function login(credentials: LoginCredentials) {
    setIsSubmitting(true);
    setFormError(null);
    try {
      await AuthService.login(credentials);
    } catch (error) {
      setFormError(getFriendlyAuthError(error));
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function register(credentials: RegisterCredentials) {
    setIsSubmitting(true);
    setFormError(null);
    try {
      await AuthService.register(credentials);
    } catch (error) {
      setFormError(getFriendlyAuthError(error));
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function logout() {
    await AuthService.logout();
  }

  async function sendPasswordReset(email: string) {
    setIsSubmitting(true);
    setFormError(null);
    try {
      await AuthService.sendPasswordReset(email);
    } catch (error) {
      setFormError(getFriendlyAuthError(error));
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    firebaseUser,
    authState,
    isSubmitting,
    formError,
    login,
    register,
    logout,
    sendPasswordReset,
  };
}
