import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Mail, RefreshCw, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { apiFetch, isBrowser } from "@/lib/api";

type School = { id: number; nome: string; total_turmas: number };
type Invite = {
  id: number;
  email: string;
  instituicao_id: number;
  instituicao_nome: string;
  status: "pendente" | "aceito" | "expirado";
  criado_em: string;
  expira_em: string;
};

export function DirectorInviteManagement() {
  const [email, setEmail] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [link, setLink] = useState("");
  const queryClient = useQueryClient();
  const key = ["admin-convites-diretor"];
  const schoolsQuery = useQuery({
    queryKey: ["admin-escolas-convites"],
    enabled: isBrowser,
    queryFn: async () => (await apiFetch<{ escolas: School[] }>("/jardim/escolas")).escolas,
  });
  const invitesQuery = useQuery({
    queryKey: key,
    enabled: isBrowser,
    queryFn: async () => (await apiFetch<{ convites: Invite[] }>("/admin/convites-diretor")).convites,
  });
  const create = useMutation({
    mutationFn: (input: { email: string; instituicao_id: number }) =>
      apiFetch<{ mensagem: string; link: string }>("/admin/convites-diretor", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: async (result) => {
      setLink(result.link);
      setEmail("");
      toast.success(result.mensagem);
      await queryClient.invalidateQueries({ queryKey: key });
    },
    onError: (error) => toast.error(error.message),
  });
  const cancel = useMutation({
    mutationFn: (id: number) =>
      apiFetch<{ mensagem: string }>(`/admin/convites-diretor/${id}`, { method: "DELETE" }),
    onSuccess: async (result) => {
      toast.success(result.mensagem);
      await queryClient.invalidateQueries({ queryKey: key });
    },
    onError: (error) => toast.error(error.message),
  });

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Link copiado");
    } catch {
      toast.error("Não foi possível copiar o link neste dispositivo");
    }
  }

  const schools = schoolsQuery.data ?? [];
  return (
    <section className="min-w-0 rounded-lg border border-border/60 bg-card p-4 shadow-soft sm:p-6">
      <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
        <UserPlus className="h-4 w-4 shrink-0 text-primary" />
        Convites de diretores e gestores
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Crie um convite de uso único vinculado à escola. O link expira em 7 dias.
      </p>

      {schoolsQuery.isError ? (
        <p className="mt-4 text-sm text-destructive">{schoolsQuery.error.message}</p>
      ) : schoolsQuery.isLoading ? (
        <p className="mt-4 text-sm text-muted-foreground">Carregando escolas...</p>
      ) : schools.length === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          Cadastre uma escola antes de criar um convite para a direção.
        </p>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!schoolId) return toast.error("Selecione uma escola");
            create.mutate({ email: email.trim(), instituicao_id: Number(schoolId) });
          }}
          className="mt-4 grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(12rem,0.8fr)_auto]"
        >
          <input
            type="email"
            required
            maxLength={150}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="min-w-0 rounded-xl border border-input bg-background px-3 py-2.5 text-sm"
            placeholder="diretor@escola.edu.br"
            aria-label="E-mail do novo diretor"
          />
          <select
            required
            value={schoolId}
            onChange={(event) => setSchoolId(event.target.value)}
            className="min-w-0 rounded-xl border border-input bg-background px-3 py-2.5 text-sm"
            aria-label="Escola do novo diretor"
          >
            <option value="">Selecione a escola</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.nome}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={create.isPending}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground disabled:opacity-60"
          >
            <Mail className="h-4 w-4" />
            {create.isPending ? "Criando..." : "Criar convite"}
          </button>
        </form>
      )}

      {link && (
        <div className="mt-3 flex min-w-0 items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 p-3">
          <code className="min-w-0 flex-1 break-all text-xs">{link}</code>
          <button
            type="button"
            onClick={() => void copy(link)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"
            aria-label="Copiar link do convite"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="mt-4 space-y-2">
        {invitesQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando convites...</p>
        ) : invitesQuery.isError ? (
          <p className="text-sm text-destructive">{invitesQuery.error.message}</p>
        ) : invitesQuery.data?.length ? (
          invitesQuery.data.map((invite) => (
            <div
              key={invite.id}
              className="flex min-w-0 flex-col gap-2 rounded-xl border border-border/60 bg-background/60 p-3 sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <div className="break-all text-sm font-bold">{invite.email}</div>
                <div className="text-xs text-muted-foreground">{invite.instituicao_nome}</div>
                <div className="text-[11px] text-muted-foreground">
                  Expira em {new Date(invite.expira_em).toLocaleString("pt-BR")}
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 sm:justify-start">
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${invite.status === "aceito" ? "bg-success/15 text-success" : invite.status === "expirado" ? "bg-destructive/10 text-destructive" : "bg-warning/15 text-warning"}`}
                >
                  {invite.status}
                </span>
                {invite.status === "expirado" ? (
                  <button
                    type="button"
                    onClick={() => create.mutate({ email: invite.email, instituicao_id: invite.instituicao_id })}
                    disabled={create.isPending}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary disabled:opacity-50"
                    aria-label={`Gerar novo convite para ${invite.email}`}
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                ) : invite.status === "pendente" ? (
                  <button
                    type="button"
                    onClick={() => cancel.mutate(invite.id)}
                    disabled={cancel.isPending}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-destructive/10 text-destructive disabled:opacity-50"
                    aria-label={`Cancelar convite para ${invite.email}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
            Nenhum convite de direção criado.
          </p>
        )}
      </div>
    </section>
  );
}
