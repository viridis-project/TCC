import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Sprout, School, EyeOff, Eye, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { A as AuthBrandPanel } from "./auth-brand-panel-Csh7AqVc.js";
import { G as Route, h as isBrowser, a as apiFetch } from "./router-eJvIn0Kb.js";
import "recharts";
import "@radix-ui/react-dialog";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-slot";
import "class-variance-authority";
function DirectorInvitePage() {
  const {
    token
  } = Route.useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ["convite-diretor", token],
    enabled: isBrowser,
    queryFn: () => apiFetch(`/convites-diretor/${token}`),
    retry: false
  });
  const accept = useMutation({
    mutationFn: () => apiFetch(`/convites-diretor/${token}/aceitar`, {
      method: "POST",
      body: JSON.stringify({
        nome: name,
        senha: password
      })
    }),
    onSuccess: async (result) => {
      toast.success(result.mensagem);
      await navigate({
        to: "/login"
      });
    },
    onError: (failure) => toast.error(failure.message)
  });
  function submit(event) {
    event.preventDefault();
    if (name.trim().length < 3) return toast.error("Informe seu nome completo");
    if (password !== confirm) return toast.error("As senhas não coincidem");
    if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      return toast.error("A senha deve ter 8 caracteres, uma maiúscula e um número");
    }
    accept.mutate();
  }
  return /* @__PURE__ */ jsxs("div", { className: "auth-shell grid lg:grid-cols-2", children: [
    /* @__PURE__ */ jsx(AuthBrandPanel, { eyebrow: "Convite para direção escolar", title: "Sua escola começa uma nova etapa na Viridis.", description: "Crie seu acesso para acompanhar turmas, professores e o desenvolvimento sustentável da comunidade escolar." }),
    /* @__PURE__ */ jsxs(motion.section, { initial: {
      opacity: 0,
      x: 20
    }, animate: {
      opacity: 1,
      x: 0
    }, className: "flex min-w-0 flex-col justify-center px-6 py-10 sm:px-12 sm:py-12 lg:px-20", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "mb-8 inline-flex items-center gap-2 sm:mb-12", children: [
        /* @__PURE__ */ jsx("div", { className: "grid h-11 w-11 place-items-center rounded-xl bg-gradient-hero text-primary-foreground", children: /* @__PURE__ */ jsx(Sprout, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsx("div", { className: "font-bold", children: "VIRIDIS" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full max-w-sm", children: isLoading ? /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Validando convite..." }) : error || !data ? /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-destructive/30 bg-destructive/5 p-6", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-destructive", children: "Convite indisponível" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 break-words text-sm text-muted-foreground", children: error?.message ?? "O link não é válido." }),
        /* @__PURE__ */ jsx(Link, { to: "/", className: "mt-4 inline-block font-bold text-primary", children: "Voltar à página inicial" })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(School, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold sm:text-3xl", children: "Criar conta de diretor" }),
            /* @__PURE__ */ jsx("p", { className: "break-words text-sm text-muted-foreground", children: data.convite.instituicao_nome })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "mt-8 space-y-4", children: [
          /* @__PURE__ */ jsx(Field, { label: "E-mail", children: /* @__PURE__ */ jsx("input", { readOnly: true, value: data.convite.email, className: `${inputCls} bg-muted` }) }),
          /* @__PURE__ */ jsx(Field, { label: "Nome completo", children: /* @__PURE__ */ jsx("input", { required: true, value: name, onChange: (event) => setName(event.target.value), maxLength: 150, className: inputCls, placeholder: "Seu nome completo", autoComplete: "name" }) }),
          /* @__PURE__ */ jsx(Field, { label: "Senha", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("input", { required: true, type: show ? "text" : "password", value: password, onChange: (event) => setPassword(event.target.value), className: `${inputCls} pr-12`, placeholder: "Mínimo 8 caracteres", autoComplete: "new-password" }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setShow((value) => !value), className: "absolute right-1 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-muted", "aria-label": show ? "Ocultar senha" : "Mostrar senha", "aria-pressed": show, children: show ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }) })
          ] }) }),
          /* @__PURE__ */ jsx(Field, { label: "Confirmar senha", children: /* @__PURE__ */ jsx("input", { required: true, type: show ? "text" : "password", value: confirm, onChange: (event) => setConfirm(event.target.value), className: inputCls, autoComplete: "new-password" }) }),
          /* @__PURE__ */ jsxs("button", { disabled: accept.isPending, className: "flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)] disabled:opacity-60", children: [
            accept.isPending ? "Criando..." : "Aceitar convite",
            /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
const inputCls = "w-full min-w-0 rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15";
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxs("label", { className: "block min-w-0", children: [
    /* @__PURE__ */ jsx("span", { className: "mb-1.5 block text-xs font-semibold text-muted-foreground", children: label }),
    children
  ] });
}
export {
  DirectorInvitePage as component
};
