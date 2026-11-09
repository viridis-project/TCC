import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CalendarPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { apiFetch, type Mission } from "@/lib/api";
import { toast } from "sonner";

type ClassRoom = { id: number; nome: string; alunos: { id: number; nome: string }[] };
export function ScheduleMissionModal({
  open,
  onOpenChange,
  turmas,
  missions,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  turmas: ClassRoom[];
  missions: Mission[];
  onCreated: () => void;
}) {
  const [classId, setClassId] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState("");
  const [mode, setMode] = useState<"aberto" | "particular">("aberto");
  const [title, setTitle] = useState("");
  const [missionId, setMissionId] = useState("");
  const [points, setPoints] = useState("0");
  const [maxStudents, setMaxStudents] = useState("1");
  const selectedClass = useMemo(
    () => turmas.find((t) => t.id === Number(classId)),
    [classId, turmas],
  );
  const mutation = useMutation({
    mutationFn: () =>
      apiFetch<{ mensagem: string }>("/missoes-publicadas", {
        method: "POST",
        body: JSON.stringify({
          turma_id: Number(classId),
          titulo: title,
          missao_id: missionId ? Number(missionId) : null,
          descricao: description,
          instrucoes: instructions,
          imagem: image,
          tipo: missions.find((m) => m.id === Number(missionId))?.tipo ?? "outro",
          modo_participacao: Number(maxStudents) > 1 ? mode : "aberto",
          pontos: Number(points),
          max_alunos: Number(maxStudents),
        }),
      }),
    onSuccess: (r) => {
      toast.success(r.mensagem);
      setTitle("");
      setDescription("");
      setInstructions("");
      setImage("");
      setMode("aberto");
      setPoints("0");
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg overflow-hidden rounded-xl border-border/60 p-0 sm:p-0">
        <div className="bg-gradient-hero p-6 text-primary-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <CalendarPlus className="h-5 w-5" />
              Nova missão
            </DialogTitle>
            <DialogDescription className="text-white/80">
              Publique uma missão com imagem e instruções para os alunos aderirem e agendarem.
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
              ? `${selectedClass.alunos.length} alunos poderão visualizar esta missão.`
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
          <Field label="Descrição">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={5000}
              rows={2}
              className={inputCls}
              placeholder="Resuma o objetivo da missão"
            />
          </Field>
          <Field label="Instruções para os alunos (opcional)">
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              maxLength={10000}
              rows={3}
              className={inputCls}
              placeholder="Explique como realizar e comprovar a missão"
            />
          </Field>
          <Field label="URL da imagem (opcional)">
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              maxLength={500}
              className={inputCls}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </Field>
          {image.trim() && (
            <img
              src={image}
              alt="Prévia da imagem da missão"
              className="max-h-36 w-full rounded-lg border object-cover"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          )}
          <Field label="Missão vinculada (opcional)">
            <select
              value={missionId}
              onChange={(e) => setMissionId(e.target.value)}
              className={inputCls}
            >
              <option value="">Sem missão</option>
              {missions.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.titulo}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Pontuação da missão">
              <input
                type="number"
                min={0}
                max={10000}
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Quantidade de participantes">
              <input
                type="number"
                min={1}
                max={100}
                value={maxStudents}
                onChange={(e) => {
                  setMaxStudents(e.target.value);
                  if (Number(e.target.value) <= 1) setMode("aberto");
                }}
                className={inputCls}
              />
            </Field>
          </div>
          {Number(maxStudents) > 1 && (
            <Field label="Participação da equipe">
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as "aberto" | "particular")}
                className={inputCls}
              >
                <option value="aberto">Qualquer participante elegível pode entrar</option>
                <option value="particular">Somente por convite da equipe</option>
              </select>
            </Field>
          )}
          {Number(maxStudents) <= 1 && (
            <p className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
              Missão individual: não há configuração de participação por convite ou aberta.
            </p>
          )}{" "}
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
