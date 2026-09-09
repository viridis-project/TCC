import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { X, Sparkles, Trophy, ArrowRight, Heart } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { LearningLesson } from "@/routes/aprender";
import { toast } from "sonner";

type Question = {
  id: number;
  texto_pergunta: string;
  pontos_recompensa: number;
  opcoes: { id: number; texto_opcao: string }[];
};

interface QuizModalProps {
  lesson: LearningLesson | null;
  onClose: () => void;
  onFinish: (xpEarned: number) => void;
}

export function QuizModal({ lesson, onClose, onFinish }: QuizModalProps) {
  const lessonId = lesson?.id;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!lessonId) return;
    const controller = new AbortController();
    setQuestions([]);
    setIndex(0);
    setAnswers({});
    setLoading(true);
    apiFetch<{ perguntas: Question[] }>(`/licoes/${lessonId}/quiz`, { signal: controller.signal })
      .then((data) => setQuestions(data.perguntas))
      .catch((error) => {
        if (!controller.signal.aborted) toast.error(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [lessonId]);

  if (!lesson) return null;
  const question = questions[index];
  const selected = question ? answers[question.id] : undefined;
  const progress = questions.length ? ((index + 1) / questions.length) * 100 : 0;

  async function next() {
    if (!question || selected === undefined) return;
    if (index + 1 < questions.length) {
      setIndex((current) => current + 1);
      return;
    }
    setSubmitting(true);
    try {
      const result = await apiFetch<{
        mensagem: string;
        acertos: number;
        total: number;
        xp_ganho: number;
        pontos_ganhos: number;
        ja_concluida: boolean;
      }>(`/licoes/${lesson!.id}/quiz/submeter`, {
        method: "POST",
        body: JSON.stringify({
          respostas: questions.map((q) => ({ pergunta_id: q.id, opcao_id: answers[q.id] })),
        }),
      });
      toast.success(result.mensagem, {
        description: result.ja_concluida
          ? `${result.acertos}/${result.total} acertos · lição já recompensada`
          : `+${result.xp_ganho} XP e +${result.pontos_ganhos} pontos`,
      });
      onFinish(result.xp_ganho);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível enviar o quiz");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 grid place-items-center bg-foreground/50 p-4 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.94, y: 16, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-soft"
        >
          <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-5 py-3">
            <button
              onClick={onClose}
              className="grid h-11 w-11 place-items-center rounded-full text-muted-foreground hover:bg-accent"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-muted">
              <motion.div
                animate={{ width: `${progress}%` }}
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-success to-primary"
              />
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-destructive">
              <Heart className="h-4 w-4 fill-destructive" /> 3
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-muted-foreground">Carregando quiz...</div>
          ) : question ? (
            <div className="p-6 sm:p-7">
              <div className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                Pergunta {index + 1} de {questions.length}
              </div>
              <h3 className="mt-2 text-xl font-bold leading-snug sm:text-2xl">
                {question.texto_pergunta}
              </h3>
              <div className="mt-5 space-y-2.5">
                {question.opcoes.map((option, optionIndex) => {
                  const active = selected === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() =>
                        setAnswers((current) => ({ ...current, [question.id]: option.id }))
                      }
                      className={`flex w-full items-center gap-3 rounded-lg border-2 px-4 py-3.5 text-left text-sm font-semibold transition-all ${active ? "border-primary bg-primary/10 shadow-soft" : "border-border hover:border-primary/40 hover:bg-muted/50"}`}
                    >
                      <span
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border text-[11px] font-bold ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-muted text-muted-foreground"}`}
                      >
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                      {option.texto_opcao}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={next}
                disabled={selected === undefined || submitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-primary-foreground disabled:opacity-40"
              >
                {submitting ? (
                  "Enviando..."
                ) : index + 1 === questions.length ? (
                  <>
                    <Trophy className="h-4 w-4" /> Concluir
                  </>
                ) : (
                  <>
                    Próxima <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
              <div className="mt-3 flex items-center justify-center gap-1 text-xs text-warning">
                <Sparkles className="h-3.5 w-3.5" /> Até +{lesson.xp} XP
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-muted-foreground">
              Esta lição ainda não possui perguntas.
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
