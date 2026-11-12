import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, LineChart, Line } from "recharts";
import { Users, Trophy, TrendingUp, HelpCircle, ArrowRight, Check, X, Plus, Building2 } from "lucide-react";
import { u as userQuery, h as isBrowser, a as apiFetch, P as PageShell, c as backendAsset, w as RewardManagement, x as ReviewActivityModal, y as AddPartnerModal } from "./router-_glEtDMC.js";
import { toast } from "sonner";
import "@radix-ui/react-dialog";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-slot";
import "class-variance-authority";
function Card({
  children
}) {
  return /* @__PURE__ */ jsx(motion.section, { initial: {
    opacity: 0,
    y: 12
  }, animate: {
    opacity: 1,
    y: 0
  }, className: "rounded-lg border border-border/60 bg-card p-6 shadow-soft", children });
}
function AdminPage() {
  return /* @__PURE__ */ jsx(OperationalPage, { panel: "admin" });
}
function OperationalPage({
  panel
}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    data: user,
    isLoading: loadingUser,
    error: userError
  } = useQuery(userQuery());
  useEffect(() => {
    if (!user) return;
    if (panel === "admin" && user.perfil_nome === "professor") void navigate({
      to: "/professor",
      replace: true
    });
    else if (panel === "admin" && user.perfil_nome === "diretor") void navigate({
      to: "/diretor",
      replace: true
    });
    else if (panel === "admin" && user.perfil_nome === "aluno") void navigate({
      to: "/aprender",
      replace: true
    });
    else if (panel === "professor" && user.perfil_nome === "admin") void navigate({
      to: "/admin",
      replace: true
    });
    else if (panel === "professor" && user.perfil_nome === "diretor") void navigate({
      to: "/diretor",
      replace: true
    });
    else if (panel === "professor" && user.perfil_nome === "aluno") void navigate({
      to: "/aprender",
      replace: true
    });
  }, [navigate, panel, user]);
  const [review, setReview] = useState(null);
  const [openPartner, setOpenPartner] = useState(false);
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ["admin", user?.perfil_nome],
    enabled: isBrowser && !!user && (panel === "admin" ? user.perfil_nome === "admin" : user.perfil_nome === "professor"),
    retry: false,
    queryFn: async () => {
      const [dashboard, submissions] = await Promise.all([apiFetch(panel === "admin" ? "/admin/dashboard" : "/professor/dashboard"), apiFetch("/submissoes?status=pending")]);
      let partners = [];
      if (user?.perfil_nome === "admin") partners = (await apiFetch("/parceiros")).parceiros;
      return {
        dashboard,
        submissions: submissions.submissoes,
        partners
      };
    }
  });
  const refresh = () => queryClient.invalidateQueries({
    queryKey: ["admin"]
  });
  async function resolve(id, action, comment = "") {
    await apiFetch(`/submissoes/${id}/revisar`, {
      method: "PUT",
      body: JSON.stringify({
        status: action === "approve" ? "approved" : "rejected",
        comentario: comment || void 0
      })
    });
    await refresh();
  }
  async function resolveAll(action) {
    if (!data) return;
    try {
      await Promise.all(data.submissions.map((s) => resolve(s.id, action, action === "reject" ? "Rejeitado em revisão coletiva" : "")));
      toast.success(action === "approve" ? "Todos aprovados" : "Todos rejeitados");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível revisar todos");
    }
  }
  if (loadingUser || isLoading) return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsx("div", { className: "p-16 text-center text-muted-foreground", children: "Carregando painel..." }) });
  if (userError || error || !data) return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsx("div", { className: "p-16 text-center text-destructive", children: userError?.message ?? error?.message ?? "Acesso exclusivo para professores e administradores" }) });
  const pending = data.submissions.map((s) => ({
    id: s.id,
    student: s.equipe && s.equipe !== s.aluno ? `${s.aluno} (equipe: ${s.equipe})` : s.aluno,
    activity: s.atividade,
    date: new Date(s.data_envio).toLocaleDateString("pt-BR"),
    points: Number(s.pontos),
    photo: backendAsset(s.url_foto),
    description: s.descricao
  }));
  const classes = data.dashboard.ranking_turmas.map((c) => ({
    name: c.nome,
    points: Number(c.pontos)
  }));
  const weekly = data.dashboard.progresso_semanal.map((w) => ({
    week: (() => {
      const value = String(w.semana);
      return value.length === 6 ? `${value.slice(0, 4)}-S${value.slice(4)}` : value;
    })(),
    value: Number(w.valor)
  }));
  const totalPoints = classes.reduce((sum, c) => sum + c.points, 0);
  return /* @__PURE__ */ jsxs(PageShell, { children: [
    /* @__PURE__ */ jsxs("div", { className: "app-page space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "page-heading", children: [
        /* @__PURE__ */ jsx("div", { className: "page-eyebrow", children: panel === "admin" ? "Painel do Administrador" : "Painel do Professor" }),
        /* @__PURE__ */ jsx("h1", { className: "page-title", children: "Gestão e visão institucional" }),
        /* @__PURE__ */ jsx("p", { className: "page-description", children: "Dados atualizados diretamente do banco Viridis." })
      ] }),
      /* @__PURE__ */ jsx("dl", { className: "grid divide-y border-y bg-card sm:grid-cols-3 sm:divide-x sm:divide-y-0", children: [{
        icon: Users,
        label: "Turmas ativas",
        value: classes.length
      }, {
        icon: Trophy,
        label: "Pontos das turmas",
        value: totalPoints.toLocaleString("pt-BR")
      }, {
        icon: TrendingUp,
        label: "Pendências",
        value: data.dashboard.pendencias
      }].map((s) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 p-5", children: [
        /* @__PURE__ */ jsx(s.icon, { className: "h-5 w-5 shrink-0 text-primary", "aria-hidden": "true" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("dd", { className: "text-2xl font-bold tabular-nums", children: s.value }),
          /* @__PURE__ */ jsx("dt", { className: "text-xs text-muted-foreground", children: s.label })
        ] })
      ] }, s.label)) }),
      user && /* @__PURE__ */ jsxs(Link, { to: "/cursos", className: "flex items-center gap-4 rounded-lg border border-primary/30 bg-primary/5 p-5 shadow-soft transition-colors hover:bg-primary/10", children: [
        /* @__PURE__ */ jsx("div", { className: "grid h-12 w-12 place-items-center rounded-lg bg-primary text-primary-foreground", children: /* @__PURE__ */ jsx(HelpCircle, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("div", { className: "font-bold", children: "Gerenciar cursos e quizzes" }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Crie cursos, módulos, lições e perguntas para seu público." })
        ] }),
        /* @__PURE__ */ jsx(ArrowRight, { className: "h-5 w-5 text-primary" })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-sm font-bold uppercase tracking-wide", children: "Verificação de pontos" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Pedidos pendentes de aprovação" })
          ] }),
          pending.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxs("button", { onClick: () => resolveAll("approve"), className: "inline-flex items-center gap-1 rounded-full bg-success px-3 py-2 text-xs font-bold text-success-foreground", children: [
              /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5" }),
              "Aprovar todos"
            ] }),
            /* @__PURE__ */ jsxs("button", { onClick: () => resolveAll("reject"), className: "inline-flex items-center gap-1 rounded-full bg-destructive px-3 py-2 text-xs font-bold text-destructive-foreground", children: [
              /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" }),
              "Rejeitar todos"
            ] })
          ] })
        ] }),
        pending.length === 0 ? /* @__PURE__ */ jsx("div", { className: "mt-4 rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground", children: "Nenhuma aprovação pendente" }) : /* @__PURE__ */ jsx("ul", { className: "mt-4 space-y-2", children: pending.map((p) => /* @__PURE__ */ jsxs("li", { className: "flex flex-col gap-3 rounded-lg border border-success/20 bg-success/5 p-4 sm:flex-row sm:items-center", children: [
          /* @__PURE__ */ jsx("div", { className: "grid h-10 w-10 place-items-center rounded-xl bg-card font-bold", children: p.student.charAt(0) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "font-bold", children: p.student }),
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
              p.activity,
              " · ",
              p.date
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "font-bold text-success", children: [
            "+",
            p.points
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => setReview(p), className: "min-h-11 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground", children: "Revisar" })
        ] }, p.id)) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-sm font-bold uppercase tracking-wide", children: "Desempenho das turmas" }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 grid gap-6 lg:grid-cols-2", children: [
          /* @__PURE__ */ jsx("div", { className: "h-64", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(BarChart, { data: classes, children: [
            /* @__PURE__ */ jsx(XAxis, { dataKey: "name" }),
            /* @__PURE__ */ jsx(YAxis, {}),
            /* @__PURE__ */ jsx(Tooltip, {}),
            /* @__PURE__ */ jsx(Bar, { dataKey: "points", fill: "var(--color-success)", radius: [8, 8, 0, 0] })
          ] }) }) }),
          /* @__PURE__ */ jsx("div", { className: "h-64", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(LineChart, { data: weekly, children: [
            /* @__PURE__ */ jsx(XAxis, { dataKey: "week" }),
            /* @__PURE__ */ jsx(YAxis, {}),
            /* @__PURE__ */ jsx(Tooltip, {}),
            /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "value", stroke: "var(--color-primary)", strokeWidth: 3 })
          ] }) }) })
        ] })
      ] }),
      user?.perfil_nome === "admin" && /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm font-bold uppercase tracking-wide", children: "Parcerias locais" }),
          /* @__PURE__ */ jsxs("button", { onClick: () => setOpenPartner(true), className: "inline-flex min-h-11 items-center gap-1 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground", children: [
            /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
            "Adicionar"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 grid gap-2 sm:grid-cols-2", children: data.partners.map((p) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-xl border border-border p-3", children: [
          /* @__PURE__ */ jsx(Building2, { className: "h-5 w-5 text-primary" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "font-bold", children: p.nome }),
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
              p.tipo,
              " · ",
              p.email
            ] })
          ] })
        ] }, p.id)) })
      ] }),
      user?.perfil_nome === "admin" && /* @__PURE__ */ jsx(RewardManagement, { endpoint: "/admin/recompensas", title: "Recompensas gerais do app" })
    ] }),
    /* @__PURE__ */ jsx(ReviewActivityModal, { item: review, onOpenChange: (v) => !v && setReview(null), onResolve: resolve }),
    /* @__PURE__ */ jsx(AddPartnerModal, { open: openPartner, onOpenChange: setOpenPartner, onCreate: async (p) => {
      await apiFetch("/parceiros", {
        method: "POST",
        body: JSON.stringify({
          nome: p.name,
          tipo: p.type,
          email: p.email,
          telefone: p.phone
        })
      });
      await refresh();
    } })
  ] });
}
export {
  OperationalPage,
  AdminPage as component
};
