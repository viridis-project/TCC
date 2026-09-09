import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Gift, History, Sprout } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiFetch, backendAsset, isBrowser, userQuery } from "@/lib/api";

export const Route = createFileRoute("/historico")({
  head: () => ({ meta: [{ title: "Meu Histórico — Viridis" }] }),
  component: HistoryPage,
});

type PlantStatus = "pending" | "approved" | "rejected";
type Plant = {
  id: number;
  titulo: string;
  descricao: string;
  url_foto: string;
  status: PlantStatus;
  comentario_professor: string | null;
  data_envio: string | null;
  revisado_em: string | null;
};
type Reward = {
  id: number;
  titulo: string | null;
  parceiro: string | null;
  pontos_debitados: number;
  criado_em: string;
};
type UserHistory = { plantios: Plant[]; recompensas: Reward[] };

const statuses = {
  pending: { label: "Em análise", style: "bg-warning/15 text-foreground" },
  approved: { label: "Aprovado", style: "bg-success/15 text-success" },
  rejected: { label: "Rejeitado", style: "bg-destructive/10 text-destructive" },
};
const buttonStyle =
  "inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed";

function formatDate(value: string | null) {
  if (!value) return "Data não informada";
  const date = new Date(value.replace(" ", "T"));
  return Number.isNaN(date.getTime())
    ? "Data não informada"
    : date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function HistoryPage() {
  const user = useQuery(userQuery());
  const history = useQuery({
    queryKey: ["historico", user.data?.id],
    enabled: isBrowser && !!user.data && !user.isError,
    retry: false,
    queryFn: () => apiFetch<UserHistory>("/historico"),
  });
  const [status, setStatus] = useState("all");
  const [plantPage, setPlantPage] = useState(1);
  const [rewardPage, setRewardPage] = useState(1);

  if (user.isError || (isBrowser && !user.isPending && !user.data)) {
    return (
      <PageShell>
        <div className="mx-auto max-w-lg space-y-4 px-4 py-16 text-center">
          <h1 className="text-2xl font-extrabold">Meu histórico</h1>
          <p role="alert">{user.error?.message ?? "Faça login para consultar seu histórico."}</p>
          <Link to="/login" className={buttonStyle}>
            Entrar na minha conta
          </Link>
        </div>
      </PageShell>
    );
  }
  if (user.isPending || history.isPending) {
    return (
      <PageShell>
        <p role="status" className="p-16 text-center text-muted-foreground">
          Carregando seu histórico...
        </p>
      </PageShell>
    );
  }
  if (history.isError) {
    return (
      <PageShell>
        <div className="space-y-4 p-16 text-center">
          <p role="alert" className="text-destructive">
            {history.error.message}
          </p>
          <button className={buttonStyle} onClick={() => void history.refetch()}>
            Tentar novamente
          </button>
        </div>
      </PageShell>
    );
  }

  const { plantios, recompensas } = history.data;
  const filtered = plantios.filter((plant) => status === "all" || plant.status === status);
  const spent = recompensas.reduce((total, reward) => total + Number(reward.pontos_debitados), 0);
  return (
    <PageShell>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl bg-gradient-hero p-6 text-primary-foreground shadow-elevated sm:p-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/70">
            <History className="h-4 w-4" /> Sua trajetória no Viridis
          </div>
          <h1 className="mt-2 text-3xl font-extrabold">Meu histórico</h1>
          <p className="mt-2 text-sm text-white/80">
            Acompanhe seus plantios e as recompensas que você já resgatou.
          </p>
        </section>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Plantios enviados", value: plantios.length, icon: Sprout },
            { label: "Recompensas resgatadas", value: recompensas.length, icon: Gift },
            { label: "Pontos utilizados", value: spent, icon: History },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-soft"
            >
              <Icon className="h-6 w-6 shrink-0 text-primary" />
              <div>
                <p className="text-2xl font-extrabold">{value.toLocaleString("pt-BR")}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="plantios" className="space-y-5">
          <TabsList className="grid h-auto w-full grid-cols-2 sm:w-96">
            <TabsTrigger value="plantios" className="gap-2 py-3">
              <Sprout className="h-4 w-4" /> Plantios
            </TabsTrigger>
            <TabsTrigger value="recompensas" className="gap-2 py-3">
              <Gift className="h-4 w-4" /> Recompensas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plantios" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold">Histórico de plantios</h2>
                <p className="text-sm text-muted-foreground">Do mais recente ao mais antigo.</p>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="plant-status" className="text-sm font-semibold">
                  Status
                </label>
                <select
                  id="plant-status"
                  value={status}
                  onChange={(event) => {
                    setStatus(event.target.value);
                    setPlantPage(1);
                  }}
                  className="rounded-xl border border-border bg-card px-3 py-2 text-sm"
                >
                  <option value="all">Todos</option>
                  {Object.entries(statuses).map(([value, item]) => (
                    <option key={value} value={value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center">
                <Sprout className="mx-auto mb-3 h-8 w-8 text-primary" />
                <p className="font-semibold">
                  {plantios.length
                    ? "Nenhum plantio com esse status."
                    : "Você ainda não registrou plantios."}
                </p>
                <Link to="/jardim" className={`${buttonStyle} mt-4`}>
                  Ir para meu jardim
                </Link>
              </div>
            ) : (
              <ul className="space-y-4">
                {filtered.slice((plantPage - 1) * 10, plantPage * 10).map((plant) => (
                  <li
                    key={plant.id}
                    className="overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-soft"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row">
                      {plant.url_foto && (
                        <img
                          src={backendAsset(plant.url_foto)}
                          alt={`Foto do plantio: ${plant.titulo}`}
                          loading="lazy"
                          className="h-40 w-full rounded-xl object-cover sm:h-28 sm:w-28"
                        />
                      )}
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h3 className="break-words font-bold">{plant.titulo}</h3>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${statuses[plant.status].style}`}
                          >
                            {statuses[plant.status].label}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Enviado em {formatDate(plant.data_envio)}
                        </p>
                        <p className="whitespace-pre-wrap break-words text-sm">{plant.descricao}</p>
                        {plant.status === "pending" && (
                          <p className="text-xs text-muted-foreground">
                            Aguardando avaliação do professor.
                          </p>
                        )}
                        {plant.revisado_em && (
                          <p className="text-xs text-muted-foreground">
                            Avaliado em {formatDate(plant.revisado_em)}
                          </p>
                        )}
                        {plant.comentario_professor && (
                          <div className="rounded-xl bg-muted/50 p-3 text-sm">
                            <p className="mb-1 font-semibold">Comentário do professor</p>
                            <p className="whitespace-pre-wrap break-words">
                              {plant.comentario_professor}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Pagination page={plantPage} count={filtered.length} onChange={setPlantPage} />
          </TabsContent>

          <TabsContent value="recompensas" className="space-y-4">
            <div>
              <h2 className="text-xl font-extrabold">Histórico de recompensas</h2>
              <p className="text-sm text-muted-foreground">
                Seus resgates confirmados, do mais recente ao mais antigo.
              </p>
            </div>
            {recompensas.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center">
                <Gift className="mx-auto mb-3 h-8 w-8 text-primary" />
                <p className="font-semibold">Você ainda não resgatou recompensas.</p>
                <Link to="/recompensas" className={`${buttonStyle} mt-4`}>
                  Ver recompensas
                </Link>
              </div>
            ) : (
              <ul className="space-y-4">
                {recompensas.slice((rewardPage - 1) * 10, rewardPage * 10).map((reward) => (
                  <li
                    key={reward.id}
                    className="flex flex-wrap items-center gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-soft"
                  >
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Gift className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="break-words font-bold">
                        {reward.titulo ?? "Recompensa indisponível"}
                      </h3>
                      <p className="break-words text-sm text-muted-foreground">
                        {reward.parceiro ?? "Parceiro não informado"}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Resgatada em {formatDate(reward.criado_em)} · Resgate #{reward.id}
                      </p>
                    </div>
                    <div className="text-sm font-bold text-primary">
                      {Number(reward.pontos_debitados).toLocaleString("pt-BR")} pontos utilizados
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Pagination page={rewardPage} count={recompensas.length} onChange={setRewardPage} />
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  );
}

function Pagination({
  page,
  count,
  onChange,
}: {
  page: number;
  count: number;
  onChange: (page: number) => void;
}) {
  const pages = Math.ceil(count / 10);
  if (pages <= 1) return null;
  return (
    <nav
      aria-label="Paginação do histórico"
      className="flex flex-wrap items-center justify-center gap-3"
    >
      <button className={buttonStyle} disabled={page === 1} onClick={() => onChange(page - 1)}>
        Anterior
      </button>
      <span aria-live="polite" className="text-sm text-muted-foreground">
        Página {page} de {pages}
      </span>
      <button className={buttonStyle} disabled={page >= pages} onClick={() => onChange(page + 1)}>
        Próxima
      </button>
    </nav>
  );
}
