import { useState } from "react";
import { Sparkles, Tag, Check } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export interface Reward {
  id: number; title: string; partner: string; points: number; image: string;
  scope?: "app" | "escola";
}

interface Props {
  reward: Reward | null;
  userPoints: number;
  onOpenChange: (v: boolean) => void;
  onConfirm?: (reward: Reward) => Promise<void>;
}

export function RedeemRewardModal({ reward, userPoints, onOpenChange, onConfirm }: Props) {
  const [loading, setLoading] = useState(false);
  if (!reward) return null;
  const can = userPoints >= reward.points;
  const remaining = userPoints - reward.points;

  async function confirm() {
    if (!can) return;
    setLoading(true);
    try {
      await onConfirm?.(reward!);
      toast.success("Resgate confirmado!", { description: `Mostre o cupom em ${reward!.partner} para validar.` });
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível resgatar");
    } finally { setLoading(false); }
  }

  return (
    <Dialog open={!!reward} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl border-border/60 p-0 overflow-hidden">
        <div className="grid place-items-center bg-gradient-to-b from-success/20 to-success/5 p-8 text-7xl">
          <span>{reward.image}</span>
        </div>
        <div className="p-6">
          <DialogHeader>
            <div className="inline-flex w-fit items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-bold text-primary">
              <Tag className="h-3 w-3" /> {reward.partner}
            </div>
            <DialogTitle className="text-xl font-extrabold">{reward.title}</DialogTitle>
            <DialogDescription>
              Confirme o resgate desta recompensa. Os pontos serão debitados imediatamente.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-2 rounded-2xl border border-border/60 bg-background/60 p-4 text-sm">
            <Row label="Seus pontos" value={userPoints.toLocaleString("pt-BR")} />
            <Row label="Custo" value={`- ${reward.points.toLocaleString("pt-BR")}`} accent="text-destructive" />
            <div className="my-1 border-t border-dashed border-border/60" />
            <Row label="Saldo após resgate" value={can ? remaining.toLocaleString("pt-BR") : "Insuficiente"} accent={can ? "text-success font-extrabold" : "text-destructive font-extrabold"} />
          </div>
        </div>
        <DialogFooter className="gap-2 border-t border-border/60 bg-muted/30 px-6 py-4">
          <button onClick={() => onOpenChange(false)} className="rounded-full border border-border bg-background px-4 py-2 text-sm font-bold text-foreground hover:bg-muted">
            Cancelar
          </button>
          <button disabled={!can || loading} onClick={confirm} className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-extrabold text-primary-foreground shadow-soft hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none">
            {loading ? "Resgatando..." : can ? <><Sparkles className="h-4 w-4" /> Confirmar resgate</> : <>Pontos insuficientes</>}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={accent ?? "font-bold text-foreground"}>{value}</span>
    </div>
  );
}

export { Check };
