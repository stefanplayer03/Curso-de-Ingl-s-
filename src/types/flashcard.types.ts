export interface ReviewCard {
  id: string;
  uid: string;
  front: string; // o que o aluno escreveu (com o erro)
  back: string; // a forma corrigida
  explanation: string;
  boxLevel: number; // caixa do sistema de Leitner (0 a 5)
  nextReviewAt: string; // ISO date
  createdAt: string; // ISO date
}
