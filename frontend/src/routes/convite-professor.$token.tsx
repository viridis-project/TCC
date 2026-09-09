import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ArrowRight, Eye, EyeOff, GraduationCap, Sprout } from "lucide-react";
import { apiFetch, isBrowser } from "@/lib/api";
import { toast } from "sonner";
import { AuthBrandPanel } from "@/components/auth-brand-panel";

export const Route = createFileRoute("/convite-professor/$token")({
  head: () => ({ meta: [{ title: "Convite de professor — Viridis" }] }),
  component: TeacherInvitePage,
});

function TeacherInvitePage() {
  const { token } = Route.useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const { data, isLoading, error } = useQuery({
    queryKey: ["convite-professor", token],
    enabled: isBrowser,
    queryFn: () =>
      apiFetch<{ convite: { email: string; instituicao_nome: string; expira_em: string } }>(
        `/convites-professor/${token}`,
      ),
    retry: false,
  });
  const accept = useMutation({
    mutationFn: () =>
      apiFetch<{ mensagem: string }>(`/convites-professor/${token}/aceitar`, {
        method: "POST",
        body: JSON.stringify({ nome: name, senha: password }),
      }),
    onSuccess: async (r) => {
      toast.success(r.mensagem);
      await navigate({ to: "/login" });
    },
    onError: (e) => toast.error(e.message),
  });
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 3) return toast.error("Informe seu nome completo");
    if (password !== confirm) return toast.error("As senhas não coincidem");
    if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password))
      return toast.error("A senha deve ter 8 caracteres, uma maiúscula e um número");
    accept.mutate();
  }
  return (
    <div className="auth-shell grid lg:grid-cols-2">
      <AuthBrandPanel
        eyebrow="Convite para educadores"
        title="Você foi convidado para ensinar na Viridis."
        description="Crie seu acesso e acompanhe o aprendizado sustentável das suas turmas."
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
          <div className="font-bold">VIRIDIS</div>
        </Link>
        <div className="max-w-sm">
          {isLoading ? (
            <div className="text-muted-foreground">Validando convite...</div>
          ) : error || !data ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
              <h1 className="text-xl font-bold text-destructive">Convite indisponível</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {error?.message ?? "O link não é válido."}
              </p>
              <Link to="/" className="mt-4 inline-block font-bold text-primary">
                Voltar à página inicial
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Criar conta de professor</h1>
                  <p className="text-sm text-muted-foreground">{data.convite.instituicao_nome}</p>
                </div>
              </div>
              <form onSubmit={submit} className="mt-8 space-y-4">
                <Field label="E-mail">
                  <input readOnly value={data.convite.email} className={`${inputCls} bg-muted`} />
                </Field>
                <Field label="Nome completo">
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputCls}
                    placeholder="Seu nome completo"
                  />
                </Field>
                <Field label="Senha">
                  <div className="relative">
                    <input
                      required
                      type={show ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${inputCls} pr-10`}
                      placeholder="Mínimo 8 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShow((value) => !value)}
                      className="absolute right-1 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-muted"
                      aria-label={show ? "Ocultar senha" : "Mostrar senha"}
                      aria-pressed={show}
                    >
                      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </Field>
                <Field label="Confirmar senha">
                  <input
                    required
                    type={show ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <button
                  disabled={accept.isPending}
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)] disabled:opacity-60"
                >
                  {accept.isPending ? "Criando..." : "Aceitar convite"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </>
          )}
        </div>
      </motion.section>
    </div>
  );
}
const inputCls =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
