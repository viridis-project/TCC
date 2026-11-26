import { useEffect, useRef, useState } from "react";
import { BookOpen, Check, GraduationCap, Lock, Star, Trophy, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Mascot } from "./mascot";
import type { LearningLesson, LessonKind, LessonStatus } from "./types";

const W = 360;
const ROW = 148;
const SIDES = ["center", "right", "right", "center", "left", "left"] as const;
const X = { center: 180, right: 272, left: 88 } as const;

const KIND_ICON: Record<LessonKind, LucideIcon> = {
  lesson: BookOpen,
  challenge: Zap,
  exam: Star,
  certificate: GraduationCap,
  trophy: Trophy,
};

const STATUS_LABEL: Record<LessonStatus, string> = {
  completed: "concluída",
  current: "lição atual",
  available: "disponível",
  locked: "bloqueada",
};

const NODE_STYLE: Record<LessonStatus, string> = {
  completed: "bg-primary text-primary-foreground shadow-[0_6px_0_var(--primary-active)]",
  current: "bg-[#8bc34a] text-[#10250f] shadow-[0_6px_0_#5e8a2d] ring-4 ring-[#8bc34a]/30",
  available: "border-2 border-primary bg-card text-primary shadow-[0_6px_0_var(--border)]",
  locked: "cursor-not-allowed bg-muted text-muted-foreground shadow-[0_5px_0_var(--border)]",
};

function LessonNode({
  lesson,
  tagSide,
  onSelect,
}: {
  lesson: LearningLesson;
  tagSide: "left" | "right";
  onSelect: (l: LearningLesson) => void;
}) {
  const Icon = KIND_ICON[lesson.kind] ?? BookOpen;
  const locked = lesson.status === "locked";
  return (
    <button
      type="button"
      onClick={locked ? undefined : () => onSelect(lesson)}
      aria-disabled={locked || undefined}
      aria-label={`${lesson.title}, ${STATUS_LABEL[lesson.status]}${locked ? "" : `, ${lesson.xp} XP`}`}
      data-testid={`lesson-trail-node-${lesson.id}`}
      className={`relative grid h-[72px] w-[72px] place-items-center rounded-full transition-[transform,box-shadow] duration-150 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-ring sm:h-20 sm:w-20 ${NODE_STYLE[lesson.status]} ${
        locked ? "" : "hover:-translate-y-0.5 active:translate-y-[3px] active:shadow-none"
      }`}
    >
      {lesson.status === "current" && (
        <span
          aria-hidden="true"
          className="vr-node-pulse absolute inset-0 rounded-full bg-[#8bc34a]/50"
        />
      )}
      {lesson.status === "completed" ? (
        <Check className="relative h-8 w-8" strokeWidth={3} aria-hidden="true" />
      ) : locked ? (
        <Lock className="relative h-6 w-6" aria-hidden="true" />
      ) : (
        <Icon className="relative h-8 w-8" aria-hidden="true" />
      )}
      {lesson.status === "current" && (
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-primary-foreground ${
            tagSide === "left" ? "right-full mr-3" : "left-full ml-3"
          }`}
        >
          Comece
        </span>
      )}
    </button>
  );
}

type Props = {
  lessons: LearningLesson[];
  onSelect: (lesson: LearningLesson) => void;
  /** Quando informado, o mascote acompanha a lição atual desta trilha. */
  mascot?: { bubble?: string } | null;
};

/** Trilha de lições: caminho que "cresce" entre as lições concluídas, nós reais clicáveis e mascote na lição atual. */
export function LessonTrail({ lessons, onSelect, mascot }: Props) {
  const ref = useRef<HTMLDivElement>(null);
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
      { threshold: 0.15 },
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
  const pct = (v: number, total: number) => `${(v / total) * 100}%`;
  const cur = withMascot ? points[currentIndex] : null;
  // mascote do lado oposto ao nó atual (nós centrais: mascote à esquerda, "Comece" à direita)
  const mascotLeft = cur ? cur.side !== "left" : true;

  return (
    <div
      ref={ref}
      className={`relative mx-auto w-full max-w-[420px] ${visible ? "vr-in" : ""}`}
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {points.slice(0, -1).map((a, i) => {
          const b = points[i + 1];
          const d = `M${a.x} ${a.y} C${a.x} ${a.y + ROW * 0.5} ${b.x} ${b.y - ROW * 0.5} ${b.x} ${b.y}`;
          return a.lesson.status === "completed" ? (
            <path
              key={a.lesson.id}
              d={d}
              pathLength={1}
              className="vr-seg-done"
              style={{ ["--vr-d" as string]: `${0.25 + i * 0.18}s` }}
            />
          ) : (
            <path key={a.lesson.id} d={d} className="vr-seg-todo" />
          );
        })}
      </svg>

      <ol className="absolute inset-0 m-0 list-none p-0">
        {points.map(({ lesson, side, x, y }) => (
          <li
            key={lesson.id}
            className="absolute flex w-[40%] -translate-x-1/2 -translate-y-9 flex-col items-center sm:-translate-y-10"
            style={{ left: pct(x, W), top: pct(y, H) }}
          >
            <LessonNode
              lesson={lesson}
              tagSide={side === "right" ? "left" : "right"}
              onSelect={onSelect}
            />
            <span
              className={`relative mt-3 max-w-[9.5rem] rounded-lg bg-card/90 px-2 py-1 text-center text-xs font-semibold leading-tight ${
                lesson.status === "locked" ? "text-muted-foreground" : "text-foreground"
              }`}
            >
              {lesson.title}
              {lesson.status !== "completed" && lesson.status !== "locked" && (
                <span className="mt-0.5 block font-medium text-muted-foreground">
                  +{lesson.xp} XP
                </span>
              )}
            </span>
          </li>
        ))}
      </ol>

      {cur && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute isolate w-[27%]"
          style={{
            top: pct(cur.y - 98, H),
            ...(mascotLeft ? { left: "2%" } : { right: "2%" }),
          }}
        >
          <div
            className="vr-mascot"
            style={{ ["--vr-from" as string]: mascotLeft ? "-60%" : "60%" }}
          >
            {mascot?.bubble && (
              <div className="vr-bubble absolute bottom-full left-1/2 mb-1 w-max max-w-[8.5rem] -translate-x-1/2 rounded-xl bg-foreground px-2.5 py-1.5 text-center text-[11px] font-semibold leading-tight text-background after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:border-x-[6px] after:border-t-[7px] after:border-x-transparent after:border-t-foreground after:content-['']">
                {mascot.bubble}
              </div>
            )}
            <span className="vr-mascot-glow absolute inset-[12%_-20%_-4%] -z-10 rounded-full opacity-80" />
            <div className="vr-float">
              <Mascot
                pose="apresentando"
                className="h-auto w-full drop-shadow-[0_10px_12px_rgba(0,0,0,0.3)]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
