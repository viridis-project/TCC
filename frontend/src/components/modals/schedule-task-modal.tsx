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
export function ScheduleTaskModal({
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
      apiFetch<{ mensagem: string }>("/agenda", {
        method: "POST",
        body: JSON.stringify({
          turma_id: Number(classId),
          titulo: title,
          missao_id: missionId ? Number(missionId) : null,
          descricao: description,
          pontos: Number(points),
          max_alunos: Number(maxStudents),
        }),
      }),
    onSuccess: (r) => {
      toast.success(r.mensagem);
      setTitle("");
      setDescription("");
      setPoints("0");
      setMaxStudents("1");
      onOpenChange(false);
      onCreated();
    },
    onError: (e) => toast.error(e.message),
  });
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!classId || title.trim() === "") return toast.error("Preencha turma e título da tarefa");
    mutation.mutate();
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg overflow-hidden rounded-xl border-border/60 p-0 sm:p-0">
        <div className="bg-gradient-hero p-6 text-primary-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <CalendarPlus className="h-5 w-5" />
              Nova tarefa
            </DialogTitle>
            <DialogDescription className="text-white/80">
              Publique uma tarefa que os alunos poderão aceitar e agendar.
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
          <p className="rounded-xl bg-muted p-3 text-xs text-muted-foreground">{selectedClass ? `${selectedClass.alunos.length} alunos poderão visualizar esta tarefa.` : "Selecione a turma que verá a tarefa."}</p>
          <Field label="Título da tarefa">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={150}
              className={inputCls}
              placeholder="Ex.: Regar o canteiro"
            />
          </Field>
          <Field label="Instruções (opcional)">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000} rows={3} className={inputCls} />
          </Field>
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
            <Field label="Pontuação da tarefa"><input type="number" min={0} max={10000} value={points} onChange={(e) => setPoints(e.target.value)} className={inputCls} /></Field>
            <Field label="Máximo de alunos"><input type="number" min={1} max={100} value={maxStudents} onChange={(e) => setMaxStudents(e.target.value)} className={inputCls} /></Field>
          </div>          <DialogFooter>
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
              {mutation.isPending ? "Publicando..." : "Publicar tarefa"}
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
