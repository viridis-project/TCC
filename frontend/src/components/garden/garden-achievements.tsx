import { motion } from "motion/react";
import {
  Bug,
  Check,
  Flame,
  Lock,
  Medal,
  Recycle,
  Sprout,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { shortDate } from "./garden-data";
import { EASE, GardenCard, ProgressBar, SectionTitle } from "./garden-ui";

export type Achievement = {
  id: number;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt: string | null;
  /** progresso real calculado a partir dos dados do aluno; null quando não é mensurável */
  progress: { value: number; target: number } | null;
};

// Nomes gravados no campo `icone` da tabela de conquistas.
const ICONS: Record<string, LucideIcon> = { Sprout, Recycle, Flame, Bug, Trophy, Medal };

export function GardenAchievements({ items }: { items: Achievement[] }) {
  const earned = items.filter((a) => a.earned).length;
  return (
    <GardenCard aria-labelledby="achievements-title" delay={0.05}>
      <SectionTitle
        id="achievements-title"
        aside={
          <span
            className="text-xs font-bold text-muted-foreground"
            aria-label={`${earned} de ${items.length} conquistas`}
          >
            {earned}/{items.length}
          </span>
        }
      >
        Conquistas
      </SectionTitle>
      {items.length > 0 && (
        <ProgressBar
          value={(earned / items.length) * 100}
          label="Conquistas desbloqueadas"
          className="mt-3 h-2"
          barClassName="bg-gradient-to-r from-forest to-lime"
        />
      )}
      {!items.length ? (
        <p className="mt-4 rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          Nenhuma conquista cadastrada ainda.
        </p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {items.map((a, i) => {
            const Icon = ICONS[a.icon] ?? Medal;
            const date = shortDate(a.earnedAt);
            const pct = a.progress
              ? Math.min(100, (a.progress.value / a.progress.target) * 100)
              : 0;
            return (
              <motion.li
                key={a.id}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: EASE, delay: i * 0.05 }}
                whileHover={{ y: -3 }}
                className={cn(
                  "relative flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-shadow hover:shadow-elevated",
                  a.earned
                    ? "border-forest/40 bg-mint/45 dark:bg-success/10"
                    : "border-border/60 bg-muted/40",
                )}
              >
                <span
                  className={cn(
                    "absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full",
                    a.earned ? "bg-lime text-moss" : "bg-muted text-muted-foreground",
                  )}
                  title={a.earned ? "Desbloqueada" : "Bloqueada"}
                >
                  {a.earned ? (
                    <Check className="h-3 w-3" strokeWidth={3} />
                  ) : (
                    <Lock className="h-3 w-3" />
                  )}
                  <span className="sr-only">{a.earned ? "Desbloqueada" : "Bloqueada"}</span>
                </span>
                <motion.div
                  initial={a.earned ? { scale: 0.6, rotate: -12 } : false}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 14,
                    delay: 0.2 + i * 0.05,
                  }}
                  className={cn(
                    "grid h-12 w-12 place-items-center rounded-full",
                    a.earned
                      ? "bg-forest text-white shadow-soft"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </motion.div>
                <div
                  className={cn(
                    "text-xs font-bold",
                    a.earned ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {a.title}
                </div>
                <div className="text-[11px] leading-snug text-muted-foreground">
                  {a.description}
                </div>
                {a.earned && date && (
                  <div className="text-[10px] font-semibold text-primary">
                    Desbloqueada em {date}
                  </div>
                )}
                {!a.earned && a.progress && (
                  <div className="w-full">
                    <ProgressBar
                      value={pct}
                      label={`Progresso em ${a.title}`}
                      barClassName="bg-lime"
                    />
                    <div className="mt-1 text-[10px] font-semibold text-muted-foreground">
                      {a.progress.value}/{a.progress.target}
                    </div>
                  </div>
                )}
              </motion.li>
            );
          })}
        </ul>
      )}
    </GardenCard>
  );
}
