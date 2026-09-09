import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { User, Plus } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { apiFetch, isBrowser, type Mission } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { ScheduleTaskModal } from "@/components/modals/schedule-task-modal";
import { ScheduleCalendar, type ScheduleCalendarItem } from "@/components/schedule-calendar";
import { toast } from "sonner";

export const Route = createFileRoute("/horarios")({
  head: () => ({ meta: [{ title: "Horários — Viridis" }] }),
  component: SchedulePage,
});
type Agenda = ScheduleCalendarItem;
type Classroom = {
  id: number;
  nome: string;
  ano_letivo: number;
  alunos: { id: number; nome: string }[];
};
function SchedulePage() {
  const { user, role, isLoading: loadingUser, error: userError } = useAuth();
  const queryClient = useQueryClient();
  const [modal, setModal] = useState(false);
  const endpoint = role === "professor" || role === "admin" ? "/agenda/professor" : "/agenda/aluno";
  const { data, isLoading, error } = useQuery({
    queryKey: ["agenda", role],
    enabled: isBrowser && !!role && role !== "diretor",
    retry: false,
    queryFn: async () => {
      const agenda = await apiFetch<{ agenda: Agenda[]; turmas?: Classroom[] }>(endpoint);
      let missions: Mission[] = [];
      if (role === "professor" || role === "admin")
        missions = (await apiFetch<{ missoes: Mission[] }>("/missoes")).missoes;
      return { agenda: agenda.agenda, turmas: agenda.turmas ?? [], missions };
    },
  });
  const status = useMutation({
    mutationFn: async ({ ids, value }: { ids: number[]; value: "concluido" | "cancelado" }) => {
      const results = await Promise.all(
        ids.map((id) =>
          apiFetch<{ mensagem: string }>(`/agenda/${id}/status`, {
            method: "PUT",
            body: JSON.stringify({ status: value }),
          }),
        ),
      );
      return {
        mensagem:
          ids.length > 1 ? `${ids.length} tarefas atualizadas com sucesso` : results[0].mensagem,
      };
    },
    onSuccess: async (r) => {
      toast.success(r.mensagem);
      await queryClient.invalidateQueries({ queryKey: ["agenda"] });
    },
    onError: (e) => toast.error(e.message),
  });
  if (loadingUser)
    return (
      <PageShell>
        <div className="p-16 text-center text-muted-foreground">Carregando agenda...</div>
      </PageShell>
    );
  if (role === "diretor")
    return (
      <PageShell>
        <div className="p-16 text-center text-muted-foreground">
          A gestão da direção está disponível no painel Diretor.
        </div>
      </PageShell>
    );
  if (isLoading)
    return (
      <PageShell>
        <div className="p-16 text-center text-muted-foreground">Carregando agenda...</div>
      </PageShell>
    );
  if (userError || error || !user || !data)
    return (
      <PageShell>
        <div className="p-16 text-center text-destructive">
          {userError?.message ?? error?.message ?? "Agenda indisponível"}
        </div>
      </PageShell>
    );
  const professor = role === "professor" || role === "admin";
  const showClassmates = professor || role === "aluno";
  return (
    <PageShell>
      <div className="app-page">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-xl bg-gradient-hero p-6 text-primary-foreground shadow-soft"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-white/15">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{professor ? "Agenda das turmas" : user.nome}</h1>
                <p className="text-xs text-white/70">
                  {professor
                    ? "Acompanhe e organize as tarefas dos alunos"
                    : `Veja os horários de todos os alunos da turma${user.turma ? ` · ${user.turma}` : ""}`}
                </p>
              </div>
            </div>
            {showClassmates && (
              <button
                onClick={() => setModal(true)}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-primary"
                aria-label="Nova tarefa"
              >
                <Plus className="h-4 w-4" />
                {professor ? "Nova tarefa" : null}
              </button>
            )}
          </div>
        </motion.section>
        <ScheduleCalendar
          items={data.agenda}
          professor={professor}
          updating={status.isPending}
          onStatus={(ids, value) => status.mutate({ ids, value })}
        />
      </div>
      <ScheduleTaskModal
        open={modal}
        onOpenChange={setModal}
        turmas={data.turmas}
        missions={data.missions}
        onCreated={() => void queryClient.invalidateQueries({ queryKey: ["agenda"] })}
      />
    </PageShell>
  );
}
