import { ChevronDown } from "lucide-react";
import { GrowthStage } from "./growth-stage";
import { STAGES, stageIndex } from "./stages";
import { LessonTrail } from "./lesson-trail";
import type { LearningLesson, LearningModule } from "./types";

type Props = {
  module: LearningModule;
  index: number;
  onSelect: (lesson: LearningLesson) => void;
  mascot?: { bubble?: string } | null;
};

/** Um módulo: cabeçalho com estágio de crescimento (derivado do progresso real) + trilha de lições. */
export function ModuleSection({ module: m, index, onSelect, mascot }: Props) {
  const stage = STAGES[stageIndex(m.progress)];
  const finished = m.lessons.length > 0 && m.lessons.every((l) => l.status === "completed");
  return (
    <section
      aria-labelledby={`modulo-${m.id}`}
      data-testid={`module-section-${m.id}`}
      className="mb-10"
    >
      <header className="relative mb-4 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.08]"
          style={{
            background: `radial-gradient(120% 90% at 100% 0%, ${m.color}, transparent 60%)`,
          }}
        />
        <div className="relative flex items-start gap-3 sm:gap-4">
          <div
            aria-hidden="true"
            className="vr-display grid h-12 w-12 shrink-0 place-items-center rounded-xl text-xl font-extrabold text-white shadow-soft sm:h-14 sm:w-14"
            style={{ background: m.color }}
          >
            {index + 1}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-muted-foreground">Módulo {index + 1}</p>
            <h3
              id={`modulo-${m.id}`}
              className="vr-display break-words text-lg font-bold leading-snug"
            >
              {m.title}
            </h3>
            {m.description && (
              <p className="mt-0.5 text-xs text-muted-foreground">{m.description}</p>
            )}
          </div>
          <div className="flex shrink-0 flex-col items-center gap-0.5 text-primary">
            <GrowthStage progress={m.progress} className="block h-9 w-9" />
            <span className="text-[11px] font-semibold">{stage}</span>
          </div>
        </div>
        <div className="relative mt-3">
          <div
            role="progressbar"
            aria-label={`Progresso do módulo ${m.title}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={m.progress}
            className="h-2 overflow-hidden rounded-full bg-muted"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-[#8bc34a]"
              style={{ width: `${m.progress}%` }}
            />
          </div>
          <p className="mt-1 text-right text-[11px] font-semibold text-muted-foreground">
            {m.progress}% concluído
          </p>
        </div>
      </header>
      {finished ? (
        <details
          data-testid={`module-section-${m.id}-details`}
          className="group rounded-3xl border border-border/70 bg-card/60"
        >
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-3xl px-5 py-3 text-sm font-semibold text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
            <span>Módulo concluído · rever as {m.lessons.length} lições</span>
            <ChevronDown
              className="h-4 w-4 transition-transform duration-200 group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <div className="px-2 pb-4 sm:px-6">
            <LessonTrail lessons={m.lessons} onSelect={onSelect} mascot={mascot} />
          </div>
        </details>
      ) : (
        <div className="rounded-3xl border border-border/70 bg-card/60 px-2 py-4 sm:px-6">
          <LessonTrail lessons={m.lessons} onSelect={onSelect} mascot={mascot} />
        </div>
      )}
    </section>
  );
}
