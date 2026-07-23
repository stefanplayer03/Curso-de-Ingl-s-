/**
 * Sistema de Leitner simplificado: cada caixa tem um intervalo em dias até a
 * próxima revisão. Acertar sobe uma caixa (revisão mais espaçada); errar volta
 * pra caixa 0 (revisão já no dia seguinte).
 */
export const LEITNER_INTERVALS_DAYS = [1, 2, 4, 7, 15, 30] as const;
export const MAX_BOX_LEVEL = LEITNER_INTERVALS_DAYS.length - 1;

export function nextReviewDate(boxLevel: number): Date {
  const days = LEITNER_INTERVALS_DAYS[Math.min(boxLevel, MAX_BOX_LEVEL)];
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}
