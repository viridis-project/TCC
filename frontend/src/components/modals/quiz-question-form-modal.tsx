import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { apiFetch, type Lesson } from "@/lib/api";
import { toast } from "sonner";

export type AdminQuestion = {
  id: number;
  texto_pergunta: string;
  pontos_recompensa: number;
  licao_id: number;
  licao: string;
  opcoes: { id: number; texto_opcao: string; is_correta: number }[];
};
export function QuizQuestionFormModal({
  open,
  onOpenChange,
  question,
  lessons,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  question: AdminQuestion | null;
  lessons: Lesson[];
  onSaved: () => void;
}) {
  const [lessonId, setLessonId] = useState("");
  const [text, setText] = useState("");
  const [points, setPoints] = useState(5);
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState(0);
  useEffect(() => {
    if (!open) return;
    if (question) {
      setLessonId(String(question.licao_id));
      setText(question.texto_pergunta);
      setPoints(Number(question.pontos_recompensa));
      setOptions(question.opcoes.map((o) => o.texto_opcao));
      setCorrect(
        Math.max(
          0,
          question.opcoes.findIndex((o) => Boolean(o.is_correta)),
        ),
      );
    } else {
      setLessonId("");
      setText("");
      setPoints(5);
      setOptions(["", "", "", ""]);
      setCorrect(0);
    }
  }, [open, question]);
  const mutation = useMutation({
    mutationFn: () =>
      apiFetch<{ mensagem: string }>(
        question ? `/admin/quiz/perguntas/${question.id}` : "/admin/quiz/perguntas",
        {
          method: question ? "PUT" : "POST",
          body: JSON.stringify({
            licao_id: Number(lessonId),
            texto_pergunta: text,
            pontos_recompensa: points,
            opcoes: options.map((texto_opcao, i) => ({ texto_opcao, is_correta: i === correct })),
          }),
        },
      ),
    onSuccess: (r) => {
      toast.success(r.mensagem);
      onOpenChange(false);
      onSaved();
    },
    onError: (e) => toast.error(e.message),
  });
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!lessonId || !text.trim() || options.some((o) => !o.trim()) || correct < 0)
      return toast.error("Preencha a pergunta, as 4 opções e marque uma correta");
    mutation.mutate();
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden rounded-xl border-border/60 p-0 sm:p-0">
        <div className="bg-gradient-hero p-6 text-primary-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <HelpCircle className="h-5 w-5" />
              {question ? "Editar pergunta" : "Nova pergunta"}
            </DialogTitle>
            <DialogDescription className="text-white/80">
              Configure o conteúdo e a resposta correta.
            </DialogDescription>
          </DialogHeader>
        </div>
        <form onSubmit={submit} className="space-y-4 p-6">
          <Field label="Lição">
            <select
              value={lessonId}
              onChange={(e) => setLessonId(e.target.value)}
              className={inputCls}
            >
              <option value="">Selecione</option>
              {lessons.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.titulo}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Pergunta">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              className={inputCls}
            />
          </Field>
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Opções
            </div>
            {options.map((option, i) => (
              <label key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={correct === i}
                  onChange={() => setCorrect(i)}
                  name="correta"
                  className="h-4 w-4 accent-primary"
                />
                <input
                  value={option}
                  onChange={(e) =>
                    setOptions((current) =>
                      current.map((o, index) => (index === i ? e.target.value : o)),
                    )
                  }
                  className={inputCls}
                  placeholder={`Opção ${i + 1}`}
                />
              </label>
            ))}
          </div>
          <Field label="Pontos">
            <input
              type="number"
              min={1}
              max={1000}
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
              className={inputCls}
            />
          </Field>
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
              {mutation.isPending ? "Salvando..." : "Salvar pergunta"}
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
