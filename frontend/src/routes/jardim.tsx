import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Sprout,
  Droplets,
  Leaf,
  Sun,
  Lock,
  Check,
  Play,
  Camera,
  Share2,
  Trophy,
  Medal,
  Flame,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { SubmitActivityModal } from "@/components/modals/submit-activity-modal";
import { StaffGarden } from "@/components/staff-garden";
import { apiFetch, isBrowser, userQuery, type Module as ApiModule } from "@/lib/api";

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

const PIE_COLORS = ["oklch(0.62 0.18 150)", "oklch(0.62 0.16 240)", "oklch(0.65 0.17 95)"];

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
  const [activityType, setActivityType] = useState<string | null>(null);
  const [rankingType, setRankingType] = useState<"individual" | "turma" | "escola">("individual");
  const queryClient = useQueryClient();
  const { data: user, isLoading: loadingUser, error: userError } = useQuery(userQuery());
  const { data, isLoading, error } = useQuery({
    queryKey: ["jardim"],
    enabled: isBrowser,
    retry: false,
    queryFn: async () => {
      const [garden, moduleResult] = await Promise.all([
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
      ]);
      return { garden, modules: moduleResult.modulos };
    },
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
  const summary = data.garden.resumo;
  const summaryStats = [
    {
      icon: Sprout,
      label: "Plantas Ativas",
      value: summary.plantas_ativas,
      color: "bg-success/15 text-success",
    },
    {
      icon: Droplets,
      label: "Litros Economizados",
      value: summary.litros_economizados,
      color: "bg-info/15 text-info",
    },
    {
      icon: Leaf,
      label: "Resíduos Reciclados (kg)",
      value: summary.kg_residuos_reciclados,
      color: "bg-success/15 text-success",
    },
    {
      icon: Sun,
      label: "kg CO₂ Reduzido",
      value: summary.kg_co2_reduzido,
      color: "bg-warning/15 text-warning",
    },
  ];
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
  const plantsData = Object.entries(summary.atividades_por_tipo).map(([name, value]) => ({
    name:
      (
        { plant: "Plantio", water: "Rega", compost: "Composto", share: "Partilha" } as Record<
          string,
          string
        >
      )[name] ?? name,
    value,
  }));
  const impactData = [
    { name: "CO₂ Reduzido", value: summary.kg_co2_reduzido },
    { name: "Água Economizada", value: summary.litros_economizados },
    { name: "Resíduos Reciclados", value: summary.kg_residuos_reciclados },
  ];
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

          {/* Resumo */}
          <Card>
            <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
              Resumo do Jardim
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {summaryStats.map((s) => (
                <motion.div
                  key={s.label}
                  whileHover={{ y: -1 }}
                  className="rounded-xl border border-border/60 bg-background/60 p-3 text-center"
                >
                  <div
                    className={`mx-auto grid h-10 w-10 place-items-center rounded-xl ${s.color}`}
                  >
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div className="mt-2 text-xl font-bold text-foreground">{s.value}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-xs font-semibold text-muted-foreground">
                  Crescimento das Plantas
                </div>
                <div className="mt-1 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={plantsData} margin={{ top: 4, right: 4, bottom: 0, left: -22 }}>
                      <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis fontSize={10} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)" }}
                      />
                      <Bar dataKey="value" fill="var(--color-success)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground">
                  Impacto Sustentável
                </div>
                <div className="mt-1 flex items-center gap-3">
                  <div className="h-32 w-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={impactData}
                          dataKey="value"
                          innerRadius={32}
                          outerRadius={56}
                          paddingAngle={3}
                        >
                          {impactData.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <ul className="space-y-1.5 text-xs">
                    {impactData.map((d, i) => (
                      <li key={d.name} className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ background: PIE_COLORS[i] }}
                        />
                        <span className="text-muted-foreground">{d.name}</span>
                        <span className="font-bold text-foreground">{d.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Atividades + Ranking */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <Card>
            <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
              Atividades Pontuáveis
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <motion.button
                onClick={() => setActivityType("plant")}
                whileHover={{ y: -1 }}
                className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 p-4 text-left transition-colors hover:bg-success/15"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-success text-success-foreground">
                  <Camera className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">Confirmar Plantio</div>
                  <div className="text-xs text-muted-foreground">Tire uma foto do seu plantio</div>
                  <div className="mt-2 inline-flex rounded-full bg-success px-2 py-0.5 text-[10px] font-bold text-success-foreground">
                    +50 pts
                  </div>
                </div>
              </motion.button>
              <motion.button
                onClick={() => setActivityType("share")}
                whileHover={{ y: -1 }}
                className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/10 p-4 text-left transition-colors hover:bg-warning/15"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-warning text-warning-foreground">
                  <Share2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">Compartilhar Progresso</div>
                  <div className="text-xs text-muted-foreground">Mostre seu jardim</div>
                  <div className="mt-2 inline-flex rounded-full bg-warning px-2 py-0.5 text-[10px] font-bold text-warning-foreground">
                    +25 pts
                  </div>
                </div>
              </motion.button>
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

      <SubmitActivityModal
        open={!!activityType}
        onOpenChange={(v) => !v && setActivityType(null)}
        defaultType={activityType ?? undefined}
        onSubmitted={() => {
          void queryClient.invalidateQueries({ queryKey: ["historico"] });
          void queryClient.invalidateQueries({ queryKey: ["jardim"] });
          void queryClient.invalidateQueries({ queryKey: ["perfil"] });
        }}
      />
    </PageShell>
  );
}
