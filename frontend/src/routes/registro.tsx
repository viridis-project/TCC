import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { Eye, EyeOff, Sprout, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { AuthBrandPanel } from "@/components/auth-brand-panel";

export const Route = createFileRoute("/registro")({
  head: () => ({ meta: [{ title: "Criar conta — Viridis" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const [show, setShow] = useState(false);
  const [pwd, setPwd] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [classCode, setClassCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const strength = Math.min(
    100,
    pwd.length * 12 + (/[A-Z]/.test(pwd) ? 20 : 0) + (/\d/.test(pwd) ? 20 : 0),
  );
  const label = strength < 40 ? "Fraco" : strength < 75 ? "Bom" : "Forte";
  const color = strength < 40 ? "bg-destructive" : strength < 75 ? "bg-warning" : "bg-success";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await apiFetch<{ mensagem: string }>("/auth/registro", {
        method: "POST",
        body: JSON.stringify({
          email,
          username,
          nome: username,
          senha: pwd,
          codigo_turma: classCode,
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
    <div className="auth-shell grid lg:grid-cols-2">
      <AuthBrandPanel
        eyebrow="Comunidade Viridis"
        title="Sua jornada começa com uma pequena semente."
        description="Crie sua conta para aprender, cuidar da horta escolar e acompanhar o impacto construído em conjunto."
      />

      <motion.section
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20"
      >
        <Link to="/" className="mb-12 inline-flex items-center gap-2">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-hero text-primary-foreground">
            <Sprout className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-base font-bold tracking-tight">VIRIDIS</div>
            <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Cultivando Sustentabilidade
            </div>
          </div>
        </Link>

        <div className="max-w-sm">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Registrar na Viridis</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Junte-se a vários outros que já estão se divertindo enquanto fazem uma boa ação.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-foreground">E-mail</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                type="email"
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                placeholder="seu.email@example.com"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-foreground">
                Nome de usuário
              </span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                minLength={3}
                maxLength={50}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                placeholder="Como devemos te chamar?"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-foreground">
                Código da turma
              </span>
              <input
                value={classCode}
                onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                required
                maxLength={10}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm font-bold uppercase tracking-wide focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                placeholder="7A-K3P9"
              />
              <span className="mt-1.5 block text-[11px] text-muted-foreground">
                Peça o código para o seu professor ou responsável
              </span>
            </label>
            <label className="block">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">Senha</span>
                {pwd && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      strength < 40
                        ? "bg-destructive/15 text-destructive"
                        : strength < 75
                          ? "bg-warning/15 text-warning"
                          : "bg-success/15 text-success"
                    }`}
                  >
                    {label}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                  placeholder="Digite sua senha aqui"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-1 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label={show ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={show}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {pwd && (
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div animate={{ width: `${strength}%` }} className={`h-full ${color}`} />
                </div>
              )}
            </label>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input type="checkbox" className="h-4 w-4 rounded border-input" /> Lembrar de mim
            </label>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.99 }}
              disabled={loading}
              className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-[var(--primary-hover)] disabled:opacity-60"
            >
              {loading ? "Criando..." : "Criar conta"} <ArrowRight className="h-4 w-4" />
            </motion.button>
            <p className="text-center text-xs text-muted-foreground">
              Já tem conta?{" "}
              <Link to="/login" className="font-bold text-primary hover:underline">
                Entrar
              </Link>
            </p>
          </form>
        </div>
      </motion.section>
    </div>
  );
}
