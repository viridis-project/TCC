import { useRef } from "react";
import { BookOpen, Flame, Play, Sparkles } from "lucide-react";
import { VrDialog, VrDialogDescription, VrDialogTitle } from "./vr-dialog";
import type { LearningLesson } from "./types";

type Props = {
  lesson: LearningLesson | null;
  onClose: () => void;
  onStart: () => void;
};

export function LessonModal({ lesson, onClose, onStart }: Props) {
  // mantém o conteúdo durante a animação de saída
  const last = useRef<LearningLesson | null>(null);
  if (lesson) last.current = lesson;
  const l = last.current;

  return (
    <VrDialog
      open={!!lesson}
      onClose={onClose}
      className="max-w-md p-0"
      closeLabel="Fechar detalhes da lição"
    >
      {l && (
        <>
          <div className="vr-hero p-8 text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <BookOpen className="h-10 w-10" aria-hidden="true" />
            </div>
            <VrDialogTitle asChild>
              <h3 className="vr-display mt-4 break-words text-xl font-extrabold">{l.title}</h3>
            </VrDialogTitle>
            <VrDialogDescription className="mt-1 text-sm opacity-85">
              Quiz interativo • +{l.xp} XP
            </VrDialogDescription>
          </div>
          <div className="space-y-3 p-6">
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/60 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-warning" aria-hidden="true" /> Recompensa
              </div>
              <div className="text-sm font-bold text-primary">+{l.xp} XP</div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/60 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Flame className="h-4 w-4 text-destructive" aria-hidden="true" /> Sequência
              </div>
              <div className="text-sm font-bold">+1 dia</div>
            </div>
            <button
              type="button"
              onClick={onStart}
              data-testid="lesson-modal-start-button"
              className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-[0_5px_0_var(--primary-active)] transition-transform hover:bg-primary-hover focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-ring active:translate-y-[3px] active:shadow-none"
            >
              <Play className="h-4 w-4 fill-current" aria-hidden="true" /> Iniciar lição
            </button>
          </div>
        </>
      )}
    </VrDialog>
  );
}
