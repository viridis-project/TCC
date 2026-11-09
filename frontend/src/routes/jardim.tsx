import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  ArrowRight,
  CalendarDays,
  TrendingUp,
  Sprout,
  Lock,
  Check,
  Play,
  Rocket,
  Trophy,
  Medal,
  Flame,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { SubmitProofModal, type ProofTarget } from "@/components/modals/submit-proof-modal";
import { StaffGarden } from "@/components/staff-garden";
import {
  apiFetch,
  backendAsset,
  isBrowser,
  missionTypes,
  userQuery,
  type Mission,
  type Module as ApiModule,
} from "@/lib/api";
import { DatePicker, TimePicker } from "@/components/ui/date-time-picker";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

type PlantStatus = "pending" | "approved" | "rejected";

type Planting = {
  id: number;
  titulo: string;
  descricao: string;
  url_foto: string;
  status: PlantStatus;
  data_envio: string | null;
};

type UserHistory = { envios: Planting[] };

const missionStatuses: Record<Mission["status"], { label: string; className: string }> = {
  disponivel: { label: "Disponível", className: "bg-success/15 text-success" },
  agendada: { label: "Agendada", className: "bg-primary/15 text-primary" },
  em_analise: { label: "Em análise", className: "bg-warning/15 text-foreground" },
  concluida: { label: "Concluída", className: "bg-muted text-muted-foreground" },
};

const plantingStatuses: Record<PlantStatus, { label: string; className: string }> = {
  pending: { label: "Em análise", className: "bg-warning/15 text-foreground" },
  approved: { label: "Aprovado", className: "bg-success/15 text-success" },
  rejected: { label: "Rejeitado", className: "bg-destructive/10 text-destructive" },
};

function plantingTimestamp(value: string | null) {
  if (!value) return 0;
  const timestamp = new Date(value.replace(" ", "T")).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function formatPlantingDate(value: string | null) {
  const timestamp = plantingTimestamp(value);
  if (!timestamp) return "Data não informada";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(timestamp);
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      className={`rounded-lg border border-border/60 bg-card p-5 shadow-soft ${className}`}
    >
      {children}
    </motion.div>
  );
}

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

function StudentGardenPage() {
  const [proof, setProof] = useState<ProofTarget | null>(null);
  const [selectedTask, setSelectedTask] = useState<Mission | null>(null);
  const [participationMode, setParticipationMode] = useState<"aberto" | "particular">("aberto");
  const [inviteStudent, setInviteStudent] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [rankingType, setRankingType] = useState<"individual" | "turma" | "escola">("individual");
  const queryClient = useQueryClient();
  const { data: user, isLoading: loadingUser, error: userError } = useQuery(userQuery());
  const { data, isLoading, error } = useQuery({
    queryKey: ["jardim"],
    enabled: isBrowser,
    retry: false,
    queryFn: async () => {
      const [garden, moduleResult, history, missionResult] = await Promise.all([
        apiFetch<{
          resumo: {
            plantas_ativas: number;
            litros_economizados: number;
            kg_residuos_reciclados: number;
            kg_co2_reduzido: number;
            atividades_por_tipo: Record<string, number>;
          };
          crescimento: { mes: string; valor: number }[];
          conquistas: {
            id: number;
            titulo: string;
            descricao: string;
            icone: string;
            conquistada: number;
          }[];
        }>("/jardim/resumo"),
        apiFetch<{ modulos: ApiModule[] }>("/modulos"),
        apiFetch<UserHistory>("/historico"),
        apiFetch<{ missoes: Mission[] }>("/missoes"),
      ]);
      return { garden, modules: moduleResult.modulos, history, missions: missionResult.missoes };
    },
  });
  const { data: classmates = [] } = useQuery({
    queryKey: ["mission-classmates", selectedTask?.id, selectedTask?.grupo_id],
    enabled: isBrowser && !!selectedTask && selectedTask.max_alunos > 1 && selectedTask.modo_participacao === "particular" && !!selectedTask.grupo_id,
    queryFn: async () => (await apiFetch<{ alunos: { id: number; nome: string }[] }>(`/missoes/${selectedTask!.id}/alunos?grupo_id=${selectedTask!.grupo_id}`)).alunos,
  });
  type RankingRow = {
    posicao: number;
    id?: number;
    turma_id?: number;
    instituicao_id?: number;
    nome?: string;
    instituicao_nome?: string;
    pontos: number;
    alunos?: number;
  };
  const {
    data: rankingResult,
    isLoading: rankingLoading,
    error: rankingError,
  } = useQuery({
    queryKey: ["ranking", rankingType],
    enabled: isBrowser,
    queryFn: () => apiFetch<{ ranking: RankingRow[] }>(`/ranking?tipo=${rankingType}`),
    retry: false,
  });
  if (loadingUser || isLoading || rankingLoading)
    return (
      <PageShell>
        <div className="p-16 text-center text-muted-foreground">Cultivando seus dados...</div>
      </PageShell>
    );
  if (userError || error || rankingError || !user || !data || !rankingResult)
    return (
      <PageShell>
        <div className="p-16 text-center text-destructive">
          {userError?.message ??
            error?.message ??
            rankingError?.message ??
            "Faça login para continuar"}
        </div>
      </PageShell>
    );
  const acceptTask = async (taskId: number) => {
    if (!taskDate || !taskTime) return toast.error("Escolha a data e o horário do seu turno");
    try {
      const solo = selectedTask?.max_alunos === 1;
      const result = await apiFetch<{ mensagem: string; grupo_id: string }>(`/missoes/${taskId}/aceitar`, {
        method: "POST",
        // Missão individual não tem escolha de quem participa.
        body: JSON.stringify({
          data_hora: `${taskDate} ${taskTime}:00`,
          ...(solo ? {} : { modo_participacao: participationMode }),
        }),
      });
      toast.success(result.mensagem);
      setTaskDate("");
      setTaskTime("");
      setSelectedTask(null);
      await queryClient.invalidateQueries({ queryKey: ["jardim"] });
      await queryClient.invalidateQueries({ queryKey: ["agenda"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível aceitar a missão");
    }
  };
  const taskAction = async (path: string, body: unknown, successMessage?: string) => {
    if (!selectedTask) return;
    try {
      const result = await apiFetch<{ mensagem: string }>(path, { method: "POST", body: JSON.stringify(body) });
      toast.success(successMessage ?? result.mensagem);
      setSelectedTask(null);
      await queryClient.invalidateQueries({ queryKey: ["jardim"] });
      await queryClient.invalidateQueries({ queryKey: ["agenda"] });
    } catch (e) { toast.error(e instanceof Error ? e.message : "Não foi possível atualizar a missão"); }
  };
  const modules = data.modules.map((m) => ({ id: m.id, title: m.titulo, progress: m.progresso }));
  const ranking = rankingResult.ranking.map((r) => ({
    pos: r.posicao,
    name: rankingType === "escola" ? (r.instituicao_nome ?? "Escola") : (r.nome ?? "Sem nome"),
    points: Number(r.pontos),
    you:
      rankingType === "individual"
        ? r.id === user.id
        : rankingType === "turma"
          ? r.turma_id === user.turma_id
          : r.instituicao_id === user.instituicao_id,
  }));
  const growthData = data.garden.crescimento.length
    ? data.garden.crescimento.map((r) => ({ month: r.mes.slice(5), value: Number(r.valor) }))
    : [{ month: "Agora", value: user.pontos_totais }];
  const recentPlantings = [...data.history.envios]
    .sort((a, b) => plantingTimestamp(b.data_envio) - plantingTimestamp(a.data_envio))
    .slice(0, 3);
  const achievements = data.garden.conquistas.map((a) => ({
    id: a.id,
    title: a.titulo,
    description: a.descricao,
    earned: Boolean(a.conquistada),
  }));
  return (
    <PageShell>
      <div className="app-page space-y-6">
        {/* Hero stats */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-xl bg-gradient-hero p-6 text-primary-foreground shadow-soft sm:p-8"
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wide text-white/70">
                Meu Painel do Jardim
              </div>
              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                Bem-vinda de volta, {user.nome.split(" ")[0]}!
              </h1>
              <div className="mt-6 rounded-lg border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
                <div className="text-[11px] font-bold uppercase tracking-wide text-white/70">
                  Pontos Totais
                </div>
                <div className="mt-1 flex items-end justify-between">
                  <div className="text-4xl font-bold tracking-tight sm:text-5xl">
                    {Number(user.pontos_totais).toLocaleString("pt-BR")}
                  </div>
                  <div className="flex items-center gap-1 text-sm font-bold text-success-foreground">
                    <TrendingUp className="h-4 w-4" /> +60%
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-white/80">
                Crescimento nos últimos 5 meses
              </div>
              <div className="mt-2 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData} margin={{ top: 6, right: 6, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="gGreen" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="var(--color-primary-foreground)"
                          stopOpacity={0.55}
                        />
                        <stop
                          offset="100%"
                          stopColor="var(--color-primary-foreground)"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="month"
                      stroke="rgba(255,255,255,.6)"
                      fontSize={11}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="rgba(255,255,255,.5)"
                      fontSize={10}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(0,0,0,.7)",
                        border: "none",
                        borderRadius: 12,
                        color: "white",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="var(--color-primary-foreground)"
                      strokeWidth={2.5}
                      fill="url(#gGreen)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Trilha */}
          <Card>
            <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
              Meu Caminho de Aprendizado
            </h2>
            <ul className="mt-4 space-y-3">
              {modules.slice(0, 6).map((m, i) => {
                const done = m.progress === 100;
                const inProg = m.progress > 0 && m.progress < 100;
                const locked = m.progress === 0 && i > 2;
                return (
                  <motion.li
                    key={m.id}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3"
                  >
                    <div
                      className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-white shadow-soft ${
                        done
                          ? "bg-success"
                          : inProg
                            ? "bg-primary"
                            : locked
                              ? "bg-muted text-muted-foreground"
                              : "bg-warning text-warning-foreground"
                      }`}
                    >
                      {done ? (
                        <Check className="h-5 w-5" strokeWidth={3} />
                      ) : locked ? (
                        <Lock className="h-4 w-4" />
                      ) : inProg ? (
                        <Play className="h-4 w-4" />
                      ) : (
                        <Trophy className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 rounded-xl border border-border/60 bg-background/60 px-4 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="truncate text-sm font-bold uppercase tracking-wide text-foreground">
                          {m.title}
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            done
                              ? "bg-success/15 text-success"
                              : inProg
                                ? "bg-primary/15 text-primary"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {done
                            ? "Completo"
                            : inProg
                              ? "Continuar"
                              : locked
                                ? "Bloqueado"
                                : "Disponível"}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${m.progress}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="h-full bg-success"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground">
                          {m.progress}%
                        </span>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </Card>

          {/* Últimos plantios */}
          <Card className="flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
                  Últimas missões
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Acompanhe os envios mais recentes da sua equipe.
                </p>
              </div>
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-success/15 text-success">
                <Sprout className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>

            {recentPlantings.length ? (
              <ul className="mt-4 space-y-3">
                {recentPlantings.map((planting, index) => {
                  const status = plantingStatuses[planting.status];
                  return (
                    <motion.li
                      key={planting.id}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.04 }}
                      className="flex min-w-0 gap-3 rounded-lg border border-border/60 bg-background/60 p-3"
                    >
                      {planting.url_foto ? (
                        <img
                          src={backendAsset(planting.url_foto)}
                          alt={`Comprovação: ${planting.titulo}`}
                          loading="lazy"
                          className="h-20 w-20 shrink-0 rounded-xl object-cover sm:h-24 sm:w-24"
                        />
                      ) : (
                        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-secondary text-primary sm:h-24 sm:w-24">
                          <Sprout className="h-7 w-7" aria-hidden="true" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1 py-0.5">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h3 className="min-w-0 break-words text-sm font-bold text-foreground">
                            {planting.titulo}
                          </h3>
                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                          {planting.descricao || "Comprovação enviada para avaliação."}
                        </p>
                        <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                          {formatPlantingDate(planting.data_envio)}
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            ) : (
              <div className="mt-4 flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-background/40 px-5 py-8 text-center">
                <Sprout className="h-8 w-8 text-primary" aria-hidden="true" />
                <p className="mt-3 font-bold text-foreground">
                  Seu jardim está pronto para crescer
                </p>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Suas comprovações de missão aparecerão aqui depois do primeiro envio.
                </p>
              </div>
            )}

            <Link
              to="/historico"
              className="mt-4 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Ver histórico completo
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Card>
        </div>

        {/* Atividades + Ranking */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <Card>
            <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
              Missões da turma
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Pegue uma missão, escolha o seu turno e envie a comprovação para ganhar pontos.
            </p>
            <div className="mt-4 grid gap-3">
              {data.missions.length ? (
                data.missions.map((mission) => {
                  const badge = missionStatuses[mission.status];
                  return (
                    <button
                      key={mission.id}
                      onClick={() => {
                        setSelectedTask(mission);
                        setTaskDate("");
                        setTaskTime("");
                        setInviteStudent("");
                        setParticipationMode("aberto");
                      }}
                      className="flex gap-3 rounded-lg border border-border/60 bg-background/60 p-3 text-left transition hover:border-primary/40 hover:bg-primary/5"
                    >
                      {mission.imagem ? (
                        <img
                          src={backendAsset(mission.imagem)}
                          alt=""
                          loading="lazy"
                          className="h-16 w-16 shrink-0 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
                          <Rocket className="h-6 w-6" aria-hidden="true" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <span className="truncate font-bold">{mission.titulo}</span>
                          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${badge.className}`}>
                            {badge.label}
                          </span>
                        </div>
                        <p className="mt-1 text-xs font-semibold text-muted-foreground">
                          +{mission.pontos} pts · {missionTypes[mission.tipo].label}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {mission.max_alunos > 1
                            ? `${mission.participantes}/${mission.max_alunos} alunos`
                            : "Individual"}{" "}
                          · {mission.horario ? `Turno ${new Date(mission.horario.replace(" ", "T")).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}` : "Escolha um turno"}
                        </p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  Nenhuma missão disponível no momento.
                </p>
              )}
            </div>
            <div className="mt-5">
              <div className="text-xs font-semibold text-muted-foreground">Sequência diária</div>
              <div className="mt-2 flex items-center gap-1.5">
                {Array.from({ length: 14 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.6, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    className={`h-7 flex-1 rounded-md ${i < user.streak_dias ? "bg-gradient-to-b from-destructive to-warning" : "bg-muted"}`}
                  />
                ))}
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-destructive">
                <Flame className="h-4 w-4" /> {user.streak_dias} dias seguidos
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">Ranking</h2>
            <div className="mt-3 inline-flex rounded-full border border-border bg-background p-1 text-xs font-semibold">
              {(
                [
                  ["individual", "Individual"],
                  ["turma", "Turmas da escola"],
                  ["escola", "Escolas"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setRankingType(value)}
                  className={`rounded-full px-4 py-1.5 ${rankingType === value ? "bg-success text-success-foreground" : "text-muted-foreground"}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <ul className="mt-4 space-y-2">
              {ranking.map((r) => (
                <motion.li
                  key={r.pos}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: r.pos * 0.04 }}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${
                    r.you ? "border-success/40 bg-success/10" : "border-border/60 bg-background/60"
                  }`}
                >
                  <div
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold text-white ${
                      r.pos === 1
                        ? "bg-warning"
                        : r.pos === 2
                          ? "bg-muted-foreground"
                          : r.pos === 3
                            ? "bg-[oklch(0.55_0.15_60)]"
                            : "bg-primary"
                    }`}
                  >
                    {r.pos}
                  </div>
                  <div className="flex-1 truncate text-sm font-bold text-foreground">{r.name}</div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-foreground">
                      {r.points.toLocaleString("pt-BR")}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Pontos
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Conquistas */}
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
              Conquistas
            </h2>
            <span className="text-xs font-bold text-muted-foreground">
              {achievements.filter((a) => a.earned).length}/{achievements.length}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {achievements.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -1 }}
                className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-center ${
                  a.earned
                    ? "border-success/40 bg-success/10"
                    : "border-border/60 bg-muted/40 opacity-60"
                }`}
              >
                <div
                  className={`grid h-12 w-12 place-items-center rounded-full ${
                    a.earned
                      ? "bg-success text-success-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Medal className="h-6 w-6" />
                </div>
                <div className="text-xs font-bold text-foreground">{a.title}</div>
                <div className="text-[10px] text-muted-foreground">{a.description}</div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      <SubmitProofModal
        mission={proof}
        onOpenChange={(v) => !v && setProof(null)}
        onSubmitted={() => {
          void queryClient.invalidateQueries({ queryKey: ["historico"] });
          void queryClient.invalidateQueries({ queryKey: ["jardim"] });
          void queryClient.invalidateQueries({ queryKey: ["agenda"] });
          void queryClient.invalidateQueries({ queryKey: ["perfil"] });
        }}
      />
      <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <DialogContent className="max-h-[calc(100dvh-1.5rem)] max-w-lg overflow-y-auto rounded-xl border-border/60 p-0">
          {selectedTask && (
            <>
              <div className="bg-gradient-hero p-6 text-primary-foreground">
                <DialogHeader>
                  <DialogTitle>{selectedTask.titulo}</DialogTitle>
                  <DialogDescription className="text-white/80">
                    Missão publicada por {selectedTask.professor}
                  </DialogDescription>
                </DialogHeader>
              </div>
              <div className="space-y-4 p-6">
                {selectedTask.imagem && (
                  <img src={backendAsset(selectedTask.imagem)} alt="" className="max-h-48 w-full rounded-lg object-cover" />
                )}
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {selectedTask.descricao || "Sem instruções adicionais."}
                </p>
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="rounded-lg bg-muted p-3">
                    <strong>{selectedTask.pontos}</strong>
                    <div className="text-xs text-muted-foreground">pontos</div>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <strong>
                      {selectedTask.max_alunos > 1
                        ? `${selectedTask.participantes}/${selectedTask.max_alunos}`
                        : "1"}
                    </strong>
                    <div className="text-xs text-muted-foreground">
                      {selectedTask.max_alunos > 1 ? "participantes" : "aluno (individual)"}
                    </div>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <strong>{missionTypes[selectedTask.tipo].label}</strong>
                    <div className="text-xs text-muted-foreground">tipo</div>
                  </div>
                </div>
                {selectedTask.horario ? (
                  <p className="rounded-lg border p-3 text-sm">
                    Turno escolhido:{" "}
                    <strong>{new Date(selectedTask.horario.replace(" ", "T")).toLocaleString("pt-BR")}</strong>
                    {selectedTask.max_alunos > 1 &&
                      ` · ${selectedTask.modo_participacao === "aberto" ? "participação aberta" : "somente por convite"}`}
                  </p>
                ) : (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="text-xs">
                        Data
                        <DatePicker value={taskDate} onChange={setTaskDate} />
                      </label>
                      <label className="text-xs">
                        Horário
                        <TimePicker value={taskTime} onChange={setTaskTime} />
                      </label>
                    </div>
                    {selectedTask.max_alunos > 1 && (
                      <fieldset className="space-y-2">
                        <legend className="text-xs font-bold">Quem pode participar?</legend>
                        <label className="flex gap-2 text-sm">
                          <input
                            type="radio"
                            checked={participationMode === "aberto"}
                            onChange={() => setParticipationMode("aberto")}
                          />
                          Qualquer colega da turma
                        </label>
                        <label className="flex gap-2 text-sm">
                          <input
                            type="radio"
                            checked={participationMode === "particular"}
                            onChange={() => setParticipationMode("particular")}
                          />
                          Somente colegas que eu convidar
                        </label>
                      </fieldset>
                    )}
                  </>
                )}
                {selectedTask.envio_status && (
                  <p className="rounded-lg border p-3 text-sm">
                    Comprovação:{" "}
                    <strong>
                      {selectedTask.envio_status === "pending"
                        ? "em análise pelo professor"
                        : selectedTask.envio_status === "approved"
                          ? "aprovada"
                          : "rejeitada"}
                    </strong>
                    {selectedTask.envio_comentario && ` — ${selectedTask.envio_comentario}`}
                  </p>
                )}
                <DialogFooter className="flex-wrap gap-2">
                  {!selectedTask.horario ? (
                    <button
                      onClick={() => void acceptTask(selectedTask.id)}
                      className="min-h-10 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
                    >
                      Reservar meu turno
                    </button>
                  ) : selectedTask.max_alunos > 1 && selectedTask.convite_id ? (
                    <button
                      onClick={() => void taskAction(`/convites-missao/${selectedTask.convite_id}/responder`, { aceitar: true })}
                      className="min-h-10 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground"
                    >
                      Aceitar convite
                    </button>
                  ) : selectedTask.participando &&
                    selectedTask.envio_status !== "pending" &&
                    selectedTask.envio_status !== "approved" ? (
                    <div className="flex w-full flex-col gap-2">
                      <button
                        onClick={() => {
                          setProof({
                            id: selectedTask.id,
                            titulo: selectedTask.titulo,
                            pontos: selectedTask.pontos,
                            equipe: selectedTask.max_alunos > 1,
                          });
                          setSelectedTask(null);
                        }}
                        className="min-h-10 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground"
                      >
                        {selectedTask.envio_status === "rejected" ? "Reenviar comprovação" : "Enviar comprovação"}
                      </button>
                      {selectedTask.max_alunos > 1 && selectedTask.modo_participacao === "particular" && (
                        <div className="flex w-full gap-2">
                          <select
                            value={inviteStudent}
                            onChange={(e) => setInviteStudent(e.target.value)}
                            className="min-h-10 flex-1 rounded-lg border bg-background px-3"
                          >
                            <option value="">Convidar aluno...</option>
                            {classmates.map((a) => (
                              <option key={a.id} value={a.id}>
                                {a.nome}
                              </option>
                            ))}
                          </select>
                          <button
                            disabled={!inviteStudent}
                            onClick={() =>
                              void taskAction(`/missoes/${selectedTask.id}/convidar`, {
                                grupo_id: selectedTask.grupo_id,
                                aluno_id: Number(inviteStudent),
                              })
                            }
                            className="min-h-10 rounded-lg border px-4 text-sm font-bold disabled:opacity-50"
                          >
                            Convidar
                          </button>
                        </div>
                      )}
                    </div>
                  ) : selectedTask.max_alunos > 1 &&
                    selectedTask.modo_participacao === "aberto" &&
                    !selectedTask.participando &&
                    selectedTask.status === "agendada" ? (
                    <button
                      onClick={() => void taskAction(`/missoes/${selectedTask.id}/entrar`, { grupo_id: selectedTask.grupo_id })}
                      className="min-h-10 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground"
                    >
                      Participar deste turno
                    </button>
                  ) : (
                    <button onClick={() => setSelectedTask(null)} className="min-h-10 rounded-lg border px-4 text-sm">
                      Fechar
                    </button>
                  )}
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
