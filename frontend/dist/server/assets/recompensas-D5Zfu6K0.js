import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Gift, Tag, Sparkles, Award, Building2, Globe2 } from "lucide-react";
import { D as Dialog, b as DialogContent, i as isImageSource, c as backendAsset, d as DialogHeader, e as DialogTitle, f as DialogDescription, g as DialogFooter, u as userQuery, h as isBrowser, a as apiFetch, P as PageShell } from "./router-_glEtDMC.js";
import { toast } from "sonner";
import "@tanstack/react-router";
import "recharts";
import "@radix-ui/react-dialog";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-slot";
import "class-variance-authority";
function RedeemRewardModal({ reward, userPoints, onOpenChange, onConfirm }) {
  const [loading, setLoading] = useState(false);
  if (!reward) return null;
  const can = userPoints >= reward.points;
  const remaining = userPoints - reward.points;
  async function confirm() {
    if (!can) return;
    setLoading(true);
    try {
      await onConfirm?.(reward);
      toast.success("Resgate confirmado!", {
        description: reward.partner ? `Mostre o cupom em ${reward.partner} para validar.` : "Seu resgate foi registrado com sucesso."
      });
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível resgatar");
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsx(Dialog, { open: !!reward, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-md overflow-hidden rounded-xl border-border/60 p-0 sm:p-0", children: [
    /* @__PURE__ */ jsx("div", { className: "grid place-items-center bg-accent/60 p-8", children: isImageSource(reward.image) ? /* @__PURE__ */ jsx(
      "img",
      {
        src: backendAsset(reward.image),
        alt: `Imagem da recompensa ${reward.title}`,
        className: "h-44 w-full object-cover"
      }
    ) : reward.image ? /* @__PURE__ */ jsx("span", { className: "text-5xl", "aria-hidden": "true", children: reward.image }) : /* @__PURE__ */ jsx(Gift, { className: "h-12 w-12 text-primary", "aria-hidden": "true" }) }),
    /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        reward.partner && /* @__PURE__ */ jsxs("div", { className: "inline-flex w-fit items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-bold text-primary", children: [
          /* @__PURE__ */ jsx(Tag, { className: "h-3 w-3" }),
          " ",
          reward.partner
        ] }),
        /* @__PURE__ */ jsx(DialogTitle, { className: "text-xl font-bold", children: reward.title }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Confirme o resgate desta recompensa. Os pontos serão debitados imediatamente." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-2 rounded-lg border border-border/60 bg-background/60 p-4 text-sm", children: [
        /* @__PURE__ */ jsx(Row, { label: "Seus pontos", value: userPoints.toLocaleString("pt-BR") }),
        /* @__PURE__ */ jsx(
          Row,
          {
            label: "Custo",
            value: `- ${reward.points.toLocaleString("pt-BR")}`,
            accent: "text-destructive"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "my-1 border-t border-dashed border-border/60" }),
        /* @__PURE__ */ jsx(
          Row,
          {
            label: "Saldo após resgate",
            value: can ? remaining.toLocaleString("pt-BR") : "Insuficiente",
            accent: can ? "text-success font-bold" : "text-destructive font-bold"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs(DialogFooter, { className: "gap-2 border-t border-border/60 bg-muted/30 px-6 py-4", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => onOpenChange(false),
          className: "min-h-11 rounded-lg border border-border bg-background px-4 py-2 text-sm font-bold text-foreground hover:bg-muted",
          children: "Cancelar"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          disabled: !can || loading,
          onClick: confirm,
          className: "inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground shadow-soft hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none",
          children: loading ? "Resgatando..." : can ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4" }),
            " Confirmar resgate"
          ] }) : /* @__PURE__ */ jsx(Fragment, { children: "Pontos insuficientes" })
        }
      )
    ] })
  ] }) });
}
function Row({ label, value, accent }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("span", { className: accent ?? "font-bold text-foreground", children: value })
  ] });
}
function RewardsPage() {
  const [selected, setSelected] = useState(null);
  const queryClient = useQueryClient();
  const {
    data: user,
    isLoading: loadingUser,
    error: userError
  } = useQuery(userQuery());
  const {
    data: rewards = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["recompensas"],
    enabled: isBrowser,
    retry: false,
    queryFn: async () => {
      const result = await apiFetch("/recompensas");
      return result.recompensas.map((r) => ({
        id: r.id,
        title: r.titulo,
        points: Number(r.pontos),
        image: r.imagem ?? "",
        partner: r.parceiro,
        scope: r.escopo
      }));
    }
  });
  const points = Number(user?.pontos_totais ?? 0);
  const canRedeem = user?.perfil_nome === "aluno";
  if (loadingUser || isLoading) return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsx("div", { className: "p-16 text-center text-muted-foreground", children: "Carregando recompensas..." }) });
  if (userError || error || !user) return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsx("div", { className: "p-16 text-center text-destructive", children: userError?.message ?? error?.message ?? "Faça login para continuar" }) });
  return /* @__PURE__ */ jsxs(PageShell, { children: [
    /* @__PURE__ */ jsxs("div", { className: "app-page", children: [
      /* @__PURE__ */ jsx(motion.section, { initial: {
        opacity: 0,
        y: 10
      }, animate: {
        opacity: 1,
        y: 0
      }, className: "overflow-hidden rounded-xl bg-gradient-hero p-6 text-primary-foreground shadow-soft sm:p-8", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white/70", children: [
            /* @__PURE__ */ jsx(Award, { className: "h-3.5 w-3.5" }),
            " Loja de Recompensas"
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "mt-1 text-2xl font-bold sm:text-3xl", children: "Resgate prêmios de parceiros locais" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-white/80", children: "Cada ponto cultivado vira impacto real na sua comunidade." })
        ] }),
        canRedeem && /* @__PURE__ */ jsxs("div", { className: "shrink-0 rounded-lg border border-white/20 bg-white/10 px-5 py-3 text-right backdrop-blur-sm", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[11px] uppercase tracking-wide text-white/70", children: "Seus pontos" }),
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: points.toLocaleString("pt-BR") })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(RewardSection, { title: "Recompensas da sua escola", description: "Benefícios oferecidos exclusivamente pela sua comunidade escolar.", icon: Building2, rewards: rewards.filter((reward) => reward.scope === "escola"), points, canRedeem, onSelect: canRedeem ? setSelected : () => {
      } }),
      /* @__PURE__ */ jsx(RewardSection, { title: "Recompensas gerais", description: "Prêmios disponíveis para toda a comunidade Viridis.", icon: Globe2, rewards: rewards.filter((reward) => reward.scope !== "escola"), points, canRedeem, onSelect: canRedeem ? setSelected : () => {
      } })
    ] }),
    canRedeem && /* @__PURE__ */ jsx(RedeemRewardModal, { reward: selected, userPoints: points, onOpenChange: (v) => !v && setSelected(null), onConfirm: async (reward) => {
      await apiFetch("/resgates", {
        method: "POST",
        body: JSON.stringify({
          recompensa_id: reward.id
        })
      });
      await queryClient.invalidateQueries({
        queryKey: ["historico"]
      });
      await queryClient.invalidateQueries({
        queryKey: ["perfil"]
      });
    } })
  ] });
}
function RewardSection({
  title,
  description,
  icon: Icon,
  rewards,
  points,
  canRedeem,
  onSelect
}) {
  return /* @__PURE__ */ jsxs("section", { className: "mt-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-start gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-foreground", children: title }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: description })
      ] })
    ] }),
    rewards.length === 0 ? /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground", children: "Nenhuma recompensa disponível nesta categoria." }) : /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: rewards.map((r, i) => {
      const can = points >= r.points;
      return /* @__PURE__ */ jsxs(motion.article, { initial: {
        opacity: 0,
        y: 14
      }, whileInView: {
        opacity: 1,
        y: 0
      }, viewport: {
        once: true
      }, transition: {
        delay: i * 0.05
      }, whileHover: {
        y: -2
      }, className: "group flex flex-col overflow-hidden rounded-lg border border-border/60 bg-card shadow-soft transition-shadow hover:shadow-soft", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative h-36 shrink-0 overflow-hidden bg-accent/60 text-6xl", children: [
          isImageSource(r.image) ? /* @__PURE__ */ jsx("img", { src: backendAsset(r.image), alt: `Imagem da recompensa ${r.title}`, loading: "lazy", className: "absolute inset-0 h-full w-full object-cover object-center" }) : r.image ? /* @__PURE__ */ jsx("div", { className: "absolute inset-0 grid place-items-center", children: /* @__PURE__ */ jsx("span", { className: "text-4xl", "aria-hidden": "true", children: r.image }) }) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 grid place-items-center", children: /* @__PURE__ */ jsx(Gift, { className: "h-10 w-10 text-primary", "aria-hidden": "true" }) }),
          /* @__PURE__ */ jsxs("div", { className: "absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-bold text-primary-foreground", children: [
            r.scope === "escola" ? /* @__PURE__ */ jsx(Building2, { className: "h-3 w-3" }) : /* @__PURE__ */ jsx(Globe2, { className: "h-3 w-3" }),
            r.scope === "escola" ? "Escola" : "Viridis"
          ] }),
          r.partner && /* @__PURE__ */ jsxs("div", { className: "absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-[10px] font-bold text-foreground backdrop-blur-sm", children: [
            /* @__PURE__ */ jsx(Tag, { className: "h-3 w-3" }),
            " ",
            r.partner
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col gap-3 p-5", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-foreground", children: r.title }),
          /* @__PURE__ */ jsxs("div", { className: "mt-auto flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1 rounded-full bg-warning/15 px-2.5 py-1 text-xs font-bold text-warning", children: [
              /* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5" }),
              " ",
              r.points,
              " pts"
            ] }),
            /* @__PURE__ */ jsx("button", { disabled: !can || !canRedeem, onClick: () => onSelect(r), className: "min-h-11 rounded-lg bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-soft transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none", children: !canRedeem ? "Resgate para alunos" : can ? "Resgatar" : "Pontos insuficientes" })
          ] })
        ] })
      ] }, r.id);
    }) })
  ] });
}
export {
  RewardsPage as component
};
