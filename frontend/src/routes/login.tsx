import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { apiFetch, type User } from "@/lib/api";
import { homePathFor } from "@/lib/nav";
import {
  AuthField,
  AuthHeading,
  AuthLayout,
  AuthLogo,
  AuthSubmit,
  AuthSwitch,
} from "@/components/auth-ui";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — Viridis" }] }),
  component: LoginPage,
});

type LoginField = "login" | "password";

function validate(login: string, password: string): Partial<Record<LoginField, string>> {
  const errors: Partial<Record<LoginField, string>> = {};
  if (!login.trim()) errors.login = "Informe seu usuário ou e-mail";
  if (!password) errors.password = "Informe sua senha";
  return errors;
}

function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState<Partial<Record<LoginField, boolean>>>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const errors = validate(login, password);
  const visibleError = (field: LoginField) => (touched[field] ? errors[field] : undefined);
  const touch = (field: LoginField) => setTouched((current) => ({ ...current, [field]: true }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const firstInvalid = (Object.keys(errors) as LoginField[])[0];
    if (firstInvalid) {
      setTouched({ login: true, password: true });
      document.getElementById(`login-${firstInvalid}`)?.focus();
      return;
    }
    setLoading(true);
    try {
      const result = await apiFetch<{ mensagem: string; usuario: User }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ login, senha: password }),
      });
      queryClient.setQueryData(["perfil"], result.usuario);
      toast.success(result.mensagem);
      // mesmo mapeamento de antes (aluno → /aprender, professor → /professor, diretor → /diretor, demais → /admin)
      await navigate({ to: homePathFor(result.usuario.perfil_nome) });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível entrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      panelSide="right"
      eyebrow="Aprendizagem sustentável"
      title="Cultive conhecimento, transforme sua escola."
      description="Uma experiência de aprendizagem conectada à prática, à comunidade e ao impacto real da horta escolar."
    >
      <AuthLogo />
      <AuthHeading
        title="Login na Viridis"
        description="Entre na sua conta para aproveitar todas as funcionalidades."
      />

      <form onSubmit={handleSubmit} noValidate className="mt-8">
        <fieldset disabled={loading} className="m-0 min-w-0 space-y-4 border-0 p-0">
          <AuthField
            id="login-login"
            label="Usuário ou e-mail"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            onBlur={() => touch("login")}
            error={visibleError("login")}
            required
            autoComplete="username"
            placeholder="Seu nome de usuário ou e-mail"
          />
          <AuthField
            id="login-password"
            label="Sua senha"
            reveal
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => touch("password")}
            error={visibleError("password")}
            required
            autoComplete="current-password"
            placeholder="Digite sua senha aqui"
          />
          <AuthSubmit loading={loading} label="Login" loadingLabel="Entrando..." />
        </fieldset>
        <AuthSwitch prompt="Não tem conta?" to="/registro" label="Criar conta" />
      </form>
    </AuthLayout>
  );
}
