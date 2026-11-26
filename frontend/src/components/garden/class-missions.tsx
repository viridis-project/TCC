import { motion } from "motion/react";
import {
  CalendarClock,
  ChevronRight,
  Droplets,
  Flame,
  Recycle,
  Share2,
  Sprout,
  Users,
  type LucideIcon,
} from "lucide-react";
import { backendAsset, isImageSource, type Mission } from "@/lib/api";
import { cn } from "@/lib/utils";
import { categoryLabel, dateTime, plural } from "./garden-data";
import { EASE, GardenCard, InlineMessage, StatusPill, softButton, type Tone } from "./garden-ui";

const TYPE_ICON: Record<string, { icon: LucideIcon; tile: string }> = {
  plant: { icon: Sprout, tile: "bg-mint/60 text-moss" },
  water: { icon: Droplets, tile: "bg-info/15 text-info" },
  compost: { icon: Recycle, tile: "bg-warning/20 text-foreground" },
  share: { icon: Share2, tile: "bg-lime/25 text-moss" },
};

const STATUS: Record<Mission["status"], { label: string; tone: Tone }> = {
  disponivel: { label: "Disponível", tone: "success" },
  agendada: { label: "Agendada", tone: "info" },
  em_analise: { label: "Em análise", tone: "warning" },
  concluida: { label: "Concluída", tone: "brand" },
};

const ACTION: Record<Mission["status"], string> = {
  disponivel: "Reservar turno",
  agendada: "Ver detalhes",
  em_analise: "Ver detalhes",
  concluida: "Ver detalhes",
};

export function ClassMissions({
  missions,
  loading,
  error,
  onRetry,
  onOpen,
  streak,
}: {
  missions: Mission[] | undefined;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  /** Abre o diálogo da missão (reservar turno, participar, convidar, enviar comprovação). */
  onOpen: (mission: Mission) => void;
  streak: number;
}) {
  const cards = missions ?? [];
  const filled = Math.max(0, Math.min(14, streak));
  return (
    <GardenCard aria-labelledby="class-title" className="flex flex-col" delay={0.05}>
      <h2 id="class-title" className="text-sm font-bold uppercase tracking-wide text-foreground">
        Missões da turma
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Escolha uma missão e envie a comprovação para ganhar pontos.
      </p>

      <div className="mt-4 flex-1 space-y-3">
        {loading ? (
          <div role="status" aria-label="Carregando missões" className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-[92px] animate-pulse rounded-xl bg-muted/70" />
            ))}
          </div>
        ) : error ? (
          <InlineMessage
            tone="danger"
            action={
              <button onClick={onRetry} className={softButton}>
                Tentar novamente
              </button>
            }
          >
            {error}
          </InlineMessage>
        ) : !cards.length ? (
          <InlineMessage>Nenhuma missão disponível no momento.</InlineMessage>
        ) : (
          <ul className="space-y-3 lg:max-h-[30rem] lg:overflow-y-auto lg:scroll-fade lg:pb-5 lg:pr-1">
            {cards.map((m, i) => {
              const visual = TYPE_ICON[m.tipo] ?? {
                icon: Sprout,
                tile: "bg-muted text-muted-foreground",
              };
              const Icon = visual.icon;
              const status = STATUS[m.status];
              const when = dateTime(m.horario);
              return (
                <motion.li
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: EASE, delay: Math.min(i, 5) * 0.05 }}
                  whileHover={{ y: -2 }}
                  className="flex gap-3 rounded-xl border border-border/60 bg-background/70 p-3 transition-colors hover:border-forest/30"
                >
                  {m.imagem && isImageSource(m.imagem) ? (
                    <img
                      src={backendAsset(m.imagem)}
                      alt=""
                      loading="lazy"
                      className="h-16 w-16 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div
                      className={cn(
                        "grid h-16 w-16 shrink-0 place-items-center rounded-xl",
                        visual.tile,
                      )}
                    >
                      <Icon className="h-7 w-7" aria-hidden="true" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="min-w-0 text-sm font-bold leading-snug text-foreground">
                        {m.titulo}
                      </h3>
                      <StatusPill tone={status.tone}>{status.label}</StatusPill>
                    </div>
                    {m.descricao && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {m.descricao}
                      </p>
                    )}
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-foreground/80">
                      <span className="text-primary">+{m.pontos} pts</span>
                      <span>{categoryLabel(m.tipo)}</span>
                      <span className="inline-flex items-center gap-1 font-medium text-muted-foreground">
                        <Users className="h-3.5 w-3.5" aria-hidden="true" />
                        {m.max_alunos > 1
                          ? `${m.participantes}/${m.max_alunos} alunos`
                          : "Individual"}
                      </span>
                      <span className="inline-flex items-center gap-1 font-medium text-muted-foreground">
                        <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />{" "}
                        {when ? `Turno ${when}` : "Escolha um turno"}
                      </span>
                    </div>
                    <div className="mt-2">
                      <button onClick={() => onOpen(m)} className={softButton}>
                        {ACTION[m.status]}{" "}
                        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-5 border-t border-border/60 pt-4">
        <div className="text-xs font-semibold text-muted-foreground">Sequência diária</div>
        <div
          className="mt-2 flex items-center gap-1.5"
          role="img"
          aria-label={`${plural(streak, "dia seguido", "dias seguidos")}`}
        >
          {Array.from({ length: 14 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.6, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03, type: "spring", stiffness: 380, damping: 20 }}
              className={cn(
                "h-7 min-w-0 flex-1 rounded-md",
                i < filled ? "bg-gradient-to-b from-destructive to-warning" : "bg-muted",
              )}
            />
          ))}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-destructive">
          <Flame className="h-4 w-4" aria-hidden="true" />{" "}
          {plural(streak, "dia seguido", "dias seguidos")}
        </div>
      </div>
    </GardenCard>
  );
}
