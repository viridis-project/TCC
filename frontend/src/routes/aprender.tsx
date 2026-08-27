import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Lock, Check, Star, BookOpen, Trophy, GraduationCap,
  Sparkles, Flame, Zap, X, Play, Leaf,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { QuizModal } from "@/components/modals/quiz-modal";
import { apiFetch, userQuery, isBrowser, type Module as ApiModule } from "@/lib/api";

export type LearningLesson = {
  id: number; title: string; status: "completed" | "current" | "available" | "locked";
  kind: "lesson" | "challenge" | "exam" | "certificate" | "trophy"; xp: number;
};
type Lesson = LearningLesson;
type Module = { id: number; title: string; description: string; color: string; progress: number; lessons: Lesson[] };

export const Route = createFileRoute("/aprender")({
  head: () => ({
    meta: [
      { title: "Aprender — Viridis" },
      { name: "description", content: "Trilha gamificada de aprendizado em sustentabilidade." },
    ],
  }),
  component: LearnPage,
});

const kindIcon = {
  lesson: BookOpen,
  challenge: Zap,
  exam: Star,
  certificate: GraduationCap,
  trophy: Trophy,
} as const;

const SIDES: Array<"center" | "right" | "right" | "center" | "left" | "left"> = [
  "center", "right", "right", "center", "left", "left",
];

function NodeButton({
  lesson,
  side,
  onClick,
}: {
  lesson: Lesson;
  side: "left" | "right" | "center";
  onClick: () => void;
}) {
  const Icon = kindIcon[lesson.kind] ?? BookOpen;
  const offset =
    side === "left"
      ? "-translate-x-16 sm:-translate-x-28"
      : side === "right"
        ? "translate-x-16 sm:translate-x-28"
        : "";

  const styles = {
    completed:
      "bg-gradient-to-b from-success to-success/70 text-success-foreground shadow-[0_8px_0_oklch(0.45_0.15_150)]",
    current:
      "bg-gradient-to-b from-primary to-primary/70 text-primary-foreground shadow-[0_8px_0_oklch(0.30_0.10_150)] ring-4 ring-primary/25",
    available:
      "bg-gradient-to-b from-card to-muted text-foreground shadow-[0_8px_0_oklch(0.85_0.02_140)] border border-border",
    locked:
      "bg-muted text-muted-foreground shadow-[0_6px_0_oklch(0.85_0.02_140)] cursor-not-allowed",
  } as const;

  return (
    <motion.button
      onClick={lesson.status !== "locked" ? onClick : undefined}
      whileHover={lesson.status !== "locked" ? { y: -3, scale: 1.05 } : undefined}
      whileTap={lesson.status !== "locked" ? { y: 2, scale: 0.96 } : undefined}
      className={`group relative grid h-20 w-20 place-items-center rounded-full transition-all sm:h-24 sm:w-24 ${styles[lesson.status]} ${offset}`}
      aria-label={lesson.title}
    >
      {lesson.status === "current" && (
        <motion.span
          aria-hidden
          animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-primary/40"
        />
      )}
      {lesson.status === "completed" ? (
        <Check className="relative h-9 w-9" strokeWidth={3} />
      ) : lesson.status === "locked" ? (
        <Lock className="relative h-7 w-7" />
      ) : (
        <Icon className="relative h-9 w-9" />
      )}
      {lesson.status === "current" && (
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-soft"
        >
          Comece <span className="ml-1">▼</span>
        </motion.span>
      )}
    </motion.button>
  );
}

function ModuleHeader({ module: m, index }: { module: Module; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="sticky top-16 z-10 mb-8 mt-4 overflow-hidden rounded-2xl border border-border/60 bg-card/95 p-5 shadow-soft backdrop-blur-sm"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{ background: `radial-gradient(120% 80% at 100% 0%, ${m.color}, transparent 60%)` }}
      />
      <div className="relative flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Módulo {index + 1}
          </div>
          <h3 className="mt-0.5 text-lg font-extrabold text-foreground">{m.title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{m.description}</p>
        </div>
        <div
          className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl font-extrabold text-primary-foreground shadow-soft"
          style={{ background: m.color }}
        >
          {index + 1}
        </div>
      </div>
      <div className="relative mt-3 h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${m.progress}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: m.color }}
        />
      </div>
      <div className="relative mt-1.5 text-right text-[11px] font-semibold text-muted-foreground">
        {m.progress}% concluído
      </div>
    </motion.div>
  );
}

function LessonModal({
  lesson,
  onClose,
  onStart,
}: {
  lesson: Lesson | null;
  onClose: () => void;
  onStart: () => void;
}) {
  return (
    <AnimatePresence>
      {lesson && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, y: 12, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 12, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-elevated"
          >
            <button onClick={onClose} className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full text-primary-foreground/80 hover:bg-white/15">
              <X className="h-4 w-4" />
            </button>
            <div className="relative overflow-hidden bg-gradient-hero p-8 text-center text-primary-foreground">
              <div aria-hidden className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div aria-hidden className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-primary-glow/30 blur-2xl" />
              <div className="relative mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-white/15 backdrop-blur-sm">
                <BookOpen className="h-10 w-10" />
              </div>
              <h3 className="relative mt-4 text-xl font-extrabold">{lesson.title}</h3>
              <p className="relative mt-1 text-sm text-primary-foreground/80">Quiz interativo • +{lesson.xp} XP</p>
            </div>
            <div className="space-y-3 p-6">
              <div className="flex items-center justify-between rounded-xl border border-border bg-muted/50 px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-semibold"><Sparkles className="h-4 w-4 text-warning" /> Recompensa</div>
                <div className="text-sm font-bold text-primary">+{lesson.xp} XP</div>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border bg-muted/50 px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-semibold"><Flame className="h-4 w-4 text-destructive" /> Sequência</div>
                <div className="text-sm font-bold">+1 dia</div>
              </div>
              <button
                onClick={onStart}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-primary to-primary/80 px-6 py-3.5 text-sm font-extrabold uppercase tracking-wider text-primary-foreground shadow-[0_5px_0_oklch(0.30_0.10_150)] transition-all active:translate-y-1 active:shadow-none"
              >
                <Play className="h-4 w-4" /> Iniciar lição
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CelebrationModal({ open, onClose, xp }: { open: boolean; onClose: () => void; xp: number }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-card p-8 text-center shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              animate={{ rotate: [0, -8, 8, -8, 0] }}
              transition={{ duration: 0.8, repeat: 1 }}
              className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-b from-warning to-warning/70 text-warning-foreground shadow-[0_8px_0_oklch(0.55_0.16_60)]"
            >
              <Trophy className="h-12 w-12" />
            </motion.div>
            <h3 className="mt-5 text-2xl font-extrabold text-foreground">Lição concluída!</h3>
            <p className="mt-1 text-sm text-muted-foreground">Mandou bem. Continue cultivando seu conhecimento.</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-warning/15 px-4 py-2 text-sm font-extrabold text-warning">
              <Sparkles className="h-4 w-4" /> +{xp} XP conquistados
            </div>
            <button onClick={onClose} className="mt-6 w-full rounded-2xl bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-soft hover:bg-primary/90">
              Continuar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function LearnPage() {
  const { data: user, isLoading: loadingUser, error: userError } = useQuery(userQuery());
  const { data: apiModules, isLoading: loadingModules, error: modulesError } = useQuery({
    queryKey: ["modulos"],
    queryFn: async () => (await apiFetch<{ modulos: ApiModule[] }>("/modulos")).modulos,
    enabled: isBrowser,
    retry: false,
  });
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Lesson | null>(null);
  const [quizLesson, setQuizLesson] = useState<Lesson | null>(null);
  const [celebrate, setCelebrate] = useState<number | null>(null);

  const modules: Module[] = (apiModules ?? []).map((m) => ({
    id: m.id, title: m.titulo, description: m.descricao, color: m.cor, progress: m.progresso,
    lessons: m.licoes.map((l) => ({ id: l.id, title: l.titulo, status: l.status, kind: l.kind, xp: l.xp })),
  }));
  const totalXP = user?.xp ?? 0;
  const pct = user?.xp_proximo_nivel ? Math.min(100, Math.round((totalXP / user.xp_proximo_nivel) * 100)) : 0;

  if (loadingUser || loadingModules) return <PageShell><div className="p-16 text-center text-muted-foreground">Carregando sua trilha...</div></PageShell>;
  if (userError || modulesError || !user) return <PageShell><div className="p-16 text-center text-destructive">{userError?.message ?? modulesError?.message ?? "Faça login para continuar"}</div></PageShell>;

  return (
    <PageShell>
      {/* Decorative background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-primary-glow/15 blur-3xl" />
        <div className="absolute right-[-10%] top-[40%] h-80 w-80 rounded-full bg-warning/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-success/10 blur-3xl" />
        <Leaf className="absolute left-8 top-44 h-10 w-10 rotate-[-18deg] text-primary/15" />
        <Leaf className="absolute right-10 top-72 h-8 w-8 rotate-[24deg] text-success/20" />
        <Leaf className="absolute bottom-32 left-20 h-12 w-12 rotate-[40deg] text-warning/20" />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {/* HUD */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-16 z-20 overflow-hidden rounded-3xl border border-border/60 bg-card/95 p-4 shadow-soft backdrop-blur-md"
        >
          <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-warning/5" />
          <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-hero text-primary-foreground font-extrabold shadow-soft">
                {user.nivel}
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-warning text-[10px] text-warning-foreground shadow">
                  <Sparkles className="h-2.5 w-2.5" />
                </span>
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Nível {user.nivel}</div>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-muted sm:w-48">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }} className="h-full bg-gradient-to-r from-primary to-primary-glow" />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">{totalXP}/{user.xp_proximo_nivel} XP</span>
                </div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1.5 text-sm font-extrabold text-destructive">
                <Flame className="h-4 w-4" /> {user.streak_dias}
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-warning/15 px-3 py-1.5 text-sm font-extrabold text-warning">
                <Sparkles className="h-4 w-4" /> {user.pontos_totais}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trilha */}
        <div className="mt-6">
          {modules.map((m, mi) => (
            <section key={m.id}>
              <ModuleHeader module={m} index={mi} />
              <div className="relative flex flex-col items-center gap-10 py-4">
                {/* Connecting dashed spine */}
                <div
                  aria-hidden
                  className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 border-l-2 border-dashed border-border/70"
                />
                {m.lessons.map((lesson, li) => {
                  const side = SIDES[li % SIDES.length];
                  return (
                    <div key={lesson.id} className="relative z-10 flex flex-col items-center gap-3">
                      <NodeButton lesson={lesson} side={side} onClick={() => setSelected(lesson)} />
                      <div
                        className={`max-w-[180px] text-center text-xs font-semibold text-muted-foreground ${
                          side === "left"
                            ? "-translate-x-16 sm:-translate-x-28"
                            : side === "right"
                              ? "translate-x-16 sm:translate-x-28"
                              : ""
                        }`}
                      >
                        {lesson.title}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      <LessonModal
        lesson={selected}
        onClose={() => setSelected(null)}
        onStart={() => {
          const l = selected;
          setSelected(null);
          setTimeout(() => setQuizLesson(l), 200);
        }}
      />
      <QuizModal
        lesson={quizLesson}
        onClose={() => setQuizLesson(null)}
        onFinish={(xp) => {
          setQuizLesson(null);
          void queryClient.invalidateQueries({ queryKey: ["perfil"] });
          void queryClient.invalidateQueries({ queryKey: ["modulos"] });
          setTimeout(() => setCelebrate(xp), 250);
        }}
      />
      <CelebrationModal open={celebrate !== null} xp={celebrate ?? 0} onClose={() => setCelebrate(null)} />
    </PageShell>
  );
}
