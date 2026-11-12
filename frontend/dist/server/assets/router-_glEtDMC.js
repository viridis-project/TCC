import { QueryClientProvider, useQuery, useQueryClient, useMutation, QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, useRouter, Link, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, useNavigate, useRouterState, redirect, createRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Toaster, toast } from "sonner";
import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, LineChart, Line } from "recharts";
import { X, Bell, CheckCheck, Users, Calendar, Medal, Check, Home, BookOpen, Sprout, CalendarClock, Trophy, Award, History, User, Settings, School, Menu, ImageIcon, MessageSquare, Building2, Tag, Mail, Phone, Gift, Upload, Camera, Plus, Edit, Trash2, TrendingUp, HelpCircle, ArrowRight } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
const appCss = "/assets/styles-jLGtkD8g.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Página não encontrada" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "A página que você procura não existe ou foi movida." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Voltar ao início"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "Não foi possível carregar esta página" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Algo deu errado. Tente novamente ou volte para a página inicial." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Tentar novamente"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Voltar ao início"
        }
      )
    ] })
  ] }) });
}
const Route$g = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Viridis" },
      { name: "description", content: "Plataforma gamificada de hortas escolares" },
      { name: "author", content: "Viridis" },
      { property: "og:title", content: "Viridis" },
      { property: "og:description", content: "Plataforma gamificada de hortas escolares" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" }
    ],
    links: [
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "pt-BR", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$g.useRouteContext();
  return /* @__PURE__ */ jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsx(Outlet, {}),
    /* @__PURE__ */ jsx(Toaster, { richColors: true, position: "top-right" })
  ] });
}
const $$splitComponentImporter$e = () => import("./registro-4IgkjWuf.js");
const Route$f = createFileRoute("/registro")({
  head: () => ({
    meta: [{
      title: "Criar conta — Viridis"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./recompensas-D5Zfu6K0.js");
const Route$e = createFileRoute("/recompensas")({
  head: () => ({
    meta: [{
      title: "Recompensas — Viridis"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./ranking-B1we8z_u.js");
const Route$d = createFileRoute("/ranking")({
  head: () => ({
    meta: [{
      title: "Ranking — Viridis"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./professor-BJ9lZUE9.js");
const Route$c = createFileRoute("/professor")({
  head: () => ({
    meta: [{
      title: "Painel do Professor — Viridis"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./perfil-BOqJ7Rvg.js");
const Route$b = createFileRoute("/perfil")({
  head: () => ({
    meta: [{
      title: "Perfil — Viridis"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./login-FsIvHRud.js");
const Route$a = createFileRoute("/login")({
  head: () => ({
    meta: [{
      title: "Entrar — Viridis"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./jardim-CV9DV4GZ.js");
const Route$9 = createFileRoute("/jardim")({
  validateSearch: (search) => {
    const positiveId = (value) => {
      const number = typeof value === "string" || typeof value === "number" ? Number(value) : NaN;
      return Number.isSafeInteger(number) && number > 0 ? number : void 0;
    };
    return {
      escola: positiveId(search.escola),
      turma: positiveId(search.turma)
    };
  },
  head: () => ({
    meta: [{
      title: "Meu Jardim — Viridis"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./horarios-9tC6JFct.js");
const Route$8 = createFileRoute("/horarios")({
  head: () => ({
    meta: [{
      title: "Horários — Viridis"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./historico-CnXUrcR6.js");
const Route$7 = createFileRoute("/historico")({
  head: () => ({
    meta: [{
      title: "Meu Histórico — Viridis"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./diretor-BZ4DYDmB.js");
const Route$6 = createFileRoute("/diretor")({
  head: () => ({
    meta: [{
      title: "Direção — Viridis"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./cursos-B4gkHJGt.js");
const Route$5 = createFileRoute("/cursos")({
  head: () => ({
    meta: [{
      title: "Gestão de cursos — Viridis"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./aprender-DCXK4S_4.js");
const Route$4 = createFileRoute("/aprender")({
  head: () => ({
    meta: [{
      title: "Aprender — Viridis"
    }, {
      name: "description",
      content: "Trilha gamificada de aprendizado em sustentabilidade."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const API_URL = "https://regisrusiglocks1794406051000.1751247.meusitehostgator.com.br/api".replace(
  /\/$/,
  ""
);
const isImageSource = (value) => Boolean(value && /^(?:https?:\/\/|\/|blob:|data:image\/)/i.test(value));
const backendAsset = (path) => /^(?:https?:\/\/|blob:|data:)/i.test(path) ? path : `${new URL(API_URL).origin}${path}`;
class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
  status;
}
async function apiFetch(path, init = {}) {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    credentials: "include"
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = payload.detalhe ? ` (${payload.detalhe})` : "";
    throw new ApiError(
      `${payload.erro ?? "Não foi possível concluir a operação"}${detail}`,
      response.status
    );
  }
  return payload;
}
const isBrowser = typeof window !== "undefined";
const missionTypes = {
  plant: { label: "Plantio", points: 50 },
  water: { label: "Rega", points: 20 },
  compost: { label: "Compostagem", points: 75 },
  share: { label: "Compartilhar", points: 25 },
  outro: { label: "Outra", points: 10 }
};
function userQuery() {
  return {
    queryKey: ["perfil"],
    queryFn: async () => (await apiFetch("/perfil")).usuario,
    enabled: isBrowser,
    retry: false
  };
}
function useAuth() {
  const query = useQuery(userQuery());
  return { ...query, user: query.data, role: query.data?.perfil_nome };
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-foreground/55 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid max-h-[calc(100vh-2rem)] w-[calc(100%-1.5rem)] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-5 overflow-y-auto rounded-xl border bg-card p-5 shadow-elevated duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:p-6",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-3 top-3 z-10 grid h-11 w-11 cursor-pointer place-items-center rounded-full bg-card/95 text-foreground shadow-soft ring-1 ring-border/80 transition-colors hover:bg-destructive hover:text-destructive-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none sm:right-4 sm:top-4", children: [
          /* @__PURE__ */ jsx(X, { className: "h-5 w-5 stroke-[2.5]", "aria-hidden": "true" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Fechar" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
const icons = {
  atividade_aprovada: Check,
  atividade_rejeitada: X,
  conquista: Medal,
  tarefa_agendada: Calendar,
  missao_agendada: Calendar,
  designacao_professor: Users,
  convite_tarefa: Users,
  convite_missao: Users
};
function NotificationsModal({
  open,
  onOpenChange
}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data = [], isLoading } = useQuery({
    queryKey: ["notificacoes"],
    enabled: isBrowser && open,
    queryFn: async () => (await apiFetch("/notificacoes")).notificacoes
  });
  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["notificacoes"] }),
      queryClient.invalidateQueries({ queryKey: ["notificacoes-contagem"] })
    ]);
  };
  const all = useMutation({
    mutationFn: () => apiFetch("/notificacoes/marcar-todas-lidas", { method: "PUT" }),
    onSuccess: async (r) => {
      toast.success(r.mensagem);
      await invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  async function openNotification(item) {
    if (!item.lida) await apiFetch(`/notificacoes/${item.id}/marcar-lida`, { method: "PUT" });
    await invalidate();
    if (["atividade_aprovada", "atividade_rejeitada"].includes(item.tipo)) {
      onOpenChange(false);
      await navigate({ to: "/jardim" });
    } else if (item.link === "/horarios") {
      onOpenChange(false);
      await navigate({ to: "/horarios" });
    } else if (item.link === "/jardim") {
      onOpenChange(false);
      await navigate({ to: "/jardim" });
    }
  }
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-lg overflow-hidden rounded-xl border-border/60 p-0 sm:p-0", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-gradient-hero p-6 text-primary-foreground", children: /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2 text-xl font-bold", children: [
        /* @__PURE__ */ jsx(Bell, { className: "h-5 w-5" }),
        "Notificações"
      ] }),
      /* @__PURE__ */ jsx(DialogDescription, { className: "text-white/80", children: "Acompanhe atividades, conquistas e sua agenda." })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "max-h-[60vh] overflow-y-auto p-5", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-3 flex justify-end", children: /* @__PURE__ */ jsxs(
        "button",
        {
          disabled: all.isPending || data.every((n) => n.lida),
          onClick: () => all.mutate(),
          className: "inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary disabled:opacity-40",
          children: [
            /* @__PURE__ */ jsx(CheckCheck, { className: "h-3.5 w-3.5" }),
            "Marcar todas como lidas"
          ]
        }
      ) }),
      isLoading ? /* @__PURE__ */ jsx("div", { className: "p-8 text-center text-muted-foreground", children: "Carregando notificações..." }) : data.length === 0 ? /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground", children: "Nenhuma notificação por enquanto." }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: data.map((item) => {
        const Icon = icons[item.tipo] ?? Bell;
        return /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => openNotification(item),
            className: `flex w-full gap-3 rounded-lg border p-4 text-left transition-colors ${item.lida ? "border-border/60 bg-background/60" : "border-primary/30 bg-primary/5"}`,
            children: [
              /* @__PURE__ */ jsx("div", { className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" }) }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsx("div", { className: "text-sm font-bold text-foreground", children: item.titulo }),
                /* @__PURE__ */ jsx("div", { className: "mt-0.5 text-xs text-muted-foreground", children: item.mensagem }),
                /* @__PURE__ */ jsx("div", { className: "mt-2 text-[10px] text-muted-foreground", children: new Date(item.criada_em).toLocaleString("pt-BR") })
              ] }),
              !item.lida && /* @__PURE__ */ jsx("span", { className: "mt-1 h-2.5 w-2.5 rounded-full bg-primary" })
            ]
          },
          item.id
        );
      }) })
    ] })
  ] }) });
}
const NAV = [
  { to: "/", label: "INÍCIO", icon: Home },
  { to: "/aprender", label: "APRENDER", icon: BookOpen },
  { to: "/jardim", label: "JARDIM", icon: Sprout },
  { to: "/horarios", label: "HORÁRIOS", icon: CalendarClock },
  { to: "/ranking", label: "RANKING", icon: Trophy },
  { to: "/recompensas", label: "RECOMPENSAS", icon: Award },
  { to: "/historico", label: "HISTÓRICO", icon: History },
  { to: "/perfil", label: "PERFIL", icon: User },
  { to: "/admin", label: "ADMINISTRAÇÃO", icon: Settings },
  { to: "/professor", label: "PAINEL DOCENTE", icon: Users },
  { to: "/diretor", label: "DIREÇÃO", icon: School }
];
function SiteNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { user, role } = useAuth();
  const { data: unread = 0 } = useQuery({
    queryKey: ["notificacoes-contagem"],
    enabled: isBrowser && !!user,
    refetchInterval: 3e4,
    queryFn: async () => (await apiFetch("/notificacoes/contagem-nao-lidas")).contagem
  });
  const visibleNav = NAV.filter((item) => {
    if (role === "admin" && (item.to === "/aprender" || item.to === "/jardim" || item.to === "/horarios"))
      return false;
    if (item.to === "/admin") return role === "admin";
    if (item.to === "/professor") return role === "professor";
    if (item.to === "/diretor") return role === "diretor";
    if (item.to === "/historico" || item.to === "/recompensas")
      return role === "aluno" || role === "admin";
    return true;
  });
  return /* @__PURE__ */ jsxs("header", { className: "sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/",
          "aria-label": "Viridis — ir para o início",
          className: "group flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4",
          children: [
            /* @__PURE__ */ jsx("div", { className: "grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-primary bg-background text-primary shadow-soft transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground", children: /* @__PURE__ */ jsxs(
              "svg",
              {
                viewBox: "0 0 40 40",
                className: "h-7 w-7",
                "aria-hidden": "true",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                children: [
                  /* @__PURE__ */ jsx("path", { d: "M20 31V18.5", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M19.6 20.3c-5.7-.2-9.3-3.8-9.6-9.8 5.8.2 9.4 3.7 9.6 9.8Z",
                      fill: "currentColor",
                      fillOpacity: ".2",
                      stroke: "currentColor",
                      strokeWidth: "1.8",
                      strokeLinejoin: "round"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M20.4 17.5c.7-5.2 4.2-8 9.8-8.1-.4 5.2-4.1 8-9.8 8.1Z",
                      fill: "currentColor",
                      fillOpacity: ".42",
                      stroke: "currentColor",
                      strokeWidth: "1.8",
                      strokeLinejoin: "round"
                    }
                  ),
                  /* @__PURE__ */ jsx("path", { d: "M12.5 31h15", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 leading-none", children: [
              /* @__PURE__ */ jsx("div", { className: "font-display text-[19px] font-extrabold tracking-[-0.045em] text-primary", children: "Viridis" }),
              /* @__PURE__ */ jsxs("div", { className: "mt-1 hidden items-center gap-1.5 sm:flex", children: [
                /* @__PURE__ */ jsx("span", { className: "h-px w-3 bg-accent-foreground/45", "aria-hidden": "true" }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground", children: "Cultivando sustentabilidade" })
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsx("nav", { className: "hidden items-center gap-1 rounded-full border border-border/70 bg-card/60 p-1 shadow-soft lg:flex", children: visibleNav.map(({ to, label, icon: Icon }) => {
        const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
        return /* @__PURE__ */ jsxs(
          Link,
          {
            to,
            className: "relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground transition-colors hover:text-foreground",
            children: [
              active && /* @__PURE__ */ jsx(
                motion.span,
                {
                  layoutId: "navbubble",
                  className: "absolute inset-0 -z-10 rounded-full bg-gradient-hero shadow-soft",
                  transition: { type: "spring", stiffness: 400, damping: 32 }
                }
              ),
              /* @__PURE__ */ jsx(Icon, { className: `h-3.5 w-3.5 ${active ? "text-primary-foreground" : ""}` }),
              /* @__PURE__ */ jsx("span", { className: active ? "text-primary-foreground" : "", children: label })
            ]
          },
          to
        );
      }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "hidden items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-2.5 py-1 sm:flex", children: /* @__PURE__ */ jsx("span", { className: "text-base leading-none", children: "🇧🇷" }) }),
        user && /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setNotificationsOpen(true),
            className: "relative grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-card text-foreground",
            "aria-label": "Notificações",
            children: [
              /* @__PURE__ */ jsx(Bell, { className: "h-4 w-4" }),
              unread > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-destructive px-1 text-[10px] font-extrabold text-destructive-foreground", children: unread > 99 ? "99+" : unread })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: user ? "/perfil" : "/login",
            className: "grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-gradient-hero text-sm font-bold text-primary-foreground shadow-soft",
            children: user?.avatar ? /* @__PURE__ */ jsx("img", { src: user.avatar, alt: user.nome, className: "h-full w-full object-cover" }) : user?.nome.charAt(0) ?? "?"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setOpen((v) => !v),
            className: "grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-card text-foreground lg:hidden",
            "aria-label": "Menu",
            children: open ? /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Menu, { className: "h-4 w-4" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsx(
      motion.nav,
      {
        initial: { height: 0, opacity: 0 },
        animate: { height: "auto", opacity: 1 },
        exit: { height: 0, opacity: 0 },
        className: "overflow-hidden border-t border-border/60 bg-background/95 lg:hidden",
        children: /* @__PURE__ */ jsx("div", { className: "mx-auto grid max-w-7xl gap-1 px-4 py-3", children: visibleNav.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return /* @__PURE__ */ jsxs(
            Link,
            {
              to,
              onClick: () => setOpen(false),
              className: `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${active ? "bg-gradient-hero text-primary-foreground" : "text-foreground hover:bg-accent"}`,
              children: [
                /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }),
                " ",
                label
              ]
            },
            to
          );
        }) })
      }
    ) }),
    /* @__PURE__ */ jsx(NotificationsModal, { open: notificationsOpen, onOpenChange: setNotificationsOpen })
  ] });
}
function SiteFooter() {
  return /* @__PURE__ */ jsx("footer", { className: "mt-10 border-t border-border/70 bg-card/50", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-primary", children: [
      /* @__PURE__ */ jsx(Sprout, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsx("span", { className: "text-sm font-bold tracking-wider", children: "VIRIDIS" })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Educação e sustentabilidade em prática · 2026" })
  ] }) });
}
function PageShell({ children }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col bg-background", children: [
    /* @__PURE__ */ jsx(
      "a",
      {
        href: "#conteudo-principal",
        className: "fixed left-3 top-3 z-[100] -translate-y-20 rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background shadow-elevated focus:translate-y-0",
        children: "Pular para o conteúdo"
      }
    ),
    /* @__PURE__ */ jsx(SiteNav, {}),
    /* @__PURE__ */ jsx("main", { id: "conteudo-principal", tabIndex: -1, className: "flex-1", children }),
    /* @__PURE__ */ jsx(SiteFooter, {})
  ] });
}
const quickComments = [
  "Ótimo trabalho!",
  "Adicione mais detalhes da foto",
  "Foto pouco nítida, reenvie",
  "Faltou descrição da atividade"
];
function ReviewActivityModal({ item, onOpenChange, onResolve }) {
  const [comment, setComment] = useState("");
  const [mode, setMode] = useState("approve");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (item) {
      setComment("");
      setMode("approve");
    }
  }, [item]);
  if (!item) return null;
  async function submit(action) {
    if (action === "reject" && comment.trim().length < 3) {
      toast.error("Adicione um comentário explicando a rejeição");
      setMode("reject");
      return;
    }
    setLoading(true);
    try {
      await onResolve?.(item.id, action, comment.trim());
      if (action === "approve")
        toast.success(`${item.student} aprovado`, {
          description: `+${item.points} pontos creditados`
        });
      else toast.error(`${item.student} rejeitado`, { description: comment.trim() });
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível revisar");
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsx(Dialog, { open: !!item, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-h-[calc(100dvh-1.5rem)] max-w-lg grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden rounded-xl border-border/60 p-0 sm:p-0", children: [
    /* @__PURE__ */ jsx("div", { className: "shrink-0 bg-gradient-hero p-6 pr-20 text-primary-foreground", children: /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsx(DialogTitle, { className: "text-xl font-bold", children: "Revisar atividade" }),
      /* @__PURE__ */ jsx(DialogDescription, { className: "text-white/80", children: "Aprove ou rejeite com um feedback construtivo." })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-0 space-y-4 overflow-y-auto overscroll-contain p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-lg border border-border/60 bg-background/60 p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary/15 text-lg font-bold text-primary", children: item.student.charAt(0) }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("div", { className: "truncate text-sm font-bold text-foreground", children: item.student }),
          /* @__PURE__ */ jsx("div", { className: "truncate text-xs text-muted-foreground", children: item.activity })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-xs font-bold text-warning", children: [
            /* @__PURE__ */ jsx(Award, { className: "h-3 w-3" }),
            " +",
            item.points
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center justify-end gap-1 text-[10px] text-muted-foreground", children: [
            /* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3" }),
            " ",
            item.date
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid min-h-40 place-items-center overflow-hidden rounded-lg border border-border/60 bg-muted/30 text-muted-foreground", children: item.photo ? /* @__PURE__ */ jsx("img", { src: item.photo, alt: "Comprovante", className: "max-h-72 w-full object-contain" }) : /* @__PURE__ */ jsxs("div", { className: "text-center text-xs", children: [
        /* @__PURE__ */ jsx(ImageIcon, { className: "mx-auto h-10 w-10 text-primary", "aria-hidden": "true" }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 font-semibold", children: "Foto comprovante" })
      ] }) }),
      item.description && /* @__PURE__ */ jsx("p", { className: "rounded-xl bg-muted/40 p-3 text-sm text-foreground", children: item.description }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("label", { className: "text-xs font-bold uppercase tracking-wide text-muted-foreground", children: [
            /* @__PURE__ */ jsx(MessageSquare, { className: "mr-1 inline h-3 w-3" }),
            " Comentário",
            " ",
            mode === "reject" && /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
            comment.length,
            "/200"
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: comment,
            onChange: (e) => setComment(e.target.value),
            maxLength: 200,
            rows: 2,
            placeholder: mode === "reject" ? "Explique o motivo da rejeição..." : "Feedback opcional para o aluno...",
            className: "mt-1 w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "mt-2 flex flex-wrap gap-1.5", children: quickComments.map((q) => /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setComment(q),
            className: "min-h-11 rounded-lg border border-border bg-background px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:border-primary/40 hover:text-primary",
            children: q
          },
          q
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(DialogFooter, { className: "shrink-0 gap-2 border-t border-border/60 bg-card px-6 py-4 shadow-soft", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          disabled: loading,
          onClick: () => submit("reject"),
          className: "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg bg-destructive px-4 py-2 text-sm font-bold text-destructive-foreground shadow-soft hover:opacity-90 disabled:opacity-60",
          children: [
            /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
            " Rejeitar"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          disabled: loading,
          onClick: () => submit("approve"),
          className: "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg bg-success px-5 py-2 text-sm font-bold text-success-foreground shadow-soft hover:opacity-90 disabled:opacity-60",
          children: [
            /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }),
            " Aprovar"
          ]
        }
      )
    ] })
  ] }) });
}
const partnerTypes = ["Vegetais", "Padaria", "Educação", "Ferramentas", "Reciclagem", "Outros"];
function AddPartnerModal({ open, onOpenChange, onCreate }) {
  const [name, setName] = useState("");
  const [type, setType] = useState(partnerTypes[0]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    if (name.trim().length < 2) return toast.error("Informe um nome válido");
    if (!email.includes("@")) return toast.error("E-mail inválido");
    setLoading(true);
    try {
      await onCreate?.({ name: name.trim(), type, email: email.trim(), phone: phone.trim() });
      toast.success("Parceiro adicionado", {
        description: `${name} (${type}) cadastrado com sucesso.`
      });
      setName("");
      setEmail("");
      setPhone("");
      setType(partnerTypes[0]);
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível adicionar o parceiro");
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-md overflow-hidden rounded-xl border-border/60 p-0 sm:p-0", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-gradient-hero p-6 text-primary-foreground", children: /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsx(DialogTitle, { className: "text-xl font-bold", children: "Adicionar parceiro" }),
      /* @__PURE__ */ jsx(DialogDescription, { className: "text-white/80", children: "Cadastre um comércio local para oferecer recompensas." })
    ] }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 p-6", children: [
      /* @__PURE__ */ jsx(Field$1, { icon: Building2, label: "Nome do parceiro", children: /* @__PURE__ */ jsx(
        "input",
        {
          value: name,
          onChange: (e) => setName(e.target.value),
          maxLength: 60,
          placeholder: "Horta da Esquina",
          className: inputCls$1
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "text-xs font-bold uppercase tracking-wide text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Tag, { className: "mr-1 inline h-3 w-3" }),
          " Categoria"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 flex flex-wrap gap-1.5", children: partnerTypes.map((t) => /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setType(t),
            className: `rounded-full border px-3 py-1 text-xs font-bold transition-colors ${type === t ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/40"}`,
            children: t
          },
          t
        )) })
      ] }),
      /* @__PURE__ */ jsx(Field$1, { icon: Mail, label: "E-mail de contato", children: /* @__PURE__ */ jsx(
        "input",
        {
          type: "email",
          value: email,
          onChange: (e) => setEmail(e.target.value),
          maxLength: 120,
          placeholder: "contato@parceiro.com",
          className: inputCls$1
        }
      ) }),
      /* @__PURE__ */ jsx(Field$1, { icon: Phone, label: "Telefone", children: /* @__PURE__ */ jsx(
        "input",
        {
          value: phone,
          onChange: (e) => setPhone(e.target.value),
          maxLength: 20,
          placeholder: "(11) 99999-0000",
          className: inputCls$1
        }
      ) }),
      /* @__PURE__ */ jsxs(DialogFooter, { className: "gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => onOpenChange(false),
            className: "min-h-11 rounded-lg border border-border bg-background px-4 py-2 text-sm font-bold text-foreground hover:bg-muted",
            children: "Cancelar"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: loading,
            className: "min-h-11 rounded-lg bg-primary px-5 py-2 text-sm font-bold text-primary-foreground shadow-soft hover:bg-primary/90 disabled:opacity-60",
            children: loading ? "Adicionando..." : "Adicionar parceiro"
          }
        )
      ] })
    ] })
  ] }) });
}
const inputCls$1 = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
function Field$1({
  icon: Icon,
  label,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("label", { className: "text-xs font-bold uppercase tracking-wide text-muted-foreground", children: [
      /* @__PURE__ */ jsx(Icon, { className: "mr-1 inline h-3 w-3" }),
      " ",
      label
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-1", children })
  ] });
}
function RewardFormModal({
  open,
  onOpenChange,
  reward,
  partners,
  endpoint,
  onSaved
}) {
  const [title, setTitle] = useState("");
  const [partner, setPartner] = useState("");
  const [points, setPoints] = useState(100);
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState("");
  const [active, setActive] = useState(true);
  useEffect(() => {
    if (!open) return;
    setTitle(reward?.titulo ?? "");
    setPartner(reward?.parceiro_id ? String(reward.parceiro_id) : "");
    setPoints(Number(reward?.pontos_necessarios ?? 100));
    setImage(null);
    setImageError("");
    setActive(reward ? Boolean(reward.ativo) : true);
  }, [open, reward]);
  const preview = useMemo(
    () => image ? URL.createObjectURL(image) : reward?.imagem ?? "",
    [image, reward?.imagem]
  );
  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);
  const mutation = useMutation({
    mutationFn: () => {
      const form = new FormData();
      form.append("titulo", title.trim());
      form.append("parceiro_id", partner);
      form.append("pontos_necessarios", String(points));
      form.append("ativo", active ? "1" : "0");
      if (image) form.append("foto", image);
      return apiFetch(reward ? `${endpoint}/${reward.id}` : endpoint, {
        method: "POST",
        body: form
      });
    },
    onSuccess: (r) => {
      toast.success(r.mensagem);
      onOpenChange(false);
      onSaved();
    },
    onError: (e) => toast.error(e.message)
  });
  function submit(e) {
    e.preventDefault();
    if (!title.trim() || points < 1) return toast.error("Informe título e pontos válidos");
    if (!image && !reward?.imagem) {
      setImageError("Selecione uma imagem para criar a recompensa.");
      return toast.error("Adicione uma imagem à recompensa");
    }
    mutation.mutate();
  }
  function selectImage(file) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setImage(null);
      setImageError("Use uma imagem JPG, PNG ou WebP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImage(null);
      setImageError("A imagem deve ter no máximo 5 MB.");
      return;
    }
    setImage(file);
    setImageError("");
  }
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "min-w-0 max-w-md overflow-hidden rounded-xl border-border/60 p-0 sm:p-0", children: [
    /* @__PURE__ */ jsx("div", { className: "min-w-0 rounded-t-xl bg-gradient-hero p-6 pr-20 text-primary-foreground", children: /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2 text-xl font-bold", children: [
        /* @__PURE__ */ jsx(Gift, { className: "h-5 w-5" }),
        reward ? "Editar recompensa" : "Nova recompensa"
      ] }),
      /* @__PURE__ */ jsx(DialogDescription, { className: "text-white/80", children: "Configure o prêmio e o custo em pontos." })
    ] }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "min-w-0 space-y-4 overflow-x-hidden p-6", children: [
      /* @__PURE__ */ jsx(Field, { label: "Título", children: /* @__PURE__ */ jsx("input", { value: title, onChange: (e) => setTitle(e.target.value), className: inputCls }) }),
      /* @__PURE__ */ jsx(Field, { label: "Parceiro (opcional)", children: /* @__PURE__ */ jsxs(
        "select",
        {
          value: partner,
          onChange: (e) => setPartner(e.target.value),
          className: inputCls,
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Sem parceiro" }),
            partners.map((p) => /* @__PURE__ */ jsx("option", { value: p.id, children: p.nome }, p.id))
          ]
        }
      ) }),
      /* @__PURE__ */ jsx(Field, { label: "Pontos", children: /* @__PURE__ */ jsx(
        "input",
        {
          type: "number",
          min: 1,
          value: points,
          onChange: (e) => setPoints(Number(e.target.value)),
          className: inputCls
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "text-xs font-bold uppercase tracking-wide text-muted-foreground", children: [
          "Imagem ",
          /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative mt-1 min-w-0", children: [
          /* @__PURE__ */ jsxs(
            "label",
            {
              className: `flex min-h-24 w-full min-w-0 cursor-pointer items-center gap-3 overflow-hidden rounded-xl border-2 border-dashed bg-background/60 p-3 transition-colors hover:bg-primary/5 ${image ? "pr-14" : ""} ${imageError ? "border-destructive" : "border-border hover:border-primary/50"}`,
              children: [
                /* @__PURE__ */ jsx("div", { className: "grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-lg bg-primary/10 text-primary", children: isImageSource(preview) ? /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: preview.startsWith("blob:") ? preview : backendAsset(preview),
                    alt: "Prévia da recompensa",
                    className: "h-full w-full object-cover"
                  }
                ) : preview ? /* @__PURE__ */ jsx("span", { className: "text-2xl", "aria-hidden": "true", children: preview }) : /* @__PURE__ */ jsx(Upload, { className: "h-5 w-5", "aria-hidden": "true" }) }),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsx("div", { className: "max-w-full truncate text-sm font-bold text-foreground", children: image ? image.name : preview ? "Imagem atual" : "Buscar imagem no dispositivo" }),
                  /* @__PURE__ */ jsx("div", { id: "reward-image-help", className: "text-xs text-muted-foreground", children: "JPG, PNG ou WebP · até 5 MB" })
                ] }),
                !image && /* @__PURE__ */ jsx(Camera, { className: "h-5 w-5 shrink-0 text-primary", "aria-hidden": "true" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "file",
                    accept: "image/jpeg,image/png,image/webp",
                    "aria-invalid": Boolean(imageError),
                    "aria-describedby": imageError ? "reward-image-error" : "reward-image-help",
                    className: "sr-only",
                    onChange: (event) => selectImage(event.target.files?.[0] ?? null)
                  },
                  image ? `${image.name}-${image.lastModified}` : "empty"
                )
              ]
            }
          ),
          image ? /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              "aria-label": "Remover imagem selecionada",
              onClick: () => setImage(null),
              className: "absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
              children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4", "aria-hidden": "true" })
            }
          ) : null
        ] }),
        imageError && /* @__PURE__ */ jsx(
          "p",
          {
            id: "reward-image-error",
            className: "mt-1.5 text-xs font-medium text-destructive",
            role: "alert",
            children: imageError
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm font-semibold", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked: active,
            onChange: (e) => setActive(e.target.checked),
            className: "h-4 w-4 accent-primary"
          }
        ),
        "Recompensa ativa"
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { className: "grid grid-cols-2 gap-2 space-x-0 sm:space-x-0", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => onOpenChange(false),
            className: "min-h-11 w-full min-w-0 rounded-lg border border-border px-4 py-2 text-sm font-bold",
            children: "Cancelar"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            disabled: mutation.isPending,
            className: "min-h-11 w-full min-w-0 rounded-lg bg-primary px-5 py-2 text-sm font-bold text-primary-foreground disabled:opacity-60",
            children: mutation.isPending ? "Salvando..." : "Salvar"
          }
        )
      ] })
    ] })
  ] }) });
}
const inputCls = "w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
function Field({ label, children }) {
  return /* @__PURE__ */ jsxs("label", { className: "block min-w-0", children: [
    /* @__PURE__ */ jsx("span", { className: "mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground", children: label }),
    children
  ] });
}
const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold cursor-pointer transition-[background-color,color,border-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-[var(--primary-hover)] active:bg-[var(--primary-active)]",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-card hover:border-primary/30 hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/75",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-11 px-4 py-2.5",
        sm: "min-h-9 h-9 rounded-md px-3 text-xs",
        lg: "h-12 px-6",
        icon: "h-11 w-11"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
const AlertDialogPortal = AlertDialogPrimitive.Portal;
const AlertDialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;
const AlertDialogContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsx(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsx(
    AlertDialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;
const AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
const AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;
const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AlertDialogPrimitive.Action, { ref, className: cn(buttonVariants(), className), ...props }));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;
const AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Cancel,
  {
    ref,
    className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
    ...props
  }
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;
function RewardManagement({ endpoint, title }) {
  const key = ["gestao-recompensas", endpoint];
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const { data, isLoading, error } = useQuery({
    queryKey: key,
    enabled: isBrowser,
    queryFn: () => apiFetch(
      endpoint
    )
  });
  const remove = useMutation({
    mutationFn: (id) => apiFetch(`${endpoint}/${id}`, { method: "DELETE" }),
    onSuccess: async (r) => {
      toast.success(r.mensagem);
      await queryClient.invalidateQueries({ queryKey: key });
    },
    onError: (e) => toast.error(e.message)
  });
  if (isLoading)
    return /* @__PURE__ */ jsx("div", { className: "p-6 text-center text-muted-foreground", children: "Carregando recompensas..." });
  if (error || !data)
    return /* @__PURE__ */ jsx("div", { className: "p-6 text-center text-destructive", children: error?.message ?? "Não foi possível carregar" });
  return /* @__PURE__ */ jsxs("section", { className: "rounded-lg border border-border/60 bg-card p-6 shadow-soft", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("h2", { className: "flex items-center gap-2 text-sm font-bold uppercase tracking-wide", children: [
        /* @__PURE__ */ jsx(Gift, { className: "h-4 w-4 text-primary" }),
        title
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => {
            setEditing(null);
            setOpen(true);
          },
          className: "inline-flex min-h-11 items-center gap-1 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground",
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
            "Nova recompensa"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 grid gap-3 sm:grid-cols-2", children: data.recompensas.map((r) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex items-center gap-3 rounded-lg border border-border/60 bg-background/60 p-3",
        children: [
          /* @__PURE__ */ jsx("div", { className: "grid h-10 w-10 place-items-center rounded-lg bg-accent text-primary", children: isImageSource(r.imagem) ? /* @__PURE__ */ jsx(
            "img",
            {
              src: backendAsset(r.imagem),
              alt: "",
              className: "h-full w-full rounded-lg object-cover"
            }
          ) : r.imagem ? /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: r.imagem }) : /* @__PURE__ */ jsx(Gift, { className: "h-5 w-5", "aria-hidden": "true" }) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "truncate font-bold", children: r.titulo }),
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
              r.parceiro ?? "Sem parceiro",
              " · ",
              r.pontos_necessarios,
              " pts ·",
              " ",
              r.ativo ? "Ativa" : "Inativa"
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              "aria-label": `Editar ${r.titulo}`,
              onClick: () => {
                setEditing(r);
                setOpen(true);
              },
              className: "grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary",
              children: /* @__PURE__ */ jsx(Edit, { className: "h-3.5 w-3.5" })
            }
          ),
          /* @__PURE__ */ jsxs(AlertDialog, { children: [
            /* @__PURE__ */ jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
              "button",
              {
                "aria-label": `Excluir ${r.titulo}`,
                className: "grid h-11 w-11 place-items-center rounded-lg bg-destructive/10 text-destructive",
                children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
              }
            ) }),
            /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
              /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Excluir recompensa?" }),
                /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Ela deixará de aparecer para os alunos." })
              ] }),
              /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancelar" }),
                /* @__PURE__ */ jsx(
                  AlertDialogAction,
                  {
                    onClick: () => remove.mutate(r.id),
                    className: "bg-destructive text-destructive-foreground",
                    children: "Excluir"
                  }
                )
              ] })
            ] })
          ] })
        ]
      },
      r.id
    )) }),
    /* @__PURE__ */ jsx(
      RewardFormModal,
      {
        open,
        onOpenChange: setOpen,
        reward: editing,
        partners: data.parceiros,
        endpoint,
        onSaved: () => void queryClient.invalidateQueries({ queryKey: key })
      }
    )
  ] });
}
const $$splitComponentImporter$2 = () => import("./admin-C81FfQu8.js");
const Route$3 = createFileRoute("/admin")({
  head: () => ({
    meta: [{
      title: "Administração — Viridis"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
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
const $$splitComponentImporter$1 = () => import("./index-vl-HP4Dc.js");
const Route$2 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Viridis — Plataforma gamificada de hortas escolares"
    }, {
      name: "description",
      content: "Educação socioemocional, nutrição e sustentabilidade através de hortas escolares interativas."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./convite-professor._token-gUTBwU4z.js");
const Route$1 = createFileRoute("/convite-professor/$token")({
  head: () => ({
    meta: [{
      title: "Convite de professor — Viridis"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const Route = createFileRoute("/admin/quiz")({
  beforeLoad: () => {
    throw redirect({ to: "/cursos" });
  }
});
const RegistroRoute = Route$f.update({
  id: "/registro",
  path: "/registro",
  getParentRoute: () => Route$g
});
const RecompensasRoute = Route$e.update({
  id: "/recompensas",
  path: "/recompensas",
  getParentRoute: () => Route$g
});
const RankingRoute = Route$d.update({
  id: "/ranking",
  path: "/ranking",
  getParentRoute: () => Route$g
});
const ProfessorRoute = Route$c.update({
  id: "/professor",
  path: "/professor",
  getParentRoute: () => Route$g
});
const PerfilRoute = Route$b.update({
  id: "/perfil",
  path: "/perfil",
  getParentRoute: () => Route$g
});
const LoginRoute = Route$a.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$g
});
const JardimRoute = Route$9.update({
  id: "/jardim",
  path: "/jardim",
  getParentRoute: () => Route$g
});
const HorariosRoute = Route$8.update({
  id: "/horarios",
  path: "/horarios",
  getParentRoute: () => Route$g
});
const HistoricoRoute = Route$7.update({
  id: "/historico",
  path: "/historico",
  getParentRoute: () => Route$g
});
const DiretorRoute = Route$6.update({
  id: "/diretor",
  path: "/diretor",
  getParentRoute: () => Route$g
});
const CursosRoute = Route$5.update({
  id: "/cursos",
  path: "/cursos",
  getParentRoute: () => Route$g
});
const AprenderRoute = Route$4.update({
  id: "/aprender",
  path: "/aprender",
  getParentRoute: () => Route$g
});
const AdminRoute = Route$3.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$g
});
const IndexRoute = Route$2.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$g
});
const ConviteProfessorTokenRoute = Route$1.update({
  id: "/convite-professor/$token",
  path: "/convite-professor/$token",
  getParentRoute: () => Route$g
});
const AdminQuizRoute = Route.update({
  id: "/quiz",
  path: "/quiz",
  getParentRoute: () => AdminRoute
});
const AdminRouteChildren = {
  AdminQuizRoute
};
const AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AdminRoute: AdminRouteWithChildren,
  AprenderRoute,
  CursosRoute,
  DiretorRoute,
  HistoricoRoute,
  HorariosRoute,
  JardimRoute,
  LoginRoute,
  PerfilRoute,
  ProfessorRoute,
  RankingRoute,
  RecompensasRoute,
  RegistroRoute,
  ConviteProfessorTokenRoute
};
const routeTree = Route$g._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  AlertDialog as A,
  Button as B,
  router as C,
  Dialog as D,
  OperationalPage as O,
  PageShell as P,
  Route$9 as R,
  apiFetch as a,
  DialogContent as b,
  backendAsset as c,
  DialogHeader as d,
  DialogTitle as e,
  DialogDescription as f,
  DialogFooter as g,
  isBrowser as h,
  isImageSource as i,
  cn as j,
  buttonVariants as k,
  useAuth as l,
  missionTypes as m,
  AlertDialogTrigger as n,
  AlertDialogContent as o,
  AlertDialogHeader as p,
  AlertDialogTitle as q,
  AlertDialogDescription as r,
  AlertDialogFooter as s,
  AlertDialogCancel as t,
  userQuery as u,
  AlertDialogAction as v,
  RewardManagement as w,
  ReviewActivityModal as x,
  AddPartnerModal as y,
  Route$1 as z
};
