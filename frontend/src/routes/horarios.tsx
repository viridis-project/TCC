import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { motion } from "motion/react";
import { User, Plus } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { apiFetch, isBrowser, type Mission } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { ScheduleMissionModal } from "@/components/modals/schedule-mission-modal";
import { ScheduleCalendar, type ScheduleCalendarItem } from "@/components/schedule-calendar";
import { toast } from "sonner";

export const Route = createFileRoute("/horarios")({
  head: () => ({ meta: [{ title: "Horários — Viridis" }] }),
  component: SchedulePage,
});
type Agenda = ScheduleCalendarItem;
type PublishedMission = {
  id: number;
  titulo: string;
  descricao: string;
  instrucoes?: string | null;
  imagem?: string | null;
  pontos: number;
  max_alunos: number;
  modo_participacao?: "aberto" | "particular";
  participantes: number;
  ativa: number | string;
  status: "disponivel" | "agendada" | "concluida";
  professor?: string;
  criador?: string;
  turma?: string;
  horario?: string | null;
  participando?: number | boolean;
};
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
  const endpoint =
    role === "admin"
      ? "/agenda/professor"
      : role === "professor"
        ? "/agenda/professor"
        : role === "diretor"
          ? "/agenda/diretor"
          : "/agenda/aluno";
  const { data, isLoading, error } = useQuery({
    queryKey: ["agenda", role],
    enabled: isBrowser && !!role,
    retry: false,
    queryFn: async () => {
      const agenda = await apiFetch<{
        agenda: Agenda[];
        turmas?: Classroom[];
        missoes_publicadas?: PublishedMission[];
      }>(endpoint);
      let missions: Mission[] = [];
      if (role === "professor" || role === "admin")
        missions = (await apiFetch<{ missoes: Mission[] }>("/missoes")).missoes;
      return {
        agenda: agenda.agenda,
        turmas: agenda.turmas ?? [],
        missions,
        publishedMissions: agenda.missoes_publicadas ?? [],
      };
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
          ids.length > 1 ? `${ids.length} missões atualizadas com sucesso` : results[0].mensagem,
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
  const professor = role === "professor" || role === "admin" || role === "diretor";
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
                    ? "Acompanhe as missões publicadas e os horários dos alunos"
                    : `Veja os horários de todos os alunos da turma${user.turma ? ` · ${user.turma}` : ""}`}
                </p>
              </div>
            </div>
            {professor && (
              <button
                onClick={() => setModal(true)}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-primary"
                aria-label="Nova missão"
              >
                <Plus className="h-4 w-4" />
                Nova missão
              </button>
            )}
          </div>
        </motion.section>
        {data.publishedMissions.length > 0 && (
          <section className="mt-6 space-y-3" aria-labelledby="published-missions-title">
            <div>
              <h2 id="published-missions-title" className="text-lg font-bold text-foreground">
                Missões publicadas
              </h2>
              <p className="text-sm text-muted-foreground">
                As missões ficam disponíveis para adesão; depois de reservar um horário, a
                participação aparece no calendário abaixo.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {data.publishedMissions.map((mission) => {
                const active = Number(mission.ativa ?? 1) === 1;
                const enrolled = Boolean(Number(mission.participando ?? 0));
                const statusLabel = !active
                  ? "Encerrada"
                  : mission.status === "concluida"
                    ? "Concluída"
                    : mission.status === "agendada" || mission.horario
                      ? "Com horário reservado"
                      : "Disponível";
                return (
                  <article
                    key={mission.id}
                    className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-soft"
                  >
                    {mission.imagem && (
                      <img
                        src={mission.imagem}
                        alt={`Imagem da missão ${mission.titulo}`}
                        className="h-36 w-full object-cover"
                        loading="lazy"
                      />
                    )}
                    <div className="space-y-3 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-bold text-foreground">{mission.titulo}</h3>
                        <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold text-muted-foreground">
                          {statusLabel}
                        </span>
                      </div>
                      <p className="line-clamp-3 text-sm text-muted-foreground">
                        {mission.descricao || "Sem descrição adicional."}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span>{mission.pontos} pontos</span>
                        <span>
                          {mission.participantes}/{mission.max_alunos} participantes
                        </span>
                        {mission.turma && <span>Turma {mission.turma}</span>}
                        {mission.professor && <span>Por {mission.professor}</span>}
                        {mission.criador && <span>Por {mission.criador}</span>}
                      </div>
                      {role === "aluno" && (
                        <Link
                          to="/jardim"
                          className="inline-flex min-h-10 items-center rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90"
                        >
                          {enrolled ? "Abrir minha missão" : "Ver e aderir no Jardim"}
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
        <ScheduleCalendar
          items={data.agenda}
          professor={professor}
          updating={status.isPending}
          onStatus={(ids, value) => status.mutate({ ids, value })}
        />
      </div>
      <ScheduleMissionModal
        open={modal}
        onOpenChange={setModal}
        turmas={data.turmas}
        missions={data.missions}
        onCreated={() => void queryClient.invalidateQueries({ queryKey: ["agenda"] })}
      />
    </PageShell>
  );
}
