import { useState } from "react";
import { Camera, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

export type ProofTarget = { id: number; titulo: string; pontos: number; equipe?: boolean };

/** Comprovação (foto + descrição) de uma missão cujo turno o aluno ou sua equipe já reservou. */
export function SubmitProofModal({
  mission,
  onOpenChange,
  onSubmitted,
}: {
  mission: ProofTarget | null;
  onOpenChange: (v: boolean) => void;
  onSubmitted?: () => void;
}) {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!mission) return;
    if (description.trim().length < 5) {
      toast.error("Descreva o que foi feito com pelo menos 5 caracteres");
      return;
    }
    if (!file) return toast.error("Envie uma foto da missão");
    const form = new FormData();
    form.append("missao_id", String(mission.id));
    form.append("descricao", description.trim());
    form.append("foto", file);
    setSubmitting(true);
    try {
      const result = await apiFetch<{ mensagem: string }>("/submissoes", {
        method: "POST",
        body: form,
      });
      toast.success(result.mensagem, {
        description: `+${mission.pontos} pontos${mission.equipe ? " para cada integrante" : ""} após aprovação do professor`,
      });
      setDescription("");
      setFile(null);
      onOpenChange(false);
      onSubmitted?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível enviar a comprovação");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={!!mission} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg overflow-hidden rounded-xl border-border/60 p-0 sm:p-0">
        <div className="bg-gradient-hero p-6 text-primary-foreground">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Enviar comprovação</DialogTitle>
            <DialogDescription className="text-white/80">
              {mission ? `${mission.titulo} · +${mission.pontos} pts` : ""}
            </DialogDescription>
          </DialogHeader>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={280}
              rows={3}
              placeholder="Conte o que vocês fizeram..."
              className="mt-1 w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <div className="mt-1 text-right text-[10px] text-muted-foreground">
              {description.length}/280
            </div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Foto comprovante
            </div>
            <label className="mt-1 flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-border bg-background/60 p-4 hover:border-primary/50 hover:bg-primary/5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
                {file ? <Camera className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold text-foreground">
                  {file ? file.name : "Clique para enviar uma foto"}
                </div>
                <div className="text-xs text-muted-foreground">PNG, JPG ou WebP até 5MB</div>
              </div>
              {file && (
                <button
                  type="button"
                  aria-label="Remover foto"
                  onClick={(e) => {
                    e.preventDefault();
                    setFile(null);
                  }}
                  className="grid h-7 w-7 place-items-center rounded-full bg-muted text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
          <DialogFooter className="gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="min-h-11 rounded-lg border border-border bg-background px-4 py-2 text-sm font-bold text-foreground hover:bg-muted"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="min-h-11 rounded-lg bg-primary px-5 py-2 text-sm font-bold text-primary-foreground shadow-soft hover:bg-primary/90 disabled:opacity-60"
            >
              {submitting ? "Enviando..." : "Enviar para verificação"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
