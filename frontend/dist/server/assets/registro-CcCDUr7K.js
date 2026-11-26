import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { a as apiFetch } from "./router-eJvIn0Kb.js";
import { A as AuthLayout, a as AuthLogo, b as AuthHeading, c as AuthField, d as AuthSubmit, e as AuthSwitch } from "./auth-ui-Bl7QHjS1.js";
import "@tanstack/react-query";
import "recharts";
import "lucide-react";
import "@radix-ui/react-dialog";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./auth-brand-panel-Csh7AqVc.js";
function validate({
  email,
  username,
  classCode,
  password
}) {
  const errors = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = "Informe um e-mail válido";
  if (!/^[\p{L}\p{N}._-]{3,50}$/u.test(username.trim())) {
    errors.username = "Use de 3 a 50 caracteres: letras, números, ponto, hífen ou sublinhado";
  }
  if (!classCode.trim()) errors.classCode = "Informe o código da turma";
  if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    errors.password = "Use 8 ou mais caracteres, com uma letra maiúscula e um número";
  }
  return errors;
}
function passwordScore(pwd) {
  return Number(pwd.length >= 8) + Number(/[A-Z]/.test(pwd)) + Number(/\d/.test(pwd)) + Number(pwd.length >= 12 || /[^\p{L}\p{N}]/u.test(pwd));
}
const STRENGTH = [{
  label: "Fraco",
  bar: "bg-destructive",
  badge: "bg-destructive/15 text-destructive"
}, {
  label: "Bom",
  bar: "bg-lime",
  badge: "bg-lime/20 text-moss"
}, {
  label: "Forte",
  bar: "bg-primary",
  badge: "bg-primary/15 text-primary"
}];
function strengthLevel(score) {
  return score >= 4 ? STRENGTH[2] : score === 3 ? STRENGTH[1] : STRENGTH[0];
}
function StrengthBadge({
  score
}) {
  const level = strengthLevel(score);
  return /* @__PURE__ */ jsx(motion.span, { initial: {
    opacity: 0,
    scale: 0.9
  }, animate: {
    opacity: 1,
    scale: 1
  }, className: `rounded-full px-2 py-0.5 text-[10px] font-bold ${level.badge}`, "aria-live": "polite", children: level.label }, level.label);
}
function StrengthBar({
  score
}) {
  const level = strengthLevel(score);
  return /* @__PURE__ */ jsx("div", { className: "mt-2 flex gap-1.5", "aria-hidden": "true", children: [1, 2, 3, 4].map((step) => /* @__PURE__ */ jsx("div", { className: "h-1.5 flex-1 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsx(motion.div, { initial: false, animate: {
    scaleX: score >= step ? 1 : 0
  }, transition: {
    duration: 0.25,
    ease: "easeOut"
  }, style: {
    transformOrigin: "left"
  }, className: `h-full ${level.bar}` }) }, step)) });
}
function RegisterPage() {
  const [values, setValues] = useState({
    email: "",
    username: "",
    classCode: "",
    password: ""
  });
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const errors = validate(values);
  const score = passwordScore(values.password);
  const visibleError = (field) => touched[field] ? errors[field] : void 0;
  const touch = (field) => setTouched((current) => ({
    ...current,
    [field]: true
  }));
  const bind = (field, transform = (v) => v) => ({
    value: values[field],
    onChange: (e) => setValues((current) => ({
      ...current,
      [field]: transform(e.target.value)
    })),
    onBlur: () => touch(field),
    error: visibleError(field)
  });
  async function handleSubmit(e) {
    e.preventDefault();
    const firstInvalid = Object.keys(errors)[0];
    if (firstInvalid) {
      setTouched({
        email: true,
        username: true,
        classCode: true,
        password: true
      });
      document.getElementById(`registro-${firstInvalid}`)?.focus();
      return;
    }
    setLoading(true);
    try {
      const result = await apiFetch("/auth/registro", {
        method: "POST",
        body: JSON.stringify({
          email: values.email,
          username: values.username,
          nome: values.username,
          senha: values.password,
          codigo_turma: values.classCode
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
  return /* @__PURE__ */ jsxs(AuthLayout, { panelSide: "left", eyebrow: "Comunidade Viridis", title: "Sua jornada começa com uma pequena semente.", description: "Crie sua conta para aprender, cuidar da horta escolar e acompanhar o impacto construído em conjunto.", children: [
    /* @__PURE__ */ jsx(AuthLogo, {}),
    /* @__PURE__ */ jsx(AuthHeading, { title: "Registrar na Viridis", description: "Junte-se a vários outros que já estão se divertindo enquanto fazem uma boa ação." }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, noValidate: true, className: "mt-8", children: [
      /* @__PURE__ */ jsxs("fieldset", { disabled: loading, className: "m-0 min-w-0 space-y-4 border-0 p-0", children: [
        /* @__PURE__ */ jsx(AuthField, { id: "registro-email", label: "E-mail", type: "email", required: true, autoComplete: "email", placeholder: "seu.email@example.com", ...bind("email") }),
        /* @__PURE__ */ jsx(AuthField, { id: "registro-username", label: "Nome de usuário", required: true, autoComplete: "username", minLength: 3, maxLength: 50, placeholder: "Como devemos te chamar?", ...bind("username") }),
        /* @__PURE__ */ jsx(AuthField, { id: "registro-classCode", label: "Código da turma", required: true, maxLength: 10, className: "font-bold uppercase tracking-wide placeholder:font-normal", placeholder: "7A-K3P9", hint: "Peça o código para o seu professor ou responsável", ...bind("classCode", (value) => value.toUpperCase()) }),
        /* @__PURE__ */ jsx(AuthField, { id: "registro-password", label: "Senha", reveal: true, required: true, autoComplete: "new-password", placeholder: "Digite sua senha aqui", labelAside: values.password ? /* @__PURE__ */ jsx(StrengthBadge, { score }) : void 0, below: values.password ? /* @__PURE__ */ jsx(StrengthBar, { score }) : void 0, ...bind("password") }),
        /* @__PURE__ */ jsx(AuthSubmit, { loading, label: "Criar conta", loadingLabel: "Criando..." })
      ] }),
      /* @__PURE__ */ jsx(AuthSwitch, { prompt: "Já tem conta?", to: "/login", label: "Entrar" })
    ] })
  ] });
}
export {
  RegisterPage as component
};
