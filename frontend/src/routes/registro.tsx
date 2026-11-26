import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import {
  AuthField,
  AuthHeading,
  AuthLayout,
  AuthLogo,
  AuthSubmit,
  AuthSwitch,
} from "@/components/auth-ui";

export const Route = createFileRoute("/registro")({
  head: () => ({ meta: [{ title: "Criar conta — Viridis" }] }),
  component: RegisterPage,
});

type RegisterField = "email" | "username" | "classCode" | "password";
type Values = Record<RegisterField, string>;

// Mesmas regras aplicadas pelo backend em /auth/registro.
function validate({ email, username, classCode, password }: Values) {
  const errors: Partial<Record<RegisterField, string>> = {};
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

/** 0–4: tamanho mínimo, maiúscula, número e um extra (12+ caracteres ou símbolo). */
function passwordScore(pwd: string) {
  return (
    Number(pwd.length >= 8) +
    Number(/[A-Z]/.test(pwd)) +
    Number(/\d/.test(pwd)) +
    Number(pwd.length >= 12 || /[^\p{L}\p{N}]/u.test(pwd))
  );
}

const STRENGTH = [
  { label: "Fraco", bar: "bg-destructive", badge: "bg-destructive/15 text-destructive" },
  { label: "Bom", bar: "bg-lime", badge: "bg-lime/20 text-moss" },
  { label: "Forte", bar: "bg-primary", badge: "bg-primary/15 text-primary" },
] as const;

function strengthLevel(score: number) {
  return score >= 4 ? STRENGTH[2] : score === 3 ? STRENGTH[1] : STRENGTH[0];
}

function StrengthBadge({ score }: { score: number }) {
  const level = strengthLevel(score);
  return (
    <motion.span
      key={level.label}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${level.badge}`}
      aria-live="polite"
    >
      {level.label}
    </motion.span>
  );
}

function StrengthBar({ score }: { score: number }) {
  const level = strengthLevel(score);
  return (
    <div className="mt-2 flex gap-1.5" aria-hidden="true">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={false}
            animate={{ scaleX: score >= step ? 1 : 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ transformOrigin: "left" }}
            className={`h-full ${level.bar}`}
          />
        </div>
      ))}
    </div>
  );
}

function RegisterPage() {
  const [values, setValues] = useState<Values>({
    email: "",
    username: "",
    classCode: "",
    password: "",
  });
  const [touched, setTouched] = useState<Partial<Record<RegisterField, boolean>>>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const errors = validate(values);
  const score = passwordScore(values.password);
  const visibleError = (field: RegisterField) => (touched[field] ? errors[field] : undefined);
  const touch = (field: RegisterField) => setTouched((current) => ({ ...current, [field]: true }));
  const bind = (field: RegisterField, transform: (value: string) => string = (v) => v) => ({
    value: values[field],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((current) => ({ ...current, [field]: transform(e.target.value) })),
    onBlur: () => touch(field),
    error: visibleError(field),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const firstInvalid = (Object.keys(errors) as RegisterField[])[0];
    if (firstInvalid) {
      setTouched({ email: true, username: true, classCode: true, password: true });
      document.getElementById(`registro-${firstInvalid}`)?.focus();
      return;
    }
    setLoading(true);
    try {
      const result = await apiFetch<{ mensagem: string }>("/auth/registro", {
        method: "POST",
        body: JSON.stringify({
          email: values.email,
          username: values.username,
          nome: values.username,
          senha: values.password,
          codigo_turma: values.classCode,
        }),
      });
      toast.success(result.mensagem);
      await navigate({ to: "/perfil" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível criar a conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      panelSide="left"
      eyebrow="Comunidade Viridis"
      title="Sua jornada começa com uma pequena semente."
      description="Crie sua conta para aprender, cuidar da horta escolar e acompanhar o impacto construído em conjunto."
    >
      <AuthLogo />
      <AuthHeading
        title="Registrar na Viridis"
        description="Junte-se a vários outros que já estão se divertindo enquanto fazem uma boa ação."
      />

      <form onSubmit={handleSubmit} noValidate className="mt-8">
        <fieldset disabled={loading} className="m-0 min-w-0 space-y-4 border-0 p-0">
          <AuthField
            id="registro-email"
            label="E-mail"
            type="email"
            required
            autoComplete="email"
            placeholder="seu.email@example.com"
            {...bind("email")}
          />
          <AuthField
            id="registro-username"
            label="Nome de usuário"
            required
            autoComplete="username"
            minLength={3}
            maxLength={50}
            placeholder="Como devemos te chamar?"
            {...bind("username")}
          />
          <AuthField
            id="registro-classCode"
            label="Código da turma"
            required
            maxLength={10}
            className="font-bold uppercase tracking-wide placeholder:font-normal"
            placeholder="7A-K3P9"
            hint="Peça o código para o seu professor ou responsável"
            {...bind("classCode", (value) => value.toUpperCase())}
          />
          <AuthField
            id="registro-password"
            label="Senha"
            reveal
            required
            autoComplete="new-password"
            placeholder="Digite sua senha aqui"
            labelAside={values.password ? <StrengthBadge score={score} /> : undefined}
            below={values.password ? <StrengthBar score={score} /> : undefined}
            {...bind("password")}
          />
          <AuthSubmit loading={loading} label="Criar conta" loadingLabel="Criando..." />
        </fieldset>
        <AuthSwitch prompt="Já tem conta?" to="/login" label="Entrar" />
      </form>
    </AuthLayout>
  );
}
