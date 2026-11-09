import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { User, Plus } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { apiFetch, isBrowser } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { MissionFormModal } from "@/components/modals/mission-form-modal";
import { SubmitProofModal, type ProofTarget } from "@/components/modals/submit-proof-modal";
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
  const [proof, setProof] = useState<ProofTarget | null>(null);
  const endpoint = role === "admin" ? "/agenda/professor" : role === "professor" ? "/agenda/professor" : role === "diretor" ? "/agenda/diretor" : "/agenda/aluno";
  const { data, isLoading, error } = useQuery({
    queryKey: ["agenda", role],
    enabled: isBrowser && !!role,
    retry: false,
    queryFn: async () => {
      const result = await apiFetch<{ agenda: Agenda[]; turmas?: Classroom[] }>(endpoint);
      return { agenda: result.agenda, turmas: result.turmas ?? [] };
    },
  });
  const status = useMutation({
    mutationFn: async ({ ids, value }: { ids: number[]; value: "cancelado" }) => {
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
          ids.length > 1 ? `${ids.length} turnos cancelados com sucesso` : results[0].mensagem,
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
                    ? "Publique missões e acompanhe os turnos que os alunos reservaram"
                    : `Veja os horários de todos os alunos da turma${user.turma ? ` · ${user.turma}` : ""}`}
                </p>
              </div>
            </div>
            {professor && role !== "diretor" && (
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
        <ScheduleCalendar
          items={data.agenda}
          professor={professor}
          updating={status.isPending}
          onStatus={(ids, value) => status.mutate({ ids, value })}
          onSubmitProof={
            role === "aluno"
              ? (item) =>
                  setProof({
                    id: Number(item.missao_id),
                    titulo: item.titulo,
                    pontos: Number(item.pontos ?? 0),
                    equipe: Number(item.participantes ?? 1) > 1,
                  })
              : undefined
          }
        />
      </div>
      {professor && role !== "diretor" && (
        <MissionFormModal
          open={modal}
          onOpenChange={setModal}
          turmas={data.turmas}
          onCreated={() => void queryClient.invalidateQueries({ queryKey: ["agenda"] })}
        />
      )}
      <SubmitProofModal
        mission={proof}
        onOpenChange={(open) => !open && setProof(null)}
        onSubmitted={() => {
          void queryClient.invalidateQueries({ queryKey: ["agenda"] });
          void queryClient.invalidateQueries({ queryKey: ["jardim"] });
          void queryClient.invalidateQueries({ queryKey: ["historico"] });
        }}
      />
    </PageShell>
  );
}
