export interface PlacementQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
}

export interface PlacementAnswer {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
}
