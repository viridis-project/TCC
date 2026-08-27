import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { Eye, EyeOff, Sprout, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { apiFetch, type User } from "@/lib/api";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — Viridis" }] }),
  component: LoginPage,
});

function LoginPage() {
  const [show, setShow] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await apiFetch<{ mensagem: string; usuario: User }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ login, senha: password }),
      });
      queryClient.setQueryData(["perfil"], result.usuario);
      toast.success(result.mensagem);
      await navigate({ to: result.usuario.perfil_nome === "aluno" ? "/aprender" : "/admin" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível entrar");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <motion.section
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20"
      >
        <Link to="/" className="mb-12 inline-flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-hero text-primary-foreground"><Sprout className="h-5 w-5" /></div>
          <div className="leading-tight">
            <div className="text-base font-extrabold tracking-tight">VIRIDIS</div>
            <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Cultivando Sustentabilidade</div>
          </div>
        </Link>

        <div className="max-w-sm">
          <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">Login na Viridis</h1>
          <p className="mt-2 text-sm text-muted-foreground">Entre na sua conta para aproveitar todas as funcionalidades.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">User name</span>
              <input value={login} onChange={(e) => setLogin(e.target.value)} required autoComplete="username" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15" placeholder="Seu nome de usuário ou e-mail" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">Sua senha</span>
              <div className="relative">
                <input value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" type={show ? "text" : "password"} className="w-full rounded-xl border border-input bg-background px-4 py-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15" placeholder="Digite sua senha aqui" />
                <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="h-4 w-4 rounded border-input" /> Lembrar de mim
              </label>
              <button type="button" className="font-semibold text-primary hover:underline">Esqueceu a senha?</button>
            </div>

            <motion.button
              type="submit" whileHover={{ y: -2 }} whileTap={{ y: 1 }}
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3.5 text-sm font-extrabold uppercase tracking-wider text-background shadow-elevated transition-all hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Login"} <ArrowRight className="h-4 w-4" />
            </motion.button>

            <p className="text-center text-xs text-muted-foreground">
              Não tem conta? <Link to="/registro" className="font-bold text-primary hover:underline">Criar conta</Link>
            </p>
          </form>
        </div>
      </motion.section>

      <motion.aside
        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
        className="relative hidden overflow-hidden bg-gradient-hero lg:block"
      >
        <div className="absolute inset-0 opacity-30 mix-blend-overlay"
          style={{ backgroundImage: "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative flex h-full flex-col items-center justify-center gap-6 p-12 text-center text-primary-foreground">
          <motion.div
            animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="text-9xl"
          >🌿</motion.div>
          <h2 className="max-w-md text-3xl font-extrabold leading-tight">Cultive conhecimento, colha sustentabilidade</h2>
          <p className="max-w-md text-sm text-white/80">Aprendizado gamificado que transforma sua escola num jardim de impacto real.</p>
        </div>
      </motion.aside>
    </div>
  );
}
