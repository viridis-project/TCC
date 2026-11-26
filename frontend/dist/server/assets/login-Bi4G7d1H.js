import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { a as apiFetch, j as homePathFor } from "./router-eJvIn0Kb.js";
import { A as AuthLayout, a as AuthLogo, b as AuthHeading, c as AuthField, d as AuthSubmit, e as AuthSwitch } from "./auth-ui-Bl7QHjS1.js";
import "motion/react";
import "recharts";
import "lucide-react";
import "@radix-ui/react-dialog";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./auth-brand-panel-Csh7AqVc.js";
function validate(login, password) {
  const errors = {};
  if (!login.trim()) errors.login = "Informe seu usuário ou e-mail";
  if (!password) errors.password = "Informe sua senha";
  return errors;
}
function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const errors = validate(login, password);
  const visibleError = (field) => touched[field] ? errors[field] : void 0;
  const touch = (field) => setTouched((current) => ({
    ...current,
    [field]: true
  }));
  async function handleSubmit(e) {
    e.preventDefault();
    const firstInvalid = Object.keys(errors)[0];
    if (firstInvalid) {
      setTouched({
        login: true,
        password: true
      });
      document.getElementById(`login-${firstInvalid}`)?.focus();
      return;
    }
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
      await navigate({
        to: homePathFor(result.usuario.perfil_nome)
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível entrar");
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxs(AuthLayout, { panelSide: "right", eyebrow: "Aprendizagem sustentável", title: "Cultive conhecimento, transforme sua escola.", description: "Uma experiência de aprendizagem conectada à prática, à comunidade e ao impacto real da horta escolar.", children: [
    /* @__PURE__ */ jsx(AuthLogo, {}),
    /* @__PURE__ */ jsx(AuthHeading, { title: "Login na Viridis", description: "Entre na sua conta para aproveitar todas as funcionalidades." }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, noValidate: true, className: "mt-8", children: [
      /* @__PURE__ */ jsxs("fieldset", { disabled: loading, className: "m-0 min-w-0 space-y-4 border-0 p-0", children: [
        /* @__PURE__ */ jsx(AuthField, { id: "login-login", label: "Usuário ou e-mail", value: login, onChange: (e) => setLogin(e.target.value), onBlur: () => touch("login"), error: visibleError("login"), required: true, autoComplete: "username", placeholder: "Seu nome de usuário ou e-mail" }),
        /* @__PURE__ */ jsx(AuthField, { id: "login-password", label: "Sua senha", reveal: true, value: password, onChange: (e) => setPassword(e.target.value), onBlur: () => touch("password"), error: visibleError("password"), required: true, autoComplete: "current-password", placeholder: "Digite sua senha aqui" }),
        /* @__PURE__ */ jsx(AuthSubmit, { loading, label: "Login", loadingLabel: "Entrando..." })
      ] }),
      /* @__PURE__ */ jsx(AuthSwitch, { prompt: "Não tem conta?", to: "/registro", label: "Criar conta" })
    ] })
  ] });
}
export {
  LoginPage as component
};
