import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Check, Lock, Play, Sprout } from "lucide-react";
import type { Module } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  EASE,
  GardenCard,
  InlineMessage,
  ProgressBar,
  SectionTitle,
  StatusPill,
} from "./garden-ui";

type State = "done" | "progress" | "locked" | "available";

function stateOf(m: Module): State {
  if (m.progresso >= 100) return "done";
  if (m.progresso > 0) return "progress";
  // bloqueio real: todas as lições do módulo estão bloqueadas pelo backend
  if (m.licoes?.length && m.licoes.every((l) => l.status === "locked")) return "locked";
  return "available";
}

const LABEL: Record<State, string> = {
  done: "Completo",
  progress: "Continuar",
  locked: "Bloqueado",
  available: "Disponível",
};
const TONE = { done: "success", progress: "brand", locked: "muted", available: "warning" } as const;

export function LearningPath({ modules }: { modules: Module[] }) {
  const visible = modules.slice(0, 6);
  return (
    <GardenCard aria-labelledby="learning-title">
      <SectionTitle
        id="learning-title"
        aside={
          modules.length > visible.length ? (
            <Link
              to="/aprender"
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              Ver todos <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          ) : undefined
        }
      >
        Meu caminho de aprendizado
      </SectionTitle>
      {!visible.length ? (
        <div className="mt-4">
          <InlineMessage>Nenhum módulo disponível para você ainda.</InlineMessage>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {visible.map((m, i) => {
            const state = stateOf(m);
            const lessons = m.licoes ?? [];
            const completed = lessons.filter((l) => l.status === "completed").length;
            const Icon =
              state === "done"
                ? Check
                : state === "locked"
                  ? Lock
                  : state === "progress"
                    ? Play
                    : Sprout;
            const body = (
              <>
                <motion.div
                  whileHover={state === "locked" ? undefined : { scale: 1.06 }}
                  className={cn(
                    "grid h-12 w-12 shrink-0 place-items-center rounded-full shadow-soft",
                    state === "done" && "bg-success text-white",
                    state === "progress" && "bg-forest text-white",
                    state === "available" && "bg-lime text-moss",
                    state === "locked" && "bg-muted text-muted-foreground",
                  )}
                >
                  <Icon
                    className="h-5 w-5"
                    strokeWidth={state === "done" ? 3 : 2}
                    aria-hidden="true"
                  />
                </motion.div>
                <div className="min-w-0 flex-1 rounded-xl border border-border/60 bg-background/70 px-4 py-3 transition-colors group-hover:border-forest/30">
                  <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                    <div className="min-w-0 break-words text-sm font-bold uppercase tracking-wide text-foreground">
                      {m.titulo}
                    </div>
                    <StatusPill tone={TONE[state]}>{LABEL[state]}</StatusPill>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <ProgressBar
                      value={m.progresso}
                      label={`Progresso em ${m.titulo}`}
                      className="flex-1"
                      barClassName={state === "done" ? "bg-success" : "bg-forest"}
                    />
                    <span className="w-9 text-right text-[10px] font-bold text-muted-foreground">
                      {m.progresso}%
                    </span>
                  </div>
                  {lessons.length > 0 && (
                    <div className="mt-1.5 text-[11px] text-muted-foreground">
                      {completed}/{lessons.length} lições concluídas
                    </div>
                  )}
                </div>
              </>
            );
            return (
              <motion.li
                key={m.id}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: EASE, delay: i * 0.05 }}
              >
                {state === "locked" ? (
                  <div className="group flex items-center gap-3 opacity-80">{body}</div>
                ) : (
                  <Link
                    to="/aprender"
                    className="group flex items-center gap-3 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {body}
                  </Link>
                )}
              </motion.li>
            );
          })}
        </ul>
      )}
    </GardenCard>
  );
}
