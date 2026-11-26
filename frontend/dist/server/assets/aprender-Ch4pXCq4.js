import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { X as X$1, Heart, Trophy, ArrowRight, Sparkles, Play, PartyPopper, BookOpen, Flame, GraduationCap, Star, Zap, Check, Lock, ChevronDown } from "lucide-react";
import { a as apiFetch, u as userQuery, h as isBrowser, P as PageShell } from "./router-eJvIn0Kb.js";
import { motion } from "motion/react";
import { toast } from "sonner";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import "recharts";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-slot";
import "class-variance-authority";
let lastOpener = null;
const VrDialogTitle = DialogPrimitive.Title;
const VrDialogDescription = DialogPrimitive.Description;
function VrDialog({
  open,
  onClose,
  children,
  className = "",
  closeLabel = "Fechar",
  hideClose = false
}) {
  const opener = useRef(null);
  return /* @__PURE__ */ jsx(DialogPrimitive.Root, { open, onOpenChange: (next) => !next && onClose(), children: /* @__PURE__ */ jsxs(DialogPrimitive.Portal, { children: [
    /* @__PURE__ */ jsx(DialogPrimitive.Overlay, { className: "vr-overlay fixed inset-0 z-50 bg-black/60 backdrop-blur-[3px] duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" }),
    /* @__PURE__ */ jsxs(
      DialogPrimitive.Content,
      {
        onOpenAutoFocus: () => {
          const active = document.activeElement;
          if (active && active !== document.body) lastOpener = active;
          opener.current = active && active !== document.body ? active : lastOpener;
        },
        onCloseAutoFocus: (event) => {
          const el = opener.current;
          if (el && el !== document.body && el.isConnected) {
            event.preventDefault();
            el.focus();
          }
        },
        className: `vr-modal vr-tokens fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-[28px_8px_28px_8px] border border-border bg-card text-card-foreground shadow-elevated outline-none duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 ${className}`,
        children: [
          children,
          !hideClose && /* @__PURE__ */ jsxs(
            DialogPrimitive.Close,
            {
              className: "absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
              "data-testid": "vr-dialog-close-button",
              children: [
                /* @__PURE__ */ jsx(X$1, { className: "h-5 w-5", "aria-hidden": "true" }),
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: closeLabel })
              ]
            }
          )
        ]
      }
    )
  ] }) });
}
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
  return /* @__PURE__ */ jsxs(VrDialog, { open: true, onClose, className: "max-w-lg overflow-hidden p-0", hideClose: true, children: [
    /* @__PURE__ */ jsxs(VrDialogTitle, { className: "sr-only", children: [
      "Quiz: ",
      lesson.title
    ] }),
    /* @__PURE__ */ jsx(VrDialogDescription, { className: "sr-only", children: "Responda às perguntas para concluir a lição." }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 border-b border-border bg-muted/40 px-5 py-3", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onClose,
          "data-testid": "quiz-modal-close-button",
          className: "grid h-11 w-11 place-items-center rounded-full text-muted-foreground hover:bg-accent",
          "aria-label": "Fechar",
          children: /* @__PURE__ */ jsx(X$1, { className: "h-4 w-4", "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          role: "progressbar",
          "aria-label": "Progresso do quiz",
          "aria-valuemin": 0,
          "aria-valuemax": 100,
          "aria-valuenow": Math.round(progress),
          className: "relative h-3 flex-1 overflow-hidden rounded-full bg-muted",
          children: /* @__PURE__ */ jsx(
            motion.div,
            {
              animate: { width: `${progress}%` },
              className: "absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-success to-primary"
            }
          )
        }
      ),
      /* @__PURE__ */ jsxs(
        "div",
        {
          "aria-hidden": "true",
          className: "flex items-center gap-1 text-sm font-bold text-destructive",
          children: [
            /* @__PURE__ */ jsx(Heart, { className: "h-4 w-4 fill-destructive" }),
            " 3"
          ]
        }
      )
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
            type: "button",
            "aria-pressed": active,
            "data-testid": `quiz-modal-option-${option.id}`,
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
          type: "button",
          "data-testid": "quiz-modal-next-button",
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
  ] });
}
const POSES = {
  apresentando: { src: "/brand/mascote-apresentando.webp", width: 376, height: 511 },
  comemorando: { src: "/brand/mascote-comemorando.webp", width: 360, height: 728 },
  cabeca: { src: "/brand/mascote-cabeca.webp", width: 193, height: 310 }
};
function Mascot({
  pose,
  alt = "",
  className,
  eager = false
}) {
  const p = POSES[pose];
  return /* @__PURE__ */ jsx(
    "img",
    {
      src: p.src,
      width: p.width,
      height: p.height,
      alt,
      loading: eager ? "eager" : "lazy",
      decoding: "async",
      draggable: false,
      className
    }
  );
}
function CelebrationModal({ open, xp, onClose }) {
  const last = useRef(xp);
  if (open) last.current = xp;
  return /* @__PURE__ */ jsxs(
    VrDialog,
    {
      open,
      onClose,
      className: "max-w-sm overflow-hidden p-0 text-center",
      hideClose: true,
      children: [
        /* @__PURE__ */ jsx("div", { className: "vr-hero px-8 pb-2 pt-8", children: /* @__PURE__ */ jsx(
          Mascot,
          {
            pose: "comemorando",
            alt: "Mascote do Viridis comemorando",
            eager: true,
            className: "vr-float mx-auto h-44 w-auto drop-shadow-[0_12px_14px_rgba(0,0,0,0.35)]"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "p-7", children: [
          /* @__PURE__ */ jsx(VrDialogTitle, { asChild: true, children: /* @__PURE__ */ jsx("h3", { className: "vr-display text-2xl font-extrabold", children: "Lição concluída!" }) }),
          /* @__PURE__ */ jsx(VrDialogDescription, { className: "mt-1 text-sm text-muted-foreground", children: "Mandou bem. Continue cultivando seu conhecimento." }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-bold text-secondary-foreground", children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4", "aria-hidden": "true" }),
            " +",
            last.current,
            " XP conquistados"
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              "data-testid": "celebration-modal-continue-button",
              className: "mt-6 flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-[0_5px_0_var(--primary-active)] transition-transform hover:bg-primary-hover focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-ring active:translate-y-[3px] active:shadow-none",
              children: "Continuar"
            }
          )
        ] })
      ]
    }
  );
}
function ContinueCard({ lesson, started, allDone, onStart }) {
  if (!lesson && !allDone) return null;
  return /* @__PURE__ */ jsxs(
    "section",
    {
      "aria-label": "Próxima lição",
      "data-testid": "continue-card",
      className: "vr-hero vr-rise grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 rounded-[30px_10px_30px_10px] p-5 shadow-elevated sm:p-7",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 self-center", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold opacity-80", children: allDone ? "Curso concluído" : started ? "Continue de onde parou" : "Comece por aqui" }),
          lesson ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("h2", { className: "vr-display mt-1 break-words text-2xl font-extrabold leading-tight sm:text-3xl", children: lesson.title }),
            /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm opacity-85", children: [
              "Quiz interativo · +",
              lesson.xp,
              " XP"
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => onStart(lesson),
                "data-testid": "continue-card-start-button",
                className: "mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#8bc34a] px-5 py-2.5 text-sm font-bold text-[#10250f] shadow-[0_5px_0_#5e8a2d] transition-transform hover:bg-[#9bd05a] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-white active:translate-y-[3px] active:shadow-none",
                children: [
                  /* @__PURE__ */ jsx(Play, { className: "h-4 w-4 fill-current", "aria-hidden": "true" }),
                  started ? "Continuar lição" : "Iniciar lição"
                ]
              }
            )
          ] }) : /* @__PURE__ */ jsxs("h2", { className: "vr-display mt-1 flex items-center gap-2 text-2xl font-extrabold leading-tight sm:text-3xl", children: [
            /* @__PURE__ */ jsx(PartyPopper, { className: "h-7 w-7", "aria-hidden": "true" }),
            " Você concluiu todas as lições!"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative -mb-5 w-24 shrink-0 sm:-mb-7 sm:w-32", children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              "aria-hidden": "true",
              className: "vr-mascot-glow absolute inset-[10%_-20%_0] -z-10 rounded-full"
            }
          ),
          /* @__PURE__ */ jsx(
            Mascot,
            {
              pose: "apresentando",
              eager: true,
              className: "vr-float h-auto w-full drop-shadow-[0_10px_14px_rgba(0,0,0,0.35)]"
            }
          )
        ] })
      ]
    }
  );
}
const SCOPE_LABEL = { app: "Viridis", escola: "Sua escola", turma: "Sua turma" };
function CoursePicker({
  courses,
  activeId,
  onSelect
}) {
  return /* @__PURE__ */ jsx("div", { role: "group", "aria-label": "Escolha o curso", className: "grid gap-3 sm:grid-cols-2", children: courses.map((course) => {
    const active = activeId === course.id;
    return /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        "aria-pressed": active,
        onClick: () => onSelect(course.id),
        "data-testid": `course-picker-course-${course.id}`,
        className: `rounded-2xl border-2 p-4 text-left transition-[border-color,background-color,transform] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98] ${active ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/50"}`,
        children: [
          /* @__PURE__ */ jsx("span", { className: "block text-xs font-bold text-primary", children: SCOPE_LABEL[course.scope] }),
          /* @__PURE__ */ jsx("span", { className: "mt-1 block break-words font-bold", children: course.title }),
          /* @__PURE__ */ jsx("span", { className: "mt-1 line-clamp-2 block break-words text-xs text-muted-foreground", children: course.description })
        ]
      },
      course.id
    );
  }) });
}
function LessonModal({ lesson, onClose, onStart }) {
  const last = useRef(null);
  if (lesson) last.current = lesson;
  const l = last.current;
  return /* @__PURE__ */ jsx(
    VrDialog,
    {
      open: !!lesson,
      onClose,
      className: "max-w-md p-0",
      closeLabel: "Fechar detalhes da lição",
      children: l && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "vr-hero p-8 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-white/15 backdrop-blur-sm", children: /* @__PURE__ */ jsx(BookOpen, { className: "h-10 w-10", "aria-hidden": "true" }) }),
          /* @__PURE__ */ jsx(VrDialogTitle, { asChild: true, children: /* @__PURE__ */ jsx("h3", { className: "vr-display mt-4 break-words text-xl font-extrabold", children: l.title }) }),
          /* @__PURE__ */ jsxs(VrDialogDescription, { className: "mt-1 text-sm opacity-85", children: [
            "Quiz interativo • +",
            l.xp,
            " XP"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3 p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-xl border border-border bg-muted/60 px-4 py-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold", children: [
              /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-warning", "aria-hidden": "true" }),
              " Recompensa"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm font-bold text-primary", children: [
              "+",
              l.xp,
              " XP"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-xl border border-border bg-muted/60 px-4 py-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold", children: [
              /* @__PURE__ */ jsx(Flame, { className: "h-4 w-4 text-destructive", "aria-hidden": "true" }),
              " Sequência"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-sm font-bold", children: "+1 dia" })
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: onStart,
              "data-testid": "lesson-modal-start-button",
              className: "mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-[0_5px_0_var(--primary-active)] transition-transform hover:bg-primary-hover focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-ring active:translate-y-[3px] active:shadow-none",
              children: [
                /* @__PURE__ */ jsx(Play, { className: "h-4 w-4 fill-current", "aria-hidden": "true" }),
                " Iniciar lição"
              ]
            }
          )
        ] })
      ] })
    }
  );
}
const STAGES = ["Semente", "Broto", "Muda", "Planta", "Árvore"];
function stageIndex(progress) {
  const p = Number.isFinite(progress) ? progress : 0;
  return Math.min(4, Math.max(0, Math.floor(p / 20)));
}
function leaf(y, dir) {
  const x = 16;
  const w = 7 * dir;
  return `M${x} ${y} C${x + w * 0.2} ${y - 1} ${x + w} ${y - 3} ${x + w} ${y - 7} C${x + w * 0.3} ${y - 7} ${x} ${y - 4} ${x} ${y}Z`;
}
function GrowthStage({ progress, className }) {
  const i = stageIndex(progress);
  const name = STAGES[i];
  return /* @__PURE__ */ jsx("span", { role: "img", "aria-label": `Estágio de crescimento: ${name}`, className, children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 32 32", className: "h-full w-full", "aria-hidden": "true", fill: "currentColor", children: [
    i === 0 && /* @__PURE__ */ jsx("ellipse", { cx: "16", cy: "24", rx: "5", ry: "3.4" }),
    i > 0 && i < 4 && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "path",
        {
          d: `M16 29V${25 - i * 4}`,
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          fill: "none"
        }
      ),
      Array.from({ length: i }).map((_, k) => /* @__PURE__ */ jsx("path", { d: leaf(24 - k * 5, k % 2 ? -1 : 1) }, k)),
      /* @__PURE__ */ jsx("path", { d: leaf(25 - i * 4, i % 2 ? 1 : -1) })
    ] }),
    i === 4 && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("path", { d: "M14.8 29V17h2.4v12z" }),
      /* @__PURE__ */ jsx("circle", { cx: "16", cy: "9.5", r: "6.5" }),
      /* @__PURE__ */ jsx("circle", { cx: "10.5", cy: "14", r: "5" }),
      /* @__PURE__ */ jsx("circle", { cx: "21.5", cy: "14", r: "5" })
    ] })
  ] }) });
}
const W = 360;
const ROW = 148;
const SIDES = ["center", "right", "right", "center", "left", "left"];
const X = { center: 180, right: 272, left: 88 };
const KIND_ICON = {
  lesson: BookOpen,
  challenge: Zap,
  exam: Star,
  certificate: GraduationCap,
  trophy: Trophy
};
const STATUS_LABEL = {
  completed: "concluída",
  current: "lição atual",
  available: "disponível",
  locked: "bloqueada"
};
const NODE_STYLE = {
  completed: "bg-primary text-primary-foreground shadow-[0_6px_0_var(--primary-active)]",
  current: "bg-[#8bc34a] text-[#10250f] shadow-[0_6px_0_#5e8a2d] ring-4 ring-[#8bc34a]/30",
  available: "border-2 border-primary bg-card text-primary shadow-[0_6px_0_var(--border)]",
  locked: "cursor-not-allowed bg-muted text-muted-foreground shadow-[0_5px_0_var(--border)]"
};
function LessonNode({
  lesson,
  tagSide,
  onSelect
}) {
  const Icon = KIND_ICON[lesson.kind] ?? BookOpen;
  const locked = lesson.status === "locked";
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick: locked ? void 0 : () => onSelect(lesson),
      "aria-disabled": locked || void 0,
      "aria-label": `${lesson.title}, ${STATUS_LABEL[lesson.status]}${locked ? "" : `, ${lesson.xp} XP`}`,
      "data-testid": `lesson-trail-node-${lesson.id}`,
      className: `relative grid h-[72px] w-[72px] place-items-center rounded-full transition-[transform,box-shadow] duration-150 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-ring sm:h-20 sm:w-20 ${NODE_STYLE[lesson.status]} ${locked ? "" : "hover:-translate-y-0.5 active:translate-y-[3px] active:shadow-none"}`,
      children: [
        lesson.status === "current" && /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": "true",
            className: "vr-node-pulse absolute inset-0 rounded-full bg-[#8bc34a]/50"
          }
        ),
        lesson.status === "completed" ? /* @__PURE__ */ jsx(Check, { className: "relative h-8 w-8", strokeWidth: 3, "aria-hidden": "true" }) : locked ? /* @__PURE__ */ jsx(Lock, { className: "relative h-6 w-6", "aria-hidden": "true" }) : /* @__PURE__ */ jsx(Icon, { className: "relative h-8 w-8", "aria-hidden": "true" }),
        lesson.status === "current" && /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": "true",
            className: `pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-primary-foreground ${tagSide === "left" ? "right-full mr-3" : "left-full ml-3"}`,
            children: "Comece"
          }
        )
      ]
    }
  );
}
function LessonTrail({ lessons, onSelect, mascot }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const currentIndex = lessons.findIndex((l) => l.status === "current");
  const withMascot = !!mascot && currentIndex >= 0;
  const padTop = withMascot && currentIndex === 0 ? 150 : 56;
  const points = lessons.map((lesson, i) => {
    const side = SIDES[i % SIDES.length];
    return { lesson, side, x: X[side], y: padTop + i * ROW };
  });
  const H = padTop + Math.max(0, lessons.length - 1) * ROW + 120;
  const pct = (v, total) => `${v / total * 100}%`;
  const cur = withMascot ? points[currentIndex] : null;
  const mascotLeft = cur ? cur.side !== "left" : true;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      className: `relative mx-auto w-full max-w-[420px] ${visible ? "vr-in" : ""}`,
      style: { aspectRatio: `${W} / ${H}` },
      children: [
        /* @__PURE__ */ jsx("svg", { className: "absolute inset-0 h-full w-full", viewBox: `0 0 ${W} ${H}`, "aria-hidden": "true", children: points.slice(0, -1).map((a, i) => {
          const b = points[i + 1];
          const d = `M${a.x} ${a.y} C${a.x} ${a.y + ROW * 0.5} ${b.x} ${b.y - ROW * 0.5} ${b.x} ${b.y}`;
          return a.lesson.status === "completed" ? /* @__PURE__ */ jsx(
            "path",
            {
              d,
              pathLength: 1,
              className: "vr-seg-done",
              style: { ["--vr-d"]: `${0.25 + i * 0.18}s` }
            },
            a.lesson.id
          ) : /* @__PURE__ */ jsx("path", { d, className: "vr-seg-todo" }, a.lesson.id);
        }) }),
        /* @__PURE__ */ jsx("ol", { className: "absolute inset-0 m-0 list-none p-0", children: points.map(({ lesson, side, x, y }) => /* @__PURE__ */ jsxs(
          "li",
          {
            className: "absolute flex w-[40%] -translate-x-1/2 -translate-y-9 flex-col items-center sm:-translate-y-10",
            style: { left: pct(x, W), top: pct(y, H) },
            children: [
              /* @__PURE__ */ jsx(
                LessonNode,
                {
                  lesson,
                  tagSide: side === "right" ? "left" : "right",
                  onSelect
                }
              ),
              /* @__PURE__ */ jsxs(
                "span",
                {
                  className: `relative mt-3 max-w-[9.5rem] rounded-lg bg-card/90 px-2 py-1 text-center text-xs font-semibold leading-tight ${lesson.status === "locked" ? "text-muted-foreground" : "text-foreground"}`,
                  children: [
                    lesson.title,
                    lesson.status !== "completed" && lesson.status !== "locked" && /* @__PURE__ */ jsxs("span", { className: "mt-0.5 block font-medium text-muted-foreground", children: [
                      "+",
                      lesson.xp,
                      " XP"
                    ] })
                  ]
                }
              )
            ]
          },
          lesson.id
        )) }),
        cur && /* @__PURE__ */ jsx(
          "div",
          {
            "aria-hidden": "true",
            className: "pointer-events-none absolute isolate w-[27%]",
            style: {
              top: pct(cur.y - 98, H),
              ...mascotLeft ? { left: "2%" } : { right: "2%" }
            },
            children: /* @__PURE__ */ jsxs(
              "div",
              {
                className: "vr-mascot",
                style: { ["--vr-from"]: mascotLeft ? "-60%" : "60%" },
                children: [
                  mascot?.bubble && /* @__PURE__ */ jsx("div", { className: "vr-bubble absolute bottom-full left-1/2 mb-1 w-max max-w-[8.5rem] -translate-x-1/2 rounded-xl bg-foreground px-2.5 py-1.5 text-center text-[11px] font-semibold leading-tight text-background after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:border-x-[6px] after:border-t-[7px] after:border-x-transparent after:border-t-foreground after:content-['']", children: mascot.bubble }),
                  /* @__PURE__ */ jsx("span", { className: "vr-mascot-glow absolute inset-[12%_-20%_-4%] -z-10 rounded-full opacity-80" }),
                  /* @__PURE__ */ jsx("div", { className: "vr-float", children: /* @__PURE__ */ jsx(
                    Mascot,
                    {
                      pose: "apresentando",
                      className: "h-auto w-full drop-shadow-[0_10px_12px_rgba(0,0,0,0.3)]"
                    }
                  ) })
                ]
              }
            )
          }
        )
      ]
    }
  );
}
function ModuleSection({ module: m, index, onSelect, mascot }) {
  const stage = STAGES[stageIndex(m.progress)];
  const finished = m.lessons.length > 0 && m.lessons.every((l) => l.status === "completed");
  return /* @__PURE__ */ jsxs(
    "section",
    {
      "aria-labelledby": `modulo-${m.id}`,
      "data-testid": `module-section-${m.id}`,
      className: "mb-10",
      children: [
        /* @__PURE__ */ jsxs("header", { className: "relative mb-4 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              "aria-hidden": "true",
              className: "absolute inset-0 opacity-[0.08]",
              style: {
                background: `radial-gradient(120% 90% at 100% 0%, ${m.color}, transparent 60%)`
              }
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "relative flex items-start gap-3 sm:gap-4", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                "aria-hidden": "true",
                className: "vr-display grid h-12 w-12 shrink-0 place-items-center rounded-xl text-xl font-extrabold text-white shadow-soft sm:h-14 sm:w-14",
                style: { background: m.color },
                children: index + 1
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxs("p", { className: "text-xs font-semibold text-muted-foreground", children: [
                "Módulo ",
                index + 1
              ] }),
              /* @__PURE__ */ jsx(
                "h3",
                {
                  id: `modulo-${m.id}`,
                  className: "vr-display break-words text-lg font-bold leading-snug",
                  children: m.title
                }
              ),
              m.description && /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-xs text-muted-foreground", children: m.description })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 flex-col items-center gap-0.5 text-primary", children: [
              /* @__PURE__ */ jsx(GrowthStage, { progress: m.progress, className: "block h-9 w-9" }),
              /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold", children: stage })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative mt-3", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                role: "progressbar",
                "aria-label": `Progresso do módulo ${m.title}`,
                "aria-valuemin": 0,
                "aria-valuemax": 100,
                "aria-valuenow": m.progress,
                className: "h-2 overflow-hidden rounded-full bg-muted",
                children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "h-full rounded-full bg-gradient-to-r from-primary to-[#8bc34a]",
                    style: { width: `${m.progress}%` }
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxs("p", { className: "mt-1 text-right text-[11px] font-semibold text-muted-foreground", children: [
              m.progress,
              "% concluído"
            ] })
          ] })
        ] }),
        finished ? /* @__PURE__ */ jsxs(
          "details",
          {
            "data-testid": `module-section-${m.id}-details`,
            className: "group rounded-3xl border border-border/70 bg-card/60",
            children: [
              /* @__PURE__ */ jsxs("summary", { className: "flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-3xl px-5 py-3 text-sm font-semibold text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden", children: [
                /* @__PURE__ */ jsxs("span", { children: [
                  "Módulo concluído · rever as ",
                  m.lessons.length,
                  " lições"
                ] }),
                /* @__PURE__ */ jsx(
                  ChevronDown,
                  {
                    className: "h-4 w-4 transition-transform duration-200 group-open:rotate-180",
                    "aria-hidden": "true"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "px-2 pb-4 sm:px-6", children: /* @__PURE__ */ jsx(LessonTrail, { lessons: m.lessons, onSelect, mascot }) })
            ]
          }
        ) : /* @__PURE__ */ jsx("div", { className: "rounded-3xl border border-border/70 bg-card/60 px-2 py-4 sm:px-6", children: /* @__PURE__ */ jsx(LessonTrail, { lessons: m.lessons, onSelect, mascot }) })
      ]
    }
  );
}
function LoadingState({ label }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: "status",
      "aria-live": "polite",
      className: "mx-auto flex max-w-sm flex-col items-center gap-4 px-6 py-20 text-center",
      children: [
        /* @__PURE__ */ jsx(Mascot, { pose: "apresentando", eager: true, className: "vr-load-mascot h-auto w-20" }),
        /* @__PURE__ */ jsx("p", { className: "vr-display text-lg font-bold", children: label }),
        /* @__PURE__ */ jsxs("div", { "aria-hidden": "true", className: "w-full space-y-2", children: [
          /* @__PURE__ */ jsx("div", { className: "vr-skeleton h-2.5 rounded-full bg-muted" }),
          /* @__PURE__ */ jsx("div", { className: "vr-skeleton mx-auto h-2.5 w-2/3 rounded-full bg-muted" })
        ] })
      ]
    }
  );
}
function ErrorState({ message }) {
  return /* @__PURE__ */ jsxs("div", { role: "alert", className: "mx-auto max-w-md px-6 py-20 text-center", children: [
    /* @__PURE__ */ jsx(Mascot, { pose: "cabeca", className: "mx-auto mb-4 h-auto w-16 opacity-90" }),
    /* @__PURE__ */ jsx("p", { className: "font-semibold text-destructive", children: message })
  ] });
}
function EmptyCourses() {
  return /* @__PURE__ */ jsxs("div", { className: "mt-4 rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center text-muted-foreground", children: [
    /* @__PURE__ */ jsx(Mascot, { pose: "cabeca", className: "mx-auto mb-3 h-auto w-16" }),
    "Nenhum curso publicado disponível para você no momento."
  ] });
}
const RING = 2 * Math.PI * 26;
function ProgressHud({ nivel, xp, xpProximoNivel, pct, streakDias, pontosTotais }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const shown = ready ? pct : 0;
  const faltam = Math.max(0, xpProximoNivel - xp);
  return /* @__PURE__ */ jsx(
    "section",
    {
      "aria-label": "Seu progresso",
      "data-testid": "progress-hud",
      className: "vr-hero rounded-[26px_8px_26px_8px] p-3.5 shadow-elevated lg:p-5",
      children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 lg:grid-cols-1 lg:gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative h-12 w-12 shrink-0 lg:h-20 lg:w-20", children: [
          /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 64 64", className: "h-full w-full -rotate-90", "aria-hidden": "true", children: [
            /* @__PURE__ */ jsx(
              "circle",
              {
                cx: "32",
                cy: "32",
                r: "26",
                fill: "none",
                strokeWidth: "7",
                stroke: "rgb(255 255 255 / 0.18)"
              }
            ),
            /* @__PURE__ */ jsx(
              "circle",
              {
                className: "vr-ring-v",
                cx: "32",
                cy: "32",
                r: "26",
                fill: "none",
                strokeWidth: "7",
                strokeLinecap: "round",
                stroke: "#8bc34a",
                strokeDasharray: RING,
                strokeDashoffset: RING * (1 - shown / 100)
              }
            )
          ] }),
          /* @__PURE__ */ jsx("span", { className: "vr-display absolute inset-0 grid place-items-center text-lg font-extrabold lg:text-3xl", children: nivel })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-[11px] font-semibold opacity-80", children: [
            "Nível ",
            nivel
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "vr-display text-base font-bold leading-tight lg:text-xl", children: [
            xp,
            "/",
            xpProximoNivel,
            " XP"
          ] }),
          /* @__PURE__ */ jsx(
            "div",
            {
              role: "progressbar",
              "aria-label": "Progresso para o próximo nível",
              "aria-valuemin": 0,
              "aria-valuemax": 100,
              "aria-valuenow": pct,
              className: "mt-1.5 h-2 overflow-hidden rounded-full bg-white/20",
              children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: "vr-bar-fill h-full w-full rounded-full bg-gradient-to-r from-[#c5e9ae] to-[#8bc34a]",
                  style: { transform: `scaleX(${shown / 100})` }
                }
              )
            }
          ),
          faltam > 0 && /* @__PURE__ */ jsxs("p", { className: "mt-1.5 hidden text-xs opacity-80 lg:block", children: [
            "Faltam ",
            faltam,
            " XP para o nível ",
            nivel + 1
          ] })
        ] }),
        /* @__PURE__ */ jsxs("ul", { className: "m-0 flex list-none flex-col gap-1.5 p-0 text-sm font-bold lg:flex-row lg:gap-2", children: [
          /* @__PURE__ */ jsxs(
            "li",
            {
              className: "flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 lg:px-3 lg:py-1.5",
              "aria-label": `Sequência de ${streakDias} dias`,
              children: [
                /* @__PURE__ */ jsx(Flame, { className: "h-4 w-4", "aria-hidden": "true" }),
                " ",
                streakDias,
                /* @__PURE__ */ jsx("span", { className: "hidden font-medium opacity-80 lg:inline", children: "dias" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "li",
            {
              className: "flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 lg:px-3 lg:py-1.5",
              "aria-label": `${pontosTotais} pontos`,
              children: [
                /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4", "aria-hidden": "true" }),
                " ",
                pontosTotais,
                /* @__PURE__ */ jsx("span", { className: "hidden font-medium opacity-80 lg:inline", children: "pts" })
              ]
            }
          )
        ] })
      ] })
    }
  );
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
  const opener = useRef(null);
  const openLesson = (lesson) => {
    opener.current = document.activeElement;
    setSelected(lesson);
  };
  const restoreFocus = () => setTimeout(() => {
    const el = opener.current;
    if (el?.isConnected && (!document.activeElement || document.activeElement === document.body)) el.focus();
  }, 80);
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
  if (loadingUser) return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsx(LoadingState, { label: "Carregando sua trilha..." }) });
  if (userError || modulesError || !user) return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsx(ErrorState, { message: userError?.message ?? modulesError?.message ?? "Faça login para continuar" }) });
  if (loadingUser || loadingModules) return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsx(LoadingState, { label: "Carregando sua trilha..." }) });
  const allLessons = modules.flatMap((m) => m.lessons);
  const nextLesson = allLessons.find((l) => l.status === "current") ?? allLessons.find((l) => l.status === "available") ?? null;
  const started = allLessons.some((l) => l.status === "completed");
  const allDone = allLessons.length > 0 && allLessons.every((l) => l.status === "completed");
  const mascotModuleId = modules.find((m) => m.lessons.some((l) => l.status === "current"))?.id;
  const faltamXp = user.xp_proximo_nivel ? Math.max(0, user.xp_proximo_nivel - totalXP) : 0;
  const bubble = faltamXp > 0 ? `${faltamXp} XP para o nível ${user.nivel + 1}` : void 0;
  return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsxs("div", { className: "vr", children: [
    /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "vr-bg" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-10", children: [
      user.perfil_nome !== "aluno" && /* @__PURE__ */ jsxs(Link, { to: "/cursos", className: "mb-6 flex items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-5 font-bold text-primary transition-colors hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring", children: [
        /* @__PURE__ */ jsx("span", { children: "Gerenciar cursos, módulos e perguntas" }),
        /* @__PURE__ */ jsx(BookOpen, { className: "h-5 w-5 shrink-0", "aria-hidden": "true" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8", children: [
        /* @__PURE__ */ jsx("aside", { className: "sticky top-16 z-20 self-start lg:top-24 lg:col-start-2 lg:row-start-1", children: /* @__PURE__ */ jsx(ProgressHud, { nivel: user.nivel, xp: totalXP, xpProximoNivel: user.xp_proximo_nivel, pct, streakDias: user.streak_dias, pontosTotais: user.pontos_totais }) }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 lg:col-start-1 lg:row-start-1", children: [
          /* @__PURE__ */ jsx("h1", { className: "vr-display text-3xl font-extrabold sm:text-4xl", children: "Seus cursos" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Conteúdo do Viridis, da sua escola e da sua turma." }),
          courses.length === 0 ? /* @__PURE__ */ jsx(EmptyCourses, {}) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("div", { className: "mt-5", children: /* @__PURE__ */ jsx(ContinueCard, { lesson: nextLesson, started, allDone, onStart: openLesson }) }),
            /* @__PURE__ */ jsx("div", { className: "my-6", children: /* @__PURE__ */ jsx(CoursePicker, { courses, activeId: activeCourse?.id, onSelect: (id) => {
              setCourseId(id);
              setSelected(null);
              setQuizLesson(null);
            } }) }),
            /* @__PURE__ */ jsx("h2", { className: "vr-display mb-4 break-words text-xl font-bold", children: activeCourse?.title })
          ] }),
          modules.map((m, mi) => /* @__PURE__ */ jsx(ModuleSection, { module: m, index: mi, onSelect: openLesson, mascot: m.id === mascotModuleId ? {
            bubble
          } : null }, m.id))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(LessonModal, { lesson: selected, onClose: () => setSelected(null), onStart: () => {
      const l = selected;
      setSelected(null);
      setTimeout(() => setQuizLesson(l), 200);
    } }),
    /* @__PURE__ */ jsx(QuizModal, { lesson: quizLesson, onClose: () => {
      setQuizLesson(null);
      restoreFocus();
    }, onFinish: (xp) => {
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
  ] }) });
}
export {
  LearnPage as component
};
