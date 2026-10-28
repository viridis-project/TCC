import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Check, X, Medal, Calendar, Users, Bell, CheckCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { apiFetch, isBrowser } from "@/lib/api";
import { toast } from "sonner";

type Notification = {
  id: number;
  tipo: string;
  titulo: string;
  mensagem: string;
  lida: number;
  link: string | null;
  criada_em: string;
};
const icons: Record<string, React.ElementType> = {
  atividade_aprovada: Check,
  atividade_rejeitada: X,
  conquista: Medal,
  tarefa_agendada: Calendar,
  designacao_professor: Users,
  convite_tarefa: Users,
  convite_missao: Users,
};

export function NotificationsModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data = [], isLoading } = useQuery({
    queryKey: ["notificacoes"],
    enabled: isBrowser && open,
    queryFn: async () =>
      (await apiFetch<{ notificacoes: Notification[] }>("/notificacoes")).notificacoes,
  });
  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["notificacoes"] }),
      queryClient.invalidateQueries({ queryKey: ["notificacoes-contagem"] }),
    ]);
  };
  const all = useMutation({
    mutationFn: () =>
      apiFetch<{ mensagem: string }>("/notificacoes/marcar-todas-lidas", { method: "PUT" }),
    onSuccess: async (r) => {
      toast.success(r.mensagem);
      await invalidate();
    },
    onError: (e) => toast.error(e.message),
  });
  async function openNotification(item: Notification) {
    if (!item.lida) await apiFetch(`/notificacoes/${item.id}/marcar-lida`, { method: "PUT" });
    await invalidate();
    if (["atividade_aprovada", "atividade_rejeitada"].includes(item.tipo)) {
      onOpenChange(false);
      await navigate({ to: "/jardim" });
    } else if (item.link === "/horarios") {
      onOpenChange(false);
      await navigate({ to: "/horarios" });
    } else if (item.link === "/jardim") {
      onOpenChange(false);
      await navigate({ to: "/jardim" });
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg overflow-hidden rounded-xl border-border/60 p-0 sm:p-0">
        <div className="bg-gradient-hero p-6 text-primary-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Bell className="h-5 w-5" />
              Notificações
            </DialogTitle>
            <DialogDescription className="text-white/80">
              Acompanhe atividades, conquistas e sua agenda.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-5">
          <div className="mb-3 flex justify-end">
            <button
              disabled={all.isPending || data.every((n) => n.lida)}
              onClick={() => all.mutate()}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary disabled:opacity-40"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Marcar todas como lidas
            </button>
          </div>
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Carregando notificações...</div>
          ) : data.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
              Nenhuma notificação por enquanto.
            </div>
          ) : (
            <div className="space-y-2">
              {data.map((item) => {
                const Icon = icons[item.tipo] ?? Bell;
                return (
                  <button
                    key={item.id}
                    onClick={() => openNotification(item)}
                    className={`flex w-full gap-3 rounded-lg border p-4 text-left transition-colors ${item.lida ? "border-border/60 bg-background/60" : "border-primary/30 bg-primary/5"}`}
                  >
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-foreground">{item.titulo}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">{item.mensagem}</div>
                      <div className="mt-2 text-[10px] text-muted-foreground">
                        {new Date(item.criada_em).toLocaleString("pt-BR")}
                      </div>
                    </div>
                    {!item.lida && <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
