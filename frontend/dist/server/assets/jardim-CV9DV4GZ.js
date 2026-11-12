import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useId } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area } from "recharts";
import { Sprout, Building2, ArrowLeft, Clock3, CheckCircle2, RefreshCw, ArrowRight, Users, Search, ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, CalendarDays, ChevronDown, Check, TrendingUp, Lock, Play, Trophy, Rocket, Flame, Medal } from "lucide-react";
import { P as PageShell, a as apiFetch, c as backendAsset, j as cn, k as buttonVariants, B as Button, u as userQuery, R as Route, h as isBrowser, m as missionTypes, D as Dialog, b as DialogContent, d as DialogHeader, e as DialogTitle, f as DialogDescription, g as DialogFooter } from "./router-_glEtDMC.js";
import { S as SubmitProofModal } from "./submit-proof-modal-Cz6RAjCn.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-s4MmrSK0.js";
import { toast } from "sonner";
import { ptBR } from "date-fns/locale";
import { getDefaultClassNames, DayPicker } from "react-day-picker";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import "@radix-ui/react-dialog";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-tabs";
const card = "rounded-lg border border-border/60 bg-card p-5 shadow-soft";
const button = "inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
const statuses = {
  pending: { label: "Em análise", style: "bg-warning/15 text-foreground" },
  approved: { label: "Aprovado", style: "bg-success/15 text-success" },
  rejected: { label: "Rejeitado", style: "bg-destructive/10 text-destructive" }
};
const types = {
  plant: "Plantio",
  water: "Rega",
  compost: "Compostagem",
  share: "Compartilhamento",
  outro: "Outros"
};
function date(value) {
  if (!value) return "Data não informada";
  const parsed = new Date(value.replace(" ", "T"));
  return Number.isNaN(parsed.getTime()) ? "Data não informada" : parsed.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}
function StaffGarden({
  user,
  schoolId,
  classId,
  onNavigate
}) {
  const admin = user.perfil_nome === "admin";
  const title = admin ? "Jardins das escolas" : user.perfil_nome === "professor" ? "Jardins das minhas turmas" : "Jardins da escola";
  const description = admin ? "Selecione uma escola e acompanhe as hortas de cada turma." : user.perfil_nome === "professor" ? "Acompanhe os envios e as atualizações das turmas sob sua responsabilidade." : "Acompanhe os envios e as atualizações de todas as turmas da sua escola.";
  return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsxs("div", { className: "app-page space-y-6", children: [
    /* @__PURE__ */ jsxs("section", { className: "rounded-xl bg-gradient-hero p-6 text-primary-foreground shadow-soft sm:p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white/70", children: [
        /* @__PURE__ */ jsx(Sprout, { className: "h-4 w-4" }),
        " Acompanhamento das hortas"
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "mt-2 text-2xl font-bold sm:text-3xl", children: title }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-2xl text-sm text-white/80", children: description }),
      !admin && user.instituicao_nome && /* @__PURE__ */ jsxs("p", { className: "mt-4 flex items-center gap-2 text-sm font-semibold", children: [
        /* @__PURE__ */ jsx(Building2, { className: "h-4 w-4" }),
        user.instituicao_nome
      ] })
    ] }),
    classId ? /* @__PURE__ */ jsx(ClassGarden, { user, classId, onNavigate }, classId) : admin && !schoolId ? /* @__PURE__ */ jsx(Schools, { user, onNavigate }) : /* @__PURE__ */ jsx(
      Classes,
      {
        user,
        schoolId,
        onNavigate
      },
      schoolId ?? "mine"
    )
  ] }) });
}
function Schools({ user, onNavigate }) {
  const [search, setSearch] = useState("");
  const query = useQuery({
    queryKey: ["jardim-gestao", user.id, "escolas"],
    queryFn: () => apiFetch("/jardim/escolas"),
    retry: false
  });
  if (query.isPending) return /* @__PURE__ */ jsx(Loading, {});
  if (query.isError) return /* @__PURE__ */ jsx(Failure, { error: query.error, retry: () => void query.refetch() });
  const schools = query.data.escolas.filter(
    (school) => school.nome.toLocaleLowerCase("pt-BR").includes(search.trim().toLocaleLowerCase("pt-BR"))
  );
  return /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx(
      SectionHeading,
      {
        title: "Escolas",
        description: "Escolha uma escola para visualizar suas turmas.",
        refresh: () => void query.refetch(),
        fetching: query.isFetching
      }
    ),
    /* @__PURE__ */ jsx(SearchField, { value: search, onChange: setSearch, label: "Buscar escola" }),
    !schools.length ? /* @__PURE__ */ jsx(Empty, { children: query.data.escolas.length ? "Nenhuma escola encontrada para essa busca." : "Nenhuma escola cadastrada." }) : /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: schools.map((school) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => onNavigate({ escola: Number(school.id) }),
        className: `${card} group space-y-4 text-left transition-colors hover:border-primary/50 hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`,
        children: [
          /* @__PURE__ */ jsx(Building2, { className: "h-8 w-8 text-primary" }),
          /* @__PURE__ */ jsx("h3", { className: "break-words text-lg font-bold", children: school.nome }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 text-sm", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
              Number(school.total_turmas),
              " turmas"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 font-semibold text-primary", children: [
              "Ver turmas ",
              /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
            ] })
          ] })
        ]
      },
      school.id
    )) })
  ] });
}
function Classes({
  user,
  schoolId,
  onNavigate
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
      admin ? schoolId : null
    ],
    queryFn: () => apiFetch(
      `/jardim/turmas${admin ? `?instituicao_id=${schoolId}` : ""}`
    ),
    retry: false
  });
  const back = admin && /* @__PURE__ */ jsxs("button", { className: button, onClick: () => onNavigate({}), children: [
    /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
    "Todas as escolas"
  ] });
  if (query.isPending)
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      back,
      /* @__PURE__ */ jsx(Loading, {})
    ] });
  if (query.isError)
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      back,
      /* @__PURE__ */ jsx(Failure, { error: query.error, retry: () => void query.refetch() })
    ] });
  const classes = query.data.turmas.filter(
    (item) => `${item.nome} ${item.ano_letivo}`.toLocaleLowerCase("pt-BR").includes(search.trim().toLocaleLowerCase("pt-BR"))
  );
  return /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
    back,
    /* @__PURE__ */ jsx(
      SectionHeading,
      {
        title: admin ? query.data.escola?.nome ?? "Turmas da escola" : user.perfil_nome === "professor" ? "Minhas turmas" : "Turmas da escola",
        description: "Selecione uma turma para abrir os envios e as atualizações da horta.",
        refresh: () => void query.refetch(),
        fetching: query.isFetching
      }
    ),
    /* @__PURE__ */ jsx(SearchField, { value: search, onChange: setSearch, label: "Buscar turma ou ano letivo" }),
    !classes.length ? /* @__PURE__ */ jsx(Empty, { children: query.data.turmas.length ? "Nenhuma turma encontrada para essa busca." : user.perfil_nome === "professor" ? "Você ainda não tem turmas vinculadas. As turmas aparecerão aqui quando a direção fizer a vinculação." : "Nenhuma turma cadastrada nesta escola." }) : /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: classes.map((item) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => onNavigate({
          escola: admin ? Number(item.instituicao_id) : void 0,
          turma: Number(item.id)
        }),
        className: `${card} space-y-4 text-left transition-colors hover:border-primary/50 hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsx(Sprout, { className: "h-8 w-8 text-primary" }),
            /* @__PURE__ */ jsx("span", { className: "rounded-full bg-muted px-3 py-1 text-xs font-bold", children: item.ano_letivo })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "break-words text-xl font-bold", children: item.nome }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 break-words text-xs text-muted-foreground", children: item.escola })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" }),
              Number(item.total_alunos),
              " alunos"
            ] }),
            /* @__PURE__ */ jsxs("span", { children: [
              Number(item.total_envios),
              " envios"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold", children: [
              Number(item.pendentes),
              " em análise"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-sm font-bold text-primary", children: [
              "Abrir horta ",
              /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
            ] })
          ] })
        ]
      },
      item.id
    )) })
  ] });
}
function ClassGarden({
  user,
  classId,
  onNavigate
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
      page
    ],
    queryFn: () => apiFetch(
      `/jardim/turmas/${classId}?${new URLSearchParams({ aba: tab, status, tipo: type, pagina: String(page) })}`
    ),
    placeholderData: (previous) => previous,
    retry: false
  });
  const goBack = () => onNavigate({
    escola: user.perfil_nome === "admin" ? Number(query.data?.turma.instituicao_id) || void 0 : void 0
  });
  const toggleMission = async (task) => {
    try {
      const result = await apiFetch(`/missoes/${task.id}`, { method: "PUT", body: JSON.stringify({ ativa: task.ativa ? 0 : 1 }) });
      toast.success(result.mensagem);
      await query.refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao atualizar missão");
    }
  };
  const back = /* @__PURE__ */ jsxs("button", { className: button, onClick: goBack, children: [
    /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
    query.data || user.perfil_nome !== "admin" ? "Voltar às turmas" : "Voltar às escolas"
  ] });
  return /* @__PURE__ */ jsxs("section", { className: "space-y-5", children: [
    back,
    query.data && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        SectionHeading,
        {
          title: `Horta da turma ${query.data.turma.nome}`,
          description: `${query.data.turma.escola} · Ano letivo ${query.data.turma.ano_letivo}`,
          refresh: () => void query.refetch(),
          fetching: query.isFetching
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3 lg:grid-cols-4", children: [
        { label: "Envios", value: query.data.resumo.total_envios, icon: Sprout },
        { label: "Em análise", value: query.data.resumo.pendentes, icon: Clock3 },
        { label: "Aprovados", value: query.data.resumo.aprovados, icon: CheckCircle2 },
        { label: "Rejeitados", value: query.data.resumo.rejeitados, icon: RefreshCw }
      ].map(({ label, value, icon: Icon }) => /* @__PURE__ */ jsxs("div", { className: card, children: [
        /* @__PURE__ */ jsx(Icon, { className: "mb-2 h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", children: Number(value).toLocaleString("pt-BR") }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: label })
      ] }, label)) })
    ] }),
    /* @__PURE__ */ jsxs(
      Tabs,
      {
        value: tab,
        onValueChange: (value) => {
          setTab(value);
          setPage(1);
        },
        className: "space-y-4",
        children: [
          /* @__PURE__ */ jsxs(TabsList, { className: "grid h-auto w-full grid-cols-3 sm:w-[34rem]", children: [
            /* @__PURE__ */ jsx(TabsTrigger, { value: "envios", className: "py-3", children: "Envios dos alunos" }),
            /* @__PURE__ */ jsx(TabsTrigger, { value: "alteracoes", className: "py-3", children: "Atualizações" }),
            /* @__PURE__ */ jsx(TabsTrigger, { value: "missoes", className: "py-3", children: "Missões" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3", children: tab !== "missoes" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              Filter,
              {
                label: "Status",
                value: status,
                onChange: (value) => {
                  setStatus(value);
                  setPage(1);
                },
                options: Object.entries(statuses).map(([value, item]) => ({
                  value,
                  label: item.label
                }))
              }
            ),
            /* @__PURE__ */ jsx(
              Filter,
              {
                label: "Atividade",
                value: type,
                onChange: (value) => {
                  setType(value);
                  setPage(1);
                },
                options: Object.entries(types).map(([value, label]) => ({ value, label }))
              }
            )
          ] }) }),
          tab === "missoes" && query.data && /* @__PURE__ */ jsx("div", { className: "space-y-3", children: query.data.missoes.length ? query.data.missoes.map((mission) => {
            const solo = Number(mission.max_alunos) === 1;
            const badge = {
              disponivel: ["Disponível", "bg-success/15 text-success"],
              agendada: ["Agendada", "bg-primary/15 text-primary"],
              em_analise: ["Em análise", "bg-warning/15 text-foreground"],
              concluida: ["Concluída", "bg-muted text-muted-foreground"]
            }[mission.status];
            const facts = [
              ["Pontuação", `${mission.pontos} pts`],
              ["Tipo", types[mission.tipo] ?? mission.tipo],
              [solo ? "Modalidade" : "Participantes", solo ? "Individual" : `${mission.participantes}/${mission.max_alunos}`]
            ];
            if (!solo) facts.push(["Participação", mission.modo_participacao === "escolher" ? "Aguardando aceite" : mission.modo_participacao === "aberto" ? "Aberta" : "Por convite"]);
            return /* @__PURE__ */ jsxs("article", { className: `${card} space-y-4`, children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 gap-3", children: [
                  mission.imagem && /* @__PURE__ */ jsx("img", { src: backendAsset(mission.imagem), alt: "", loading: "lazy", className: "h-16 w-16 shrink-0 rounded-lg object-cover" }),
                  /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                      /* @__PURE__ */ jsx("h3", { className: "text-base font-bold", children: mission.titulo }),
                      /* @__PURE__ */ jsx("span", { className: `rounded-full px-2.5 py-1 text-[10px] font-bold ${badge[1]}`, children: badge[0] }),
                      /* @__PURE__ */ jsx("span", { className: "rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold text-muted-foreground", children: mission.ativa ? "Publicada" : "Encerrada" })
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
                      "Criada por ",
                      mission.criador
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("button", { className: button, onClick: () => void toggleMission(mission), children: mission.ativa ? "Encerrar missão" : "Reabrir missão" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4", children: facts.map(([label, value]) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-muted/60 px-3 py-2", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-semibold uppercase text-muted-foreground", children: label }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm font-bold", children: value })
              ] }, label)) }),
              mission.inscritos.length ? /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground", children: "Turnos e alunos" }),
                /* @__PURE__ */ jsx("ul", { className: "divide-y rounded-lg border", children: mission.inscritos.map((a) => /* @__PURE__ */ jsxs("li", { className: "flex flex-wrap justify-between gap-2 px-3 py-2 text-sm", children: [
                  /* @__PURE__ */ jsxs("span", { children: [
                    a.aluno,
                    " ",
                    /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
                      "· ",
                      a.status
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: date(a.data_hora) })
                ] }, a.id)) })
              ] }) : /* @__PURE__ */ jsx(Empty, { children: "Nenhum aluno pegou esta missão ainda." })
            ] }, mission.id);
          }) : /* @__PURE__ */ jsx(Empty, { children: "Nenhuma missão publicada para esta turma." }) }),
          "        ",
          ["envios", "alteracoes"].map((value) => /* @__PURE__ */ jsxs(TabsContent, { value, className: "space-y-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: value === "envios" ? "Atividades enviadas pelos alunos da turma, da mais recente à mais antiga." : "Avaliações e mudanças de status dos envios, da mais recente à mais antiga." }),
            query.isPending || query.isPlaceholderData ? /* @__PURE__ */ jsx(Loading, {}) : query.isError ? /* @__PURE__ */ jsx(Failure, { error: query.error, retry: () => void query.refetch() }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              !query.data.registros.length ? /* @__PURE__ */ jsx(Empty, { children: status !== "all" || type !== "all" ? "Nenhum registro corresponde aos filtros selecionados." : value === "envios" ? "Os alunos desta turma ainda não enviaram atividades." : "Nenhuma avaliação registrada para esta turma." }) : /* @__PURE__ */ jsx("ul", { className: "space-y-4", children: query.data.registros.map((activity) => /* @__PURE__ */ jsx(
                ActivityCard,
                {
                  activity,
                  updates: value === "alteracoes"
                },
                activity.id
              )) }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
                /* @__PURE__ */ jsxs("p", { "aria-live": "polite", className: "text-sm text-muted-foreground", children: [
                  query.data.paginacao.total,
                  " registros"
                ] }),
                query.data.paginacao.paginas > 1 && /* @__PURE__ */ jsxs("nav", { "aria-label": "Páginas de atividades", className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      className: button,
                      disabled: query.data.paginacao.pagina <= 1,
                      onClick: () => setPage(query.data.paginacao.pagina - 1),
                      children: "Anterior"
                    }
                  ),
                  /* @__PURE__ */ jsxs("span", { className: "text-sm", children: [
                    query.data.paginacao.pagina,
                    " / ",
                    query.data.paginacao.paginas
                  ] }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      className: button,
                      disabled: query.data.paginacao.pagina >= query.data.paginacao.paginas,
                      onClick: () => setPage(query.data.paginacao.pagina + 1),
                      children: "Próxima"
                    }
                  )
                ] })
              ] })
            ] })
          ] }, value))
        ]
      }
    )
  ] });
}
function ActivityCard({ activity, updates }) {
  const badge = statuses[activity.status];
  return /* @__PURE__ */ jsxs("li", { className: `${card} flex flex-col gap-4 sm:flex-row`, children: [
    activity.url_foto && /* @__PURE__ */ jsx(
      "a",
      {
        href: backendAsset(activity.url_foto),
        target: "_blank",
        rel: "noreferrer",
        className: "shrink-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        children: /* @__PURE__ */ jsx(
          "img",
          {
            src: backendAsset(activity.url_foto),
            alt: `Foto de ${activity.atividade}, enviada por ${activity.aluno}`,
            loading: "lazy",
            className: "h-44 w-full rounded-xl object-cover sm:h-32 sm:w-32"
          }
        )
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 space-y-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "break-words font-bold", children: activity.atividade }),
        /* @__PURE__ */ jsx("span", { className: `rounded-full px-3 py-1 text-xs font-bold ${badge.style}`, children: badge.label })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "break-words text-sm font-semibold", children: [
        activity.aluno,
        " ",
        /* @__PURE__ */ jsxs("span", { className: "font-normal text-muted-foreground", children: [
          "· ",
          types[activity.tipo] ?? activity.tipo
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: updates ? `Avaliado em ${date(activity.revisado_em)}` : `Enviado em ${date(activity.data_envio)}` }),
      /* @__PURE__ */ jsx("p", { className: "whitespace-pre-wrap break-words text-sm", children: activity.descricao }),
      activity.revisado_em && /* @__PURE__ */ jsxs("div", { className: "space-y-1 rounded-xl bg-muted/50 p-3 text-sm", children: [
        /* @__PURE__ */ jsxs("p", { className: "font-semibold", children: [
          activity.status === "approved" ? "Atividade aprovada" : activity.status === "rejected" ? "Atividade rejeitada" : "Atividade avaliada",
          activity.revisor ? ` por ${activity.revisor}` : ""
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: updates ? `Envio original: ${date(activity.data_envio)}` : date(activity.revisado_em) }),
        activity.comentario_professor && /* @__PURE__ */ jsx("p", { className: "whitespace-pre-wrap break-words", children: activity.comentario_professor })
      ] })
    ] })
  ] });
}
function Filter({
  label,
  value,
  onChange,
  options
}) {
  const id = useId();
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold", children: [
    /* @__PURE__ */ jsx("label", { htmlFor: id, children: label }),
    /* @__PURE__ */ jsxs(
      "select",
      {
        id,
        value,
        onChange: (event) => onChange(event.target.value),
        className: "min-w-0 rounded-xl border border-border bg-card px-3 py-2 font-normal",
        children: [
          /* @__PURE__ */ jsx("option", { value: "all", children: "Todos" }),
          options.map((option) => /* @__PURE__ */ jsx("option", { value: option.value, children: option.label }, option.value))
        ]
      }
    )
  ] });
}
function SearchField({
  label,
  value,
  onChange
}) {
  return /* @__PURE__ */ jsxs("label", { className: "flex max-w-lg items-center gap-2 rounded-xl border border-border bg-card px-3 py-2", children: [
    /* @__PURE__ */ jsx(Search, { "aria-hidden": "true", className: "h-4 w-4 shrink-0 text-muted-foreground" }),
    /* @__PURE__ */ jsx("span", { className: "sr-only", children: label }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "search",
        value,
        onChange: (event) => onChange(event.target.value),
        placeholder: label,
        className: "min-w-0 flex-1 bg-transparent text-sm outline-none"
      }
    )
  ] });
}
function SectionHeading({
  title,
  description,
  refresh,
  fetching
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsx("h2", { className: "break-words text-xl font-bold", children: title }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: description })
    ] }),
    /* @__PURE__ */ jsxs("button", { className: button, onClick: refresh, disabled: fetching, children: [
      /* @__PURE__ */ jsx(RefreshCw, { className: `h-4 w-4 ${fetching ? "animate-spin" : ""}` }),
      "Atualizar"
    ] })
  ] });
}
function Loading() {
  return /* @__PURE__ */ jsx("p", { role: "status", className: "p-12 text-center text-muted-foreground", children: "Carregando dados da horta..." });
}
function Empty({ children }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-dashed border-border p-8 text-center", children: [
    /* @__PURE__ */ jsx(Sprout, { className: "mx-auto mb-3 h-8 w-8 text-primary" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children })
  ] });
}
function Failure({ error, retry }) {
  return /* @__PURE__ */ jsxs("div", { className: `${card} space-y-4 text-center`, children: [
    /* @__PURE__ */ jsx("p", { role: "alert", className: "text-destructive", children: error.message }),
    /* @__PURE__ */ jsx("button", { className: button, onClick: retry, children: "Tentar novamente" })
  ] });
}
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();
  return /* @__PURE__ */ jsx(
    DayPicker,
    {
      showOutsideDays,
      className: cn(
        "bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      ),
      captionLayout,
      formatters: {
        formatMonthDropdown: (date2) => date2.toLocaleString("default", { month: "short" }),
        ...formatters
      },
      classNames: {
        root: cn("w-fit", defaultClassNames.root),
        months: cn("relative flex flex-col gap-4 md:flex-row", defaultClassNames.months),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn("bg-popover absolute inset-0 opacity-0", defaultClassNames.dropdown),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label" ? "text-sm" : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn("w-(--cell-size) select-none", defaultClassNames.week_number_header),
        week_number: cn(
          "text-muted-foreground select-none text-[0.8rem]",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
          defaultClassNames.day
        ),
        range_start: cn("bg-accent rounded-l-md", defaultClassNames.range_start),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("bg-accent rounded-r-md", defaultClassNames.range_end),
        today: cn(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames
      },
      components: {
        Root: ({ className: className2, rootRef, ...props2 }) => {
          return /* @__PURE__ */ jsx("div", { "data-slot": "calendar", ref: rootRef, className: cn(className2), ...props2 });
        },
        Chevron: ({ className: className2, orientation, ...props2 }) => {
          if (orientation === "left") {
            return /* @__PURE__ */ jsx(ChevronLeftIcon, { className: cn("size-4", className2), ...props2 });
          }
          if (orientation === "right") {
            return /* @__PURE__ */ jsx(ChevronRightIcon, { className: cn("size-4", className2), ...props2 });
          }
          return /* @__PURE__ */ jsx(ChevronDownIcon, { className: cn("size-4", className2), ...props2 });
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props2 }) => {
          return /* @__PURE__ */ jsx("td", { ...props2, children: /* @__PURE__ */ jsx("div", { className: "flex size-(--cell-size) items-center justify-center text-center", children }) });
        },
        ...components
      },
      ...props
    }
  );
}
function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);
  return /* @__PURE__ */ jsx(
    Button,
    {
      ref,
      variant: "ghost",
      size: "icon",
      "data-day": day.date.toLocaleDateString(),
      "data-selected-single": modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle,
      "data-range-start": modifiers.range_start,
      "data-range-end": modifiers.range_end,
      "data-range-middle": modifiers.range_middle,
      className: cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-(--cell-size) flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      ),
      ...props
    }
  );
}
const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  PopoverPrimitive.Content,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
const triggerClass = "flex min-h-11 w-full items-center justify-between gap-2 rounded-xl border border-input bg-background px-3 py-2.5 text-left text-sm transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20";
function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return void 0;
  const [year, month, day] = value.split("-").map(Number);
  const date2 = new Date(year, month - 1, day);
  return Number.isNaN(date2.getTime()) ? void 0 : date2;
}
function serializeDate(date2) {
  return [
    date2.getFullYear(),
    String(date2.getMonth() + 1).padStart(2, "0"),
    String(date2.getDate()).padStart(2, "0")
  ].join("-");
}
function formatDate(date2) {
  if (!date2) return "Escolha uma data";
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date2);
}
function DatePicker({
  value,
  onChange
}) {
  const [open, setOpen] = useState(false);
  const selected = parseDate(value);
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  return /* @__PURE__ */ jsxs(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs("button", { type: "button", className: triggerClass, "aria-label": "Selecionar data", children: [
      /* @__PURE__ */ jsxs(
        "span",
        {
          className: cn("flex min-w-0 items-center gap-2", !selected && "text-muted-foreground"),
          children: [
            /* @__PURE__ */ jsx(CalendarDays, { className: "h-4 w-4 shrink-0 text-primary", "aria-hidden": "true" }),
            /* @__PURE__ */ jsx("span", { className: "truncate capitalize", children: formatDate(selected) })
          ]
        }
      ),
      /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground", "aria-hidden": "true" })
    ] }) }),
    /* @__PURE__ */ jsxs(PopoverContent, { align: "start", className: "w-auto max-w-[calc(100vw-1.5rem)] rounded-xl p-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "border-b border-border/60 px-4 py-3", children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm font-bold", children: "Escolha a data" }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Selecione o dia da atividade." })
      ] }),
      /* @__PURE__ */ jsx(
        Calendar,
        {
          mode: "single",
          locale: ptBR,
          selected,
          defaultMonth: selected ?? today,
          disabled: { before: today },
          onSelect: (day) => {
            if (!day) return;
            onChange(serializeDate(day));
            setOpen(false);
          },
          className: "[--cell-size:2.75rem]"
        }
      )
    ] })
  ] });
}
const hours = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, "0"));
const minutes = ["00", "15", "30", "45"];
function TimePicker({
  value,
  onChange
}) {
  const [open, setOpen] = useState(false);
  const [selectedHour, selectedMinute] = /^\d{2}:\d{2}$/.test(value) ? value.split(":") : ["", ""];
  const suggestedHour = String(Math.min(23, (/* @__PURE__ */ new Date()).getHours() + 1)).padStart(2, "0");
  function update(hour, minute) {
    onChange(`${hour || suggestedHour}:${minute || "00"}`);
  }
  return /* @__PURE__ */ jsxs(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs("button", { type: "button", className: triggerClass, "aria-label": "Selecionar horário", children: [
      /* @__PURE__ */ jsxs("span", { className: cn("flex items-center gap-2", !value && "text-muted-foreground"), children: [
        /* @__PURE__ */ jsx(Clock3, { className: "h-4 w-4 text-primary", "aria-hidden": "true" }),
        /* @__PURE__ */ jsx("span", { children: value || "Escolha um horário" })
      ] }),
      /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground", "aria-hidden": "true" })
    ] }) }),
    /* @__PURE__ */ jsxs(PopoverContent, { align: "end", className: "w-80 max-w-[calc(100vw-1.5rem)] rounded-xl p-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-border/60 px-4 py-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-bold", children: "Escolha o horário" }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Hora e minutos" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-primary/10 px-3 py-1.5 font-display text-lg font-bold tabular-nums text-primary", children: [
          selectedHour || "--",
          ":",
          selectedMinute || "--"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[minmax(0,1fr)_7rem] gap-3 p-3", children: [
        /* @__PURE__ */ jsxs("fieldset", { children: [
          /* @__PURE__ */ jsx("legend", { className: "mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground", children: "Hora" }),
          /* @__PURE__ */ jsx("div", { className: "grid max-h-52 grid-cols-3 gap-1 overflow-y-auto pr-1", children: hours.map((hour) => /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              "aria-pressed": selectedHour === hour,
              onClick: () => update(hour, selectedMinute),
              className: cn(
                "min-h-11 rounded-lg text-sm font-semibold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selectedHour === hour ? "bg-primary text-primary-foreground" : "bg-muted/60 text-foreground hover:bg-accent"
              ),
              children: hour
            },
            hour
          )) })
        ] }),
        /* @__PURE__ */ jsxs("fieldset", { children: [
          /* @__PURE__ */ jsx("legend", { className: "mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground", children: "Minutos" }),
          /* @__PURE__ */ jsx("div", { className: "grid gap-1", children: minutes.map((minute) => /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              "aria-pressed": selectedMinute === minute,
              onClick: () => update(selectedHour, minute),
              className: cn(
                "min-h-11 rounded-lg text-sm font-semibold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selectedMinute === minute ? "bg-primary text-primary-foreground" : "bg-muted/60 text-foreground hover:bg-accent"
              ),
              children: [
                ":",
                minute
              ]
            },
            minute
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-end border-t border-border/60 p-3", children: /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          disabled: !value,
          onClick: () => setOpen(false),
          className: "inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50",
          children: [
            /* @__PURE__ */ jsx(Check, { className: "h-4 w-4", "aria-hidden": "true" }),
            " Concluir"
          ]
        }
      ) })
    ] })
  ] });
}
const missionStatuses = {
  disponivel: {
    label: "Disponível",
    className: "bg-success/15 text-success"
  },
  agendada: {
    label: "Agendada",
    className: "bg-primary/15 text-primary"
  },
  em_analise: {
    label: "Em análise",
    className: "bg-warning/15 text-foreground"
  },
  concluida: {
    label: "Concluída",
    className: "bg-muted text-muted-foreground"
  }
};
const plantingStatuses = {
  pending: {
    label: "Em análise",
    className: "bg-warning/15 text-foreground"
  },
  approved: {
    label: "Aprovado",
    className: "bg-success/15 text-success"
  },
  rejected: {
    label: "Rejeitado",
    className: "bg-destructive/10 text-destructive"
  }
};
function plantingTimestamp(value) {
  if (!value) return 0;
  const timestamp = new Date(value.replace(" ", "T")).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}
function formatPlantingDate(value) {
  const timestamp = plantingTimestamp(value);
  if (!timestamp) return "Data não informada";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short"
  }).format(timestamp);
}
function Card({
  children,
  className = ""
}) {
  return /* @__PURE__ */ jsx(motion.div, { initial: {
    opacity: 0,
    y: 14
  }, whileInView: {
    opacity: 1,
    y: 0
  }, viewport: {
    once: true,
    margin: "-40px"
  }, className: `rounded-lg border border-border/60 bg-card p-5 shadow-soft ${className}`, children });
}
function GardenPage() {
  const {
    data: user,
    isPending,
    error
  } = useQuery(userQuery());
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  if (isPending) return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsx("p", { role: "status", className: "p-16 text-center text-muted-foreground", children: "Carregando seu jardim..." }) });
  if (error || !user) return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-4 p-16 text-center", children: [
    /* @__PURE__ */ jsx("p", { role: "alert", children: error?.message ?? "Faça login para continuar" }),
    /* @__PURE__ */ jsx(Link, { to: "/login", className: "font-semibold text-primary underline", children: "Entrar na minha conta" })
  ] }) });
  if (user.perfil_nome !== "aluno") return /* @__PURE__ */ jsx(StaffGarden, { user, schoolId: search.escola, classId: search.turma, onNavigate: (next) => void navigate({
    search: next
  }) }, `${user.id}-${user.perfil_nome}-${user.instituicao_id}`);
  return /* @__PURE__ */ jsx(StudentGardenPage, {});
}
function StudentGardenPage() {
  const [proof, setProof] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [participationMode, setParticipationMode] = useState("aberto");
  const [inviteStudent, setInviteStudent] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [rankingType, setRankingType] = useState("individual");
  const queryClient = useQueryClient();
  const {
    data: user,
    isLoading: loadingUser,
    error: userError
  } = useQuery(userQuery());
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ["jardim"],
    enabled: isBrowser,
    retry: false,
    queryFn: async () => {
      const [garden, moduleResult, history, missionResult] = await Promise.all([apiFetch("/jardim/resumo"), apiFetch("/modulos"), apiFetch("/historico"), apiFetch("/missoes")]);
      return {
        garden,
        modules: moduleResult.modulos,
        history,
        missions: missionResult.missoes
      };
    }
  });
  const {
    data: classmates = []
  } = useQuery({
    queryKey: ["mission-classmates", selectedTask?.id, selectedTask?.grupo_id],
    enabled: isBrowser && !!selectedTask && selectedTask.max_alunos > 1 && selectedTask.modo_participacao === "particular" && !!selectedTask.grupo_id,
    queryFn: async () => (await apiFetch(`/missoes/${selectedTask.id}/alunos?grupo_id=${selectedTask.grupo_id}`)).alunos
  });
  const {
    data: rankingResult,
    isLoading: rankingLoading,
    error: rankingError
  } = useQuery({
    queryKey: ["ranking", rankingType],
    enabled: isBrowser,
    queryFn: () => apiFetch(`/ranking?tipo=${rankingType}`),
    retry: false
  });
  if (loadingUser || isLoading || rankingLoading) return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsx("div", { className: "p-16 text-center text-muted-foreground", children: "Cultivando seus dados..." }) });
  if (userError || error || rankingError || !user || !data || !rankingResult) return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsx("div", { className: "p-16 text-center text-destructive", children: userError?.message ?? error?.message ?? rankingError?.message ?? "Faça login para continuar" }) });
  const acceptTask = async (taskId) => {
    if (!taskDate || !taskTime) return toast.error("Escolha a data e o horário do seu turno");
    try {
      const solo = selectedTask?.max_alunos === 1;
      const result = await apiFetch(`/missoes/${taskId}/aceitar`, {
        method: "POST",
        // Missão individual não tem escolha de quem participa.
        body: JSON.stringify({
          data_hora: `${taskDate} ${taskTime}:00`,
          ...solo ? {} : {
            modo_participacao: participationMode
          }
        })
      });
      toast.success(result.mensagem);
      setTaskDate("");
      setTaskTime("");
      setSelectedTask(null);
      await queryClient.invalidateQueries({
        queryKey: ["jardim"]
      });
      await queryClient.invalidateQueries({
        queryKey: ["agenda"]
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível aceitar a missão");
    }
  };
  const taskAction = async (path, body, successMessage) => {
    if (!selectedTask) return;
    try {
      const result = await apiFetch(path, {
        method: "POST",
        body: JSON.stringify(body)
      });
      toast.success(successMessage ?? result.mensagem);
      setSelectedTask(null);
      await queryClient.invalidateQueries({
        queryKey: ["jardim"]
      });
      await queryClient.invalidateQueries({
        queryKey: ["agenda"]
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível atualizar a missão");
    }
  };
  const modules = data.modules.map((m) => ({
    id: m.id,
    title: m.titulo,
    progress: m.progresso
  }));
  const ranking = rankingResult.ranking.map((r) => ({
    pos: r.posicao,
    name: rankingType === "escola" ? r.instituicao_nome ?? "Escola" : r.nome ?? "Sem nome",
    points: Number(r.pontos),
    you: rankingType === "individual" ? r.id === user.id : rankingType === "turma" ? r.turma_id === user.turma_id : r.instituicao_id === user.instituicao_id
  }));
  const growthData = data.garden.crescimento.length ? data.garden.crescimento.map((r) => ({
    month: r.mes.slice(5),
    value: Number(r.valor)
  })) : [{
    month: "Agora",
    value: user.pontos_totais
  }];
  const recentPlantings = [...data.history.envios].sort((a, b) => plantingTimestamp(b.data_envio) - plantingTimestamp(a.data_envio)).slice(0, 3);
  const achievements = data.garden.conquistas.map((a) => ({
    id: a.id,
    title: a.titulo,
    description: a.descricao,
    earned: Boolean(a.conquistada)
  }));
  return /* @__PURE__ */ jsxs(PageShell, { children: [
    /* @__PURE__ */ jsxs("div", { className: "app-page space-y-6", children: [
      /* @__PURE__ */ jsx(motion.section, { initial: {
        opacity: 0,
        y: 12
      }, animate: {
        opacity: 1,
        y: 0
      }, className: "overflow-hidden rounded-xl bg-gradient-hero p-6 text-primary-foreground shadow-soft sm:p-8", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-[1fr_1.4fr]", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-[11px] font-bold uppercase tracking-wide text-white/70", children: "Meu Painel do Jardim" }),
          /* @__PURE__ */ jsxs("h1", { className: "mt-1 text-2xl font-bold sm:text-3xl", children: [
            "Bem-vinda de volta, ",
            user.nome.split(" ")[0],
            "!"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 rounded-lg border border-white/20 bg-white/10 p-5 backdrop-blur-sm", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[11px] font-bold uppercase tracking-wide text-white/70", children: "Pontos Totais" }),
            /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-end justify-between", children: [
              /* @__PURE__ */ jsx("div", { className: "text-4xl font-bold tracking-tight sm:text-5xl", children: Number(user.pontos_totais).toLocaleString("pt-BR") }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-sm font-bold text-success-foreground", children: [
                /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4" }),
                " +60%"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold text-white/80", children: "Crescimento nos últimos 5 meses" }),
          /* @__PURE__ */ jsx("div", { className: "mt-2 h-48", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(AreaChart, { data: growthData, margin: {
            top: 6,
            right: 6,
            bottom: 0,
            left: -20
          }, children: [
            /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "gGreen", x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "var(--color-primary-foreground)", stopOpacity: 0.55 }),
              /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "var(--color-primary-foreground)", stopOpacity: 0.05 })
            ] }) }),
            /* @__PURE__ */ jsx(XAxis, { dataKey: "month", stroke: "rgba(255,255,255,.6)", fontSize: 11, axisLine: false, tickLine: false }),
            /* @__PURE__ */ jsx(YAxis, { stroke: "rgba(255,255,255,.5)", fontSize: 10, axisLine: false, tickLine: false }),
            /* @__PURE__ */ jsx(Tooltip, { contentStyle: {
              background: "rgba(0,0,0,.7)",
              border: "none",
              borderRadius: 12,
              color: "white"
            } }),
            /* @__PURE__ */ jsx(Area, { type: "monotone", dataKey: "value", stroke: "var(--color-primary-foreground)", strokeWidth: 2.5, fill: "url(#gGreen)" })
          ] }) }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm font-bold uppercase tracking-wide text-foreground", children: "Meu Caminho de Aprendizado" }),
          /* @__PURE__ */ jsx("ul", { className: "mt-4 space-y-3", children: modules.slice(0, 6).map((m, i) => {
            const done = m.progress === 100;
            const inProg = m.progress > 0 && m.progress < 100;
            const locked = m.progress === 0 && i > 2;
            return /* @__PURE__ */ jsxs(motion.li, { initial: {
              opacity: 0,
              x: -8
            }, whileInView: {
              opacity: 1,
              x: 0
            }, viewport: {
              once: true
            }, transition: {
              delay: i * 0.04
            }, className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: `grid h-12 w-12 shrink-0 place-items-center rounded-full text-white shadow-soft ${done ? "bg-success" : inProg ? "bg-primary" : locked ? "bg-muted text-muted-foreground" : "bg-warning text-warning-foreground"}`, children: done ? /* @__PURE__ */ jsx(Check, { className: "h-5 w-5", strokeWidth: 3 }) : locked ? /* @__PURE__ */ jsx(Lock, { className: "h-4 w-4" }) : inProg ? /* @__PURE__ */ jsx(Play, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Trophy, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 rounded-xl border border-border/60 bg-background/60 px-4 py-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "truncate text-sm font-bold uppercase tracking-wide text-foreground", children: m.title }),
                  /* @__PURE__ */ jsx("span", { className: `shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${done ? "bg-success/15 text-success" : inProg ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`, children: done ? "Completo" : inProg ? "Continuar" : locked ? "Bloqueado" : "Disponível" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "h-1.5 flex-1 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsx(motion.div, { initial: {
                    width: 0
                  }, whileInView: {
                    width: `${m.progress}%`
                  }, viewport: {
                    once: true
                  }, transition: {
                    duration: 0.8
                  }, className: "h-full bg-success" }) }),
                  /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-muted-foreground", children: [
                    m.progress,
                    "%"
                  ] })
                ] })
              ] })
            ] }, m.id);
          }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "flex flex-col", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-sm font-bold uppercase tracking-wide text-foreground", children: "Últimas missões" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Acompanhe os envios mais recentes da sua equipe." })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-success/15 text-success", children: /* @__PURE__ */ jsx(Sprout, { className: "h-5 w-5", "aria-hidden": "true" }) })
          ] }),
          recentPlantings.length ? /* @__PURE__ */ jsx("ul", { className: "mt-4 space-y-3", children: recentPlantings.map((planting, index) => {
            const status = plantingStatuses[planting.status];
            return /* @__PURE__ */ jsxs(motion.li, { initial: {
              opacity: 0,
              y: 8
            }, whileInView: {
              opacity: 1,
              y: 0
            }, viewport: {
              once: true
            }, transition: {
              delay: index * 0.04
            }, className: "flex min-w-0 gap-3 rounded-lg border border-border/60 bg-background/60 p-3", children: [
              planting.url_foto ? /* @__PURE__ */ jsx("img", { src: backendAsset(planting.url_foto), alt: `Comprovação: ${planting.titulo}`, loading: "lazy", className: "h-20 w-20 shrink-0 rounded-xl object-cover sm:h-24 sm:w-24" }) : /* @__PURE__ */ jsx("div", { className: "grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-secondary text-primary sm:h-24 sm:w-24", children: /* @__PURE__ */ jsx(Sprout, { className: "h-7 w-7", "aria-hidden": "true" }) }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 py-0.5", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-2", children: [
                  /* @__PURE__ */ jsx("h3", { className: "min-w-0 break-words text-sm font-bold text-foreground", children: planting.titulo }),
                  /* @__PURE__ */ jsx("span", { className: `shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${status.className}`, children: status.label })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground", children: planting.descricao || "Comprovação enviada para avaliação." }),
                /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground", children: [
                  /* @__PURE__ */ jsx(CalendarDays, { className: "h-3.5 w-3.5", "aria-hidden": "true" }),
                  formatPlantingDate(planting.data_envio)
                ] })
              ] })
            ] }, planting.id);
          }) }) : /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-background/40 px-5 py-8 text-center", children: [
            /* @__PURE__ */ jsx(Sprout, { className: "h-8 w-8 text-primary", "aria-hidden": "true" }),
            /* @__PURE__ */ jsx("p", { className: "mt-3 font-bold text-foreground", children: "Seu jardim está pronto para crescer" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 max-w-sm text-sm text-muted-foreground", children: "Suas comprovações de missão aparecerão aqui depois do primeiro envio." })
          ] }),
          /* @__PURE__ */ jsxs(Link, { to: "/historico", className: "mt-4 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", children: [
            "Ver histórico completo",
            /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4", "aria-hidden": "true" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-[1fr_1.3fr]", children: [
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm font-bold uppercase tracking-wide text-foreground", children: "Missões da turma" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Pegue uma missão, escolha o seu turno e envie a comprovação para ganhar pontos." }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 grid gap-3", children: data.missions.length ? data.missions.map((mission) => {
            const badge = missionStatuses[mission.status];
            return /* @__PURE__ */ jsxs("button", { onClick: () => {
              setSelectedTask(mission);
              setTaskDate("");
              setTaskTime("");
              setInviteStudent("");
              setParticipationMode("aberto");
            }, className: "flex gap-3 rounded-lg border border-border/60 bg-background/60 p-3 text-left transition hover:border-primary/40 hover:bg-primary/5", children: [
              mission.imagem ? /* @__PURE__ */ jsx("img", { src: backendAsset(mission.imagem), alt: "", loading: "lazy", className: "h-16 w-16 shrink-0 rounded-lg object-cover" }) : /* @__PURE__ */ jsx("div", { className: "grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-secondary text-primary", children: /* @__PURE__ */ jsx(Rocket, { className: "h-6 w-6", "aria-hidden": "true" }) }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
                  /* @__PURE__ */ jsx("span", { className: "truncate font-bold", children: mission.titulo }),
                  /* @__PURE__ */ jsx("span", { className: `shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${badge.className}`, children: badge.label })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs font-semibold text-muted-foreground", children: [
                  "+",
                  mission.pontos,
                  " pts · ",
                  missionTypes[mission.tipo].label
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "mt-0.5 text-xs text-muted-foreground", children: [
                  mission.max_alunos > 1 ? `${mission.participantes}/${mission.max_alunos} alunos` : "Individual",
                  " ",
                  "· ",
                  mission.horario ? `Turno ${new Date(mission.horario.replace(" ", "T")).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short"
                  })}` : "Escolha um turno"
                ] })
              ] })
            ] }, mission.id);
          }) : /* @__PURE__ */ jsx("p", { className: "rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground", children: "Nenhuma missão disponível no momento." }) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-5", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold text-muted-foreground", children: "Sequência diária" }),
            /* @__PURE__ */ jsx("div", { className: "mt-2 flex items-center gap-1.5", children: Array.from({
              length: 14
            }).map((_, i) => /* @__PURE__ */ jsx(motion.div, { initial: {
              scale: 0.6,
              opacity: 0
            }, whileInView: {
              scale: 1,
              opacity: 1
            }, viewport: {
              once: true
            }, transition: {
              delay: i * 0.03
            }, className: `h-7 flex-1 rounded-md ${i < user.streak_dias ? "bg-gradient-to-b from-destructive to-warning" : "bg-muted"}` }, i)) }),
            /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-1.5 text-xs font-bold text-destructive", children: [
              /* @__PURE__ */ jsx(Flame, { className: "h-4 w-4" }),
              " ",
              user.streak_dias,
              " dias seguidos"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm font-bold uppercase tracking-wide text-foreground", children: "Ranking" }),
          /* @__PURE__ */ jsx("div", { className: "mt-3 inline-flex rounded-full border border-border bg-background p-1 text-xs font-semibold", children: [["individual", "Individual"], ["turma", "Turmas da escola"], ["escola", "Escolas"]].map(([value, label]) => /* @__PURE__ */ jsx("button", { onClick: () => setRankingType(value), className: `rounded-full px-4 py-1.5 ${rankingType === value ? "bg-success text-success-foreground" : "text-muted-foreground"}`, children: label }, value)) }),
          /* @__PURE__ */ jsx("ul", { className: "mt-4 space-y-2", children: ranking.map((r) => /* @__PURE__ */ jsxs(motion.li, { initial: {
            opacity: 0,
            x: -8
          }, whileInView: {
            opacity: 1,
            x: 0
          }, viewport: {
            once: true
          }, transition: {
            delay: r.pos * 0.04
          }, className: `flex items-center gap-3 rounded-lg border px-4 py-3 ${r.you ? "border-success/40 bg-success/10" : "border-border/60 bg-background/60"}`, children: [
            /* @__PURE__ */ jsx("div", { className: `grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold text-white ${r.pos === 1 ? "bg-warning" : r.pos === 2 ? "bg-muted-foreground" : r.pos === 3 ? "bg-[oklch(0.55_0.15_60)]" : "bg-primary"}`, children: r.pos }),
            /* @__PURE__ */ jsx("div", { className: "flex-1 truncate text-sm font-bold text-foreground", children: r.name }),
            /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsx("div", { className: "text-sm font-bold text-foreground", children: r.points.toLocaleString("pt-BR") }),
              /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Pontos" })
            ] })
          ] }, r.pos)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm font-bold uppercase tracking-wide text-foreground", children: "Conquistas" }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-muted-foreground", children: [
            achievements.filter((a) => a.earned).length,
            "/",
            achievements.length
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6", children: achievements.map((a, i) => /* @__PURE__ */ jsxs(motion.div, { initial: {
          opacity: 0,
          scale: 0.9
        }, whileInView: {
          opacity: 1,
          scale: 1
        }, viewport: {
          once: true
        }, transition: {
          delay: i * 0.05
        }, whileHover: {
          y: -1
        }, className: `flex flex-col items-center gap-2 rounded-lg border p-4 text-center ${a.earned ? "border-success/40 bg-success/10" : "border-border/60 bg-muted/40 opacity-60"}`, children: [
          /* @__PURE__ */ jsx("div", { className: `grid h-12 w-12 place-items-center rounded-full ${a.earned ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`, children: /* @__PURE__ */ jsx(Medal, { className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsx("div", { className: "text-xs font-bold text-foreground", children: a.title }),
          /* @__PURE__ */ jsx("div", { className: "text-[10px] text-muted-foreground", children: a.description })
        ] }, a.id)) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(SubmitProofModal, { mission: proof, onOpenChange: (v) => !v && setProof(null), onSubmitted: () => {
      void queryClient.invalidateQueries({
        queryKey: ["historico"]
      });
      void queryClient.invalidateQueries({
        queryKey: ["jardim"]
      });
      void queryClient.invalidateQueries({
        queryKey: ["agenda"]
      });
      void queryClient.invalidateQueries({
        queryKey: ["perfil"]
      });
    } }),
    /* @__PURE__ */ jsx(Dialog, { open: !!selectedTask, onOpenChange: (open) => !open && setSelectedTask(null), children: /* @__PURE__ */ jsx(DialogContent, { className: "max-h-[calc(100dvh-1.5rem)] max-w-lg overflow-y-auto rounded-xl border-border/60 p-0", children: selectedTask && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "bg-gradient-hero p-6 text-primary-foreground", children: /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: selectedTask.titulo }),
        /* @__PURE__ */ jsxs(DialogDescription, { className: "text-white/80", children: [
          "Missão publicada por ",
          selectedTask.professor
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 p-6", children: [
        selectedTask.imagem && /* @__PURE__ */ jsx("img", { src: backendAsset(selectedTask.imagem), alt: "", className: "max-h-48 w-full rounded-lg object-cover" }),
        /* @__PURE__ */ jsx("p", { className: "whitespace-pre-wrap text-sm text-muted-foreground", children: selectedTask.descricao || "Sem instruções adicionais." }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 text-center text-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-muted p-3", children: [
            /* @__PURE__ */ jsx("strong", { children: selectedTask.pontos }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "pontos" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-muted p-3", children: [
            /* @__PURE__ */ jsx("strong", { children: selectedTask.max_alunos > 1 ? `${selectedTask.participantes}/${selectedTask.max_alunos}` : "1" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: selectedTask.max_alunos > 1 ? "participantes" : "aluno (individual)" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-muted p-3", children: [
            /* @__PURE__ */ jsx("strong", { children: missionTypes[selectedTask.tipo].label }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "tipo" })
          ] })
        ] }),
        selectedTask.horario ? /* @__PURE__ */ jsxs("p", { className: "rounded-lg border p-3 text-sm", children: [
          "Turno escolhido:",
          " ",
          /* @__PURE__ */ jsx("strong", { children: new Date(selectedTask.horario.replace(" ", "T")).toLocaleString("pt-BR") }),
          selectedTask.max_alunos > 1 && ` · ${selectedTask.modo_participacao === "aberto" ? "participação aberta" : "somente por convite"}`
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxs("label", { className: "text-xs", children: [
              "Data",
              /* @__PURE__ */ jsx(DatePicker, { value: taskDate, onChange: setTaskDate })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "text-xs", children: [
              "Horário",
              /* @__PURE__ */ jsx(TimePicker, { value: taskTime, onChange: setTaskTime })
            ] })
          ] }),
          selectedTask.max_alunos > 1 && /* @__PURE__ */ jsxs("fieldset", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("legend", { className: "text-xs font-bold", children: "Quem pode participar?" }),
            /* @__PURE__ */ jsxs("label", { className: "flex gap-2 text-sm", children: [
              /* @__PURE__ */ jsx("input", { type: "radio", checked: participationMode === "aberto", onChange: () => setParticipationMode("aberto") }),
              "Qualquer colega da turma"
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "flex gap-2 text-sm", children: [
              /* @__PURE__ */ jsx("input", { type: "radio", checked: participationMode === "particular", onChange: () => setParticipationMode("particular") }),
              "Somente colegas que eu convidar"
            ] })
          ] })
        ] }),
        selectedTask.envio_status && /* @__PURE__ */ jsxs("p", { className: "rounded-lg border p-3 text-sm", children: [
          "Comprovação:",
          " ",
          /* @__PURE__ */ jsx("strong", { children: selectedTask.envio_status === "pending" ? "em análise pelo professor" : selectedTask.envio_status === "approved" ? "aprovada" : "rejeitada" }),
          selectedTask.envio_comentario && ` — ${selectedTask.envio_comentario}`
        ] }),
        /* @__PURE__ */ jsx(DialogFooter, { className: "flex-wrap gap-2", children: !selectedTask.horario ? /* @__PURE__ */ jsx("button", { onClick: () => void acceptTask(selectedTask.id), className: "min-h-10 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground", children: "Reservar meu turno" }) : selectedTask.max_alunos > 1 && selectedTask.convite_id ? /* @__PURE__ */ jsx("button", { onClick: () => void taskAction(`/convites-missao/${selectedTask.convite_id}/responder`, {
          aceitar: true
        }), className: "min-h-10 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground", children: "Aceitar convite" }) : selectedTask.participando && selectedTask.envio_status !== "pending" && selectedTask.envio_status !== "approved" ? /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col gap-2", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => {
            setProof({
              id: selectedTask.id,
              titulo: selectedTask.titulo,
              pontos: selectedTask.pontos,
              equipe: selectedTask.max_alunos > 1
            });
            setSelectedTask(null);
          }, className: "min-h-10 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground", children: selectedTask.envio_status === "rejected" ? "Reenviar comprovação" : "Enviar comprovação" }),
          selectedTask.max_alunos > 1 && selectedTask.modo_participacao === "particular" && /* @__PURE__ */ jsxs("div", { className: "flex w-full gap-2", children: [
            /* @__PURE__ */ jsxs("select", { value: inviteStudent, onChange: (e) => setInviteStudent(e.target.value), className: "min-h-10 flex-1 rounded-lg border bg-background px-3", children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Convidar aluno..." }),
              classmates.map((a) => /* @__PURE__ */ jsx("option", { value: a.id, children: a.nome }, a.id))
            ] }),
            /* @__PURE__ */ jsx("button", { disabled: !inviteStudent, onClick: () => void taskAction(`/missoes/${selectedTask.id}/convidar`, {
              grupo_id: selectedTask.grupo_id,
              aluno_id: Number(inviteStudent)
            }), className: "min-h-10 rounded-lg border px-4 text-sm font-bold disabled:opacity-50", children: "Convidar" })
          ] })
        ] }) : selectedTask.max_alunos > 1 && selectedTask.modo_participacao === "aberto" && !selectedTask.participando && selectedTask.status === "agendada" ? /* @__PURE__ */ jsx("button", { onClick: () => void taskAction(`/missoes/${selectedTask.id}/entrar`, {
          grupo_id: selectedTask.grupo_id
        }), className: "min-h-10 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground", children: "Participar deste turno" }) : /* @__PURE__ */ jsx("button", { onClick: () => setSelectedTask(null), className: "min-h-10 rounded-lg border px-4 text-sm", children: "Fechar" }) })
      ] })
    ] }) }) })
  ] });
}
export {
  GardenPage as component
};
