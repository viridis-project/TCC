import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Calendar, Check, User, Plus, X } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { apiFetch, isBrowser, type Mission } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { ScheduleTaskModal } from "@/components/modals/schedule-task-modal";
import { toast } from "sonner";

export const Route = createFileRoute("/horarios")({
  head: () => ({ meta: [{ title: "Horários — Viridis" }] }),
  component: SchedulePage,
});
type Agenda = {
  id: number;
  titulo: string;
  data_hora: string;
  status: "agendado" | "concluido" | "cancelado";
  missao: string | null;
  turma?: string;
  aluno?: string;
};
type Classroom = {
  id: number;
  nome: string;
  ano_letivo: number;
  alunos: { id: number; nome: string }[];
};
const startOfWeek = () => {
  const d = new Date();
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  d.setHours(0, 0, 0, 0);
  return d;
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
    mutationFn: ({ id, value }: { id: number; value: "concluido" | "cancelado" }) =>
      apiFetch<{ mensagem: string }>(`/agenda/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: value }),
      }),
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
  const monday = startOfWeek();
  const days = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d;
  });
  const professor = role === "professor" || role === "admin";
  const showClassmates = professor || role === "aluno";
  const hours = Array.from(
    new Set([
      7,
      9,
      11,
      13,
      15,
      ...data.agenda.map((item) => new Date(item.data_hora.replace(" ", "T")).getHours()),
    ]),
  ).sort((a, b) => a - b);
  const same = (raw: string, day: Date, hour: number) => {
    const d = new Date(raw.replace(" ", "T"));
    return (
      d.getFullYear() === day.getFullYear() &&
      d.getMonth() === day.getMonth() &&
      d.getDate() === day.getDate() &&
      d.getHours() === hour
    );
  };
  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl bg-gradient-hero p-6 text-primary-foreground shadow-elevated"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold">
                  {professor ? "Agenda das turmas" : user.nome}
                </h1>
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
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-primary"
              >
                <Plus className="h-4 w-4" />
            {professor ? "Nova tarefa" : null}
              </button>
            )}
          </div>
        </motion.section>
        <div className="mt-6 overflow-x-auto rounded-3xl border border-border/60 bg-card p-3 shadow-soft">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr>
                <th className="w-20 p-2"></th>
                {days.map((d) => (
                  <th
                    key={d.toISOString()}
                    className="p-3 text-xs font-bold uppercase tracking-wide text-muted-foreground"
                  >
                    {d.toLocaleDateString("pt-BR", {
                      weekday: "short",
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map((hour) => (
                <tr key={hour}>
                  <td className="border-r border-border/60 p-3 text-right text-sm font-extrabold">
                    {String(hour).padStart(2, "0")}:00
                  </td>
                  {days.map((day) => {
                    const entries = data.agenda.filter((a) => same(a.data_hora, day, hour));
                    return (
                      <td
                        key={day.toISOString()}
                        className="h-28 border-b border-border/40 p-1.5 align-top"
                      >
                        {entries.map((item) => (
                          <div
                            key={item.id}
                            className={`mb-1 rounded-xl border p-2 text-xs ${item.status === "concluido" ? "border-success/30 bg-success/10" : item.status === "cancelado" ? "border-destructive/30 bg-destructive/5" : "border-primary/30 bg-primary/5"}`}
                          >
                            <div className="font-extrabold">{item.titulo}</div>
                            <div className="mt-0.5 text-muted-foreground">
                              {new Date(item.data_hora.replace(" ", "T")).toLocaleTimeString(
                                "pt-BR",
                                { hour: "2-digit", minute: "2-digit" },
                              )}
                            </div>
                            {professor && (
                              <div className="mt-1 text-muted-foreground">
                                {item.turma} · {item.aluno}
                              </div>
                            )}
                            <div className="mt-1 flex items-center justify-between">
                              <span className="capitalize text-muted-foreground">
                                {item.status}
                              </span>
                              {professor && item.status === "agendado" && (
                                <span className="flex gap-1">
                                  <button
                                    onClick={() =>
                                      status.mutate({ id: item.id, value: "concluido" })
                                    }
                                    className="grid h-6 w-6 place-items-center rounded-full bg-success text-success-foreground"
                                  >
                                    <Check className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      status.mutate({ id: item.id, value: "cancelado" })
                                    }
                                    className="grid h-6 w-6 place-items-center rounded-full bg-destructive text-destructive-foreground"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                        {entries.length === 0 && (
                          <div className="grid h-full place-items-center text-muted-foreground/30">
                            <Calendar className="h-4 w-4" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
