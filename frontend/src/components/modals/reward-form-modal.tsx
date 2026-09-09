import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Camera, Gift, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { apiFetch, backendAsset, isImageSource } from "@/lib/api";
import { toast } from "sonner";

export type ManagedReward = {
  id: number;
  titulo: string;
  parceiro_id: number | null;
  parceiro: string | null;
  pontos_necessarios: number;
  imagem: string | null;
  ativo: number;
};
export function RewardFormModal({
  open,
  onOpenChange,
  reward,
  partners,
  endpoint,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  reward: ManagedReward | null;
  partners: { id: number; nome: string }[];
  endpoint: string;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState("");
  const [partner, setPartner] = useState("");
  const [points, setPoints] = useState(100);
  const [image, setImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState("");
  const [active, setActive] = useState(true);
  useEffect(() => {
    if (!open) return;
    setTitle(reward?.titulo ?? "");
    setPartner(reward?.parceiro_id ? String(reward.parceiro_id) : "");
    setPoints(Number(reward?.pontos_necessarios ?? 100));
    setImage(null);
    setImageError("");
    setActive(reward ? Boolean(reward.ativo) : true);
  }, [open, reward]);
  const preview = useMemo(
    () => (image ? URL.createObjectURL(image) : (reward?.imagem ?? "")),
    [image, reward?.imagem],
  );
  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);
  const mutation = useMutation({
    mutationFn: () => {
      const form = new FormData();
      form.append("titulo", title.trim());
      form.append("parceiro_id", partner);
      form.append("pontos_necessarios", String(points));
      form.append("ativo", active ? "1" : "0");
      if (image) form.append("foto", image);
      return apiFetch<{ mensagem: string }>(reward ? `${endpoint}/${reward.id}` : endpoint, {
        method: "POST",
        body: form,
      });
    },
    onSuccess: (r) => {
      toast.success(r.mensagem);
      onOpenChange(false);
      onSaved();
    },
    onError: (e) => toast.error(e.message),
  });
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || points < 1) return toast.error("Informe título e pontos válidos");
    if (!image && !reward?.imagem) {
      setImageError("Selecione uma imagem para criar a recompensa.");
      return toast.error("Adicione uma imagem à recompensa");
    }
    mutation.mutate();
  }
  function selectImage(file: File | null) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setImage(null);
      setImageError("Use uma imagem JPG, PNG ou WebP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImage(null);
      setImageError("A imagem deve ter no máximo 5 MB.");
      return;
    }
    setImage(file);
    setImageError("");
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-0 max-w-md overflow-hidden rounded-xl border-border/60 p-0 sm:p-0">
        <div className="min-w-0 rounded-t-xl bg-gradient-hero p-6 pr-20 text-primary-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Gift className="h-5 w-5" />
              {reward ? "Editar recompensa" : "Nova recompensa"}
            </DialogTitle>
            <DialogDescription className="text-white/80">
              Configure o prêmio e o custo em pontos.
            </DialogDescription>
          </DialogHeader>
        </div>
        <form onSubmit={submit} className="min-w-0 space-y-4 overflow-x-hidden p-6">
          <Field label="Título">
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Parceiro (opcional)">
            <select
              value={partner}
              onChange={(e) => setPartner(e.target.value)}
              className={inputCls}
            >
              <option value="">Sem parceiro</option>
              {partners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Pontos">
            <input
              type="number"
              min={1}
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
              className={inputCls}
            />
          </Field>
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Imagem <span className="text-destructive">*</span>
            </div>
            <div className="relative mt-1 min-w-0">
              <label
                className={`flex min-h-24 w-full min-w-0 cursor-pointer items-center gap-3 overflow-hidden rounded-xl border-2 border-dashed bg-background/60 p-3 transition-colors hover:bg-primary/5 ${
                  image ? "pr-14" : ""
                } ${imageError ? "border-destructive" : "border-border hover:border-primary/50"}`}
              >
                <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-lg bg-primary/10 text-primary">
                  {isImageSource(preview) ? (
                    <img
                      src={preview.startsWith("blob:") ? preview : backendAsset(preview)}
                      alt="Prévia da recompensa"
                      className="h-full w-full object-cover"
                    />
                  ) : preview ? (
                    <span className="text-2xl" aria-hidden="true">
                      {preview}
                    </span>
                  ) : (
                    <Upload className="h-5 w-5" aria-hidden="true" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="max-w-full truncate text-sm font-bold text-foreground">
                    {image ? image.name : preview ? "Imagem atual" : "Buscar imagem no dispositivo"}
                  </div>
                  <div id="reward-image-help" className="text-xs text-muted-foreground">
                    JPG, PNG ou WebP · até 5 MB
                  </div>
                </div>
                {!image && <Camera className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />}
                <input
                  key={image ? `${image.name}-${image.lastModified}` : "empty"}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  aria-invalid={Boolean(imageError)}
                  aria-describedby={imageError ? "reward-image-error" : "reward-image-help"}
                  className="sr-only"
                  onChange={(event) => selectImage(event.target.files?.[0] ?? null)}
                />
              </label>
              {image ? (
                <button
                  type="button"
                  aria-label="Remover imagem selecionada"
                  onClick={() => setImage(null)}
                  className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : null}
            </div>
            {imageError && (
              <p
                id="reward-image-error"
                className="mt-1.5 text-xs font-medium text-destructive"
                role="alert"
              >
                {imageError}
              </p>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            Recompensa ativa
          </label>
          <DialogFooter className="grid grid-cols-2 gap-2 space-x-0 sm:space-x-0">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="min-h-11 w-full min-w-0 rounded-lg border border-border px-4 py-2 text-sm font-bold"
            >
              Cancelar
            </button>
            <button
              disabled={mutation.isPending}
              className="min-h-11 w-full min-w-0 rounded-lg bg-primary px-5 py-2 text-sm font-bold text-primary-foreground disabled:opacity-60"
            >
              {mutation.isPending ? "Salvando..." : "Salvar"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
const inputCls =
  "w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
