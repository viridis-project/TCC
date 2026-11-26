import { Mascot } from "./mascot";

/** Carregamento com o mascote (substitui o texto solto). */
export function LoadingState({ label }: { label: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto flex max-w-sm flex-col items-center gap-4 px-6 py-20 text-center"
    >
      <Mascot pose="apresentando" eager className="vr-load-mascot h-auto w-20" />
      <p className="vr-display text-lg font-bold">{label}</p>
      <div aria-hidden="true" className="w-full space-y-2">
        <div className="vr-skeleton h-2.5 rounded-full bg-muted" />
        <div className="vr-skeleton mx-auto h-2.5 w-2/3 rounded-full bg-muted" />
      </div>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div role="alert" className="mx-auto max-w-md px-6 py-20 text-center">
      <Mascot pose="cabeca" className="mx-auto mb-4 h-auto w-16 opacity-90" />
      <p className="font-semibold text-destructive">{message}</p>
    </div>
  );
}

export function EmptyCourses() {
  return (
    <div className="mt-4 rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center text-muted-foreground">
      <Mascot pose="cabeca" className="mx-auto mb-3 h-auto w-16" />
      Nenhum curso publicado disponível para você no momento.
    </div>
  );
}
