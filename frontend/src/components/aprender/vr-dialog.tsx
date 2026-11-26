import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useRef, type ReactNode } from "react";
import { X } from "lucide-react";

// Último elemento que abriu um diálogo: serve de reserva quando um diálogo abre logo após outro fechar
// (ex.: lição → quiz) e o foco ainda está no body.
let lastOpener: HTMLElement | null = null;

export const VrDialogTitle = DialogPrimitive.Title;
export const VrDialogDescription = DialogPrimitive.Description;

/**
 * Diálogo acessível do /aprender (Radix): foco preso dentro do modal, fechamento por Esc,
 * retorno do foco ao elemento que o abriu e rolagem do fundo bloqueada.
 * O conteúdo é renderizado no `body` (acima da navegação) e recebe `vr-tokens` para usar a paleta do Viridis.
 */
export function VrDialog({
  open,
  onClose,
  children,
  className = "",
  closeLabel = "Fechar",
  hideClose = false,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  closeLabel?: string;
  hideClose?: boolean;
}) {
  // Radix só devolve o foco a um <Trigger>; aqui o diálogo abre por código, então guardamos o opener.
  const opener = useRef<HTMLElement | null>(null);
  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="vr-overlay fixed inset-0 z-50 bg-black/60 backdrop-blur-[3px] duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          onOpenAutoFocus={() => {
            const active = document.activeElement as HTMLElement | null;
            if (active && active !== document.body) lastOpener = active;
            opener.current = active && active !== document.body ? active : lastOpener;
          }}
          onCloseAutoFocus={(event) => {
            const el = opener.current;
            if (el && el !== document.body && el.isConnected) {
              event.preventDefault();
              el.focus();
            }
          }}
          className={`vr-modal vr-tokens fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-[28px_8px_28px_8px] border border-border bg-card text-card-foreground shadow-elevated outline-none duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 ${className}`}
        >
          {children}
          {!hideClose && (
            <DialogPrimitive.Close
              className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              data-testid="vr-dialog-close-button"
            >
              <X className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">{closeLabel}</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
