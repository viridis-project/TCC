import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserMinus, Users, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

export type DirectorTeacher = { id: number; nome: string; email?: string };
export type DirectorClass = {
  id: number;
  nome: string;
  ano_letivo: number;
  codigo_acesso: string;
  codigo_ativo: number;
  total_alunos: number;
  professores: DirectorTeacher[];
};
type Student = { id: number; nome: string; email: string; pontos: number; data_entrada: string };

export function TurmaDetailModal({
  open,
  onOpenChange,
  classroom,
  classes,
  teachers,
  onChanged,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  classroom: DirectorClass | null;
  classes: DirectorClass[];
  teachers: DirectorTeacher[];
  onChanged: () => void;
}) {
  const queryClient = useQueryClient();
  const detailKey = ["diretor-turma-alunos", classroom?.id];
  const { data: students = [], isLoading } = useQuery({
    queryKey: detailKey,
    enabled: open && !!classroom,
    queryFn: async () =>
      (await apiFetch<{ alunos: Student[] }>(`/diretor/turmas/${classroom!.id}/alunos`)).alunos,
  });
  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: detailKey });
    onChanged();
  };
  const move = useMutation({
    mutationFn: ({ studentId, destinationId }: { studentId: number; destinationId: number }) =>
      apiFetch<{ mensagem: string }>(`/diretor/turmas/${classroom!.id}/alunos/${studentId}`, {
        method: "PUT",
        body: JSON.stringify({ nova_turma_id: destinationId }),
      }),
    onSuccess: async (r) => {
      toast.success(r.mensagem);
      await refresh();
    },
    onError: (e) => toast.error(e.message),
  });
  const unlink = useMutation({
    mutationFn: (studentId: number) =>
      apiFetch<{ mensagem: string }>(`/diretor/turmas/${classroom!.id}/alunos/${studentId}`, {
        method: "DELETE",
      }),
    onSuccess: async (r) => {
      toast.success(r.mensagem);
      await refresh();
    },
    onError: (e) => toast.error(e.message),
  });
  const assign = useMutation({
    mutationFn: (teacherId: number) =>
      apiFetch<{ mensagem: string }>(`/diretor/turmas/${classroom!.id}/professores`, {
        method: "POST",
        body: JSON.stringify({ professor_id: teacherId }),
      }),
    onSuccess: async (r) => {
      toast.success(r.mensagem);
      await refresh();
    },
    onError: (e) => toast.error(e.message),
  });
  const removeTeacher = useMutation({
    mutationFn: (teacherId: number) =>
      apiFetch<{ mensagem: string }>(`/diretor/turmas/${classroom!.id}/professores/${teacherId}`, {
        method: "DELETE",
      }),
    onSuccess: async (r) => {
      toast.success(r.mensagem);
      await refresh();
    },
    onError: (e) => toast.error(e.message),
  });
  if (!classroom) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-xl border-border/60 p-0 sm:p-0">
        <div className="bg-gradient-hero p-6 text-primary-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Users className="h-5 w-5" />
              Turma {classroom.nome}
            </DialogTitle>
            <DialogDescription className="text-white/80">
              {classroom.ano_letivo} · código {classroom.codigo_acesso}
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="space-y-6 p-6">
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Alunos vinculados
            </h3>
            <div className="mt-3 space-y-2">
              {isLoading ? (
                <div className="p-6 text-center text-muted-foreground">Carregando alunos...</div>
              ) : students.length === 0 ? (
                <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                  Nenhum aluno vinculado.
                </div>
              ) : (
                students.map((student) => (
                  <div
                    key={student.id}
                    className="flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-background/60 p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-bold">{student.nome}</div>
                      <div className="text-xs text-muted-foreground">
                        {student.email} · {Number(student.pontos).toLocaleString("pt-BR")} pontos
                      </div>
                    </div>
                    <Select
                      onValueChange={(value) =>
                        move.mutate({ studentId: student.id, destinationId: Number(value) })
                      }
                    >
                      <SelectTrigger className="w-44">
                        <SelectValue placeholder="Mover para..." />
                      </SelectTrigger>
                      <SelectContent>
                        {classes
                          .filter((item) => item.id !== classroom.id)
                          .map((item) => (
                            <SelectItem key={item.id} value={String(item.id)}>
                              {item.nome}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="grid h-11 w-11 place-items-center rounded-full bg-destructive/10 text-destructive"
                          title="Remover vínculo"
                        >
                          <UserMinus className="h-4 w-4" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remover aluno da turma?</AlertDialogTitle>
                          <AlertDialogDescription>
                            O aluno ficará sem turma e sem escola até ser realocado.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => unlink.mutate(student.id)}
                            className="bg-destructive text-destructive-foreground"
                          >
                            Remover vínculo
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))
              )}
            </div>
          </section>
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Professores responsáveis
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {classroom.professores.map((teacher) => (
                <span
                  key={teacher.id}
                  className="inline-flex min-h-11 items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary"
                >
                  {teacher.nome}
                  <button onClick={() => removeTeacher.mutate(teacher.id)}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <Select onValueChange={(value) => assign.mutate(Number(value))}>
              <SelectTrigger className="mt-3">
                <SelectValue placeholder="Adicionar professor responsável" />
              </SelectTrigger>
              <SelectContent>
                {teachers
                  .filter(
                    (teacher) =>
                      !classroom.professores.some((current) => current.id === teacher.id),
                  )
                  .map((teacher) => (
                    <SelectItem key={teacher.id} value={String(teacher.id)}>
                      {teacher.nome}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
