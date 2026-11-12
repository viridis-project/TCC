import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { X, Heart, Trophy, ArrowRight, Sparkles, Leaf, BookOpen, Flame, GraduationCap, Star, Zap, Check, Lock, Play } from "lucide-react";
import { a as apiFetch, u as userQuery, h as isBrowser, P as PageShell } from "./router-_glEtDMC.js";
import { toast } from "sonner";
import "recharts";
import "@radix-ui/react-dialog";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-slot";
import "class-variance-authority";
function QuizModal({ lesson, onClose, onFinish }) {
  const lessonId = lesson?.id;
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    if (!lessonId) return;
    const controller = new AbortController();
    setQuestions([]);
    setIndex(0);
    setAnswers({});
    setLoading(true);
    apiFetch(`/licoes/${lessonId}/quiz`, { signal: controller.signal }).then((data) => setQuestions(data.perguntas)).catch((error) => {
      if (!controller.signal.aborted) toast.error(error.message);
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [lessonId]);
  if (!lesson) return null;
  const question = questions[index];
  const selected = question ? answers[question.id] : void 0;
  const progress = questions.length ? (index + 1) / questions.length * 100 : 0;
  async function next() {
    if (!question || selected === void 0) return;
    if (index + 1 < questions.length) {
      setIndex((current) => current + 1);
      return;
    }
    setSubmitting(true);
    try {
      const result = await apiFetch(`/licoes/${lesson.id}/quiz/submeter`, {
        method: "POST",
        body: JSON.stringify({
          respostas: questions.map((q) => ({ pergunta_id: q.id, opcao_id: answers[q.id] }))
        })
      });
      toast.success(result.mensagem, {
        description: result.ja_concluida ? `${result.acertos}/${result.total} acertos · lição já recompensada` : `+${result.xp_ganho} XP e +${result.pontos_ganhos} pontos`
      });
      onFinish(result.xp_ganho);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível enviar o quiz");
    } finally {
      setSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsx(AnimatePresence, { children: /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 z-50 grid place-items-center bg-foreground/50 p-4 backdrop-blur-md",
      children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { scale: 0.94, y: 16, opacity: 0 },
          animate: { scale: 1, y: 0, opacity: 1 },
          className: "w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-soft",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 border-b border-border bg-muted/40 px-5 py-3", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: onClose,
                  className: "grid h-11 w-11 place-items-center rounded-full text-muted-foreground hover:bg-accent",
                  "aria-label": "Fechar",
                  children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "relative h-3 flex-1 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsx(
                motion.div,
                {
                  animate: { width: `${progress}%` },
                  className: "absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-success to-primary"
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-sm font-bold text-destructive", children: [
                /* @__PURE__ */ jsx(Heart, { className: "h-4 w-4 fill-destructive" }),
                " 3"
              ] })
            ] }),
            loading ? /* @__PURE__ */ jsx("div", { className: "p-12 text-center text-muted-foreground", children: "Carregando quiz..." }) : question ? /* @__PURE__ */ jsxs("div", { className: "p-6 sm:p-7", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-[11px] font-bold uppercase tracking-wide text-muted-foreground", children: [
                "Pergunta ",
                index + 1,
                " de ",
                questions.length
              ] }),
              /* @__PURE__ */ jsx("h3", { className: "mt-2 text-xl font-bold leading-snug sm:text-2xl", children: question.texto_pergunta }),
              /* @__PURE__ */ jsx("div", { className: "mt-5 space-y-2.5", children: question.opcoes.map((option, optionIndex) => {
                const active = selected === option.id;
                return /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => setAnswers((current) => ({ ...current, [question.id]: option.id })),
                    className: `flex w-full items-center gap-3 rounded-lg border-2 px-4 py-3.5 text-left text-sm font-semibold transition-all ${active ? "border-primary bg-primary/10 shadow-soft" : "border-border hover:border-primary/40 hover:bg-muted/50"}`,
                    children: [
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: `grid h-7 w-7 shrink-0 place-items-center rounded-lg border text-[11px] font-bold ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-muted text-muted-foreground"}`,
                          children: String.fromCharCode(65 + optionIndex)
                        }
                      ),
                      option.texto_opcao
                    ]
                  },
                  option.id
                );
              }) }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: next,
                  disabled: selected === void 0 || submitting,
                  className: "mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-primary-foreground disabled:opacity-40",
                  children: submitting ? "Enviando..." : index + 1 === questions.length ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(Trophy, { className: "h-4 w-4" }),
                    " Concluir"
                  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                    "Próxima ",
                    /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-center gap-1 text-xs text-warning", children: [
                /* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5" }),
                " Até +",
                lesson.xp,
                " XP"
              ] })
            ] }) : /* @__PURE__ */ jsx("div", { className: "p-12 text-center text-muted-foreground", children: "Esta lição ainda não possui perguntas." })
          ]
        }
      )
    }
  ) });
}
const kindIcon = {
  lesson: BookOpen,
  challenge: Zap,
  exam: Star,
  certificate: GraduationCap,
  trophy: Trophy
};
const SIDES = ["center", "right", "right", "center", "left", "left"];
function NodeButton({
  lesson,
  side,
  onClick
}) {
  const Icon = kindIcon[lesson.kind] ?? BookOpen;
  const offset = side === "left" ? "-translate-x-16 sm:-translate-x-28" : side === "right" ? "translate-x-16 sm:translate-x-28" : "";
  const styles = {
    completed: "bg-gradient-to-b from-success to-success/70 text-success-foreground shadow-[0_8px_0_oklch(0.45_0.15_150)]",
    current: "bg-gradient-to-b from-primary to-primary/70 text-primary-foreground shadow-[0_8px_0_oklch(0.30_0.10_150)] ring-4 ring-primary/25",
    available: "bg-card text-foreground shadow-[0_8px_0_oklch(0.85_0.02_140)] border border-border",
    locked: "bg-muted text-muted-foreground shadow-[0_6px_0_oklch(0.85_0.02_140)] cursor-not-allowed"
  };
  return /* @__PURE__ */ jsxs(motion.button, { onClick: lesson.status !== "locked" ? onClick : void 0, whileHover: lesson.status !== "locked" ? {
    y: -3,
    scale: 1.05
  } : void 0, whileTap: lesson.status !== "locked" ? {
    y: 2,
    scale: 0.96
  } : void 0, className: `group relative grid h-20 w-20 place-items-center rounded-full transition-all sm:h-24 sm:w-24 ${styles[lesson.status]} ${offset}`, "aria-label": lesson.title, children: [
    lesson.status === "current" && /* @__PURE__ */ jsx(motion.span, { "aria-hidden": true, animate: {
      scale: [1, 1.25, 1],
      opacity: [0.5, 0, 0.5]
    }, transition: {
      duration: 2,
      repeat: Infinity
    }, className: "absolute inset-0 rounded-full bg-primary/40" }),
    lesson.status === "completed" ? /* @__PURE__ */ jsx(Check, { className: "relative h-9 w-9", strokeWidth: 3 }) : lesson.status === "locked" ? /* @__PURE__ */ jsx(Lock, { className: "relative h-7 w-7" }) : /* @__PURE__ */ jsx(Icon, { className: "relative h-9 w-9" }),
    lesson.status === "current" && /* @__PURE__ */ jsxs(motion.span, { initial: {
      scale: 0.6,
      opacity: 0
    }, animate: {
      scale: 1,
      opacity: 1
    }, className: "absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-soft", children: [
      "Comece ",
      /* @__PURE__ */ jsx("span", { className: "ml-1", children: "▼" })
    ] })
  ] });
}
function ModuleHeader({
  module: m,
  index
}) {
  return /* @__PURE__ */ jsxs(motion.div, { initial: {
    opacity: 0,
    x: -16
  }, whileInView: {
    opacity: 1,
    x: 0
  }, viewport: {
    once: true
  }, transition: {
    delay: index * 0.05
  }, className: "sticky top-16 z-10 mb-8 mt-4 overflow-hidden rounded-lg border border-border/60 bg-card/95 p-5 shadow-soft backdrop-blur-sm", children: [
    /* @__PURE__ */ jsx("div", { "aria-hidden": true, className: "absolute inset-0 opacity-[0.07]", style: {
      background: `radial-gradient(120% 80% at 100% 0%, ${m.color}, transparent 60%)`
    } }),
    /* @__PURE__ */ jsxs("div", { className: "relative flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "text-[11px] font-bold uppercase tracking-wide text-muted-foreground", children: [
          "Módulo ",
          index + 1
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "mt-0.5 text-lg font-bold text-foreground", children: m.title }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: m.description })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid h-14 w-14 shrink-0 place-items-center rounded-lg text-2xl font-bold text-primary-foreground shadow-soft", style: {
        background: m.color
      }, children: index + 1 })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "relative mt-3 h-2 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsx(motion.div, { initial: {
      width: 0
    }, whileInView: {
      width: `${m.progress}%`
    }, viewport: {
      once: true
    }, transition: {
      duration: 0.9,
      ease: "easeOut"
    }, className: "h-full rounded-full", style: {
      background: m.color
    } }) }),
    /* @__PURE__ */ jsxs("div", { className: "relative mt-1.5 text-right text-[11px] font-semibold text-muted-foreground", children: [
      m.progress,
      "% concluído"
    ] })
  ] });
}
function LessonModal({
  lesson,
  onClose,
  onStart
}) {
  return /* @__PURE__ */ jsx(AnimatePresence, { children: lesson && /* @__PURE__ */ jsx(motion.div, { initial: {
    opacity: 0
  }, animate: {
    opacity: 1
  }, exit: {
    opacity: 0
  }, className: "fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm", onClick: onClose, children: /* @__PURE__ */ jsxs(motion.div, { initial: {
    scale: 0.92,
    y: 12,
    opacity: 0
  }, animate: {
    scale: 1,
    y: 0,
    opacity: 1
  }, exit: {
    scale: 0.92,
    y: 12,
    opacity: 0
  }, transition: {
    type: "spring",
    stiffness: 280,
    damping: 24
  }, onClick: (e) => e.stopPropagation(), className: "relative w-full max-w-md overflow-hidden rounded-xl border border-border bg-card shadow-soft", children: [
    /* @__PURE__ */ jsx("button", { onClick: onClose, className: "absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-lg text-primary-foreground/80 hover:bg-white/15", "aria-label": "Fechar detalhes da lição", children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden bg-gradient-hero p-8 text-center text-primary-foreground", children: [
      /* @__PURE__ */ jsx("div", { "aria-hidden": true, className: "absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" }),
      /* @__PURE__ */ jsx("div", { "aria-hidden": true, className: "absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-primary-glow/30 blur-2xl" }),
      /* @__PURE__ */ jsx("div", { className: "relative mx-auto grid h-20 w-20 place-items-center rounded-xl bg-white/15 backdrop-blur-sm", children: /* @__PURE__ */ jsx(BookOpen, { className: "h-10 w-10" }) }),
      /* @__PURE__ */ jsx("h3", { className: "relative mt-4 text-xl font-bold", children: lesson.title }),
      /* @__PURE__ */ jsxs("p", { className: "relative mt-1 text-sm text-primary-foreground/80", children: [
        "Quiz interativo • +",
        lesson.xp,
        " XP"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3 p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-xl border border-border bg-muted/50 px-4 py-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-warning" }),
          " Recompensa"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-sm font-bold text-primary", children: [
          "+",
          lesson.xp,
          " XP"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-xl border border-border bg-muted/50 px-4 py-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold", children: [
          /* @__PURE__ */ jsx(Flame, { className: "h-4 w-4 text-destructive" }),
          " Sequência"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-sm font-bold", children: "+1 dia" })
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: onStart, className: "mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-primary to-primary/80 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[0_5px_0_oklch(0.30_0.10_150)] transition-all active:translate-y-1 active:shadow-none", children: [
        /* @__PURE__ */ jsx(Play, { className: "h-4 w-4" }),
        " Iniciar lição"
      ] })
    ] })
  ] }) }) });
}
function CelebrationModal({
  open,
  onClose,
  xp
}) {
  return /* @__PURE__ */ jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsx(motion.div, { initial: {
    opacity: 0
  }, animate: {
    opacity: 1
  }, exit: {
    opacity: 0
  }, className: "fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm", onClick: onClose, children: /* @__PURE__ */ jsxs(motion.div, { initial: {
    scale: 0.5,
    opacity: 0
  }, animate: {
    scale: 1,
    opacity: 1
  }, exit: {
    scale: 0.5,
    opacity: 0
  }, transition: {
    type: "spring",
    stiffness: 220,
    damping: 18
  }, className: "relative w-full max-w-sm overflow-hidden rounded-xl bg-card p-8 text-center shadow-soft", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsx(motion.div, { animate: {
      rotate: [0, -8, 8, -8, 0]
    }, transition: {
      duration: 0.8,
      repeat: 1
    }, className: "mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-b from-warning to-warning/70 text-warning-foreground shadow-[0_8px_0_oklch(0.55_0.16_60)]", children: /* @__PURE__ */ jsx(Trophy, { className: "h-12 w-12" }) }),
    /* @__PURE__ */ jsx("h3", { className: "mt-5 text-2xl font-bold text-foreground", children: "Lição concluída!" }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Mandou bem. Continue cultivando seu conhecimento." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 inline-flex items-center gap-2 rounded-full bg-warning/15 px-4 py-2 text-sm font-bold text-warning", children: [
      /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4" }),
      " +",
      xp,
      " XP conquistados"
    ] }),
    /* @__PURE__ */ jsx("button", { onClick: onClose, className: "mt-6 w-full rounded-lg bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-soft hover:bg-primary/90", children: "Continuar" })
  ] }) }) });
}
function LearnPage() {
  const {
    data: user,
    isPending: loadingUser,
    error: userError
  } = useQuery(userQuery());
  const {
    data: apiModules,
    isPending: loadingModules,
    error: modulesError
  } = useQuery({
    queryKey: ["modulos", user?.id],
    queryFn: async () => (await apiFetch("/modulos")).modulos,
    enabled: isBrowser && !!user,
    retry: false
  });
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [quizLesson, setQuizLesson] = useState(null);
  const [celebrate, setCelebrate] = useState(null);
  const [courseId, setCourseId] = useState(null);
  const courses = [...new Map((apiModules ?? []).map((module) => [module.curso_id, {
    id: module.curso_id,
    title: module.curso_titulo,
    description: module.curso_descricao,
    scope: module.escopo
  }])).values()];
  const activeCourse = courses.find((course) => course.id === courseId) ?? courses[0];
  const modules = (apiModules ?? []).filter((module) => module.curso_id === activeCourse?.id).map((m) => ({
    id: m.id,
    title: m.titulo,
    description: m.descricao,
    color: m.cor,
    progress: m.progresso,
    lessons: m.licoes.map((l) => ({
      id: l.id,
      title: l.titulo,
      status: l.status,
      kind: l.kind,
      xp: l.xp
    }))
  }));
  const totalXP = user?.xp ?? 0;
  const pct = user?.xp_proximo_nivel ? Math.min(100, Math.round(totalXP / user.xp_proximo_nivel * 100)) : 0;
  if (loadingUser) return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsx("div", { role: "status", className: "p-16 text-center text-muted-foreground", children: "Carregando sua trilha..." }) });
  if (userError || modulesError || !user) return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsx("div", { className: "p-16 text-center text-destructive", children: userError?.message ?? modulesError?.message ?? "Faça login para continuar" }) });
  if (loadingUser || loadingModules) return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsx("div", { className: "p-16 text-center text-muted-foreground", children: "Carregando sua trilha..." }) });
  return /* @__PURE__ */ jsxs(PageShell, { children: [
    /* @__PURE__ */ jsxs("div", { "aria-hidden": true, className: "pointer-events-none fixed inset-0 -z-10 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute -left-32 top-24 h-72 w-72 rounded-full bg-primary-glow/15 blur-3xl" }),
      /* @__PURE__ */ jsx("div", { className: "absolute right-[-10%] top-[40%] h-80 w-80 rounded-full bg-warning/10 blur-3xl" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-success/10 blur-3xl" }),
      /* @__PURE__ */ jsx(Leaf, { className: "absolute left-8 top-44 h-10 w-10 rotate-[-18deg] text-primary/15" }),
      /* @__PURE__ */ jsx(Leaf, { className: "absolute right-10 top-72 h-8 w-8 rotate-[24deg] text-success/20" }),
      /* @__PURE__ */ jsx(Leaf, { className: "absolute bottom-32 left-20 h-12 w-12 rotate-[40deg] text-warning/20" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "app-page max-w-3xl", children: [
      user.perfil_nome !== "aluno" && /* @__PURE__ */ jsxs(Link, { to: "/cursos", className: "mb-6 flex items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary/5 p-5 font-bold text-primary", children: [
        /* @__PURE__ */ jsx("span", { children: "Gerenciar cursos, módulos e perguntas" }),
        /* @__PURE__ */ jsx(BookOpen, { className: "h-5 w-5 shrink-0" })
      ] }),
      /* @__PURE__ */ jsxs(motion.div, { initial: {
        opacity: 0,
        y: -8
      }, animate: {
        opacity: 1,
        y: 0
      }, className: "sticky top-16 z-20 overflow-hidden rounded-xl border border-border/60 bg-card/95 p-4 shadow-soft backdrop-blur-md", children: [
        /* @__PURE__ */ jsx("div", { "aria-hidden": true, className: "absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-warning/5" }),
        /* @__PURE__ */ jsxs("div", { className: "relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-center gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-gradient-hero text-primary-foreground font-bold shadow-soft", children: [
              user.nivel,
              /* @__PURE__ */ jsx("span", { className: "absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-warning text-[10px] text-warning-foreground shadow", children: /* @__PURE__ */ jsx(Sparkles, { className: "h-2.5 w-2.5" }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-[11px] font-bold uppercase tracking-wide text-muted-foreground", children: [
                "Nível ",
                user.nivel
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("div", { className: "h-2 w-32 overflow-hidden rounded-full bg-muted sm:w-48", children: /* @__PURE__ */ jsx(motion.div, { initial: {
                  width: 0
                }, animate: {
                  width: `${pct}%`
                }, transition: {
                  duration: 1
                }, className: "h-full bg-primary" }) }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-muted-foreground", children: [
                  totalXP,
                  "/",
                  user.xp_proximo_nivel,
                  " XP"
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1.5 text-sm font-bold text-destructive", children: [
              /* @__PURE__ */ jsx(Flame, { className: "h-4 w-4" }),
              " ",
              user.streak_dias
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 rounded-full bg-warning/15 px-3 py-1.5 text-sm font-bold text-warning", children: [
              /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4" }),
              " ",
              user.pontos_totais
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Seus cursos" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Conteúdo do Viridis, da sua escola e da sua turma." }),
        courses.length === 0 ? /* @__PURE__ */ jsx("div", { className: "mt-4 rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground", children: "Nenhum curso publicado disponível para você no momento." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { className: "my-5 grid gap-3 sm:grid-cols-2", children: courses.map((course) => /* @__PURE__ */ jsxs("button", { "aria-pressed": activeCourse?.id === course.id, onClick: () => {
            setCourseId(course.id);
            setSelected(null);
            setQuizLesson(null);
          }, className: `rounded-lg border p-4 text-left transition-colors ${activeCourse?.id === course.id ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-accent"}`, children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-wide text-primary", children: {
              app: "Viridis",
              escola: "Sua escola",
              turma: "Sua turma"
            }[course.scope] }),
            /* @__PURE__ */ jsx("h2", { className: "mt-1 break-words font-bold", children: course.title }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 line-clamp-2 break-words text-xs text-muted-foreground", children: course.description })
          ] }, course.id)) }),
          /* @__PURE__ */ jsx("h2", { className: "mb-4 break-words text-lg font-bold", children: activeCourse?.title })
        ] }),
        modules.map((m, mi) => /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx(ModuleHeader, { module: m, index: mi }),
          /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col items-center gap-10 py-4", children: [
            /* @__PURE__ */ jsx("div", { "aria-hidden": true, className: "absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 border-l-2 border-dashed border-border/70" }),
            m.lessons.map((lesson, li) => {
              const side = SIDES[li % SIDES.length];
              return /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-col items-center gap-3", children: [
                /* @__PURE__ */ jsx(NodeButton, { lesson, side, onClick: () => setSelected(lesson) }),
                /* @__PURE__ */ jsx("div", { className: `max-w-[180px] text-center text-xs font-semibold text-muted-foreground ${side === "left" ? "-translate-x-16 sm:-translate-x-28" : side === "right" ? "translate-x-16 sm:translate-x-28" : ""}`, children: lesson.title })
              ] }, lesson.id);
            })
          ] })
        ] }, m.id))
      ] })
    ] }),
    /* @__PURE__ */ jsx(LessonModal, { lesson: selected, onClose: () => setSelected(null), onStart: () => {
      const l = selected;
      setSelected(null);
      setTimeout(() => setQuizLesson(l), 200);
    } }),
    /* @__PURE__ */ jsx(QuizModal, { lesson: quizLesson, onClose: () => setQuizLesson(null), onFinish: (xp) => {
      setQuizLesson(null);
      void queryClient.invalidateQueries({
        queryKey: ["perfil"]
      });
      void queryClient.invalidateQueries({
        queryKey: ["modulos"]
      });
      setTimeout(() => setCelebrate(xp), 250);
    } }),
    /* @__PURE__ */ jsx(CelebrationModal, { open: celebrate !== null, xp: celebrate ?? 0, onClose: () => setCelebrate(null) })
  ] });
}
export {
  LearnPage as component
};
