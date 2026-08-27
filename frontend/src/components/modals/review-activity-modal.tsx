import { useState, useEffect } from "react";
import { Check, X, MessageSquare, Calendar, Award } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export interface PendingItem {
  id: number;
  student: string;
  activity: string;
  date: string;
  points: number;
  photo?: string;
  description?: string;
}

interface Props {
  item: PendingItem | null;
  onOpenChange: (v: boolean) => void;
  onResolve?: (id: number, action: "approve" | "reject", comment: string) => Promise<void>;
}

const quickComments = [
  "Ótimo trabalho! 🌱",
  "Adicione mais detalhes da foto",
  "Foto pouco nítida, reenvie",
  "Faltou descrição da atividade",
];

export function ReviewActivityModal({ item, onOpenChange, onResolve }: Props) {
  const [comment, setComment] = useState("");
  const [mode, setMode] = useState<"approve" | "reject">("approve");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) { setComment(""); setMode("approve"); }
  }, [item]);

  if (!item) return null;

  async function submit(action: "approve" | "reject") {
    if (action === "reject" && comment.trim().length < 3) {
      toast.error("Adicione um comentário explicando a rejeição");
      setMode("reject");
      return;
    }
    setLoading(true);
    try {
      await onResolve?.(item!.id, action, comment.trim());
      if (action === "approve") toast.success(`${item!.student} aprovado`, { description: `+${item!.points} pontos creditados` });
      else toast.error(`${item!.student} rejeitado`, { description: comment.trim() });
      onOpenChange(false);
    } catch (error) { toast.error(error instanceof Error ? error.message : "Não foi possível revisar"); }
    finally { setLoading(false); }
  }

  return (
    <Dialog open={!!item} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl border-border/60 p-0 overflow-hidden">
        <div className="bg-gradient-hero p-6 text-primary-foreground">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold">Revisar atividade</DialogTitle>
            <DialogDescription className="text-white/80">
              Aprove ou rejeite com um feedback construtivo.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-4 p-6">
          <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/60 p-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/15 text-lg font-extrabold text-primary">
              {item.student.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-extrabold text-foreground">{item.student}</div>
              <div className="truncate text-xs text-muted-foreground">{item.activity}</div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-xs font-extrabold text-warning">
                <Award className="h-3 w-3" /> +{item.points}
              </div>
              <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
                <Calendar className="h-3 w-3" /> {item.date}
              </div>
            </div>
          </div>

          <div className="grid min-h-40 place-items-center overflow-hidden rounded-2xl border border-border/60 bg-muted/30 text-muted-foreground">
            {item.photo ? <img src={item.photo} alt="Comprovante" className="max-h-72 w-full object-contain" /> :
            <div className="text-center text-xs">
              <div className="text-4xl">📷</div>
              <div className="mt-2 font-semibold">Foto comprovante</div>
            </div>}
          </div>
          {item.description && <p className="rounded-xl bg-muted/40 p-3 text-sm text-foreground">{item.description}</p>}

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <MessageSquare className="mr-1 inline h-3 w-3" /> Comentário {mode === "reject" && <span className="text-destructive">*</span>}
              </label>
              <span className="text-[10px] text-muted-foreground">{comment.length}/200</span>
            </div>
            <textarea
              value={comment} onChange={(e) => setComment(e.target.value)} maxLength={200} rows={2}
              placeholder={mode === "reject" ? "Explique o motivo da rejeição..." : "Feedback opcional para o aluno..."}
              className="mt-1 w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {quickComments.map((q) => (
                <button key={q} type="button" onClick={() => setComment(q)} className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:border-primary/40 hover:text-primary">
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 border-t border-border/60 bg-muted/30 px-6 py-4">
          <button disabled={loading} onClick={() => submit("reject")} className="inline-flex items-center gap-1.5 rounded-full bg-destructive px-4 py-2 text-sm font-extrabold text-destructive-foreground shadow-soft hover:opacity-90 disabled:opacity-60">
            <X className="h-4 w-4" /> Rejeitar
          </button>
          <button disabled={loading} onClick={() => submit("approve")} className="inline-flex items-center gap-1.5 rounded-full bg-success px-5 py-2 text-sm font-extrabold text-success-foreground shadow-soft hover:opacity-90 disabled:opacity-60">
            <Check className="h-4 w-4" /> Aprovar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
