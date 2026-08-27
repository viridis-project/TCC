import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ArrowLeft, User, Mail, Phone, Users, Bell, Sun, Save, LogOut, Camera } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { apiFetch, userQuery } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/perfil")({
  head: () => ({ meta: [{ title: "Perfil — Viridis" }] }),
  component: ProfilePage,
});

const inputCls = "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15";

function ProfilePage() {
  const { data: user, isLoading, error } = useQuery(userQuery());
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", turma: "", avatar: "" });
  const [notif, setNotif] = useState(true);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({ nome: user.nome, email: user.email, telefone: user.telefone ?? "", turma: user.turma ?? "", avatar: user.avatar ?? "" });
    setNotif(user.notificacoes_ativas);
    setDark(user.tema_escuro);
    document.documentElement.classList.toggle("dark", user.tema_escuro);
  }, [user]);

  const save = useMutation({
    mutationFn: () => apiFetch<{ mensagem: string }>("/perfil", {
      method: "PUT",
      body: JSON.stringify({ ...form, notificacoes_ativas: notif, tema_escuro: dark }),
    }),
    onSuccess: async (result) => {
      toast.success(result.mensagem);
      await queryClient.invalidateQueries({ queryKey: ["perfil"] });
    },
    onError: (e) => toast.error(e.message),
  });

  const logout = useMutation({
    mutationFn: () => apiFetch<{ mensagem: string }>("/auth/logout", { method: "POST" }),
    onSuccess: async (result) => {
      queryClient.clear();
      toast.success(result.mensagem);
      await navigate({ to: "/login" });
    },
    onError: (e) => toast.error(e.message),
  });

  function field(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  if (isLoading) return <PageShell><div className="mx-auto max-w-2xl px-4 py-16 text-center text-muted-foreground">Carregando perfil...</div></PageShell>;
  if (error || !user) return <PageShell><div className="mx-auto max-w-2xl px-4 py-16 text-center"><p className="text-destructive">{error?.message ?? "Faça login para acessar seu perfil"}</p><Link to="/login" className="mt-4 inline-block font-bold text-primary">Ir para o login</Link></div></PageShell>;

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Link to="/" className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card"><ArrowLeft className="h-4 w-4" /></Link>
          <div><h1 className="text-xl font-extrabold">Editar Perfil</h1><p className="text-xs text-muted-foreground">Dados sincronizados com sua conta Viridis</p></div>
        </div>

        <div className="mb-6 flex flex-col items-center">
          <div className="relative">
            {form.avatar ? <img src={form.avatar} alt={user.nome} className="h-24 w-24 rounded-3xl object-cover shadow-elevated" /> : <div className="grid h-24 w-24 place-items-center rounded-3xl bg-gradient-hero text-3xl font-extrabold text-primary-foreground shadow-elevated">{user.nome.charAt(0)}</div>}
            <span className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full bg-card text-primary shadow-soft ring-2 ring-background"><Camera className="h-4 w-4" /></span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">Nível {user.nivel} · {user.pontos_totais} pontos · {user.xp} XP</div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-5">
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
            <h2 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest"><User className="h-4 w-4 text-primary" /> Informações pessoais</h2>
            <Field icon={User} label="Nome completo"><input value={form.nome} onChange={(e) => field("nome", e.target.value)} required className={inputCls} /></Field>
            <Field icon={Mail} label="E-mail"><input value={form.email} onChange={(e) => field("email", e.target.value)} required type="email" className={inputCls} /></Field>
            <Field icon={Phone} label="Telefone"><input value={form.telefone} onChange={(e) => field("telefone", e.target.value)} className={inputCls} /></Field>
            <Field icon={Users} label="Turma"><input value={form.turma} onChange={(e) => field("turma", e.target.value)} maxLength={20} className={inputCls} /></Field>
            <Field icon={Camera} label="URL do avatar"><input value={form.avatar} onChange={(e) => field("avatar", e.target.value)} placeholder="https://..." className={inputCls} /></Field>
          </motion.section>

          <section className="space-y-3 rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
            <h2 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest"><Bell className="h-4 w-4 text-primary" /> Preferências</h2>
            <Toggle icon={Bell} label="Notificações" active={notif} onClick={() => setNotif((v) => !v)} />
            <Toggle icon={Sun} label="Tema escuro" active={dark} onClick={() => { const next=!dark; setDark(next); document.documentElement.classList.toggle("dark", next); }} />
          </section>

          <button disabled={save.isPending} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-extrabold uppercase tracking-wider text-primary-foreground disabled:opacity-60"><Save className="h-4 w-4" /> {save.isPending ? "Salvando..." : "Salvar alterações"}</button>
          <button type="button" onClick={() => logout.mutate()} disabled={logout.isPending} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-3 text-sm font-bold text-destructive"><LogOut className="h-4 w-4" /> Sair da conta</button>
        </form>
      </div>
    </PageShell>
  );
}

function Field({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><Icon className="h-3.5 w-3.5" /> {label}</span>{children}</label>;
}

function Toggle({ icon: Icon, label, active, onClick }: { icon: React.ElementType; label: string; active: boolean; onClick: () => void }) {
  return <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 p-3.5"><div className="flex items-center gap-3"><Icon className="h-4 w-4 text-primary" /><span className="text-sm font-semibold">{label}</span></div><button type="button" onClick={onClick} className={`relative h-6 w-11 rounded-full ${active ? "bg-success" : "bg-muted"}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-all ${active ? "left-[22px]" : "left-0.5"}`} /></button></div>;
}
