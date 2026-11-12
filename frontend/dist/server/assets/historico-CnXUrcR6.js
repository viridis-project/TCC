import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { History, Sprout, Gift } from "lucide-react";
import { u as userQuery, h as isBrowser, a as apiFetch, P as PageShell, c as backendAsset } from "./router-_glEtDMC.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-s4MmrSK0.js";
import "sonner";
import "motion/react";
import "recharts";
import "@radix-ui/react-dialog";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-tabs";
const statuses = {
  pending: {
    label: "Em análise",
    style: "bg-warning/15 text-foreground"
  },
  approved: {
    label: "Aprovado",
    style: "bg-success/15 text-success"
  },
  rejected: {
    label: "Rejeitado",
    style: "bg-destructive/10 text-destructive"
  }
};
const buttonStyle = "inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed";
function formatDate(value) {
  if (!value) return "Data não informada";
  const date = new Date(value.replace(" ", "T"));
  return Number.isNaN(date.getTime()) ? "Data não informada" : date.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  });
}
function HistoryPage() {
  const user = useQuery(userQuery());
  const history = useQuery({
    queryKey: ["historico", user.data?.id],
    enabled: isBrowser && !!user.data && !user.isError,
    retry: false,
    queryFn: () => apiFetch("/historico")
  });
  const [status, setStatus] = useState("all");
  const [plantPage, setPlantPage] = useState(1);
  const [rewardPage, setRewardPage] = useState(1);
  if (user.isError || isBrowser && !user.isPending && !user.data) {
    return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-lg space-y-4 px-4 py-16 text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Meu histórico" }),
      /* @__PURE__ */ jsx("p", { role: "alert", children: user.error?.message ?? "Faça login para consultar seu histórico." }),
      /* @__PURE__ */ jsx(Link, { to: "/login", className: buttonStyle, children: "Entrar na minha conta" })
    ] }) });
  }
  if (user.isPending || history.isPending) {
    return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsx("p", { role: "status", className: "p-16 text-center text-muted-foreground", children: "Carregando seu histórico..." }) });
  }
  if (history.isError) {
    return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-4 p-16 text-center", children: [
      /* @__PURE__ */ jsx("p", { role: "alert", className: "text-destructive", children: history.error.message }),
      /* @__PURE__ */ jsx("button", { className: buttonStyle, onClick: () => void history.refetch(), children: "Tentar novamente" })
    ] }) });
  }
  const {
    envios: plantios,
    recompensas
  } = history.data;
  const filtered = plantios.filter((plant) => status === "all" || plant.status === status);
  const spent = recompensas.reduce((total, reward) => total + Number(reward.pontos_debitados), 0);
  return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsxs("div", { className: "app-page space-y-6", children: [
    /* @__PURE__ */ jsxs("section", { className: "rounded-xl bg-gradient-hero p-6 text-primary-foreground shadow-soft sm:p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white/70", children: [
        /* @__PURE__ */ jsx(History, { className: "h-4 w-4" }),
        " Sua trajetória no Viridis"
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "mt-2 text-3xl font-bold", children: "Meu histórico" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-white/80", children: "Acompanhe suas missões e as recompensas que você já resgatou." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-3 sm:grid-cols-3", children: [{
      label: "Missões enviadas",
      value: plantios.length,
      icon: Sprout
    }, {
      label: "Recompensas resgatadas",
      value: recompensas.length,
      icon: Gift
    }, {
      label: "Pontos utilizados",
      value: spent,
      icon: History
    }].map(({
      label,
      value,
      icon: Icon
    }) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 rounded-lg border border-border/60 bg-card p-5 shadow-soft", children: [
      /* @__PURE__ */ jsx(Icon, { className: "h-6 w-6 shrink-0 text-primary" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", children: value.toLocaleString("pt-BR") }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: label })
      ] })
    ] }, label)) }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "plantios", className: "space-y-5", children: [
      /* @__PURE__ */ jsxs(TabsList, { className: "grid h-auto w-full grid-cols-2 sm:w-96", children: [
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "plantios", className: "gap-2 py-3", children: [
          /* @__PURE__ */ jsx(Sprout, { className: "h-4 w-4" }),
          " Missões"
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "recompensas", className: "gap-2 py-3", children: [
          /* @__PURE__ */ jsx(Gift, { className: "h-4 w-4" }),
          " Recompensas"
        ] })
      ] }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "plantios", className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold", children: "Histórico de missões" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Do mais recente ao mais antigo." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "plant-status", className: "text-sm font-semibold", children: "Status" }),
            /* @__PURE__ */ jsxs("select", { id: "plant-status", value: status, onChange: (event) => {
              setStatus(event.target.value);
              setPlantPage(1);
            }, className: "rounded-xl border border-border bg-card px-3 py-2 text-sm", children: [
              /* @__PURE__ */ jsx("option", { value: "all", children: "Todos" }),
              Object.entries(statuses).map(([value, item]) => /* @__PURE__ */ jsx("option", { value, children: item.label }, value))
            ] })
          ] })
        ] }),
        filtered.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-dashed border-border p-8 text-center", children: [
          /* @__PURE__ */ jsx(Sprout, { className: "mx-auto mb-3 h-8 w-8 text-primary" }),
          /* @__PURE__ */ jsx("p", { className: "font-semibold", children: plantios.length ? "Nenhuma missão com esse status." : "Você ainda não enviou comprovações de missões." }),
          /* @__PURE__ */ jsx(Link, { to: "/jardim", className: `${buttonStyle} mt-4`, children: "Ir para meu jardim" })
        ] }) : /* @__PURE__ */ jsx("ul", { className: "space-y-4", children: filtered.slice((plantPage - 1) * 10, plantPage * 10).map((plant) => /* @__PURE__ */ jsx("li", { className: "overflow-hidden rounded-lg border border-border/60 bg-card p-5 shadow-soft", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:flex-row", children: [
          plant.url_foto && /* @__PURE__ */ jsx("img", { src: backendAsset(plant.url_foto), alt: `Comprovação: ${plant.titulo}`, loading: "lazy", className: "h-40 w-full rounded-xl object-cover sm:h-28 sm:w-28" }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsx("h3", { className: "break-words font-bold", children: plant.titulo }),
              /* @__PURE__ */ jsx("span", { className: `rounded-full px-3 py-1 text-xs font-bold ${statuses[plant.status].style}`, children: statuses[plant.status].label })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Enviado em ",
              formatDate(plant.data_envio)
            ] }),
            plant.equipe && plant.equipe.includes(",") && /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Equipe: ",
              plant.equipe
            ] }),
            /* @__PURE__ */ jsx("p", { className: "whitespace-pre-wrap break-words text-sm", children: plant.descricao }),
            plant.status === "pending" && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Aguardando avaliação do professor." }),
            plant.revisado_em && /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Avaliado em ",
              formatDate(plant.revisado_em)
            ] }),
            plant.comentario_professor && /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-muted/50 p-3 text-sm", children: [
              /* @__PURE__ */ jsx("p", { className: "mb-1 font-semibold", children: "Comentário do professor" }),
              /* @__PURE__ */ jsx("p", { className: "whitespace-pre-wrap break-words", children: plant.comentario_professor })
            ] })
          ] })
        ] }) }, plant.id)) }),
        /* @__PURE__ */ jsx(Pagination, { page: plantPage, count: filtered.length, onChange: setPlantPage })
      ] }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "recompensas", className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold", children: "Histórico de recompensas" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Seus resgates confirmados, do mais recente ao mais antigo." })
        ] }),
        recompensas.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-dashed border-border p-8 text-center", children: [
          /* @__PURE__ */ jsx(Gift, { className: "mx-auto mb-3 h-8 w-8 text-primary" }),
          /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Você ainda não resgatou recompensas." }),
          /* @__PURE__ */ jsx(Link, { to: "/recompensas", className: `${buttonStyle} mt-4`, children: "Ver recompensas" })
        ] }) : /* @__PURE__ */ jsx("ul", { className: "space-y-4", children: recompensas.slice((rewardPage - 1) * 10, rewardPage * 10).map((reward) => /* @__PURE__ */ jsxs("li", { className: "flex flex-wrap items-center gap-4 rounded-lg border border-border/60 bg-card p-5 shadow-soft", children: [
          /* @__PURE__ */ jsx("div", { className: "grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(Gift, { className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx("h3", { className: "break-words font-bold", children: reward.titulo ?? "Recompensa indisponível" }),
            /* @__PURE__ */ jsx("p", { className: "break-words text-sm text-muted-foreground", children: reward.parceiro ?? "Parceiro não informado" }),
            /* @__PURE__ */ jsxs("p", { className: "mt-2 text-xs text-muted-foreground", children: [
              "Resgatada em ",
              formatDate(reward.criado_em),
              " · Resgate #",
              reward.id
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-sm font-bold text-primary", children: [
            Number(reward.pontos_debitados).toLocaleString("pt-BR"),
            " pontos utilizados"
          ] })
        ] }, reward.id)) }),
        /* @__PURE__ */ jsx(Pagination, { page: rewardPage, count: recompensas.length, onChange: setRewardPage })
      ] })
    ] })
  ] }) });
}
function Pagination({
  page,
  count,
  onChange
}) {
  const pages = Math.ceil(count / 10);
  if (pages <= 1) return null;
  return /* @__PURE__ */ jsxs("nav", { "aria-label": "Paginação do histórico", className: "flex flex-wrap items-center justify-center gap-3", children: [
    /* @__PURE__ */ jsx("button", { className: buttonStyle, disabled: page === 1, onClick: () => onChange(page - 1), children: "Anterior" }),
    /* @__PURE__ */ jsxs("span", { "aria-live": "polite", className: "text-sm text-muted-foreground", children: [
      "Página ",
      page,
      " de ",
      pages
    ] }),
    /* @__PURE__ */ jsx("button", { className: buttonStyle, disabled: page >= pages, onClick: () => onChange(page + 1), children: "Próxima" })
  ] });
}
export {
  HistoryPage as component
};
