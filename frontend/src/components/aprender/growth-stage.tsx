import { STAGES, stageIndex } from "./stages";

function leaf(y: number, dir: 1 | -1) {
  const x = 16;
  const w = 7 * dir;
  return `M${x} ${y} C${x + w * 0.2} ${y - 1} ${x + w} ${y - 3} ${x + w} ${y - 7} C${x + w * 0.3} ${y - 7} ${x} ${y - 4} ${x} ${y}Z`;
}

/** Ícone de estágio de crescimento (semente → árvore) a partir do progresso real (0–100). */
export function GrowthStage({ progress, className }: { progress: number; className?: string }) {
  const i = stageIndex(progress);
  const name = STAGES[i];
  return (
    <span role="img" aria-label={`Estágio de crescimento: ${name}`} className={className}>
      <svg viewBox="0 0 32 32" className="h-full w-full" aria-hidden="true" fill="currentColor">
        {i === 0 && <ellipse cx="16" cy="24" rx="5" ry="3.4" />}
        {i > 0 && i < 4 && (
          <>
            <path
              d={`M16 29V${25 - i * 4}`}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            {Array.from({ length: i }).map((_, k) => (
              <path key={k} d={leaf(24 - k * 5, k % 2 ? -1 : 1)} />
            ))}
            <path d={leaf(25 - i * 4, i % 2 ? 1 : -1)} />
          </>
        )}
        {i === 4 && (
          <>
            <path d="M14.8 29V17h2.4v12z" />
            <circle cx="16" cy="9.5" r="6.5" />
            <circle cx="10.5" cy="14" r="5" />
            <circle cx="21.5" cy="14" r="5" />
          </>
        )}
      </svg>
    </span>
  );
}
