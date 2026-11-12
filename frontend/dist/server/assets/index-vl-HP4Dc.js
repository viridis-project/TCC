import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { Leaf, ArrowRight, BookOpen, Sprout, TrendingUp, Award, Target, GraduationCap, ShieldCheck } from "lucide-react";
import { P as PageShell } from "./router-_glEtDMC.js";
import "@tanstack/react-query";
import "sonner";
import "react";
import "motion/react";
import "recharts";
import "@radix-ui/react-dialog";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-slot";
import "class-variance-authority";
const stats = [{
  value: "24",
  label: "Plantas acompanhadas"
}, {
  value: "186",
  label: "Alunos participantes"
}, {
  value: "77 mil",
  label: "Pontos conquistados"
}];
const features = [{
  icon: BookOpen,
  title: "Aprendizagem aplicada",
  desc: "Conteúdo sobre plantio, nutrição, compostagem e manejo, ligado à prática na escola."
}, {
  icon: Sprout,
  title: "Horta acompanhada",
  desc: "Registro de atividades e evolução do jardim com validação dos educadores."
}, {
  icon: TrendingUp,
  title: "Impacto visível",
  desc: "Indicadores de participação, crescimento e sustentabilidade para apoiar decisões."
}, {
  icon: Award,
  title: "Reconhecimento",
  desc: "Pontos, conquistas e benefícios de parceiros que valorizam a evolução dos alunos."
}];
const profiles = [{
  icon: GraduationCap,
  title: "Estudantes",
  desc: "Aprendem, registram atividades e acompanham sua evolução."
}, {
  icon: BookOpen,
  title: "Professores",
  desc: "Orientam turmas, validam práticas e administram conteúdos."
}, {
  icon: ShieldCheck,
  title: "Gestão escolar",
  desc: "Acompanha resultados, pessoas, parcerias e iniciativas."
}];
const sdg = [["02", "Agricultura sustentável"], ["03", "Saúde e bem-estar"], ["04", "Educação de qualidade"], ["12", "Consumo responsável"], ["15", "Vida terrestre"]];
function HomePage() {
  return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsxs("div", { className: "app-page space-y-10", children: [
    /* @__PURE__ */ jsxs("section", { className: "overflow-hidden rounded-xl border border-primary/15 bg-card", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-[1.35fr_0.65fr]", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-6 sm:p-9 lg:p-12", children: [
          /* @__PURE__ */ jsxs("div", { className: "page-eyebrow flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Leaf, { className: "h-4 w-4", "aria-hidden": "true" }),
            " Educação que cria raízes"
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "mt-4 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.75rem]", children: "Cultive conhecimento. Transforme a escola." }),
          /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground", children: "O Viridis conecta aprendizagem, prática e gestão para tornar a horta escolar uma experiência contínua de sustentabilidade." }),
          /* @__PURE__ */ jsxs("div", { className: "mt-7 flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxs(Link, { to: "/aprender", className: "inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-[var(--primary-hover)]", children: [
              "Começar a aprender ",
              /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4", "aria-hidden": "true" })
            ] }),
            /* @__PURE__ */ jsx(Link, { to: "/jardim", className: "inline-flex min-h-11 items-center rounded-lg border border-input bg-card px-5 py-2.5 text-sm font-semibold hover:border-primary/30 hover:bg-accent", children: "Acessar meu jardim" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "relative hidden min-h-80 overflow-hidden bg-accent bg-cover bg-center lg:block", style: {
          backgroundImage: 'url("https://conteudo.imguol.com.br/c/entretenimento/d5/2022/02/28/hortas-criadas-em-terrenos-osciosos-de-sp-colhem-6-t-de-alimentos-todo-mes-1646098868610_v2_4x3.jpg")'
        }, "aria-hidden": "true" })
      ] }),
      /* @__PURE__ */ jsx("dl", { className: "grid border-t bg-background/60 sm:grid-cols-3", children: stats.map((stat) => /* @__PURE__ */ jsxs("div", { className: "px-6 py-5 sm:border-r sm:last:border-r-0", children: [
        /* @__PURE__ */ jsx("dt", { className: "text-xs font-medium text-muted-foreground", children: stat.label }),
        /* @__PURE__ */ jsx("dd", { className: "mt-1 text-2xl font-bold tabular-nums", children: stat.value })
      ] }, stat.label)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { "aria-labelledby": "recursos-title", className: "grid gap-8 lg:grid-cols-[0.65fr_1.35fr]", children: [
      /* @__PURE__ */ jsxs("div", { className: "page-heading", children: [
        /* @__PURE__ */ jsx("div", { className: "page-eyebrow", children: "Uma plataforma, uma jornada" }),
        /* @__PURE__ */ jsx("h2", { id: "recursos-title", className: "mt-2 text-2xl font-bold", children: "Da teoria ao impacto real" }),
        /* @__PURE__ */ jsx("p", { className: "page-description", children: "Recursos conectados em um fluxo claro para apoiar toda a comunidade escolar." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "divide-y border-y", children: features.map(({
        icon: Icon,
        title,
        desc
      }, index) => /* @__PURE__ */ jsxs("div", { className: "grid gap-3 py-5 sm:grid-cols-[2.5rem_1fr]", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-primary", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold tabular-nums", children: [
            "0",
            index + 1
          ] }),
          /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4", "aria-hidden": "true" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: title }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm leading-relaxed text-muted-foreground", children: desc })
        ] })
      ] }, title)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { "aria-labelledby": "ods-title", className: "section-divider", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-between gap-3 sm:flex-row sm:items-end", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "page-eyebrow", children: "Compromisso coletivo" }),
          /* @__PURE__ */ jsx("h2", { id: "ods-title", className: "mt-2 text-2xl font-bold", children: "Objetivos que orientam o Viridis" })
        ] }),
        /* @__PURE__ */ jsx(Target, { className: "hidden h-7 w-7 text-primary sm:block", "aria-hidden": "true" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-5 grid border sm:grid-cols-5", children: sdg.map(([number, label]) => /* @__PURE__ */ jsxs("div", { className: "border-b p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0", children: [
        /* @__PURE__ */ jsx("div", { className: "text-xl font-bold text-primary", children: number }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs leading-snug text-muted-foreground", children: label })
      ] }, number)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { "aria-labelledby": "perfis-title", className: "section-divider", children: [
      /* @__PURE__ */ jsx("div", { className: "page-eyebrow", children: "Feito para a comunidade escolar" }),
      /* @__PURE__ */ jsx("h2", { id: "perfis-title", className: "mt-2 text-2xl font-bold", children: "Cada perfil enxerga o que precisa" }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 grid gap-6 md:grid-cols-3", children: profiles.map(({
        icon: Icon,
        title,
        desc
      }) => /* @__PURE__ */ jsxs("div", { className: "border-l-2 border-primary/25 pl-4", children: [
        /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5 text-primary", "aria-hidden": "true" }),
        /* @__PURE__ */ jsx("h3", { className: "mt-3 font-semibold", children: title }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: desc })
      ] }, title)) })
    ] })
  ] }) });
}
export {
  HomePage as component
};
