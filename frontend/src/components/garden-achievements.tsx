import { useRouterState } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  Bug,
  Check,
  Flame,
  Leaf,
  Lock,
  Medal,
  Recycle,
  Sprout,
  Star,
  Trophy,
} from "lucide-react";
import { useEffect, useRef } from "react";

export interface Achievement {
  id: number;
  titulo: string;
  descricao: string;
  icone: string;
  regra: string;
  conquistada: number;
  conquistada_em: string | null;
  progresso: number | null;
  meta: number | null;
}

const icons = { Award, BookOpen, Bug, Flame, Leaf, Medal, Recycle, Sprout, Star, Trophy };
const dateFormat = new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" });

function requirement(achievement: Achievement) {
  switch (achievement.regra) {
    case "licoes:1":
      return "Conclua sua primeira lição.";
    case "modulo_completo:2":
      return "Conclua o módulo Nutrição do Solo.";
    case "modulo_completo:3":
      return "Conclua o módulo Controle de Pragas.";
    case "streak:7":
      return "Conclua pelo menos uma lição nova por dia durante 7 dias seguidos.";
    case "todos_modulos":
      return "Conclua todos os módulos disponíveis na sua trilha.";
    case "ranking:3":
      return "Fique entre os 3 primeiros do ranking individual com pelo menos 1 ponto.";
    default:
      return achievement.descricao;
  }
}

export function GardenAchievements({ achievements }: { achievements: Achievement[] }) {
  const section = useRef<HTMLElement>(null);
  const hash = useRouterState({ select: (state) => state.location.hash });
  useEffect(() => {
    if (hash === "conquistas") section.current?.scrollIntoView();
  }, [hash]);

  const unlocked = achievements.filter((achievement) => achievement.conquistada).length;

  return (
    <section
      id="conquistas"
      ref={section}
      aria-labelledby="conquistas-titulo"
      className="scroll-mt-20 rounded-lg border border-border/60 bg-card p-5 shadow-soft sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="conquistas-titulo" className="flex items-center gap-2 text-lg font-bold">
          <Medal aria-hidden="true" className="size-5 text-primary" /> Conquistas
        </h2>
        {achievements.length > 0 && (
          <p className="text-sm font-semibold text-muted-foreground">
            {unlocked} de {achievements.length} desbloqueadas
          </p>
        )}
      </div>
      {achievements.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Nenhuma conquista disponível.</p>
      ) : (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement) => {
            const { id, titulo, icone, conquistada_em, progresso, meta } = achievement;
            const earned = Boolean(achievement.conquistada);
            const Icon = Object.hasOwn(icons, icone) ? icons[icone as keyof typeof icons] : Medal;
            const StatusIcon = earned ? Check : Lock;
            const date = conquistada_em?.slice(0, 10);

            return (
              <li
                key={id}
                className="flex flex-col gap-3 rounded-lg border border-border bg-background p-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`grid size-10 shrink-0 place-items-center rounded-full ${earned ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                  >
                    <Icon aria-hidden="true" className="size-5" />
                  </div>
                  <div>
                    <h3 id={`conquista-${id}`} className="text-sm font-bold">
                      {titulo}
                    </h3>
                    <p
                      className={`flex items-center gap-1 text-xs font-semibold ${earned ? "text-primary" : "text-muted-foreground"}`}
                    >
                      <StatusIcon aria-hidden="true" className="size-3" />
                      {earned ? "Desbloqueada" : "Bloqueada"}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{requirement(achievement)}</p>
                {earned && date && (
                  <time dateTime={date} className="mt-auto text-xs text-muted-foreground">
                    {dateFormat.format(new Date(`${date}T12:00:00`))}
                  </time>
                )}
                {!earned && meta !== null && progresso !== null && (
                  <div className="mt-auto flex items-center gap-3">
                    <progress
                      aria-labelledby={`conquista-${id}`}
                      value={progresso}
                      max={meta}
                      className="h-2 min-w-0 flex-1 accent-primary"
                    />
                    <span aria-hidden="true" className="text-xs tabular-nums text-muted-foreground">
                      {progresso}/{meta}
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
