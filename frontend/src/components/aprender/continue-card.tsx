import { Play, PartyPopper } from "lucide-react";
import { Mascot } from "./mascot";
import type { LearningLesson } from "./types";

type Props = {
  lesson: LearningLesson | null;
  started: boolean;
  allDone: boolean;
  onStart: (lesson: LearningLesson) => void;
};

/** Chamada principal da página: abre a próxima lição real (mesmo fluxo de clicar no nó da trilha). */
export function ContinueCard({ lesson, started, allDone, onStart }: Props) {
  if (!lesson && !allDone) return null;
  return (
    <section
      aria-label="Próxima lição"
      data-testid="continue-card"
      className="vr-hero vr-rise grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 rounded-[30px_10px_30px_10px] p-5 shadow-elevated sm:p-7"
    >
      <div className="min-w-0 self-center">
        <p className="text-xs font-semibold opacity-80">
          {allDone ? "Curso concluído" : started ? "Continue de onde parou" : "Comece por aqui"}
        </p>
        {lesson ? (
          <>
            <h2 className="vr-display mt-1 break-words text-2xl font-extrabold leading-tight sm:text-3xl">
              {lesson.title}
            </h2>
            <p className="mt-1 text-sm opacity-85">Quiz interativo · +{lesson.xp} XP</p>
            <button
              type="button"
              onClick={() => onStart(lesson)}
              data-testid="continue-card-start-button"
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#8bc34a] px-5 py-2.5 text-sm font-bold text-[#10250f] shadow-[0_5px_0_#5e8a2d] transition-transform hover:bg-[#9bd05a] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-white active:translate-y-[3px] active:shadow-none"
            >
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              {started ? "Continuar lição" : "Iniciar lição"}
            </button>
          </>
        ) : (
          <h2 className="vr-display mt-1 flex items-center gap-2 text-2xl font-extrabold leading-tight sm:text-3xl">
            <PartyPopper className="h-7 w-7" aria-hidden="true" /> Você concluiu todas as lições!
          </h2>
        )}
      </div>
      <div className="relative -mb-5 w-24 shrink-0 sm:-mb-7 sm:w-32">
        <span
          aria-hidden="true"
          className="vr-mascot-glow absolute inset-[10%_-20%_0] -z-10 rounded-full"
        />
        <Mascot
          pose="apresentando"
          eager
          className="vr-float h-auto w-full drop-shadow-[0_10px_14px_rgba(0,0,0,0.35)]"
        />
      </div>
    </section>
  );
}
