import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { Sprout, EyeOff, Eye, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { a as apiFetch } from "./router-_glEtDMC.js";
import { A as AuthBrandPanel } from "./auth-brand-panel-CWdHy31Q.js";
import "@tanstack/react-query";
import "recharts";
import "@radix-ui/react-dialog";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-slot";
import "class-variance-authority";
function RegisterPage() {
  const [show, setShow] = useState(false);
  const [pwd, setPwd] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [classCode, setClassCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const strength = Math.min(100, pwd.length * 12 + (/[A-Z]/.test(pwd) ? 20 : 0) + (/\d/.test(pwd) ? 20 : 0));
  const label = strength < 40 ? "Fraco" : strength < 75 ? "Bom" : "Forte";
  const color = strength < 40 ? "bg-destructive" : strength < 75 ? "bg-warning" : "bg-success";
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await apiFetch("/auth/registro", {
        method: "POST",
        body: JSON.stringify({
          email,
          username,
          nome: username,
          senha: pwd,
          codigo_turma: classCode
        })
      });
      toast.success(result.mensagem);
      await navigate({
        to: "/perfil"
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível criar a conta");
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "auth-shell grid lg:grid-cols-2", children: [
    /* @__PURE__ */ jsx(AuthBrandPanel, { eyebrow: "Comunidade Viridis", title: "Sua jornada começa com uma pequena semente.", description: "Crie sua conta para aprender, cuidar da horta escolar e acompanhar o impacto construído em conjunto." }),
    /* @__PURE__ */ jsxs(motion.section, { initial: {
      opacity: 0,
      x: 20
    }, animate: {
      opacity: 1,
      x: 0
    }, className: "flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "mb-12 inline-flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "grid h-11 w-11 place-items-center rounded-xl bg-gradient-hero text-primary-foreground", children: /* @__PURE__ */ jsx(Sprout, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxs("div", { className: "leading-tight", children: [
          /* @__PURE__ */ jsx("div", { className: "text-base font-bold tracking-tight", children: "VIRIDIS" }),
          /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium uppercase tracking-wide text-muted-foreground", children: "Cultivando Sustentabilidade" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-sm", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-foreground sm:text-4xl", children: "Registrar na Viridis" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Junte-se a vários outros que já estão se divertindo enquanto fazem uma boa ação." }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "mt-8 space-y-4", children: [
          /* @__PURE__ */ jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsx("span", { className: "mb-1.5 block text-xs font-semibold text-foreground", children: "E-mail" }),
            /* @__PURE__ */ jsx("input", { value: email, onChange: (e) => setEmail(e.target.value), required: true, autoComplete: "email", type: "email", className: "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15", placeholder: "seu.email@example.com" })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsx("span", { className: "mb-1.5 block text-xs font-semibold text-foreground", children: "Nome de usuário" }),
            /* @__PURE__ */ jsx("input", { value: username, onChange: (e) => setUsername(e.target.value), required: true, autoComplete: "username", minLength: 3, maxLength: 50, className: "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15", placeholder: "Como devemos te chamar?" })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsx("span", { className: "mb-1.5 block text-xs font-semibold text-foreground", children: "Código da turma" }),
            /* @__PURE__ */ jsx("input", { value: classCode, onChange: (e) => setClassCode(e.target.value.toUpperCase()), required: true, maxLength: 10, className: "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm font-bold uppercase tracking-wide focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15", placeholder: "7A-K3P9" }),
            /* @__PURE__ */ jsx("span", { className: "mt-1.5 block text-[11px] text-muted-foreground", children: "Peça o código para o seu professor ou responsável" })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-1.5 flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-foreground", children: "Senha" }),
              pwd && /* @__PURE__ */ jsx("span", { className: `rounded-full px-2 py-0.5 text-[10px] font-bold ${strength < 40 ? "bg-destructive/15 text-destructive" : strength < 75 ? "bg-warning/15 text-warning" : "bg-success/15 text-success"}`, children: label })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("input", { type: show ? "text" : "password", value: pwd, onChange: (e) => setPwd(e.target.value), required: true, autoComplete: "new-password", className: "w-full rounded-xl border border-input bg-background px-4 py-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15", placeholder: "Digite sua senha aqui" }),
              /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setShow((v) => !v), className: "absolute right-1 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground", "aria-label": show ? "Ocultar senha" : "Mostrar senha", "aria-pressed": show, children: show ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }) })
            ] }),
            pwd && /* @__PURE__ */ jsx("div", { className: "mt-2 h-1.5 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsx(motion.div, { animate: {
              width: `${strength}%`
            }, className: `h-full ${color}` }) })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsx("input", { type: "checkbox", className: "h-4 w-4 rounded border-input" }),
            " Lembrar de mim"
          ] }),
          /* @__PURE__ */ jsxs(motion.button, { type: "submit", whileTap: {
            scale: 0.99
          }, disabled: loading, className: "mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-[var(--primary-hover)] disabled:opacity-60", children: [
            loading ? "Criando..." : "Criar conta",
            " ",
            /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-center text-xs text-muted-foreground", children: [
            "Já tem conta?",
            " ",
            /* @__PURE__ */ jsx(Link, { to: "/login", className: "font-bold text-primary hover:underline", children: "Entrar" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  RegisterPage as component
};
