import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Camera, Sprout, Droplets, Recycle, Share2, Upload, X } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { apiFetch, isBrowser, type Mission } from "@/lib/api";

const activityTypes = [
  { id: "plant", label: "Plantio", icon: Sprout, points: 50, color: "bg-success/15 text-success border-success/30" },
  { id: "water", label: "Rega", icon: Droplets, points: 20, color: "bg-info/15 text-info border-info/30" },
  { id: "compost", label: "Compostagem", icon: Recycle, points: 75, color: "bg-warning/15 text-warning border-warning/30" },
  { id: "share", label: "Compartilhar", icon: Share2, points: 25, color: "bg-primary/15 text-primary border-primary/30" },
];

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultType?: string;
  onSubmitted?: () => void;
}

export function SubmitActivityModal({ open, onOpenChange, defaultType, onSubmitted }: Props) {
  const [type, setType] = useState(defaultType ?? "plant");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { data: missions = [] } = useQuery({
    queryKey: ["missoes"], enabled: isBrowser && open,
    queryFn: async () => (await apiFetch<{ missoes: Mission[] }>("/missoes")).missoes,
  });
  useEffect(() => { if (open) setType(defaultType ?? "plant"); }, [defaultType, open]);
  const selectedBase = activityTypes.find((a) => a.id === type) ?? activityTypes[0];
  const selectedMission = missions.find((mission) => mission.tipo === type);
  const selected = { ...selectedBase, points: selectedMission?.pontos_recompensa ?? selectedBase.points };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (description.trim().length < 5) {
      toast.error("Descreva sua atividade com pelo menos 5 caracteres");
      return;
    }
    if (!file) return toast.error("Envie uma foto da atividade");
    if (!selectedMission) return toast.error("Atividade não encontrada no servidor");
    const form = new FormData();
    form.append("missao_id", String(selectedMission.id));
    form.append("descricao", description.trim());
    form.append("foto", file);
    setSubmitting(true);
    try {
      const result = await apiFetch<{ mensagem: string }>("/submissoes", { method: "POST", body: form });
      toast.success(result.mensagem, { description: `+${selected.points} pontos pendentes de aprovação do professor` });
      setDescription(""); setFile(null); onOpenChange(false); onSubmitted?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível enviar a atividade");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl border-border/60 p-0 overflow-hidden">
        <div className="bg-gradient-hero p-6 text-primary-foreground">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold">Cadastrar atividade</DialogTitle>
            <DialogDescription className="text-white/80">
              Registre sua ação sustentável e ganhe pontos após verificação.
            </DialogDescription>
          </DialogHeader>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tipo de atividade</div>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {activityTypes.map((a) => {
                const active = type === a.id;
                return (
                  <motion.button
                    key={a.id} type="button" whileTap={{ scale: 0.96 }}
                    onClick={() => setType(a.id)}
                    className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-3 text-center transition-all ${
                      active ? a.color + " ring-2 ring-primary/30" : "border-border/60 bg-background/60 text-muted-foreground"
                    }`}
                  >
                    <a.icon className="h-5 w-5" />
                    <span className="text-xs font-bold">{a.label}</span>
                    <span className="text-[10px] font-extrabold">+{a.points}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Descrição</label>
            <textarea
              value={description} onChange={(e) => setDescription(e.target.value)}
              maxLength={280} rows={3} placeholder="Conte o que você fez..."
              className="mt-1 w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <div className="mt-1 text-right text-[10px] text-muted-foreground">{description.length}/280</div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Foto comprovante</div>
            <label className="mt-1 flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-border bg-background/60 p-4 hover:border-primary/50 hover:bg-primary/5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
                {file ? <Camera className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold text-foreground">
                  {file ? file.name : "Clique para enviar uma foto"}
                </div>
                <div className="text-xs text-muted-foreground">PNG, JPG até 5MB</div>
              </div>
              {file && (
                <button type="button" onClick={(e) => { e.preventDefault(); setFile(null); }} className="grid h-7 w-7 place-items-center rounded-full bg-muted text-muted-foreground hover:bg-destructive hover:text-destructive-foreground">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </label>
          </div>

          <DialogFooter className="gap-2">
            <button type="button" onClick={() => onOpenChange(false)} className="rounded-full border border-border bg-background px-4 py-2 text-sm font-bold text-foreground hover:bg-muted">
              Cancelar
            </button>
            <button type="submit" disabled={submitting} className="rounded-full bg-primary px-5 py-2 text-sm font-extrabold text-primary-foreground shadow-soft hover:bg-primary/90 disabled:opacity-60">
              {submitting ? "Enviando..." : "Enviar para verificação"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
