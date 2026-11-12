import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { Sprout, EyeOff, Eye, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { a as apiFetch } from "./router-_glEtDMC.js";
import { A as AuthBrandPanel } from "./auth-brand-panel-CWdHy31Q.js";
import "recharts";
import "@radix-ui/react-dialog";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-slot";
import "class-variance-authority";
function LoginPage() {
  const [show, setShow] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          login,
          senha: password
        })
      });
      queryClient.setQueryData(["perfil"], result.usuario);
      toast.success(result.mensagem);
      const destino = result.usuario.perfil_nome === "aluno" ? "/aprender" : result.usuario.perfil_nome === "professor" ? "/professor" : result.usuario.perfil_nome === "diretor" ? "/diretor" : "/admin";
      await navigate({
        to: destino
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível entrar");
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "auth-shell grid lg:grid-cols-2", children: [
    /* @__PURE__ */ jsxs(motion.section, { initial: {
      opacity: 0,
      x: -20
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
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-foreground sm:text-4xl", children: "Login na Viridis" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Entre na sua conta para aproveitar todas as funcionalidades." }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "mt-8 space-y-4", children: [
          /* @__PURE__ */ jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsx("span", { className: "mb-1.5 block text-xs font-semibold text-foreground", children: "Usuário ou e-mail" }),
            /* @__PURE__ */ jsx("input", { value: login, onChange: (e) => setLogin(e.target.value), required: true, autoComplete: "username", className: "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15", placeholder: "Seu nome de usuário ou e-mail" })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsx("span", { className: "mb-1.5 block text-xs font-semibold text-muted-foreground", children: "Sua senha" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("input", { value: password, onChange: (e) => setPassword(e.target.value), required: true, autoComplete: "current-password", type: show ? "text" : "password", className: "w-full rounded-xl border border-input bg-background px-4 py-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15", placeholder: "Digite sua senha aqui" }),
              /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setShow((v) => !v), className: "absolute right-1 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground", "aria-label": show ? "Ocultar senha" : "Mostrar senha", "aria-pressed": show, children: show ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-muted-foreground", children: [
              /* @__PURE__ */ jsx("input", { type: "checkbox", className: "h-4 w-4 rounded border-input" }),
              " Lembrar de mim"
            ] }),
            /* @__PURE__ */ jsx("button", { type: "button", className: "min-h-11 px-2 font-semibold text-primary hover:underline", children: "Esqueceu a senha?" })
          ] }),
          /* @__PURE__ */ jsxs(motion.button, { type: "submit", whileTap: {
            scale: 0.99
          }, disabled: loading, className: "mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-[var(--primary-hover)] disabled:opacity-60", children: [
            loading ? "Entrando..." : "Login",
            " ",
            /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-center text-xs text-muted-foreground", children: [
            "Não tem conta?",
            " ",
            /* @__PURE__ */ jsx(Link, { to: "/registro", className: "font-bold text-primary hover:underline", children: "Criar conta" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(AuthBrandPanel, { eyebrow: "Aprendizagem sustentável", title: "Cultive conhecimento, transforme sua escola.", description: "Uma experiência de aprendizagem conectada à prática, à comunidade e ao impacto real da horta escolar." })
  ] });
}
export {
  LoginPage as component
};
