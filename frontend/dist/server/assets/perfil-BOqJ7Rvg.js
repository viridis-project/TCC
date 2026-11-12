import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ArrowLeft, Camera, User, Mail, Phone, Users, Bell, Sun, Save, LogOut } from "lucide-react";
import { u as userQuery, a as apiFetch, P as PageShell } from "./router-_glEtDMC.js";
import { toast } from "sonner";
import "recharts";
import "@radix-ui/react-dialog";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-slot";
import "class-variance-authority";
const inputCls = "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15";
function ProfilePage() {
  const {
    data: user,
    isLoading,
    error
  } = useQuery(userQuery());
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    turma: "",
    avatar: ""
  });
  const [notif, setNotif] = useState(true);
  const [dark, setDark] = useState(false);
  useEffect(() => {
    if (!user) return;
    setForm({
      nome: user.nome,
      email: user.email,
      telefone: user.telefone ?? "",
      turma: user.turma ?? "",
      avatar: user.avatar ?? ""
    });
    setNotif(user.notificacoes_ativas);
    setDark(user.tema_escuro);
    document.documentElement.classList.toggle("dark", user.tema_escuro);
  }, [user]);
  const save = useMutation({
    mutationFn: () => apiFetch("/perfil", {
      method: "PUT",
      body: JSON.stringify({
        ...form,
        notificacoes_ativas: notif,
        tema_escuro: dark
      })
    }),
    onSuccess: async (result) => {
      toast.success(result.mensagem);
      await queryClient.invalidateQueries({
        queryKey: ["perfil"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const logout = useMutation({
    mutationFn: () => apiFetch("/auth/logout", {
      method: "POST"
    }),
    onSuccess: async (result) => {
      queryClient.clear();
      toast.success(result.mensagem);
      await navigate({
        to: "/login"
      });
    },
    onError: (e) => toast.error(e.message)
  });
  function field(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  }
  if (isLoading) return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-2xl px-4 py-16 text-center text-muted-foreground", children: "Carregando perfil..." }) });
  if (error || !user) return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl px-4 py-16 text-center", children: [
    /* @__PURE__ */ jsx("p", { className: "text-destructive", children: error?.message ?? "Faça login para acessar seu perfil" }),
    /* @__PURE__ */ jsx(Link, { to: "/login", className: "mt-4 inline-block font-bold text-primary", children: "Ir para o login" })
  ] }) });
  return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsxs("div", { className: "app-page max-w-2xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(Link, { to: "/", "aria-label": "Voltar ao início", className: "grid h-11 w-11 place-items-center rounded-lg border border-border bg-card", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold", children: "Editar Perfil" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Dados sincronizados com sua conta Viridis" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-col items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        form.avatar ? /* @__PURE__ */ jsx("img", { src: form.avatar, alt: user.nome, className: "h-24 w-24 rounded-xl object-cover shadow-soft" }) : /* @__PURE__ */ jsx("div", { className: "grid h-24 w-24 place-items-center rounded-xl bg-gradient-hero text-3xl font-bold text-primary-foreground shadow-soft", children: user.nome.charAt(0) }),
        /* @__PURE__ */ jsx("span", { className: "absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full bg-card text-primary shadow-soft ring-2 ring-background", children: /* @__PURE__ */ jsx(Camera, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-2 text-xs text-muted-foreground", children: [
        "Nível ",
        user.nivel,
        " · ",
        user.pontos_totais,
        " pontos · ",
        user.xp,
        " XP"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: (e) => {
      e.preventDefault();
      save.mutate();
    }, className: "space-y-5", children: [
      /* @__PURE__ */ jsxs(motion.section, { initial: {
        opacity: 0,
        y: 10
      }, animate: {
        opacity: 1,
        y: 0
      }, className: "space-y-4 rounded-lg border border-border/60 bg-card p-6 shadow-soft", children: [
        /* @__PURE__ */ jsxs("h2", { className: "flex items-center gap-2 text-xs font-bold uppercase tracking-wide", children: [
          /* @__PURE__ */ jsx(User, { className: "h-4 w-4 text-primary" }),
          " Informações pessoais"
        ] }),
        /* @__PURE__ */ jsx(Field, { icon: User, label: "Nome completo", children: /* @__PURE__ */ jsx("input", { value: form.nome, onChange: (e) => field("nome", e.target.value), required: true, className: inputCls }) }),
        /* @__PURE__ */ jsx(Field, { icon: Mail, label: "E-mail", children: /* @__PURE__ */ jsx("input", { value: form.email, onChange: (e) => field("email", e.target.value), required: true, type: "email", className: inputCls }) }),
        /* @__PURE__ */ jsx(Field, { icon: Phone, label: "Telefone", children: /* @__PURE__ */ jsx("input", { value: form.telefone, onChange: (e) => field("telefone", e.target.value), className: inputCls }) }),
        /* @__PURE__ */ jsx(Field, { icon: Users, label: "Turma", children: /* @__PURE__ */ jsx("input", { value: form.turma, onChange: (e) => field("turma", e.target.value), maxLength: 20, className: inputCls }) }),
        /* @__PURE__ */ jsx(Field, { icon: Camera, label: "URL do avatar", children: /* @__PURE__ */ jsx("input", { value: form.avatar, onChange: (e) => field("avatar", e.target.value), placeholder: "https://...", className: inputCls }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-3 rounded-lg border border-border/60 bg-card p-6 shadow-soft", children: [
        /* @__PURE__ */ jsxs("h2", { className: "flex items-center gap-2 text-xs font-bold uppercase tracking-wide", children: [
          /* @__PURE__ */ jsx(Bell, { className: "h-4 w-4 text-primary" }),
          " Preferências"
        ] }),
        /* @__PURE__ */ jsx(Toggle, { icon: Bell, label: "Notificações", active: notif, onClick: () => setNotif((v) => !v) }),
        /* @__PURE__ */ jsx(Toggle, { icon: Sun, label: "Tema escuro", active: dark, onClick: () => {
          const next = !dark;
          setDark(next);
          document.documentElement.classList.toggle("dark", next);
        } })
      ] }),
      /* @__PURE__ */ jsxs("button", { disabled: save.isPending, className: "flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-primary-foreground disabled:opacity-60", children: [
        /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
        " ",
        save.isPending ? "Salvando..." : "Salvar alterações"
      ] }),
      /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => logout.mutate(), disabled: logout.isPending, className: "flex w-full items-center justify-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-3 text-sm font-bold text-destructive", children: [
        /* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" }),
        " Sair da conta"
      ] })
    ] })
  ] }) });
}
function Field({
  icon: Icon,
  label,
  children
}) {
  return /* @__PURE__ */ jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxs("span", { className: "mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground", children: [
      /* @__PURE__ */ jsx(Icon, { className: "h-3.5 w-3.5" }),
      " ",
      label
    ] }),
    children
  ] });
}
function Toggle({
  icon: Icon,
  label,
  active,
  onClick
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-lg border border-border/60 bg-background/60 p-3.5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4 text-primary" }),
      /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: label })
    ] }),
    /* @__PURE__ */ jsx("button", { type: "button", role: "switch", "aria-checked": active, "aria-label": label, onClick, className: `relative h-7 w-12 rounded-full ${active ? "bg-success" : "bg-muted"}`, children: /* @__PURE__ */ jsx("span", { className: `absolute top-1 h-5 w-5 rounded-full bg-card shadow transition-all ${active ? "left-6" : "left-1"}` }) })
  ] });
}
export {
  ProfilePage as component
};
