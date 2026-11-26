import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MotionConfig, motion } from "motion/react";
import { Sprout } from "lucide-react";
import { toast } from "sonner";
import { PageShell } from "@/components/page-shell";
import { SubmitProofModal, type ProofTarget } from "@/components/modals/submit-proof-modal";
import { MissionDialog } from "@/components/garden/mission-dialog";
import { StaffGarden } from "@/components/staff-garden";
import { GardenHero } from "@/components/garden/garden-hero";
import { LearningPath } from "@/components/garden/learning-path";
import { RecentMissions, type Submission } from "@/components/garden/recent-missions";
import { ClassMissions } from "@/components/garden/class-missions";
import { GardenRanking, type RankingKind, type RankRow } from "@/components/garden/garden-ranking";
import { GardenAchievements, type Achievement } from "@/components/garden/garden-achievements";
import { GardenImpact, type GardenSummary } from "@/components/garden/garden-impact";
import { growthWindow, monthEvolution } from "@/components/garden/garden-data";
import {
  apiFetch,
  isBrowser,
  userQuery,
  type Mission,
  type Module as ApiModule,
  type User,
} from "@/lib/api";

export const Route = createFileRoute("/jardim")({
  validateSearch: (search: Record<string, unknown>): { escola?: number; turma?: number } => {
    const positiveId = (value: unknown) => {
      const number = typeof value === "string" || typeof value === "number" ? Number(value) : NaN;
      return Number.isSafeInteger(number) && number > 0 ? number : undefined;
    };
    return { escola: positiveId(search.escola), turma: positiveId(search.turma) };
  },
  head: () => ({ meta: [{ title: "Meu Jardim — Viridis" }] }),
  component: GardenPage,
});

function GardenPage() {
  const { data: user, isPending, error } = useQuery(userQuery());
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  if (isPending)
    return (
      <PageShell>
        <p role="status" className="p-16 text-center text-muted-foreground">
          Carregando seu jardim...
        </p>
      </PageShell>
    );
  if (error || !user)
    return (
      <PageShell>
        <div className="space-y-4 p-16 text-center">
          <p role="alert">{error?.message ?? "Faça login para continuar"}</p>
          <Link to="/login" className="font-semibold text-primary underline">
            Entrar na minha conta
          </Link>
        </div>
      </PageShell>
    );
  if (user.perfil_nome !== "aluno")
    return (
      <StaffGarden
        key={`${user.id}-${user.perfil_nome}-${user.instituicao_id}`}
        user={user}
        schoolId={search.escola}
        classId={search.turma}
        onNavigate={(next) => void navigate({ search: next })}
      />
    );
  return <StudentGardenPage />;
}

type GardenResponse = {
  resumo: GardenSummary;
  crescimento: { mes: string; valor: number }[];
  conquistas: {
    id: number;
    titulo: string;
    descricao: string;
    icone: string;
    regra?: string;
    conquistada: number;
    conquistada_em?: string | null;
  }[];
};

type RankingApiRow = {
  posicao: number;
  id?: number;
  turma_id?: number;
  instituicao_id?: number;
  nome?: string;
  instituicao_nome?: string;
  pontos: number;
  alunos?: number;
};

/** Progresso mensurável com os mesmos critérios usados pelo backend para liberar a conquista. */
function achievementProgress(rule: string | undefined, modules: ApiModule[], user: User) {
  if (!rule) return null;
  const lessons = modules.flatMap((m) => m.licoes ?? []);
  const done = (list: { status: string }[]) => list.filter((l) => l.status === "completed").length;
  const [kind, raw] = rule.split(":");
  const target = Number(raw);
  if (kind === "licoes" && target > 0) return { value: Math.min(done(lessons), target), target };
  if (kind === "streak" && target > 0)
    return { value: Math.min(Number(user.streak_dias) || 0, target), target };
  if (kind === "modulo_completo" && target > 0) {
    const module = modules.find((m) => m.ordem === target);
    if (!module?.licoes?.length) return null;
    return { value: done(module.licoes), target: module.licoes.length };
  }
  if (rule === "todos_modulos" && modules.length)
    return { value: modules.filter((m) => m.progresso >= 100).length, target: modules.length };
  return null;
}

function submissionTime(value: string | null) {
  if (!value) return 0;
  const time = new Date(value.replace(" ", "T")).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function GardenSkeleton({ children }: { children: string }) {
  return (
    <PageShell>
      <div
        role="status"
        className="grid place-items-center gap-3 p-16 text-center text-muted-foreground"
      >
        <motion.span
          animate={{ scale: [1, 1.12, 1], rotate: [0, -6, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="grid h-12 w-12 place-items-center rounded-full bg-mint/60 text-forest"
        >
          <Sprout className="h-6 w-6" aria-hidden="true" />
        </motion.span>
        {children}
      </div>
    </PageShell>
  );
}

function StudentGardenPage() {
  const [proof, setProof] = useState<ProofTarget | null>(null);
  const [selectedTask, setSelectedTask] = useState<Mission | null>(null);
  const [rankingType, setRankingType] = useState<RankingKind>("individual");
  const [justSubmitted, setJustSubmitted] = useState(false);
  const queryClient = useQueryClient();
  const { data: user, isLoading: loadingUser, error: userError } = useQuery(userQuery());

  const { data, isLoading, error } = useQuery({
    queryKey: ["jardim"],
    enabled: isBrowser,
    retry: false,
    queryFn: async () => {
      const [garden, moduleResult] = await Promise.all([
        apiFetch<GardenResponse>("/jardim/resumo"),
        apiFetch<{ modulos: ApiModule[] }>("/modulos"),
      ]);
      return { garden, modules: moduleResult.modulos };
    },
  });

  const ranking = useQuery({
    queryKey: ["ranking", rankingType],
    enabled: isBrowser,
    queryFn: () => apiFetch<{ ranking: RankingApiRow[] }>(`/ranking?tipo=${rankingType}`),
    retry: false,
  });

  // Dados complementares: uma falha aqui afeta só o próprio card, nunca a página inteira.
  const history = useQuery({
    queryKey: ["historico", user?.id],
    enabled: isBrowser && !!user,
    retry: false,
    queryFn: () => apiFetch<{ envios: Submission[] }>("/historico"),
  });
  const missions = useQuery({
    queryKey: ["missoes"],
    enabled: isBrowser && !!user,
    retry: false,
    queryFn: async () => (await apiFetch<{ missoes: Mission[] }>("/missoes")).missoes,
  });
  useEffect(() => {
    if (!justSubmitted) return;
    const timer = window.setTimeout(() => setJustSubmitted(false), 6000);
    return () => window.clearTimeout(timer);
  }, [justSubmitted]);

  if (loadingUser || isLoading) return <GardenSkeleton>Cultivando seus dados...</GardenSkeleton>;
  if (userError || error || !user || !data)
    return (
      <PageShell>
        <div role="alert" className="p-16 text-center text-destructive">
          {userError?.message ?? error?.message ?? "Faça login para continuar"}
        </div>
      </PageShell>
    );

  const growth = growthWindow(data.garden.crescimento);
  const rankingRows: RankRow[] | undefined = ranking.data?.ranking.map((r) => ({
    pos: r.posicao,
    name: rankingType === "escola" ? (r.instituicao_nome ?? "Escola") : (r.nome ?? "Sem nome"),
    points: Number(r.pontos),
    you:
      rankingType === "individual"
        ? r.id === user.id
        : rankingType === "turma"
          ? r.turma_id === user.turma_id
          : r.instituicao_id === user.instituicao_id,
    members: rankingType === "individual" || r.alunos === undefined ? undefined : Number(r.alunos),
  }));
  const achievements: Achievement[] = data.garden.conquistas.map((a) => ({
    id: a.id,
    title: a.titulo,
    description: a.descricao,
    icon: a.icone,
    earned: Boolean(a.conquistada),
    earnedAt: a.conquistada_em ?? null,
    progress: achievementProgress(a.regra, data.modules, user),
  }));
  const startFirstMission = () => {
    const list = missions.data ?? [];
    const next =
      list.find(
        (m) =>
          m.participando && m.envio_status !== "pending" && m.envio_status !== "approved",
      ) ?? list.find((m) => m.status === "disponivel");
    if (next) setSelectedTask(next);
    else toast.info("Nenhuma missão disponível no momento.");
  };
  const recentSubmissions = history.data
    ? [...history.data.envios]
        .sort((a, b) => submissionTime(b.data_envio) - submissionTime(a.data_envio))
        .slice(0, 3)
    : undefined;

  return (
    <PageShell>
      <MotionConfig reducedMotion="user">
        <div className="app-page space-y-6">
          <GardenHero
            firstName={user.nome.split(" ")[0]}
            points={Number(user.pontos_totais)}
            growth={growth}
            evolution={monthEvolution(growth)}
          />

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
            <LearningPath modules={data.modules} />
            <RecentMissions
              items={recentSubmissions}
              loading={history.isPending}
              error={history.isError ? history.error.message : null}
              onRetry={() => void history.refetch()}
              onSubmit={startFirstMission}
              justSubmitted={justSubmitted}
            />
          </div>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
            <ClassMissions
              missions={missions.data}
              loading={missions.isPending}
              error={missions.isError ? missions.error.message : null}
              onRetry={() => void missions.refetch()}
              onOpen={setSelectedTask}
              streak={Number(user.streak_dias) || 0}
            />
            <GardenRanking
              type={rankingType}
              onTypeChange={setRankingType}
              rows={rankingRows}
              loading={ranking.isFetching}
              error={ranking.isError ? ranking.error.message : null}
              onRetry={() => void ranking.refetch()}
            />
          </div>

          <GardenAchievements items={achievements} />
          <GardenImpact summary={data.garden.resumo} />
        </div>
      </MotionConfig>

      <MissionDialog
        mission={selectedTask}
        onClose={() => setSelectedTask(null)}
        onProof={setProof}
      />
      <SubmitProofModal
        mission={proof}
        onOpenChange={(v) => !v && setProof(null)}
        onSubmitted={() => {
          setJustSubmitted(true);
          void queryClient.invalidateQueries({ queryKey: ["historico"] });
          void queryClient.invalidateQueries({ queryKey: ["jardim"] });
          void queryClient.invalidateQueries({ queryKey: ["missoes"] });
          void queryClient.invalidateQueries({ queryKey: ["agenda"] });
          void queryClient.invalidateQueries({ queryKey: ["perfil"] });
        }}
      />
    </PageShell>
  );
}
