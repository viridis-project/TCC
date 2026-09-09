import { useId, useState, type FormEvent, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  FileQuestion,
  GraduationCap,
  Pencil,
  Plus,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch, type User } from "@/lib/api";
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

type Course = {
  id: number;
  titulo: string;
  descricao: string;
  escopo: "app" | "escola" | "turma";
  turma_id: number | null;
  turma?: string;
  publicado: number;
  total_modulos?: number;
};
type SchoolClass = { id: number; nome: string; ano_letivo: number };
type Question = {
  id: number;
  texto_pergunta: string;
  explicacao: string | null;
  pontos_recompensa: number;
  opcoes: { id: number; texto_opcao: string; is_correta: number }[];
};
type Lesson = { id: number; titulo: string; xp: number; ordem: number; perguntas: Question[] };
type Module = {
  id: number;
  titulo: string;
  descricao: string;
  cor: string;
  ordem: number;
  licoes: Lesson[];
};
type CourseTree = { curso: Course; modulos: Module[] };
type BasicEditor =
  | { kind: "curso"; item?: Course }
  | { kind: "modulo"; parent: number; item?: Module; order: number }
  | { kind: "licao"; parent: number; item?: Lesson; order: number };
type QuestionEditor = { parent: number; item?: Question };
const primary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50";
const secondary =
  "inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-accent disabled:opacity-50";
const input =
  "w-full min-w-0 rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";
const card = "rounded-lg border border-border/60 bg-card p-5 shadow-soft";
const scopeLabel = {
  app: "Todos os usuários",
  escola: "Toda a escola",
  turma: "Turma selecionada",
};

export function CourseManagement({ user }: { user: User }) {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<number | null>(null);
  const [basic, setBasic] = useState<BasicEditor | null>(null);
  const [question, setQuestion] = useState<QuestionEditor | null>(null);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const list = useQuery({
    queryKey: ["gestao-cursos", user.id],
    queryFn: () => apiFetch<{ cursos: Course[]; turmas: SchoolClass[] }>("/gestao/cursos"),
    retry: false,
  });
  const detail = useQuery({
    queryKey: ["gestao-curso", user.id, selected],
    queryFn: () => apiFetch<CourseTree>(`/gestao/cursos/${selected}`),
    enabled: selected !== null,
    retry: false,
  });
  async function refresh() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["gestao-cursos"] }),
      queryClient.invalidateQueries({ queryKey: ["gestao-curso"] }),
      queryClient.invalidateQueries({ queryKey: ["modulos"] }),
      queryClient.invalidateQueries({ queryKey: ["jardim"] }),
    ]);
  }
  const action = useMutation({
    mutationFn: ({ path, method, body }: { path: string; method: string; body?: unknown }) =>
      apiFetch<{ mensagem: string }>(path, {
        method,
        body: body === undefined ? undefined : JSON.stringify(body),
      }),
    onSuccess: async (result, variables) => {
      toast.success(result.mensagem);
      if (variables.method === "DELETE" && variables.path === `/gestao/cursos/${selected}`)
        setSelected(null);
      await refresh();
    },
    onError: (error) => toast.error(error.message),
  });
  const course = detail.data?.curso;
  const published = Number(course?.publicado) === 1;
  const busy = action.isPending;
  const audience =
    user.perfil_nome === "admin"
      ? "Conteúdo global para todos os usuários do Viridis."
      : user.perfil_nome === "diretor"
        ? `Conteúdo para toda a escola ${user.instituicao_nome ?? "vinculada ao seu perfil"}.`
        : "Crie cursos independentes para cada uma das suas turmas.";
  const courses = (list.data?.cursos ?? []).filter(
    (item) =>
      item.titulo.toLocaleLowerCase("pt-BR").includes(search.trim().toLocaleLowerCase("pt-BR")) &&
      (!classFilter || String(item.turma_id) === classFilter),
  );
  return (
    <div className="app-page max-w-6xl space-y-6">
      <section className="rounded-xl bg-gradient-hero p-6 text-primary-foreground shadow-soft sm:p-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white/70">
          <GraduationCap className="h-4 w-4" /> Gestão de aprendizagem
        </div>
        <h1 className="mt-2 text-3xl font-bold">Cursos e quizzes</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/80">{audience}</p>
        <p className="mt-4 text-xs text-white/70">
          Monte os módulos, adicione lições e perguntas e publique quando estiver pronto.
        </p>
      </section>
      {selected === null ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold">Meus cursos</h2>
            <button
              className={primary}
              disabled={
                !list.data || (user.perfil_nome === "professor" && !list.data.turmas.length)
              }
              onClick={() => setBasic({ kind: "curso" })}
            >
              <Plus className="h-4 w-4" /> Novo curso
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="sr-only">Buscar curso</span>
              <input
                type="search"
                className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar curso"
              />
            </label>
            {user.perfil_nome === "professor" && (
              <label>
                <span className="sr-only">Filtrar por turma</span>
                <select
                  className={input}
                  value={classFilter}
                  onChange={(event) => setClassFilter(event.target.value)}
                >
                  <option value="">Todas as minhas turmas</option>
                  {list.data?.turmas.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nome} · {item.ano_letivo}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
          {list.isPending ? (
            <Loading />
          ) : list.isError ? (
            <Failure error={list.error} retry={() => void list.refetch()} />
          ) : user.perfil_nome === "professor" && !list.data.turmas.length ? (
            <Empty>A direção precisa vincular você a uma turma antes da criação dos cursos.</Empty>
          ) : !courses.length ? (
            <Empty>
              {search || classFilter
                ? "Nenhum curso encontrado com esses filtros."
                : "Você ainda não tem cursos. Comece criando um rascunho."}
            </Empty>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {courses.map((item) => (
                <button
                  key={item.id}
                  className={`${card} space-y-3 text-left transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
                  onClick={() => setSelected(Number(item.id))}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <BookOpen className="h-7 w-7 text-primary" />
                    <Publication published={Number(item.publicado) === 1} />
                  </div>
                  <h3 className="break-words text-xl font-bold">{item.titulo}</h3>
                  <p className="line-clamp-2 break-words text-sm text-muted-foreground">
                    {item.descricao || "Sem descrição"}
                  </p>
                  <p className="text-xs font-semibold text-primary">
                    {item.escopo === "turma" ? item.turma : scopeLabel[item.escopo]}
                  </p>
                  <div className="flex items-center justify-between border-t border-border/60 pt-3 text-sm">
                    <span>{Number(item.total_modulos)} módulos</span>
                    <span className="inline-flex items-center gap-1 font-bold text-primary">
                      Gerenciar <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <button className={secondary} onClick={() => setSelected(null)}>
            <ArrowLeft className="h-4 w-4" /> Voltar aos cursos
          </button>
          {detail.isPending ? (
            <Loading />
          ) : detail.isError ? (
            <Failure error={detail.error} retry={() => void detail.refetch()} />
          ) : (
            course &&
            detail.data && (
              <>
                <div className={`${card} space-y-4`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="break-words text-2xl font-bold">{course.titulo}</h2>
                      <p className="mt-1 whitespace-pre-wrap break-words text-sm text-muted-foreground">
                        {course.descricao}
                      </p>
                      <p className="mt-3 text-xs font-bold text-primary">
                        {course.escopo === "turma"
                          ? `Turma: ${list.data?.turmas.find((item) => Number(item.id) === Number(course.turma_id))?.nome ?? course.turma_id}`
                          : scopeLabel[course.escopo]}
                      </p>
                    </div>
                    <Publication published={published} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className={secondary}
                      disabled={busy}
                      onClick={() => setBasic({ kind: "curso", item: course })}
                    >
                      <Pencil className="h-4 w-4" /> Editar curso
                    </button>
                    {published ? (
                      <Confirm
                        label="Voltar para rascunho"
                        title="Retirar o curso da publicação?"
                        description="O curso ficará indisponível aos alunos enquanto você faz alterações. O progresso será preservado."
                        disabled={busy}
                        onConfirm={() =>
                          action.mutate({
                            path: `/gestao/cursos/${course.id}/publicacao`,
                            method: "PUT",
                            body: { publicado: false },
                          })
                        }
                      />
                    ) : (
                      <button
                        className={primary}
                        disabled={busy}
                        onClick={() =>
                          action.mutate({
                            path: `/gestao/cursos/${course.id}/publicacao`,
                            method: "PUT",
                            body: { publicado: true },
                          })
                        }
                      >
                        Publicar curso
                      </button>
                    )}
                    <Confirm
                      label="Arquivar curso"
                      title="Arquivar este curso?"
                      description="O curso e seu conteúdo deixarão de aparecer para os alunos. O progresso já registrado será preservado."
                      disabled={busy}
                      onConfirm={() =>
                        action.mutate({ path: `/gestao/cursos/${course.id}`, method: "DELETE" })
                      }
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {published
                      ? "Publicado. Todas as opções do curso podem ser ajustadas; as alterações ficam disponíveis após salvar."
                      : "Rascunho: somente você e os gestores com permissão podem acessar o editor. Cada módulo deve ter uma lição e cada lição deve ter perguntas antes da publicação."}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-bold">Módulos do curso</h2>
                  <button
                    className={primary}
                    disabled={busy}
                    onClick={() =>
                      setBasic({
                        kind: "modulo",
                        parent: Number(course.id),
                        order:
                          Math.max(0, ...detail.data.modulos.map((item) => Number(item.ordem))) + 1,
                      })
                    }
                  >
                    <Plus className="h-4 w-4" /> Novo módulo
                  </button>
                </div>
                {!detail.data.modulos.length && (
                  <Empty>Adicione o primeiro módulo para começar a organizar este curso.</Empty>
                )}
                {detail.data.modulos.map((module) => (
                  <section key={module.id} className={`${card} space-y-4`}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wider text-primary">
                          Módulo · Ordem {module.ordem}
                        </p>
                        <h3 className="break-words text-xl font-bold">{module.titulo}</h3>
                        <p className="mt-1 break-words text-sm text-muted-foreground">
                          {module.descricao}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          className={secondary}
                          disabled={busy}
                          onClick={() =>
                            setBasic({
                              kind: "modulo",
                              parent: Number(course.id),
                              item: module,
                              order: Number(module.ordem),
                            })
                          }
                        >
                          Editar módulo
                        </button>
                        <Confirm
                          label="Arquivar módulo"
                          title="Arquivar este módulo?"
                          description="Suas lições e perguntas deixarão de aparecer no curso."
                          disabled={busy}
                          onConfirm={() =>
                            action.mutate({
                              path: `/gestao/modulos/${module.id}`,
                              method: "DELETE",
                            })
                          }
                        />
                      </div>
                    </div>
                    {module.licoes.map((lesson) => (
                      <details
                        key={lesson.id}
                        className="rounded-xl border border-border/70 bg-background/50"
                        open
                      >
                        <summary className="cursor-pointer break-words p-4 font-bold">
                          {lesson.ordem}. {lesson.titulo}{" "}
                          <span className="text-xs font-normal text-muted-foreground">
                            · {lesson.perguntas.length} perguntas · {lesson.xp} XP
                          </span>
                        </summary>
                        <div className="space-y-4 border-t border-border/50 p-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              className={secondary}
                              disabled={busy}
                              onClick={() =>
                                setBasic({
                                  kind: "licao",
                                  parent: Number(module.id),
                                  item: lesson,
                                  order: Number(lesson.ordem),
                                })
                              }
                            >
                              Editar lição
                            </button>
                            <Confirm
                              label="Arquivar lição"
                              title="Arquivar esta lição?"
                              description="A lição deixará de aparecer para os alunos. O progresso será preservado."
                              disabled={busy}
                              onConfirm={() =>
                                action.mutate({
                                  path: `/gestao/licoes/${lesson.id}`,
                                  method: "DELETE",
                                })
                              }
                            />
                          </div>
                          {lesson.perguntas.map((item, index) => (
                            <article
                              key={item.id}
                              className="space-y-3 rounded-xl border border-border bg-card p-4"
                            >
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs text-muted-foreground">
                                    Pergunta {index + 1} · {item.pontos_recompensa} pontos
                                  </p>
                                  <h4 className="mt-1 whitespace-pre-wrap break-words font-bold">
                                    {item.texto_pergunta}
                                  </h4>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    className={secondary}
                                    disabled={busy}
                                    onClick={() => setQuestion({ parent: Number(lesson.id), item })}
                                  >
                                    Editar pergunta
                                  </button>
                                  <Confirm
                                    label="Arquivar pergunta"
                                    title="Arquivar esta pergunta?"
                                    description="A pergunta deixará de fazer parte do quiz; as respostas já registradas serão preservadas."
                                    disabled={busy}
                                    onConfirm={() =>
                                      action.mutate({
                                        path: `/gestao/perguntas/${item.id}`,
                                        method: "DELETE",
                                      })
                                    }
                                  />
                                </div>
                              </div>
                              <div className="grid gap-2 sm:grid-cols-2">
                                {item.opcoes.map((option) => (
                                  <p
                                    key={option.id}
                                    className={`flex items-start gap-2 rounded-lg border p-3 text-sm ${Number(option.is_correta) === 1 ? "border-primary/30 bg-primary/10" : "border-border"}`}
                                  >
                                    {Number(option.is_correta) === 1 && (
                                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                    )}
                                    <span className="break-words">{option.texto_opcao}</span>
                                    {Number(option.is_correta) === 1 && (
                                      <span className="sr-only">Resposta correta</span>
                                    )}
                                  </p>
                                ))}
                              </div>
                              {item.explicacao && (
                                <p className="whitespace-pre-wrap break-words text-sm text-muted-foreground">
                                  Explicação: {item.explicacao}
                                </p>
                              )}
                            </article>
                          ))}
                          {!lesson.perguntas.length && (
                            <p className="text-sm text-muted-foreground">
                              Esta lição ainda não tem perguntas.
                            </p>
                          )}
                          <button
                            className={primary}
                            disabled={busy}
                            onClick={() => setQuestion({ parent: Number(lesson.id) })}
                          >
                            <FileQuestion className="h-4 w-4" /> Nova pergunta
                          </button>
                        </div>
                      </details>
                    ))}
                    {!module.licoes.length && (
                      <p className="text-sm text-muted-foreground">
                        Este módulo ainda não tem lições.
                      </p>
                    )}
                    <button
                      className={secondary}
                      disabled={busy}
                      onClick={() =>
                        setBasic({
                          kind: "licao",
                          parent: Number(module.id),
                          order:
                            Math.max(0, ...module.licoes.map((item) => Number(item.ordem))) + 1,
                        })
                      }
                    >
                      <Plus className="h-4 w-4" /> Nova lição
                    </button>
                  </section>
                ))}
              </>
            )
          )}
        </>
      )}
      {basic && (
        <BasicForm
          editor={basic}
          user={user}
          classes={list.data?.turmas ?? []}
          close={() => setBasic(null)}
          saved={async (id) => {
            if (basic.kind === "curso" && !basic.item) setSelected(id);
            setBasic(null);
            await refresh();
          }}
        />
      )}
      {question && (
        <QuestionForm
          editor={question}
          close={() => setQuestion(null)}
          saved={async () => {
            setQuestion(null);
            await refresh();
          }}
        />
      )}
    </div>
  );
}

function BasicForm({
  editor,
  user,
  classes,
  close,
  saved,
}: {
  editor: BasicEditor;
  user: User;
  classes: SchoolClass[];
  close: () => void;
  saved: (id: number) => Promise<void>;
}) {
  const [title, setTitle] = useState(editor.item?.titulo ?? "");
  const [description, setDescription] = useState(
    editor.kind !== "licao" ? (editor.item?.descricao ?? "") : "",
  );
  const [order, setOrder] = useState(editor.kind === "curso" ? 1 : editor.order);
  const [xp, setXp] = useState(editor.kind === "licao" ? Number(editor.item?.xp ?? 20) : 20);
  const [color, setColor] = useState(
    editor.kind === "modulo" && /^#[\da-f]{6}$/i.test(editor.item?.cor ?? "")
      ? editor.item!.cor
      : "var(--color-primary)",
  );
  const [classId, setClassId] = useState("");
  const plural = { curso: "cursos", modulo: "modulos", licao: "licoes" };
  const label = { curso: "curso", modulo: "módulo", licao: "lição" }[editor.kind];
  const mutation = useMutation({
    mutationFn: () =>
      apiFetch<{ id: number; mensagem: string }>(
        `/gestao/${plural[editor.kind]}${editor.item ? `/${editor.item.id}` : ""}`,
        {
          method: editor.item ? "PUT" : "POST",
          body: JSON.stringify({
            titulo: title.trim(),
            descricao: description.trim(),
            ordem: order,
            xp,
            cor: color,
            ...(editor.kind === "curso"
              ? { turma_id: Number(classId) }
              : editor.kind === "modulo"
                ? { curso_id: editor.parent }
                : { modulo_id: editor.parent }),
          }),
        },
      ),
    onSuccess: async (result) => {
      toast.success(result.mensagem);
      await saved(result.id);
    },
  });
  function submit(event: FormEvent) {
    event.preventDefault();
    mutation.mutate();
  }
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !mutation.isPending) close();
      }}
    >
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-xl sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {editor.item ? "Editar" : "Criar"} {label}
          </DialogTitle>
          <DialogDescription>
            {editor.kind === "curso"
              ? "O público deste curso será definido pelo seu perfil e não poderá ser alterado depois."
              : "Este conteúdo será disponibilizado ao mesmo público do curso."}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={submit}>
          <Field label="Título">
            {(id) => (
              <input
                id={id}
                className={input}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                minLength={3}
                maxLength={editor.kind === "curso" ? 150 : editor.kind === "modulo" ? 100 : 120}
                autoFocus
              />
            )}
          </Field>
          {editor.kind !== "licao" && (
            <Field label="Descrição">
              {(id) => (
                <textarea
                  id={id}
                  className={input}
                  rows={3}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  maxLength={editor.kind === "curso" ? 1000 : 255}
                />
              )}
            </Field>
          )}
          {editor.kind === "curso" &&
            !editor.item &&
            (user.perfil_nome === "professor" ? (
              <Field label="Turma do curso">
                {(id) => (
                  <select
                    id={id}
                    className={input}
                    required
                    value={classId}
                    onChange={(event) => setClassId(event.target.value)}
                  >
                    <option value="">Selecione uma das suas turmas</option>
                    {classes.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nome} · {item.ano_letivo}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
            ) : (
              <p className="rounded-xl bg-primary/10 p-3 text-sm">
                Público:{" "}
                {user.perfil_nome === "admin"
                  ? "todos os usuários"
                  : (user.instituicao_nome ?? "toda a escola")}
              </p>
            ))}
          {editor.kind !== "curso" && (
            <Field label="Ordem">
              {(id) => (
                <input
                  id={id}
                  className={input}
                  type="number"
                  required
                  min={1}
                  max={9999}
                  value={order}
                  onChange={(event) => setOrder(Number(event.target.value))}
                />
              )}
            </Field>
          )}
          {editor.kind === "modulo" && (
            <Field label="Cor do módulo">
              {(id) => (
                <input
                  id={id}
                  className="h-10 w-20 rounded border border-border"
                  type="color"
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                />
              )}
            </Field>
          )}
          {editor.kind === "licao" && (
            <Field label="XP da lição">
              {(id) => (
                <input
                  id={id}
                  className={input}
                  type="number"
                  required
                  min={0}
                  max={1000}
                  value={xp}
                  onChange={(event) => setXp(Number(event.target.value))}
                />
              )}
            </Field>
          )}
          {mutation.error && (
            <p role="alert" className="text-sm text-destructive">
              {mutation.error.message}
            </p>
          )}
          <FormActions busy={mutation.isPending} close={close} label={`Salvar ${label}`} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

function QuestionForm({
  editor,
  close,
  saved,
}: {
  editor: QuestionEditor;
  close: () => void;
  saved: () => Promise<void>;
}) {
  const [text, setText] = useState(editor.item?.texto_pergunta ?? "");
  const [explanation, setExplanation] = useState(editor.item?.explicacao ?? "");
  const [points, setPoints] = useState(Number(editor.item?.pontos_recompensa ?? 5));
  const [options, setOptions] = useState(
    editor.item?.opcoes.map((item) => item.texto_opcao) ?? ["", "", "", ""],
  );
  const [correct, setCorrect] = useState(
    editor.item ? editor.item.opcoes.findIndex((item) => Number(item.is_correta) === 1) : -1,
  );
  const radioName = useId();
  const mutation = useMutation({
    mutationFn: () =>
      apiFetch<{ mensagem: string }>(
        `/gestao/perguntas${editor.item ? `/${editor.item.id}` : ""}`,
        {
          method: editor.item ? "PUT" : "POST",
          body: JSON.stringify({
            licao_id: editor.parent,
            texto_pergunta: text.trim(),
            explicacao: explanation.trim(),
            pontos_recompensa: points,
            opcoes: options.map((value, index) => ({
              texto_opcao: value.trim(),
              is_correta: index === correct,
            })),
          }),
        },
      ),
    onSuccess: async (result) => {
      toast.success(result.mensagem);
      await saved();
    },
  });
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !mutation.isPending) close();
      }}
    >
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editor.item ? "Editar pergunta" : "Nova pergunta"}</DialogTitle>
          <DialogDescription>
            Escreva quatro alternativas diferentes e marque uma resposta correta.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (correct < 0) {
              toast.error("Marque a alternativa correta");
              return;
            }
            mutation.mutate();
          }}
        >
          <Field label="Pergunta">
            {(id) => (
              <textarea
                id={id}
                className={input}
                rows={3}
                required
                minLength={3}
                maxLength={2000}
                value={text}
                onChange={(event) => setText(event.target.value)}
                autoFocus
              />
            )}
          </Field>
          <fieldset className="space-y-3">
            <legend className="mb-2 text-sm font-bold">Alternativas e resposta correta</legend>
            {options.map((value, index) => (
              <div key={index} className="flex items-end gap-3">
                <label className="flex shrink-0 items-center gap-1 pb-3 text-sm">
                  <input
                    type="radio"
                    name={radioName}
                    checked={correct === index}
                    onChange={() => setCorrect(index)}
                    required
                    aria-label={`Alternativa ${index + 1} é a correta`}
                  />
                  {String.fromCharCode(65 + index)}
                </label>
                <div className="min-w-0 flex-1">
                  <Field label={`Alternativa ${index + 1}`}>
                    {(id) => (
                      <input
                        id={id}
                        className={input}
                        required
                        maxLength={255}
                        value={value}
                        onChange={(event) =>
                          setOptions((current) =>
                            current.map((item, i) => (i === index ? event.target.value : item)),
                          )
                        }
                      />
                    )}
                  </Field>
                </div>
              </div>
            ))}
          </fieldset>
          <Field label="Explicação (opcional)">
            {(id) => (
              <textarea
                id={id}
                className={input}
                rows={2}
                maxLength={500}
                value={explanation}
                onChange={(event) => setExplanation(event.target.value)}
              />
            )}
          </Field>
          <Field label="Pontos por acerto">
            {(id) => (
              <input
                id={id}
                className={input}
                type="number"
                min={1}
                max={1000}
                required
                value={points}
                onChange={(event) => setPoints(Number(event.target.value))}
              />
            )}
          </Field>
          {mutation.error && (
            <p role="alert" className="text-sm text-destructive">
              {mutation.error.message}
            </p>
          )}
          <FormActions busy={mutation.isPending} close={close} label="Salvar pergunta" />
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: (id: string) => ReactNode }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      {children(id)}
    </div>
  );
}
function FormActions({ busy, close, label }: { busy: boolean; close: () => void; label: string }) {
  return (
    <div className="flex justify-end gap-2 border-t border-border pt-4">
      <button className={secondary} type="button" disabled={busy} onClick={close}>
        Cancelar
      </button>
      <button className={primary} disabled={busy}>
        {busy ? "Salvando..." : label}
      </button>
    </div>
  );
}
function Confirm({
  label,
  title,
  description,
  disabled,
  onConfirm,
}: {
  label: string;
  title: string;
  description: string;
  disabled: boolean;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className={secondary} disabled={disabled}>
          {label}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirmar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
function Publication({ published }: { published: boolean }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${published ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
    >
      {published ? "Publicado" : "Rascunho"}
    </span>
  );
}
function Loading() {
  return (
    <p role="status" className="p-12 text-center text-muted-foreground">
      Carregando cursos...
    </p>
  );
}
function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}
function Failure({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <div className={`${card} space-y-3 text-center`}>
      <p role="alert" className="text-destructive">
        {error.message}
      </p>
      <button className={secondary} onClick={retry}>
        Tentar novamente
      </button>
    </div>
  );
}
