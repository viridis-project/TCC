import { useId, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  RefreshCw,
  Search,
  Sprout,
  Users,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiFetch, backendAsset, type User } from "@/lib/api";
import { toast } from "sonner";

type Selection = { escola?: number; turma?: number };
type School = { id: number; nome: string; total_turmas: number };
type SchoolClass = {
  id: number;
  nome: string;
  ano_letivo: number;
  instituicao_id: number;
  escola: string;
  total_alunos: number;
  total_envios: number;
  pendentes: number;
};
type ActivityStatus = "pending" | "approved" | "rejected";
type Activity = {
  id: number;
  descricao: string;
  url_foto: string;
  status: ActivityStatus;
  data_envio: string | null;
  revisado_em: string | null;
  comentario_professor: string | null;
  aluno: string;
  atividade: string;
  tipo: string;
  revisor: string | null;
};
type ClassHistory = {
  turma: SchoolClass;
  resumo: { total_envios: number; pendentes: number; aprovados: number; rejeitados: number };
  registros: Activity[];
  paginacao: { pagina: number; paginas: number; total: number };
  missoes_publicadas: OpenTask[];
};
type OpenTask = {
  id: number;
  titulo: string;
  descricao: string;
  instrucoes?: string | null;
  imagem?: string | null;
  tipo?: string;
  ativa: number;
  criado_em: string;
  missao: string | null;
  criador: string;
  pontos: number;
  max_alunos: number;
  modo_participacao: "aberto" | "particular";
  participantes: number;
  status: "disponivel" | "agendada" | "concluida";
  inscritos: { id: number; titulo: string; data_hora: string; status: string; aluno: string }[];
};

const card = "rounded-lg border border-border/60 bg-card p-5 shadow-soft";
const button =
  "inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
const statuses = {
  pending: { label: "Em análise", style: "bg-warning/15 text-foreground" },
  approved: { label: "Aprovado", style: "bg-success/15 text-success" },
  rejected: { label: "Rejeitado", style: "bg-destructive/10 text-destructive" },
};
const types: Record<string, string> = {
  plant: "Plantio",
  water: "Rega",
  compost: "Compostagem",
  share: "Compartilhamento",
  outro: "Outros",
};

function date(value: string | null) {
  if (!value) return "Data não informada";
  const parsed = new Date(value.replace(" ", "T"));
  return Number.isNaN(parsed.getTime())
    ? "Data não informada"
    : parsed.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export function StaffGarden({
  user,
  schoolId,
  classId,
  onNavigate,
}: {
  user: User;
  schoolId?: number;
  classId?: number;
  onNavigate: (selection: Selection) => void;
}) {
  const admin = user.perfil_nome === "admin";
  const title = admin
    ? "Jardins das escolas"
    : user.perfil_nome === "professor"
      ? "Jardins das minhas turmas"
      : "Jardins da escola";
  const description = admin
    ? "Selecione uma escola e acompanhe as hortas de cada turma."
    : user.perfil_nome === "professor"
      ? "Acompanhe os envios e as atualizações das turmas sob sua responsabilidade."
      : "Acompanhe os envios e as atualizações de todas as turmas da sua escola.";
  return (
    <PageShell>
      <div className="app-page space-y-6">
        <section className="rounded-xl bg-gradient-hero p-6 text-primary-foreground shadow-soft sm:p-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white/70">
            <Sprout className="h-4 w-4" /> Acompanhamento das hortas
          </div>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/80">{description}</p>
          {!admin && user.instituicao_nome && (
            <p className="mt-4 flex items-center gap-2 text-sm font-semibold">
              <Building2 className="h-4 w-4" />
              {user.instituicao_nome}
            </p>
          )}
        </section>
        {classId ? (
          <ClassGarden key={classId} user={user} classId={classId} onNavigate={onNavigate} />
        ) : admin && !schoolId ? (
          <Schools user={user} onNavigate={onNavigate} />
        ) : (
          <Classes
            key={schoolId ?? "mine"}
            user={user}
            schoolId={schoolId}
            onNavigate={onNavigate}
          />
        )}
      </div>
    </PageShell>
  );
}

function Schools({ user, onNavigate }: { user: User; onNavigate: (selection: Selection) => void }) {
  const [search, setSearch] = useState("");
  const query = useQuery({
    queryKey: ["jardim-gestao", user.id, "escolas"],
    queryFn: () => apiFetch<{ escolas: School[] }>("/jardim/escolas"),
    retry: false,
  });
  if (query.isPending) return <Loading />;
  if (query.isError) return <Failure error={query.error} retry={() => void query.refetch()} />;
  const schools = query.data.escolas.filter((school) =>
    school.nome.toLocaleLowerCase("pt-BR").includes(search.trim().toLocaleLowerCase("pt-BR")),
  );
  return (
    <section className="space-y-4">
      <SectionHeading
        title="Escolas"
        description="Escolha uma escola para visualizar suas turmas."
        refresh={() => void query.refetch()}
        fetching={query.isFetching}
      />
      <SearchField value={search} onChange={setSearch} label="Buscar escola" />
      {!schools.length ? (
        <Empty>
          {query.data.escolas.length
            ? "Nenhuma escola encontrada para essa busca."
            : "Nenhuma escola cadastrada."}
        </Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {schools.map((school) => (
            <button
              key={school.id}
              onClick={() => onNavigate({ escola: Number(school.id) })}
              className={`${card} group space-y-4 text-left transition-colors hover:border-primary/50 hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
            >
              <Building2 className="h-8 w-8 text-primary" />
              <h3 className="break-words text-lg font-bold">{school.nome}</h3>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">{Number(school.total_turmas)} turmas</span>
                <span className="inline-flex items-center gap-1 font-semibold text-primary">
                  Ver turmas <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function Classes({
  user,
  schoolId,
  onNavigate,
}: {
  user: User;
  schoolId?: number;
  onNavigate: (selection: Selection) => void;
}) {
  const [search, setSearch] = useState("");
  const admin = user.perfil_nome === "admin";
  const query = useQuery({
    queryKey: [
      "jardim-gestao",
      user.id,
      user.perfil_nome,
      user.instituicao_id,
      "turmas",
      admin ? schoolId : null,
    ],
    queryFn: () =>
      apiFetch<{ escola: School | null; turmas: SchoolClass[] }>(
        `/jardim/turmas${admin ? `?instituicao_id=${schoolId}` : ""}`,
      ),
    retry: false,
  });
  const back = admin && (
    <button className={button} onClick={() => onNavigate({})}>
      <ArrowLeft className="h-4 w-4" />
      Todas as escolas
    </button>
  );
  if (query.isPending)
    return (
      <>
        {back}
        <Loading />
      </>
    );
  if (query.isError)
    return (
      <>
        {back}
        <Failure error={query.error} retry={() => void query.refetch()} />
      </>
    );
  const classes = query.data.turmas.filter((item) =>
    `${item.nome} ${item.ano_letivo}`
      .toLocaleLowerCase("pt-BR")
      .includes(search.trim().toLocaleLowerCase("pt-BR")),
  );
  return (
    <section className="space-y-4">
      {back}
      <SectionHeading
        title={
          admin
            ? (query.data.escola?.nome ?? "Turmas da escola")
            : user.perfil_nome === "professor"
              ? "Minhas turmas"
              : "Turmas da escola"
        }
        description="Selecione uma turma para abrir os envios e as atualizações da horta."
        refresh={() => void query.refetch()}
        fetching={query.isFetching}
      />
      <SearchField value={search} onChange={setSearch} label="Buscar turma ou ano letivo" />
      {!classes.length ? (
        <Empty>
          {query.data.turmas.length
            ? "Nenhuma turma encontrada para essa busca."
            : user.perfil_nome === "professor"
              ? "Você ainda não tem turmas vinculadas. As turmas aparecerão aqui quando a direção fizer a vinculação."
              : "Nenhuma turma cadastrada nesta escola."}
        </Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((item) => (
            <button
              key={item.id}
              onClick={() =>
                onNavigate({
                  escola: admin ? Number(item.instituicao_id) : undefined,
                  turma: Number(item.id),
                })
              }
              className={`${card} space-y-4 text-left transition-colors hover:border-primary/50 hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
            >
              <div className="flex items-center justify-between gap-3">
                <Sprout className="h-8 w-8 text-primary" />
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold">
                  {item.ano_letivo}
                </span>
              </div>
              <div>
                <h3 className="break-words text-xl font-bold">{item.nome}</h3>
                <p className="mt-1 break-words text-xs text-muted-foreground">{item.escola}</p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {Number(item.total_alunos)} alunos
                </span>
                <span>{Number(item.total_envios)} envios</span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3">
                <span className="text-xs font-semibold">{Number(item.pendentes)} em análise</span>
                <span className="inline-flex items-center gap-1 text-sm font-bold text-primary">
                  Abrir horta <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function ClassGarden({
  user,
  classId,
  onNavigate,
}: {
  user: User;
  classId: number;
  onNavigate: (selection: Selection) => void;
}) {
  const [tab, setTab] = useState("envios");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);
  const query = useQuery({
    queryKey: [
      "jardim-gestao",
      user.id,
      user.perfil_nome,
      user.instituicao_id,
      "turma",
      classId,
      tab,
      status,
      type,
      page,
    ],
    queryFn: () =>
      apiFetch<ClassHistory>(
        `/jardim/turmas/${classId}?${new URLSearchParams({ aba: tab, status, tipo: type, pagina: String(page) })}`,
      ),
    placeholderData: (previous) => previous,
    retry: false,
  });
  const goBack = () =>
    onNavigate({
      escola:
        user.perfil_nome === "admin"
          ? Number(query.data?.turma.instituicao_id) || undefined
          : undefined,
    });
  const toggleTask = async (task: OpenTask) => {
    try {
      const result = await apiFetch<{ mensagem: string }>(`/missoes-publicadas/${task.id}`, {
        method: "PUT",
        body: JSON.stringify({ ativa: task.ativa ? 0 : 1 }),
      });
      toast.success(result.mensagem);
      await query.refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao atualizar missão");
    }
  };
  const back = (
    <button className={button} onClick={goBack}>
      <ArrowLeft className="h-4 w-4" />
      {query.data || user.perfil_nome !== "admin" ? "Voltar às turmas" : "Voltar às escolas"}
    </button>
  );
  return (
    <section className="space-y-5">
      {back}
      {query.data && (
        <>
          <SectionHeading
            title={`Horta da turma ${query.data.turma.nome}`}
            description={`${query.data.turma.escola} · Ano letivo ${query.data.turma.ano_letivo}`}
            refresh={() => void query.refetch()}
            fetching={query.isFetching}
          />
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: "Envios", value: query.data.resumo.total_envios, icon: Sprout },
              { label: "Em análise", value: query.data.resumo.pendentes, icon: Clock3 },
              { label: "Aprovados", value: query.data.resumo.aprovados, icon: CheckCircle2 },
              { label: "Rejeitados", value: query.data.resumo.rejeitados, icon: RefreshCw },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className={card}>
                <Icon className="mb-2 h-5 w-5 text-primary" />
                <p className="text-2xl font-bold">{Number(value).toLocaleString("pt-BR")}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </>
      )}
      <Tabs
        value={tab}
        onValueChange={(value) => {
          setTab(value);
          setPage(1);
        }}
        className="space-y-4"
      >
        <TabsList className="grid h-auto w-full grid-cols-3 sm:w-[34rem]">
          <TabsTrigger value="envios" className="py-3">
            Envios dos alunos
          </TabsTrigger>
          <TabsTrigger value="alteracoes" className="py-3">
            Atualizações
          </TabsTrigger>
          <TabsTrigger value="missoes" className="py-3">
            Missões publicadas
          </TabsTrigger>
        </TabsList>
        <div className="flex flex-wrap gap-3">
          {tab !== "missoes" && (
            <>
              <Filter
                label="Status"
                value={status}
                onChange={(value) => {
                  setStatus(value);
                  setPage(1);
                }}
                options={Object.entries(statuses).map(([value, item]) => ({
                  value,
                  label: item.label,
                }))}
              />
              <Filter
                label="Atividade"
                value={type}
                onChange={(value) => {
                  setType(value);
                  setPage(1);
                }}
                options={Object.entries(types).map(([value, label]) => ({ value, label }))}
              />
            </>
          )}
        </div>
        {tab === "missoes" && query.data && (
          <div className="space-y-3">
            {query.data.missoes_publicadas.length ? (
              query.data.missoes_publicadas.map((task) => (
                <article key={task.id} className={`${card} space-y-4`}>
                  {task.imagem && (
                    <img
                      src={task.imagem}
                      alt={`Imagem da missão ${task.titulo}`}
                      className="max-h-48 w-full rounded-lg border object-cover"
                    />
                  )}
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold">{task.titulo}</h3>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${task.status === "disponivel" ? "bg-success/15 text-success" : task.status === "agendada" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}
                        >
                          {task.status === "disponivel"
                            ? "Disponível"
                            : task.status === "agendada"
                              ? "Agendada"
                              : "Concluída"}
                        </span>
                        <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold text-muted-foreground">
                          {task.ativa ? "Publicada" : "Encerrada"}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Criada por {task.criador}
                        {task.missao ? ` · ${task.missao}` : ""}
                      </p>
                    </div>
                    <button className={button} onClick={() => void toggleTask(task)}>
                      {task.ativa ? "Encerrar missão" : "Reabrir missão"}
                    </button>
                  </div>
                  {task.descricao && (
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                      {task.descricao}
                    </p>
                  )}
                  {task.instrucoes && (
                    <p className="whitespace-pre-wrap text-sm">{task.instrucoes}</p>
                  )}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      ["Pontuação", `${task.pontos} pts`],
                      ["Participantes", `${task.participantes}/${task.max_alunos}`],
                      [
                        "Participação",
                        task.max_alunos <= 1
                          ? "Individual"
                          : task.modo_participacao === "aberto"
                            ? "Equipe aberta"
                            : "Equipe por convite",
                      ],
                      ["Referência", task.missao ?? "Personalizada"],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-lg bg-muted/60 px-3 py-2">
                        <p className="text-[10px] font-semibold uppercase text-muted-foreground">
                          {label}
                        </p>
                        <p className="mt-1 text-sm font-bold">{value}</p>
                      </div>
                    ))}
                  </div>
                  {task.inscritos.length ? (
                    <div>
                      <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        Turnos e alunos
                      </h4>
                      <ul className="divide-y rounded-lg border">
                        {task.inscritos.map((a) => (
                          <li
                            key={a.id}
                            className="flex flex-wrap justify-between gap-2 px-3 py-2 text-sm"
                          >
                            <span>
                              {a.aluno}{" "}
                              <span className="text-xs text-muted-foreground">· {a.status}</span>
                            </span>
                            <span className="text-muted-foreground">{date(a.data_hora)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <Empty>Nenhum aluno aderiu à missão ainda.</Empty>
                  )}
                </article>
              ))
            ) : (
              <Empty>Nenhuma missão publicada para esta turma.</Empty>
            )}
          </div>
        )}{" "}
        {["envios", "alteracoes"].map((value) => (
          <TabsContent key={value} value={value} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {value === "envios"
                ? "Atividades enviadas pelos alunos da turma, da mais recente à mais antiga."
                : "Avaliações e mudanças de status dos envios, da mais recente à mais antiga."}
            </p>
            {query.isPending || query.isPlaceholderData ? (
              <Loading />
            ) : query.isError ? (
              <Failure error={query.error} retry={() => void query.refetch()} />
            ) : (
              <>
                {!query.data.registros.length ? (
                  <Empty>
                    {status !== "all" || type !== "all"
                      ? "Nenhum registro corresponde aos filtros selecionados."
                      : value === "envios"
                        ? "Os alunos desta turma ainda não enviaram atividades."
                        : "Nenhuma avaliação registrada para esta turma."}
                  </Empty>
                ) : (
                  <ul className="space-y-4">
                    {query.data.registros.map((activity) => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        updates={value === "alteracoes"}
                      />
                    ))}
                  </ul>
                )}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p aria-live="polite" className="text-sm text-muted-foreground">
                    {query.data.paginacao.total} registros
                  </p>
                  {query.data.paginacao.paginas > 1 && (
                    <nav aria-label="Páginas de atividades" className="flex items-center gap-3">
                      <button
                        className={button}
                        disabled={query.data.paginacao.pagina <= 1}
                        onClick={() => setPage(query.data.paginacao.pagina - 1)}
                      >
                        Anterior
                      </button>
                      <span className="text-sm">
                        {query.data.paginacao.pagina} / {query.data.paginacao.paginas}
                      </span>
                      <button
                        className={button}
                        disabled={query.data.paginacao.pagina >= query.data.paginacao.paginas}
                        onClick={() => setPage(query.data.paginacao.pagina + 1)}
                      >
                        Próxima
                      </button>
                    </nav>
                  )}
                </div>
              </>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

function ActivityCard({ activity, updates }: { activity: Activity; updates: boolean }) {
  const badge = statuses[activity.status];
  return (
    <li className={`${card} flex flex-col gap-4 sm:flex-row`}>
      {activity.url_foto && (
        <a
          href={backendAsset(activity.url_foto)}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <img
            src={backendAsset(activity.url_foto)}
            alt={`Foto de ${activity.atividade}, enviada por ${activity.aluno}`}
            loading="lazy"
            className="h-44 w-full rounded-xl object-cover sm:h-32 sm:w-32"
          />
        </a>
      )}
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="break-words font-bold">{activity.atividade}</h3>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${badge.style}`}>
            {badge.label}
          </span>
        </div>
        <p className="break-words text-sm font-semibold">
          {activity.aluno}{" "}
          <span className="font-normal text-muted-foreground">
            · {types[activity.tipo] ?? activity.tipo}
          </span>
        </p>
        <p className="text-xs text-muted-foreground">
          {updates
            ? `Avaliado em ${date(activity.revisado_em)}`
            : `Enviado em ${date(activity.data_envio)}`}
        </p>
        <p className="whitespace-pre-wrap break-words text-sm">{activity.descricao}</p>
        {activity.revisado_em && (
          <div className="space-y-1 rounded-xl bg-muted/50 p-3 text-sm">
            <p className="font-semibold">
              {activity.status === "approved"
                ? "Atividade aprovada"
                : activity.status === "rejected"
                  ? "Atividade rejeitada"
                  : "Atividade avaliada"}
              {activity.revisor ? ` por ${activity.revisor}` : ""}
            </p>
            <p className="text-xs text-muted-foreground">
              {updates
                ? `Envio original: ${date(activity.data_envio)}`
                : date(activity.revisado_em)}
            </p>
            {activity.comentario_professor && (
              <p className="whitespace-pre-wrap break-words">{activity.comentario_professor}</p>
            )}
          </div>
        )}
      </div>
    </li>
  );
}

function Filter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  const id = useId();
  return (
    <div className="flex items-center gap-2 text-sm font-semibold">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 rounded-xl border border-border bg-card px-3 py-2 font-normal"
      >
        <option value="all">Todos</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
function SearchField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex max-w-lg items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
      <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="sr-only">{label}</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={label}
        className="min-w-0 flex-1 bg-transparent text-sm outline-none"
      />
    </label>
  );
}
function SectionHeading({
  title,
  description,
  refresh,
  fetching,
}: {
  title: string;
  description: string;
  refresh: () => void;
  fetching: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <h2 className="break-words text-xl font-bold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <button className={button} onClick={refresh} disabled={fetching}>
        <RefreshCw className={`h-4 w-4 ${fetching ? "animate-spin" : ""}`} />
        Atualizar
      </button>
    </div>
  );
}
function Loading() {
  return (
    <p role="status" className="p-12 text-center text-muted-foreground">
      Carregando dados da horta...
    </p>
  );
}
function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-border p-8 text-center">
      <Sprout className="mx-auto mb-3 h-8 w-8 text-primary" />
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
function Failure({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <div className={`${card} space-y-4 text-center`}>
      <p role="alert" className="text-destructive">
        {error.message}
      </p>
      <button className={button} onClick={retry}>
        Tentar novamente
      </button>
    </div>
  );
}
