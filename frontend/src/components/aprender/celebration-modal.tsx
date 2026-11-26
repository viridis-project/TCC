import { useRef } from "react";
import { Sparkles } from "lucide-react";
import { Mascot } from "./mascot";
import { VrDialog, VrDialogDescription, VrDialogTitle } from "./vr-dialog";

type Props = { open: boolean; xp: number; onClose: () => void };

/** Feedback de lição concluída (XP vem do resultado real do quiz). */
export function CelebrationModal({ open, xp, onClose }: Props) {
  const last = useRef(xp);
  if (open) last.current = xp;

  return (
    <VrDialog
      open={open}
      onClose={onClose}
      className="max-w-sm overflow-hidden p-0 text-center"
      hideClose
    >
      <div className="vr-hero px-8 pb-2 pt-8">
        <Mascot
          pose="comemorando"
          alt="Mascote do Viridis comemorando"
          eager
          className="vr-float mx-auto h-44 w-auto drop-shadow-[0_12px_14px_rgba(0,0,0,0.35)]"
        />
      </div>
      <div className="p-7">
        <VrDialogTitle asChild>
          <h3 className="vr-display text-2xl font-extrabold">Lição concluída!</h3>
        </VrDialogTitle>
        <VrDialogDescription className="mt-1 text-sm text-muted-foreground">
          Mandou bem. Continue cultivando seu conhecimento.
        </VrDialogDescription>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-bold text-secondary-foreground">
          <Sparkles className="h-4 w-4" aria-hidden="true" /> +{last.current} XP conquistados
        </div>
        <button
          type="button"
          onClick={onClose}
          data-testid="celebration-modal-continue-button"
          className="mt-6 flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-[0_5px_0_var(--primary-active)] transition-transform hover:bg-primary-hover focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-ring active:translate-y-[3px] active:shadow-none"
        >
          Continuar
        </button>
      </div>
    </VrDialog>
  );
}
