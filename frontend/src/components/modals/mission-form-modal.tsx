import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ImagePlus, Rocket, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { apiFetch, missionTypes, type MissionType } from "@/lib/api";
import { toast } from "sonner";

type ClassRoom = { id: number; nome: string; alunos: { id: number; nome: string }[] };

/**
 * Publica uma missão para uma turma. O professor define o que deve ser feito, a recompensa e o limite
 * de alunos, mas NÃO quem fará nem quando: os alunos pegam a missão e escolhem o turno.
 */
export function MissionFormModal({
  open,
  onOpenChange,
  turmas,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  turmas: ClassRoom[];
  onCreated: () => void;
}) {
  const [classId, setClassId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<MissionType>("plant");
  const [points, setPoints] = useState(String(missionTypes.plant.points));
  const [maxStudents, setMaxStudents] = useState("1");
  const [image, setImage] = useState<File | null>(null);
  const selectedClass = useMemo(
    () => turmas.find((t) => t.id === Number(classId)),
    [classId, turmas],
  );
  const preview = useMemo(() => (image ? URL.createObjectURL(image) : null), [image]);
  const mutation = useMutation({
    mutationFn: () => {
      const form = new FormData();
      form.append("turma_id", classId);
      form.append("titulo", title.trim());
      form.append("descricao", description.trim());
      form.append("tipo", type);
      form.append("pontos", points);
      form.append("max_alunos", maxStudents);
      if (image) form.append("foto", image);
      return apiFetch<{ mensagem: string }>("/missoes", { method: "POST", body: form });
    },
    onSuccess: (r) => {
      toast.success(r.mensagem);
      setTitle("");
      setDescription("");
      setImage(null);
      setType("plant");
      setPoints(String(missionTypes.plant.points));
      setMaxStudents("1");
      onOpenChange(false);
      onCreated();
    },
    onError: (e) => toast.error(e.message),
  });
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!classId || title.trim() === "") return toast.error("Preencha turma e título da missão");
    mutation.mutate();
  }
  function chooseType(value: MissionType) {
    setType(value);
    setPoints(String(missionTypes[value].points));
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-1.5rem)] max-w-lg overflow-y-auto rounded-xl border-border/60 p-0 sm:p-0">
        <div className="bg-gradient-hero p-6 text-primary-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Rocket className="h-5 w-5" />
              Nova missão
            </DialogTitle>
            <DialogDescription className="text-white/80">
              Publique uma missão para a turma. Os alunos escolhem quem faz e quando.
            </DialogDescription>
          </DialogHeader>
        </div>
        <form onSubmit={submit} className="space-y-4 p-6">
          <Field label="Turma">
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className={inputCls}
            >
              <option value="">Selecione</option>
              {turmas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </select>
          </Field>
          <p className="rounded-xl bg-muted p-3 text-xs text-muted-foreground">
            {selectedClass
              ? `${selectedClass.alunos.length} alunos poderão ver esta missão.`
              : "Selecione a turma que verá a missão."}
          </p>
          <Field label="Título da missão">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={150}
              className={inputCls}
              placeholder="Ex.: Regar o canteiro"
            />
          </Field>
          <Field label="Descrição (opcional)">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
              rows={3}
              className={inputCls}
            />
          </Field>
          <Field label="Imagem (opcional)">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-border bg-background/60 p-3 hover:border-primary/50 hover:bg-primary/5">
              {preview ? (
                <img src={preview} alt="Prévia da imagem da missão" className="h-14 w-14 rounded-lg object-cover" />
              ) : (
                <div className="grid h-14 w-14 place-items-center rounded-lg bg-primary/15 text-primary">
                  <ImagePlus className="h-5 w-5" />
                </div>
              )}
              <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                {image ? image.name : "Clique para escolher uma imagem (JPG, PNG ou WebP, até 5 MB)"}
              </span>
              {image && (
                <button
                  type="button"
                  aria-label="Remover imagem"
                  onClick={(e) => {
                    e.preventDefault();
                    setImage(null);
                  }}
                  className="grid h-7 w-7 place-items-center rounded-full bg-muted text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              />
            </label>
          </Field>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Tipo">
              <select
                value={type}
                onChange={(e) => chooseType(e.target.value as MissionType)}
                className={inputCls}
              >
                {Object.entries(missionTypes).map(([value, item]) => (
                  <option key={value} value={value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Pontos">
              <input
                type="number"
                min={0}
                max={10000}
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Máx. de alunos">
              <input
                type="number"
                min={1}
                max={100}
                value={maxStudents}
                onChange={(e) => setMaxStudents(e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>
          <p className="text-xs text-muted-foreground">
            {Number(maxStudents) > 1
              ? "Os pontos são creditados a cada integrante da equipe quando você aprova a comprovação."
              : "Missão individual: apenas um aluno poderá pegá-la."}
          </p>
          <DialogFooter>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="min-h-11 rounded-lg border border-border px-4 py-2 text-sm font-bold"
            >
              Cancelar
            </button>
            <button
              disabled={mutation.isPending}
              className="min-h-11 rounded-lg bg-primary px-5 py-2 text-sm font-bold text-primary-foreground disabled:opacity-60"
            >
              {mutation.isPending ? "Publicando..." : "Publicar missão"}
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
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
