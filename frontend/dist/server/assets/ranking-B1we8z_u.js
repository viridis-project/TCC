import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Trophy, Users } from "lucide-react";
import { u as userQuery, P as PageShell, h as isBrowser, a as apiFetch } from "./router-_glEtDMC.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-s4MmrSK0.js";
import "@tanstack/react-router";
import "sonner";
import "react";
import "recharts";
import "@radix-ui/react-dialog";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-tabs";
const TABS = [{
  value: "individual",
  label: "Individual"
}, {
  value: "turma",
  label: "Turmas da escola"
}, {
  value: "escola",
  label: "Escolas"
}];
const SCOPE_LABEL = {
  individual: "alunos",
  turma: "turmas",
  escola: "escolas"
};
function useRanking(rankingType) {
  return useQuery({
    queryKey: ["ranking-completo", rankingType],
    enabled: isBrowser,
    retry: false,
    queryFn: () => apiFetch(`/ranking?tipo=${rankingType}`)
  });
}
function RankingPage() {
  const {
    data: user,
    isLoading: loadingUser,
    error: userError
  } = useQuery(userQuery());
  if (loadingUser) {
    return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsx("div", { className: "p-16 text-center text-muted-foreground", children: "Carregando ranking..." }) });
  }
  if (userError || !user) {
    return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsx("div", { className: "p-16 text-center text-destructive", children: userError?.message ?? "Faça login para continuar" }) });
  }
  const isAdmin = user.perfil_nome === "admin";
  const visibleTabs = isAdmin ? TABS.filter((tab) => tab.value === "escola") : TABS;
  return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsxs("div", { className: "app-page space-y-6", children: [
    /* @__PURE__ */ jsxs(motion.section, { initial: {
      opacity: 0,
      y: 10
    }, animate: {
      opacity: 1,
      y: 0
    }, className: "overflow-hidden rounded-xl bg-gradient-hero p-6 text-primary-foreground shadow-soft sm:p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white/70", children: [
        /* @__PURE__ */ jsx(Trophy, { className: "h-3.5 w-3.5" }),
        " Ranking Viridis"
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "mt-1 text-2xl font-bold sm:text-3xl", children: isAdmin ? "Ranking das escolas participantes" : "Quem está liderando a horta" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 max-w-md text-sm text-white/80", children: isAdmin ? "Acompanhe a pontuação das escolas com alunos participantes do Viridis." : "Cumpra missões, ganhe pontos e suba no ranking da sua turma e da sua escola." })
    ] }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: isAdmin ? "escola" : "individual", className: "space-y-5", children: [
      /* @__PURE__ */ jsx(TabsList, { className: isAdmin ? "grid h-auto w-full grid-cols-1 sm:w-[26rem]" : "grid h-auto w-full grid-cols-3 sm:w-[26rem]", children: visibleTabs.map((tab) => /* @__PURE__ */ jsx(TabsTrigger, { value: tab.value, className: "py-2.5 text-xs sm:text-sm", children: tab.label }, tab.value)) }),
      visibleTabs.map((tab) => /* @__PURE__ */ jsx(TabsContent, { value: tab.value, className: "space-y-4", children: /* @__PURE__ */ jsx(RankingList, { rankingType: tab.value, user }) }, tab.value))
    ] })
  ] }) });
}
function RankingList({
  rankingType,
  user
}) {
  const {
    data: rankingResult,
    isLoading,
    error
  } = useRanking(rankingType);
  if (isLoading) {
    return /* @__PURE__ */ jsx("p", { className: "p-10 text-center text-sm text-muted-foreground", children: "Carregando..." });
  }
  if (error || !rankingResult) {
    return /* @__PURE__ */ jsx("p", { className: "p-10 text-center text-sm text-destructive", children: error?.message ?? "Não foi possível carregar o ranking." });
  }
  const ranking = rankingResult.ranking.map((r) => ({
    pos: r.posicao,
    name: rankingType === "escola" ? r.instituicao_nome ?? "Escola" : r.nome ?? "Sem nome",
    subtitle: rankingType === "individual" ? r.turma ?? r.instituicao_nome ?? void 0 : rankingType === "turma" ? r.instituicao_nome ?? void 0 : void 0,
    points: Number(r.pontos),
    alunos: r.alunos,
    you: rankingType === "individual" ? r.id === user.id : rankingType === "turma" ? r.turma_id === user.turma_id : r.instituicao_id === user.instituicao_id
  }));
  const yourPosition = rankingType === "individual" ? rankingResult.contexto_usuario.posicao : ranking.find((r) => r.you)?.pos ?? null;
  return /* @__PURE__ */ jsxs("section", { className: "surface-panel p-5 sm:p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-foreground", children: "Classificação completa" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          ranking.length,
          " ",
          SCOPE_LABEL[rankingType]
        ] })
      ] }),
      yourPosition != null && /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-accent/40 px-4 py-2 text-right", children: [
        /* @__PURE__ */ jsx("div", { className: "text-[10px] font-bold uppercase tracking-wide text-muted-foreground", children: "Sua posição" }),
        /* @__PURE__ */ jsxs("div", { className: "text-xl font-bold text-primary", children: [
          "#",
          yourPosition
        ] })
      ] })
    ] }),
    ranking.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-10 text-center text-sm text-muted-foreground", children: "Ainda não há dados no ranking." }) : /* @__PURE__ */ jsx("ul", { className: "mt-4 divide-y divide-border", children: ranking.map((r) => /* @__PURE__ */ jsxs("li", { className: `flex items-center gap-3 py-3 ${r.you ? "bg-accent/40 px-3 rounded-lg" : ""}`, children: [
      /* @__PURE__ */ jsx("div", { className: `grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold ${r.pos <= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`, children: r.pos }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "truncate text-sm font-semibold text-foreground", children: [
          r.name,
          r.you && /* @__PURE__ */ jsx("span", { className: "ml-2 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success", children: "Você" })
        ] }),
        r.subtitle && /* @__PURE__ */ jsx("div", { className: "truncate text-xs text-muted-foreground", children: r.subtitle })
      ] }),
      r.alunos != null && /* @__PURE__ */ jsxs("div", { className: "hidden shrink-0 items-center gap-1 text-xs text-muted-foreground sm:flex", children: [
        /* @__PURE__ */ jsx(Users, { className: "h-3.5 w-3.5" }),
        " ",
        r.alunos
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "shrink-0 text-right", children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm font-bold text-foreground", children: r.points.toLocaleString("pt-BR") }),
        /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wide text-muted-foreground", children: "pontos" })
      ] })
    ] }, r.pos)) })
  ] });
}
export {
  RankingPage as component
};
