import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CalendarDays, Camera, CheckCircle2, Sprout } from "lucide-react";
import { backendAsset, isImageSource } from "@/lib/api";
import { cn } from "@/lib/utils";
import { shortDate } from "./garden-data";
import {
  EASE,
  GardenCard,
  InlineMessage,
  SectionTitle,
  StatusPill,
  primaryButton,
  softButton,
  type Tone,
} from "./garden-ui";

export type Submission = {
  id: number;
  titulo: string;
  descricao: string;
  url_foto: string;
  status: "pending" | "approved" | "rejected";
  comentario_professor?: string | null;
  data_envio: string | null;
};

const STATUS: Record<Submission["status"], { label: string; tone: Tone }> = {
  pending: { label: "Em análise", tone: "warning" },
  approved: { label: "Aprovado", tone: "success" },
  rejected: { label: "Rejeitado", tone: "danger" },
};

function Thumb({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed || !isImageSource(src))
    return (
      <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-mint/50 text-forest dark:text-primary">
        <Sprout className="h-7 w-7" aria-hidden="true" />
      </div>
    );
  return (
    <img
      src={backendAsset(src)}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-20 w-20 shrink-0 rounded-xl object-cover"
    />
  );
}

export function RecentMissions({
  items,
  loading,
  error,
  onRetry,
  onSubmit,
  justSubmitted,
}: {
  items: Submission[] | undefined;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onSubmit: () => void;
  justSubmitted: boolean;
}) {
  const latest = (items ?? []).slice(0, 3);
  return (
    <GardenCard aria-labelledby="recent-title" className="flex flex-col" delay={0.05}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2
            id="recent-title"
            className="text-sm font-bold uppercase tracking-wide text-foreground"
          >
            Últimas missões
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Acompanhe os seus envios mais recentes.
          </p>
        </div>
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-mint/60 text-forest dark:text-primary">
          <Sprout className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      <AnimatePresence>
        {justSubmitted && (
          <motion.div
            role="status"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 rounded-xl bg-mint/60 px-3 py-2.5 text-sm font-semibold text-moss dark:bg-success/15 dark:text-success">
              <motion.span
                initial={{ scale: 0, rotate: -40 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 16, delay: 0.1 }}
              >
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              </motion.span>
              Envio recebido! Ele aparece aqui até o professor revisar.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 flex-1 space-y-3">
        {loading ? (
          <div role="status" className="space-y-3" aria-label="Carregando missões">
            {[0, 1].map((i) => (
              <div key={i} className="h-[104px] animate-pulse rounded-xl bg-muted/70" />
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
        ) : !latest.length ? (
          <InlineMessage
            action={
              <button onClick={onSubmit} className={softButton}>
                <Camera className="h-4 w-4" aria-hidden="true" /> Enviar minha primeira atividade
              </button>
            }
          >
            Você ainda não enviou nenhuma missão.
          </InlineMessage>
        ) : (
          <ul className="space-y-3">
            {latest.map((m, i) => {
              const status = STATUS[m.status] ?? STATUS.pending;
              const date = shortDate(m.data_envio);
              return (
                <motion.li
                  key={m.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    boxShadow:
                      justSubmitted && i === 0
                        ? [
                            "0 0 0 0 rgba(139,195,74,0)",
                            "0 0 0 6px rgba(139,195,74,.35)",
                            "0 0 0 0 rgba(139,195,74,0)",
                          ]
                        : "0 0 0 0 rgba(139,195,74,0)",
                  }}
                  transition={{
                    duration: justSubmitted && i === 0 ? 1.4 : 0.4,
                    ease: EASE,
                    delay: i * 0.06,
                  }}
                  whileHover={{ y: -2 }}
                  className={cn(
                    "flex gap-3 rounded-xl border border-border/60 bg-background/70 p-3 transition-colors hover:border-forest/30",
                  )}
                >
                  <Thumb src={m.url_foto} alt={`Foto enviada em ${m.titulo}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="min-w-0 truncate text-sm font-bold text-foreground">
                        {m.titulo}
                      </h3>
                      <StatusPill tone={status.tone}>{status.label}</StatusPill>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{m.descricao}</p>
                    {m.status === "rejected" && m.comentario_professor && (
                      <p className="mt-1 line-clamp-2 text-xs font-medium text-destructive">
                        Professor: {m.comentario_professor}
                      </p>
                    )}
                    {date && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" /> {date}
                      </div>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </ul>
        )}
      </div>

      <Link to="/historico" className={cn(primaryButton, "mt-4 w-full")}>
        Ver histórico completo <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </GardenCard>
  );
}
