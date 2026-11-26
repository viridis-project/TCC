export const STAGES = ["Semente", "Broto", "Muda", "Planta", "Árvore"] as const;

/** Estágio visual derivado do progresso real do módulo (0–100), em 5 faixas iguais. */
export function stageIndex(progress: number) {
  const p = Number.isFinite(progress) ? progress : 0;
  return Math.min(4, Math.max(0, Math.floor(p / 20)));
}
