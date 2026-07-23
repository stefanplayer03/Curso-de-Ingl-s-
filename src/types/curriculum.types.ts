import type { CefrLevel } from "@/types/user.types";

export interface LessonExercise {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
}

export interface Lesson {
  id: string;
  title: string;
  /** Frase de exemplo em contexto — nunca uma palavra isolada. */
  teachingSentence: string;
  /** Explicação breve do porquê/uso da estrutura ensinada. */
  teachingNote: string;
  exercises: LessonExercise[];
}

export interface Unit {
  id: string;
  title: string;
  level: CefrLevel;
  description: string;
  lessons: Lesson[];
}
