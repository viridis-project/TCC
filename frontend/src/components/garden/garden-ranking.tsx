import { AnimatePresence, motion } from "motion/react";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE, GardenCard, InlineMessage, SectionTitle, StatusPill, softButton } from "./garden-ui";

export type RankingKind = "individual" | "turma" | "escola";
export type RankRow = {
  pos: number;
  name: string;
  points: number;
  you: boolean;
  members?: number;
};

const TABS: [RankingKind, string][] = [
  ["individual", "Individual"],
  ["turma", "Turmas da escola"],
  ["escola", "Escolas"],
];

const BADGE: Record<number, string> = {
  1: "bg-[#e8a600] text-white shadow-[0_0_0_3px_rgba(232,166,0,.22)]",
  2: "bg-[#6f7f75] text-white",
  3: "bg-[#b4690e] text-white",
};

function Row({ row, pinned = false }: { row: RankRow; pinned?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors sm:px-4 sm:py-3",
        row.you
          ? "border-forest/40 bg-mint/50 dark:bg-success/10"
          : "border-border/60 bg-background/70 hover:border-forest/25",
        pinned && "shadow-soft",
      )}
    >
      <div
        className={cn(
          "relative grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold",
          BADGE[row.pos] ?? "bg-forest text-white",
        )}
      >
        {row.pos}
        {row.pos === 1 && (
          <Crown
            className="absolute inset-x-0 -top-3 mx-auto h-3.5 w-3.5 text-[#e8a600]"
            aria-label="Primeiro lugar"
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="line-clamp-2 min-w-0 break-words text-sm font-bold leading-tight text-foreground">
            {row.name}
          </span>
          {row.you && (
            <StatusPill tone="brand" className="py-px">
              Você
            </StatusPill>
          )}
        </div>
        {row.members !== undefined && (
          <div className="text-[11px] text-muted-foreground">
            {row.members} {row.members === 1 ? "aluno" : "alunos"}
          </div>
        )}
      </div>
      <div className="shrink-0 text-right">
        <div className="text-sm font-bold tabular-nums text-foreground">
          {row.points.toLocaleString("pt-BR")}
        </div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Pontos</div>
      </div>
    </div>
  );
}

export function GardenRanking({
  type,
  onTypeChange,
  rows,
  loading,
  error,
  onRetry,
}: {
  type: RankingKind;
  onTypeChange: (t: RankingKind) => void;
  rows: RankRow[] | undefined;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}) {
  const mine = rows?.find((r) => r.you);
  return (
    <GardenCard aria-labelledby="ranking-title" className="flex flex-col" delay={0.1}>
      <SectionTitle id="ranking-title">Ranking</SectionTitle>

      <div className="-mx-1 mt-3 overflow-x-auto px-1 pb-1 scrollbar-none">
        <div
          role="tablist"
          aria-label="Tipo de ranking"
          className="inline-flex min-w-max gap-1 rounded-full border border-border bg-background p-1 text-xs font-semibold"
        >
          {TABS.map(([value, label]) => {
            const active = type === value;
            return (
              <button
                key={value}
                role="tab"
                aria-selected={active}
                onClick={() => onTypeChange(value)}
                className={cn(
                  "relative whitespace-nowrap rounded-full px-3 py-1.5 sm:px-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active ? "text-white" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="ranking-tab"
                    className="absolute inset-0 rounded-full bg-forest"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex-1" role="tabpanel" aria-busy={loading}>
        {error ? (
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
        ) : !rows ? (
          <div role="status" aria-label="Carregando ranking" className="space-y-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-[58px] animate-pulse rounded-xl bg-muted/70" />
            ))}
          </div>
        ) : !rows.length ? (
          <InlineMessage>Ainda não há pontuação neste ranking.</InlineMessage>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.ul
              key={type}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: loading ? 0.55 : 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="max-h-[26rem] space-y-2 overflow-y-auto scroll-fade pb-5 pr-1 sm:max-h-[30rem]"
            >
              {rows.map((r, i) => (
                <motion.li
                  key={`${type}-${r.pos}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: EASE, delay: Math.min(i, 9) * 0.035 }}
                  whileHover={{ x: 3 }}
                >
                  <Row row={r} />
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        )}
      </div>

      {mine && !error && (
        <div className="mt-3 border-t border-border/60 pt-3">
          <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Sua posição
          </div>
          <Row row={mine} pinned />
        </div>
      )}
    </GardenCard>
  );
}
