import { useEffect, useState } from "react";
import { Flame, Sparkles } from "lucide-react";

const RING = 2 * Math.PI * 26;

type Props = {
  nivel: number;
  xp: number;
  xpProximoNivel: number;
  pct: number;
  streakDias: number;
  pontosTotais: number;
};

/** Painel de progresso do aluno. Mostra apenas dados reais já fornecidos pela API. */
export function ProgressHud({ nivel, xp, xpProximoNivel, pct, streakDias, pontosTotais }: Props) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const shown = ready ? pct : 0;
  const faltam = Math.max(0, xpProximoNivel - xp);

  return (
    <section
      aria-label="Seu progresso"
      data-testid="progress-hud"
      className="vr-hero rounded-[26px_8px_26px_8px] p-3.5 shadow-elevated lg:p-5"
    >
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 lg:grid-cols-1 lg:gap-4">
        <div className="relative h-12 w-12 shrink-0 lg:h-20 lg:w-20">
          <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90" aria-hidden="true">
            <circle
              cx="32"
              cy="32"
              r="26"
              fill="none"
              strokeWidth="7"
              stroke="rgb(255 255 255 / 0.18)"
            />
            <circle
              className="vr-ring-v"
              cx="32"
              cy="32"
              r="26"
              fill="none"
              strokeWidth="7"
              strokeLinecap="round"
              stroke="#8bc34a"
              strokeDasharray={RING}
              strokeDashoffset={RING * (1 - shown / 100)}
            />
          </svg>
          <span className="vr-display absolute inset-0 grid place-items-center text-lg font-extrabold lg:text-3xl">
            {nivel}
          </span>
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-semibold opacity-80">Nível {nivel}</p>
          <p className="vr-display text-base font-bold leading-tight lg:text-xl">
            {xp}/{xpProximoNivel} XP
          </p>
          <div
            role="progressbar"
            aria-label="Progresso para o próximo nível"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/20"
          >
            <div
              className="vr-bar-fill h-full w-full rounded-full bg-gradient-to-r from-[#c5e9ae] to-[#8bc34a]"
              style={{ transform: `scaleX(${shown / 100})` }}
            />
          </div>
          {faltam > 0 && (
            <p className="mt-1.5 hidden text-xs opacity-80 lg:block">
              Faltam {faltam} XP para o nível {nivel + 1}
            </p>
          )}
        </div>

        <ul className="m-0 flex list-none flex-col gap-1.5 p-0 text-sm font-bold lg:flex-row lg:gap-2">
          <li
            className="flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 lg:px-3 lg:py-1.5"
            aria-label={`Sequência de ${streakDias} dias`}
          >
            <Flame className="h-4 w-4" aria-hidden="true" /> {streakDias}
            <span className="hidden font-medium opacity-80 lg:inline">dias</span>
          </li>
          <li
            className="flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 lg:px-3 lg:py-1.5"
            aria-label={`${pontosTotais} pontos`}
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" /> {pontosTotais}
            <span className="hidden font-medium opacity-80 lg:inline">pts</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
