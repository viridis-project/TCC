import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiFetch, backendAsset, isBrowser, missionTypes, type Mission } from "@/lib/api";
import { DatePicker, TimePicker } from "@/components/ui/date-time-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ProofTarget } from "@/components/modals/submit-proof-modal";

const primaryBtn =
  "min-h-10 cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

/**
 * Diálogo da missão: reservar turno, aceitar convite, participar, convidar colegas
 * e abrir o envio de comprovação. Toda a lógica de API vive aqui (mesmos endpoints de antes).
 */
export function MissionDialog({
  mission,
  onClose,
  onProof,
}: {
  mission: Mission | null;
  onClose: () => void;
  onProof: (target: ProofTarget) => void;
}) {
  const queryClient = useQueryClient();
  const [participationMode, setParticipationMode] = useState<"aberto" | "particular">("aberto");
  const [inviteStudent, setInviteStudent] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskTime, setTaskTime] = useState("");

  // Cada missão aberta começa com o formulário limpo.
  useEffect(() => {
    setTaskDate("");
    setTaskTime("");
    setInviteStudent("");
    setParticipationMode("aberto");
  }, [mission?.id]);

  const { data: classmates = [] } = useQuery({
    queryKey: ["mission-classmates", mission?.id, mission?.grupo_id],
    enabled:
      isBrowser &&
      !!mission &&
      mission.max_alunos > 1 &&
      mission.modo_participacao === "particular" &&
      !!mission.grupo_id,
    queryFn: async () =>
      (
        await apiFetch<{ alunos: { id: number; nome: string }[] }>(
          `/missoes/${mission!.id}/alunos?grupo_id=${mission!.grupo_id}`,
        )
      ).alunos,
  });

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["jardim"] });
    await queryClient.invalidateQueries({ queryKey: ["missoes"] });
    await queryClient.invalidateQueries({ queryKey: ["agenda"] });
  };

  const acceptTask = async (taskId: number) => {
    if (!taskDate || !taskTime) return toast.error("Escolha a data e o horário do seu turno");
    try {
      const solo = mission?.max_alunos === 1;
      const result = await apiFetch<{ mensagem: string; grupo_id: string }>(
        `/missoes/${taskId}/aceitar`,
        {
          method: "POST",
          // Missão individual não tem escolha de quem participa.
          body: JSON.stringify({
            data_hora: `${taskDate} ${taskTime}:00`,
            ...(solo ? {} : { modo_participacao: participationMode }),
          }),
        },
      );
      toast.success(result.mensagem);
      setTaskDate("");
      setTaskTime("");
      onClose();
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível aceitar a missão");
    }
  };

  const taskAction = async (path: string, body: unknown, successMessage?: string) => {
    if (!mission) return;
    try {
      const result = await apiFetch<{ mensagem: string }>(path, {
        method: "POST",
        body: JSON.stringify(body),
      });
      toast.success(successMessage ?? result.mensagem);
      onClose();
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível atualizar a missão");
    }
  };

  return (
    <Dialog open={!!mission} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[calc(100dvh-1.5rem)] max-w-lg overflow-y-auto rounded-2xl border-border/60 p-0">
        {mission && (
          <>
            <div className="bg-gradient-garden p-6 text-white">
              <DialogHeader>
                <DialogTitle>{mission.titulo}</DialogTitle>
                <DialogDescription className="text-white/80">
                  Missão publicada por {mission.professor}
                </DialogDescription>
              </DialogHeader>
            </div>
            <div className="space-y-4 p-6">
              {mission.imagem && (
                <img
                  src={backendAsset(mission.imagem)}
                  alt=""
                  className="max-h-48 w-full rounded-lg object-cover"
                />
              )}
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {mission.descricao || "Sem instruções adicionais."}
              </p>
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="rounded-lg bg-muted p-3">
                  <strong>{mission.pontos}</strong>
                  <div className="text-xs text-muted-foreground">pontos</div>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <strong>
                    {mission.max_alunos > 1 ? `${mission.participantes}/${mission.max_alunos}` : "1"}
                  </strong>
                  <div className="text-xs text-muted-foreground">
                    {mission.max_alunos > 1 ? "participantes" : "aluno (individual)"}
                  </div>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <strong>{missionTypes[mission.tipo].label}</strong>
                  <div className="text-xs text-muted-foreground">tipo</div>
                </div>
              </div>
              {mission.horario ? (
                <p className="rounded-lg border p-3 text-sm">
                  Turno escolhido:{" "}
                  <strong>
                    {new Date(mission.horario.replace(" ", "T")).toLocaleString("pt-BR")}
                  </strong>
                  {mission.max_alunos > 1 &&
                    ` · ${mission.modo_participacao === "aberto" ? "participação aberta" : "somente por convite"}`}
                </p>
              ) : (
                <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="text-xs">
                      Data
                      <DatePicker value={taskDate} onChange={setTaskDate} />
                    </label>
                    <label className="text-xs">
                      Horário
                      <TimePicker value={taskTime} onChange={setTaskTime} />
                    </label>
                  </div>
                  {mission.max_alunos > 1 && (
                    <fieldset className="space-y-2">
                      <legend className="text-xs font-bold">Quem pode participar?</legend>
                      <label className="flex gap-2 text-sm">
                        <input
                          type="radio"
                          checked={participationMode === "aberto"}
                          onChange={() => setParticipationMode("aberto")}
                        />
                        Qualquer colega da turma
                      </label>
                      <label className="flex gap-2 text-sm">
                        <input
                          type="radio"
                          checked={participationMode === "particular"}
                          onChange={() => setParticipationMode("particular")}
                        />
                        Somente colegas que eu convidar
                      </label>
                    </fieldset>
                  )}
                </>
              )}
              {mission.envio_status && (
                <p className="rounded-lg border p-3 text-sm">
                  Comprovação:{" "}
                  <strong>
                    {mission.envio_status === "pending"
                      ? "em análise pelo professor"
                      : mission.envio_status === "approved"
                        ? "aprovada"
                        : "rejeitada"}
                  </strong>
                  {mission.envio_comentario && ` — ${mission.envio_comentario}`}
                </p>
              )}
              <DialogFooter className="flex-wrap gap-2">
                {!mission.horario ? (
                  <button onClick={() => void acceptTask(mission.id)} className={primaryBtn}>
                    Reservar meu turno
                  </button>
                ) : mission.max_alunos > 1 && mission.convite_id ? (
                  <button
                    onClick={() =>
                      void taskAction(`/convites-missao/${mission.convite_id}/responder`, {
                        aceitar: true,
                      })
                    }
                    className={primaryBtn}
                  >
                    Aceitar convite
                  </button>
                ) : mission.participando &&
                  mission.envio_status !== "pending" &&
                  mission.envio_status !== "approved" ? (
                  <div className="flex w-full flex-col gap-2">
                    <button
                      onClick={() => {
                        onProof({
                          id: mission.id,
                          titulo: mission.titulo,
                          pontos: mission.pontos,
                          equipe: mission.max_alunos > 1,
                        });
                        onClose();
                      }}
                      className={primaryBtn}
                    >
                      {mission.envio_status === "rejected"
                        ? "Reenviar comprovação"
                        : "Enviar comprovação"}
                    </button>
                    {mission.max_alunos > 1 && mission.modo_participacao === "particular" && (
                      <div className="flex w-full gap-2">
                        <select
                          value={inviteStudent}
                          onChange={(e) => setInviteStudent(e.target.value)}
                          className="min-h-10 flex-1 rounded-lg border bg-background px-3"
                        >
                          <option value="">Convidar aluno...</option>
                          {classmates.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.nome}
                            </option>
                          ))}
                        </select>
                        <button
                          disabled={!inviteStudent}
                          onClick={() =>
                            void taskAction(`/missoes/${mission.id}/convidar`, {
                              grupo_id: mission.grupo_id,
                              aluno_id: Number(inviteStudent),
                            })
                          }
                          className="min-h-10 rounded-lg border px-4 text-sm font-bold disabled:opacity-50"
                        >
                          Convidar
                        </button>
                      </div>
                    )}
                  </div>
                ) : mission.max_alunos > 1 &&
                  mission.modo_participacao === "aberto" &&
                  !mission.participando &&
                  mission.status === "agendada" ? (
                  <button
                    onClick={() =>
                      void taskAction(`/missoes/${mission.id}/entrar`, {
                        grupo_id: mission.grupo_id,
                      })
                    }
                    className={primaryBtn}
                  >
                    Participar deste turno
                  </button>
                ) : (
                  <button onClick={onClose} className="min-h-10 rounded-lg border px-4 text-sm">
                    Fechar
                  </button>
                )}
              </DialogFooter>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
