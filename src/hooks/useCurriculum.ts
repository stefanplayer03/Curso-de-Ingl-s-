import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { CurriculumService } from "@/services/curriculum.service";
import { CURRICULUM } from "@/constants/curriculum";

export function useCurriculum() {
  const { firebaseUser } = useAuth();
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!firebaseUser) return;
    setIsLoading(true);
    CurriculumService.getCompletedLessonIds(firebaseUser.uid).then((ids) => {
      setCompletedLessonIds(ids);
      setIsLoading(false);
    });
  }, [firebaseUser]);

  return { units: CURRICULUM, completedLessonIds, isLoading };
}
