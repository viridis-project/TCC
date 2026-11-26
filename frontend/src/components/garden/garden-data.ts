import type { Mission } from "@/lib/api";

export type MissionType = Mission["tipo"];

export const MISSION_CATEGORY: Record<string, string> = {
  plant: "Plantio",
  water: "Rega",
  compost: "Compostagem",
  share: "Compartilhar",
  outro: "Outra",
};

export function categoryLabel(tipo: string | null | undefined) {
  return (tipo && MISSION_CATEGORY[tipo]) || "Outra";
}

const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export function monthLabel(key: string) {
  const month = Number(key.slice(5, 7));
  return MONTHS[month - 1] ?? key.slice(5);
}

/** Janela dos últimos 5 meses; meses sem aprovações valem 0 pontos. */
export function growthWindow(rows: { mes: string; valor: number }[], now = new Date()) {
  const byMonth = new Map(rows.map((r) => [r.mes, Number(r.valor)]));
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (4 - i), 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return { key, month: monthLabel(key), value: byMonth.get(key) ?? 0 };
  });
}

/** Variação % do mês atual contra o anterior; null quando não há base de comparação. */
export function monthEvolution(window: { value: number }[]) {
  const current = window[window.length - 1]?.value ?? 0;
  const previous = window[window.length - 2]?.value ?? 0;
  if (previous <= 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}

export function parseDate(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(value.replace(" ", "T"));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function shortDate(value: string | null | undefined) {
  const date = parseDate(value);
  return date ? date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) : null;
}

export function dateTime(value: string | null | undefined) {
  const date = parseDate(value);
  return date
    ? date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }).replace(",", "")
    : null;
}

export function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}
