import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Trophy, Users } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiFetch, isBrowser, userQuery, type User } from "@/lib/api";

export const Route = createFileRoute("/ranking")({
  head: () => ({ meta: [{ title: "Ranking — Viridis" }] }),
  component: RankingPage,
});

type RankingRow = {
  posicao: number;
  id?: number;
  turma_id?: number;
  instituicao_id?: number;
  nome?: string;
  turma?: string;
  instituicao_nome?: string;
  pontos: number;
  alunos?: number;
};

type RankingResponse = {
  tipo: string;
  ranking: RankingRow[];
  contexto_usuario: {
    usuario_id: number;
    posicao: number | null;
    turma_id: number | null;
    instituicao_id: number | null;
    instituicao_nome: string | null;
  };
};

type RankingType = "individual" | "turma" | "escola";

const TABS: { value: RankingType; label: string }[] = [
  { value: "individual", label: "Individual" },
  { value: "turma", label: "Turmas da escola" },
  { value: "escola", label: "Escolas" },
];

const SCOPE_LABEL: Record<RankingType, string> = {
  individual: "alunos",
  turma: "turmas",
  escola: "escolas",
};

function useRanking(rankingType: RankingType) {
  return useQuery({
    queryKey: ["ranking-completo", rankingType],
    enabled: isBrowser,
    retry: false,
    queryFn: () => apiFetch<RankingResponse>(`/ranking?tipo=${rankingType}`),
  });
}

function RankingPage() {
  const { data: user, isLoading: loadingUser, error: userError } = useQuery(userQuery());

  if (loadingUser) {
    return (
      <PageShell>
        <div className="p-16 text-center text-muted-foreground">Carregando ranking...</div>
      </PageShell>
    );
  }
  if (userError || !user) {
    return (
      <PageShell>
        <div className="p-16 text-center text-destructive">
          {userError?.message ?? "Faça login para continuar"}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="app-page space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-xl bg-gradient-hero p-6 text-primary-foreground shadow-soft sm:p-8"
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white/70">
            <Trophy className="h-3.5 w-3.5" /> Ranking Viridis
          </div>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Quem está liderando a horta</h1>
          <p className="mt-1 max-w-md text-sm text-white/80">
            Cumpra tarefas, ganhe pontos e suba no ranking da sua turma e da sua escola.
          </p>
        </motion.section>

        <Tabs defaultValue="individual" className="space-y-5">
          <TabsList className="grid h-auto w-full grid-cols-3 sm:w-[26rem]">
            {TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="py-2.5 text-xs sm:text-sm">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {TABS.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="space-y-4">
              <RankingList rankingType={tab.value} user={user} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PageShell>
  );
}

function RankingList({ rankingType, user }: { rankingType: RankingType; user: User }) {
  const { data: rankingResult, isLoading, error } = useRanking(rankingType);

  if (isLoading) {
    return <p className="p-10 text-center text-sm text-muted-foreground">Carregando...</p>;
  }
  if (error || !rankingResult) {
    return (
      <p className="p-10 text-center text-sm text-destructive">
        {error?.message ?? "Não foi possível carregar o ranking."}
      </p>
    );
  }

  const ranking = rankingResult.ranking.map((r) => ({
    pos: r.posicao,
    name: rankingType === "escola" ? (r.instituicao_nome ?? "Escola") : (r.nome ?? "Sem nome"),
    subtitle:
      rankingType === "individual"
        ? (r.turma ?? r.instituicao_nome ?? undefined)
        : rankingType === "turma"
          ? (r.instituicao_nome ?? undefined)
          : undefined,
    points: Number(r.pontos),
    alunos: r.alunos,
    you:
      rankingType === "individual"
        ? r.id === user.id
        : rankingType === "turma"
          ? r.turma_id === user.turma_id
          : r.instituicao_id === user.instituicao_id,
  }));

  const yourPosition =
    rankingType === "individual"
      ? rankingResult.contexto_usuario.posicao
      : (ranking.find((r) => r.you)?.pos ?? null);

  return (
    <section className="surface-panel p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Classificação completa</h2>
          <p className="text-sm text-muted-foreground">
            {ranking.length} {SCOPE_LABEL[rankingType]}
          </p>
        </div>
        {yourPosition != null && (
          <div className="rounded-lg border border-border bg-accent/40 px-4 py-2 text-right">
            <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              Sua posição
            </div>
            <div className="text-xl font-bold text-primary">#{yourPosition}</div>
          </div>
        )}
      </div>

      {ranking.length === 0 ? (
        <div className="p-10 text-center text-sm text-muted-foreground">
          Ainda não há dados no ranking.
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {ranking.map((r) => (
            <li
              key={r.pos}
              className={`flex items-center gap-3 py-3 ${r.you ? "bg-accent/40 px-3 rounded-lg" : ""}`}
            >
              <div
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold ${
                  r.pos <= 3
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {r.pos}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-foreground">
                  {r.name}
                  {r.you && (
                    <span className="ml-2 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">
                      Você
                    </span>
                  )}
                </div>
                {r.subtitle && (
                  <div className="truncate text-xs text-muted-foreground">{r.subtitle}</div>
                )}
              </div>
              {r.alunos != null && (
                <div className="hidden shrink-0 items-center gap-1 text-xs text-muted-foreground sm:flex">
                  <Users className="h-3.5 w-3.5" /> {r.alunos}
                </div>
              )}
              <div className="shrink-0 text-right">
                <div className="text-sm font-bold text-foreground">
                  {r.points.toLocaleString("pt-BR")}
                </div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  pontos
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
