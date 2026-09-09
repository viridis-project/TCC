import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Mail, RefreshCw, Trash2 } from "lucide-react";
import { apiFetch, isBrowser } from "@/lib/api";
import { toast } from "sonner";

type Invite = {
  id: number;
  email: string;
  status: "pendente" | "aceito" | "expirado";
  criado_em: string;
  expira_em: string;
};
export function TeacherInviteManagement() {
  const [email, setEmail] = useState("");
  const [link, setLink] = useState("");
  const queryClient = useQueryClient();
  const key = ["diretor-convites"];
  const { data = [], isLoading } = useQuery({
    queryKey: key,
    enabled: isBrowser,
    queryFn: async () =>
      (await apiFetch<{ convites: Invite[] }>("/diretor/convites-professor")).convites,
  });
  const send = useMutation({
    mutationFn: (address: string) =>
      apiFetch<{ mensagem: string; link: string }>("/diretor/convites-professor", {
        method: "POST",
        body: JSON.stringify({ email: address }),
      }),
    onSuccess: async (r) => {
      toast.success("Convite enviado");
      setLink(r.link);
      setEmail("");
      await queryClient.invalidateQueries({ queryKey: key });
    },
    onError: (e) => toast.error(e.message),
  });
  const cancel = useMutation({
    mutationFn: (id: number) =>
      apiFetch<{ mensagem: string }>(`/diretor/convites-professor/${id}`, { method: "DELETE" }),
    onSuccess: async (r) => {
      toast.success(r.mensagem);
      await queryClient.invalidateQueries({ queryKey: key });
    },
    onError: (e) => toast.error(e.message),
  });
  async function copy(value: string) {
    await navigator.clipboard.writeText(value);
    toast.success("Link copiado");
  }
  return (
    <section className="rounded-lg border border-border/60 bg-card p-6 shadow-soft">
      <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
        <Mail className="h-4 w-4 text-primary" />
        Professores
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Convide professores com um link seguro de uso único.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!email.trim()) return toast.error("Informe o e-mail");
          send.mutate(email);
        }}
        className="mt-4 flex gap-2"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-w-0 flex-1 rounded-xl border border-input bg-background px-3 py-2.5 text-sm"
          placeholder="professor@escola.edu.br"
        />
        <button
          disabled={send.isPending}
          className="min-h-11 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
        >
          {send.isPending ? "Enviando..." : "Enviar convite"}
        </button>
      </form>
      {link && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 p-3">
          <code className="min-w-0 flex-1 truncate text-xs">{link}</code>
          <button
            onClick={() => copy(link)}
            className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
      <div className="mt-4 space-y-2">
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Carregando convites...</div>
        ) : (
          data.map((invite) => (
            <div
              key={invite.id}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 p-3"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold">{invite.email}</div>
                <div className="text-[11px] text-muted-foreground">
                  Expira em {new Date(invite.expira_em).toLocaleString("pt-BR")}
                </div>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${invite.status === "aceito" ? "bg-success/15 text-success" : invite.status === "expirado" ? "bg-destructive/10 text-destructive" : "bg-warning/15 text-warning"}`}
              >
                {invite.status}
              </span>
              {invite.status === "expirado" ? (
                <button
                  onClick={() => send.mutate(invite.email)}
                  className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary"
                  title="Reenviar"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              ) : invite.status === "pendente" ? (
                <button
                  onClick={() => cancel.mutate(invite.id)}
                  className="grid h-11 w-11 place-items-center rounded-full bg-destructive/10 text-destructive"
                  title="Cancelar"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
