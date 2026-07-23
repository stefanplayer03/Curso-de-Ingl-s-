import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { UserProfileService } from "@/services/userProfile.service";
import type { UserProfile } from "@/types/user.types";

/**
 * Componentes de UI usam apenas isto para ler o perfil (nível, XP, streak) —
 * nunca chamam UserProfileService ou o Firestore diretamente.
 */
export function useUserProfile() {
  const { firebaseUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!firebaseUser) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribe = UserProfileService.subscribe(firebaseUser.uid, (result) => {
      setProfile(result);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [firebaseUser]);

  return { profile, isLoading };
}
