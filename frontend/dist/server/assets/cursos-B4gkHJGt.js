import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { a as apiFetch, A as AlertDialog, n as AlertDialogTrigger, o as AlertDialogContent, p as AlertDialogHeader, q as AlertDialogTitle, r as AlertDialogDescription, s as AlertDialogFooter, t as AlertDialogCancel, v as AlertDialogAction, D as Dialog, b as DialogContent, d as DialogHeader, e as DialogTitle, f as DialogDescription, u as userQuery, P as PageShell } from "./router-_glEtDMC.js";
import { useState, useId } from "react";
import { GraduationCap, Plus, Search, BookOpen, ArrowRight, ArrowLeft, Pencil, Check, FileQuestion } from "lucide-react";
import { toast } from "sonner";
import "motion/react";
import "recharts";
import "@radix-ui/react-dialog";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-slot";
import "class-variance-authority";
const primary = "inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50";
const secondary = "inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-accent disabled:opacity-50";
const input = "w-full min-w-0 rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";
const card = "rounded-lg border border-border/60 bg-card p-5 shadow-soft";
const scopeLabel = {
  app: "Todos os usuários",
  escola: "Toda a escola",
  turma: "Turma selecionada"
};
function CourseManagement({ user }) {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [basic, setBasic] = useState(null);
  const [question, setQuestion] = useState(null);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const list = useQuery({
    queryKey: ["gestao-cursos", user.id],
    queryFn: () => apiFetch("/gestao/cursos"),
    retry: false
  });
  const detail = useQuery({
    queryKey: ["gestao-curso", user.id, selected],
    queryFn: () => apiFetch(`/gestao/cursos/${selected}`),
    enabled: selected !== null,
    retry: false
  });
  async function refresh() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["gestao-cursos"] }),
      queryClient.invalidateQueries({ queryKey: ["gestao-curso"] }),
      queryClient.invalidateQueries({ queryKey: ["modulos"] }),
      queryClient.invalidateQueries({ queryKey: ["jardim"] })
    ]);
  }
  const action = useMutation({
    mutationFn: ({ path, method, body }) => apiFetch(path, {
      method,
      body: body === void 0 ? void 0 : JSON.stringify(body)
    }),
    onSuccess: async (result, variables) => {
      toast.success(result.mensagem);
      if (variables.method === "DELETE" && variables.path === `/gestao/cursos/${selected}`)
        setSelected(null);
      await refresh();
    },
    onError: (error) => toast.error(error.message)
  });
  const course = detail.data?.curso;
  const published = Number(course?.publicado) === 1;
  const busy = action.isPending;
  const audience = user.perfil_nome === "admin" ? "Conteúdo global para todos os usuários do Viridis." : user.perfil_nome === "diretor" ? `Conteúdo para toda a escola ${user.instituicao_nome ?? "vinculada ao seu perfil"}.` : "Crie cursos independentes para cada uma das suas turmas.";
  const courses = (list.data?.cursos ?? []).filter(
    (item) => item.titulo.toLocaleLowerCase("pt-BR").includes(search.trim().toLocaleLowerCase("pt-BR")) && (!classFilter || String(item.turma_id) === classFilter)
  );
  return /* @__PURE__ */ jsxs("div", { className: "app-page max-w-6xl space-y-6", children: [
    /* @__PURE__ */ jsxs("section", { className: "rounded-xl bg-gradient-hero p-6 text-primary-foreground shadow-soft sm:p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white/70", children: [
        /* @__PURE__ */ jsx(GraduationCap, { className: "h-4 w-4" }),
        " Gestão de aprendizagem"
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "mt-2 text-3xl font-bold", children: "Cursos e quizzes" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-2xl text-sm text-white/80", children: audience }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-xs text-white/70", children: "Monte os módulos, adicione lições e perguntas e publique quando estiver pronto." })
    ] }),
    selected === null ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold", children: "Meus cursos" }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: primary,
            disabled: !list.data || user.perfil_nome === "professor" && !list.data.turmas.length,
            onClick: () => setBasic({ kind: "curso" }),
            children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
              " Novo curso"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsxs("label", { className: "flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3", children: [
          /* @__PURE__ */ jsx(Search, { className: "h-4 w-4 shrink-0 text-muted-foreground" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Buscar curso" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "search",
              className: "min-w-0 flex-1 bg-transparent py-3 text-sm outline-none",
              value: search,
              onChange: (event) => setSearch(event.target.value),
              placeholder: "Buscar curso"
            }
          )
        ] }),
        user.perfil_nome === "professor" && /* @__PURE__ */ jsxs("label", { children: [
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Filtrar por turma" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              className: input,
              value: classFilter,
              onChange: (event) => setClassFilter(event.target.value),
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Todas as minhas turmas" }),
                list.data?.turmas.map((item) => /* @__PURE__ */ jsxs("option", { value: item.id, children: [
                  item.nome,
                  " · ",
                  item.ano_letivo
                ] }, item.id))
              ]
            }
          )
        ] })
      ] }),
      list.isPending ? /* @__PURE__ */ jsx(Loading, {}) : list.isError ? /* @__PURE__ */ jsx(Failure, { error: list.error, retry: () => void list.refetch() }) : user.perfil_nome === "professor" && !list.data.turmas.length ? /* @__PURE__ */ jsx(Empty, { children: "A direção precisa vincular você a uma turma antes da criação dos cursos." }) : !courses.length ? /* @__PURE__ */ jsx(Empty, { children: search || classFilter ? "Nenhum curso encontrado com esses filtros." : "Você ainda não tem cursos. Comece criando um rascunho." }) : /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2", children: courses.map((item) => /* @__PURE__ */ jsxs(
        "button",
        {
          className: `${card} space-y-3 text-left transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`,
          onClick: () => setSelected(Number(item.id)),
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsx(BookOpen, { className: "h-7 w-7 text-primary" }),
              /* @__PURE__ */ jsx(Publication, { published: Number(item.publicado) === 1 })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "break-words text-xl font-bold", children: item.titulo }),
            /* @__PURE__ */ jsx("p", { className: "line-clamp-2 break-words text-sm text-muted-foreground", children: item.descricao || "Sem descrição" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-primary", children: item.escopo === "turma" ? item.turma : scopeLabel[item.escopo] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t border-border/60 pt-3 text-sm", children: [
              /* @__PURE__ */ jsxs("span", { children: [
                Number(item.total_modulos),
                " módulos"
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 font-bold text-primary", children: [
                "Gerenciar ",
                /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
              ] })
            ] })
          ]
        },
        item.id
      )) })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("button", { className: secondary, onClick: () => setSelected(null), children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Voltar aos cursos"
      ] }),
      detail.isPending ? /* @__PURE__ */ jsx(Loading, {}) : detail.isError ? /* @__PURE__ */ jsx(Failure, { error: detail.error, retry: () => void detail.refetch() }) : course && detail.data && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: `${card} space-y-4`, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("h2", { className: "break-words text-2xl font-bold", children: course.titulo }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 whitespace-pre-wrap break-words text-sm text-muted-foreground", children: course.descricao }),
              /* @__PURE__ */ jsx("p", { className: "mt-3 text-xs font-bold text-primary", children: course.escopo === "turma" ? `Turma: ${list.data?.turmas.find((item) => Number(item.id) === Number(course.turma_id))?.nome ?? course.turma_id}` : scopeLabel[course.escopo] })
            ] }),
            /* @__PURE__ */ jsx(Publication, { published })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                className: secondary,
                disabled: busy,
                onClick: () => setBasic({ kind: "curso", item: course }),
                children: [
                  /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }),
                  " Editar curso"
                ]
              }
            ),
            published ? /* @__PURE__ */ jsx(
              Confirm,
              {
                label: "Voltar para rascunho",
                title: "Retirar o curso da publicação?",
                description: "O curso ficará indisponível aos alunos enquanto você faz alterações. O progresso será preservado.",
                disabled: busy,
                onConfirm: () => action.mutate({
                  path: `/gestao/cursos/${course.id}/publicacao`,
                  method: "PUT",
                  body: { publicado: false }
                })
              }
            ) : /* @__PURE__ */ jsx(
              "button",
              {
                className: primary,
                disabled: busy,
                onClick: () => action.mutate({
                  path: `/gestao/cursos/${course.id}/publicacao`,
                  method: "PUT",
                  body: { publicado: true }
                }),
                children: "Publicar curso"
              }
            ),
            /* @__PURE__ */ jsx(
              Confirm,
              {
                label: "Arquivar curso",
                title: "Arquivar este curso?",
                description: "O curso e seu conteúdo deixarão de aparecer para os alunos. O progresso já registrado será preservado.",
                disabled: busy,
                onConfirm: () => action.mutate({ path: `/gestao/cursos/${course.id}`, method: "DELETE" })
              }
            )
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: published ? "Publicado. Todas as opções do curso podem ser ajustadas; as alterações ficam disponíveis após salvar." : "Rascunho: somente você e os gestores com permissão podem acessar o editor. Cada módulo deve ter uma lição e cada lição deve ter perguntas antes da publicação." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold", children: "Módulos do curso" }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: primary,
              disabled: busy,
              onClick: () => setBasic({
                kind: "modulo",
                parent: Number(course.id),
                order: Math.max(0, ...detail.data.modulos.map((item) => Number(item.ordem))) + 1
              }),
              children: [
                /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
                " Novo módulo"
              ]
            }
          )
        ] }),
        !detail.data.modulos.length && /* @__PURE__ */ jsx(Empty, { children: "Adicione o primeiro módulo para começar a organizar este curso." }),
        detail.data.modulos.map((module) => /* @__PURE__ */ jsxs("section", { className: `${card} space-y-4`, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold uppercase tracking-wider text-primary", children: [
                "Módulo · Ordem ",
                module.ordem
              ] }),
              /* @__PURE__ */ jsx("h3", { className: "break-words text-xl font-bold", children: module.titulo }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 break-words text-sm text-muted-foreground", children: module.descricao })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: secondary,
                  disabled: busy,
                  onClick: () => setBasic({
                    kind: "modulo",
                    parent: Number(course.id),
                    item: module,
                    order: Number(module.ordem)
                  }),
                  children: "Editar módulo"
                }
              ),
              /* @__PURE__ */ jsx(
                Confirm,
                {
                  label: "Arquivar módulo",
                  title: "Arquivar este módulo?",
                  description: "Suas lições e perguntas deixarão de aparecer no curso.",
                  disabled: busy,
                  onConfirm: () => action.mutate({
                    path: `/gestao/modulos/${module.id}`,
                    method: "DELETE"
                  })
                }
              )
            ] })
          ] }),
          module.licoes.map((lesson) => /* @__PURE__ */ jsxs(
            "details",
            {
              className: "rounded-xl border border-border/70 bg-background/50",
              open: true,
              children: [
                /* @__PURE__ */ jsxs("summary", { className: "cursor-pointer break-words p-4 font-bold", children: [
                  lesson.ordem,
                  ". ",
                  lesson.titulo,
                  " ",
                  /* @__PURE__ */ jsxs("span", { className: "text-xs font-normal text-muted-foreground", children: [
                    "· ",
                    lesson.perguntas.length,
                    " perguntas · ",
                    lesson.xp,
                    " XP"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-4 border-t border-border/50 p-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        className: secondary,
                        disabled: busy,
                        onClick: () => setBasic({
                          kind: "licao",
                          parent: Number(module.id),
                          item: lesson,
                          order: Number(lesson.ordem)
                        }),
                        children: "Editar lição"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      Confirm,
                      {
                        label: "Arquivar lição",
                        title: "Arquivar esta lição?",
                        description: "A lição deixará de aparecer para os alunos. O progresso será preservado.",
                        disabled: busy,
                        onConfirm: () => action.mutate({
                          path: `/gestao/licoes/${lesson.id}`,
                          method: "DELETE"
                        })
                      }
                    )
                  ] }),
                  lesson.perguntas.map((item, index) => /* @__PURE__ */ jsxs(
                    "article",
                    {
                      className: "space-y-3 rounded-xl border border-border bg-card p-4",
                      children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
                          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                            /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                              "Pergunta ",
                              index + 1,
                              " · ",
                              item.pontos_recompensa,
                              " pontos"
                            ] }),
                            /* @__PURE__ */ jsx("h4", { className: "mt-1 whitespace-pre-wrap break-words font-bold", children: item.texto_pergunta })
                          ] }),
                          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
                            /* @__PURE__ */ jsx(
                              "button",
                              {
                                className: secondary,
                                disabled: busy,
                                onClick: () => setQuestion({ parent: Number(lesson.id), item }),
                                children: "Editar pergunta"
                              }
                            ),
                            /* @__PURE__ */ jsx(
                              Confirm,
                              {
                                label: "Arquivar pergunta",
                                title: "Arquivar esta pergunta?",
                                description: "A pergunta deixará de fazer parte do quiz; as respostas já registradas serão preservadas.",
                                disabled: busy,
                                onConfirm: () => action.mutate({
                                  path: `/gestao/perguntas/${item.id}`,
                                  method: "DELETE"
                                })
                              }
                            )
                          ] })
                        ] }),
                        /* @__PURE__ */ jsx("div", { className: "grid gap-2 sm:grid-cols-2", children: item.opcoes.map((option) => /* @__PURE__ */ jsxs(
                          "p",
                          {
                            className: `flex items-start gap-2 rounded-lg border p-3 text-sm ${Number(option.is_correta) === 1 ? "border-primary/30 bg-primary/10" : "border-border"}`,
                            children: [
                              Number(option.is_correta) === 1 && /* @__PURE__ */ jsx(Check, { className: "mt-0.5 h-4 w-4 shrink-0 text-primary" }),
                              /* @__PURE__ */ jsx("span", { className: "break-words", children: option.texto_opcao }),
                              Number(option.is_correta) === 1 && /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Resposta correta" })
                            ]
                          },
                          option.id
                        )) }),
                        item.explicacao && /* @__PURE__ */ jsxs("p", { className: "whitespace-pre-wrap break-words text-sm text-muted-foreground", children: [
                          "Explicação: ",
                          item.explicacao
                        ] })
                      ]
                    },
                    item.id
                  )),
                  !lesson.perguntas.length && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Esta lição ainda não tem perguntas." }),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      className: primary,
                      disabled: busy,
                      onClick: () => setQuestion({ parent: Number(lesson.id) }),
                      children: [
                        /* @__PURE__ */ jsx(FileQuestion, { className: "h-4 w-4" }),
                        " Nova pergunta"
                      ]
                    }
                  )
                ] })
              ]
            },
            lesson.id
          )),
          !module.licoes.length && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Este módulo ainda não tem lições." }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: secondary,
              disabled: busy,
              onClick: () => setBasic({
                kind: "licao",
                parent: Number(module.id),
                order: Math.max(0, ...module.licoes.map((item) => Number(item.ordem))) + 1
              }),
              children: [
                /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
                " Nova lição"
              ]
            }
          )
        ] }, module.id))
      ] })
    ] }),
    basic && /* @__PURE__ */ jsx(
      BasicForm,
      {
        editor: basic,
        user,
        classes: list.data?.turmas ?? [],
        close: () => setBasic(null),
        saved: async (id) => {
          if (basic.kind === "curso" && !basic.item) setSelected(id);
          setBasic(null);
          await refresh();
        }
      }
    ),
    question && /* @__PURE__ */ jsx(
      QuestionForm,
      {
        editor: question,
        close: () => setQuestion(null),
        saved: async () => {
          setQuestion(null);
          await refresh();
        }
      }
    )
  ] });
}
function BasicForm({
  editor,
  user,
  classes,
  close,
  saved
}) {
  const [title, setTitle] = useState(editor.item?.titulo ?? "");
  const [description, setDescription] = useState(
    editor.kind !== "licao" ? editor.item?.descricao ?? "" : ""
  );
  const [order, setOrder] = useState(editor.kind === "curso" ? 1 : editor.order);
  const [xp, setXp] = useState(editor.kind === "licao" ? Number(editor.item?.xp ?? 20) : 20);
  const [color, setColor] = useState(
    editor.kind === "modulo" && /^#[\da-f]{6}$/i.test(editor.item?.cor ?? "") ? editor.item.cor : "var(--color-primary)"
  );
  const [classId, setClassId] = useState("");
  const plural = { curso: "cursos", modulo: "modulos", licao: "licoes" };
  const label = { curso: "curso", modulo: "módulo", licao: "lição" }[editor.kind];
  const mutation = useMutation({
    mutationFn: () => apiFetch(
      `/gestao/${plural[editor.kind]}${editor.item ? `/${editor.item.id}` : ""}`,
      {
        method: editor.item ? "PUT" : "POST",
        body: JSON.stringify({
          titulo: title.trim(),
          descricao: description.trim(),
          ordem: order,
          xp,
          cor: color,
          ...editor.kind === "curso" ? { turma_id: Number(classId) } : editor.kind === "modulo" ? { curso_id: editor.parent } : { modulo_id: editor.parent }
        })
      }
    ),
    onSuccess: async (result) => {
      toast.success(result.mensagem);
      await saved(result.id);
    }
  });
  function submit(event) {
    event.preventDefault();
    mutation.mutate();
  }
  return /* @__PURE__ */ jsx(
    Dialog,
    {
      open: true,
      onOpenChange: (open) => {
        if (!open && !mutation.isPending) close();
      },
      children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-h-[90dvh] overflow-y-auto rounded-xl sm:max-w-xl", children: [
        /* @__PURE__ */ jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxs(DialogTitle, { children: [
            editor.item ? "Editar" : "Criar",
            " ",
            label
          ] }),
          /* @__PURE__ */ jsx(DialogDescription, { children: editor.kind === "curso" ? "O público deste curso será definido pelo seu perfil e não poderá ser alterado depois." : "Este conteúdo será disponibilizado ao mesmo público do curso." })
        ] }),
        /* @__PURE__ */ jsxs("form", { className: "space-y-4", onSubmit: submit, children: [
          /* @__PURE__ */ jsx(Field, { label: "Título", children: (id) => /* @__PURE__ */ jsx(
            "input",
            {
              id,
              className: input,
              value: title,
              onChange: (event) => setTitle(event.target.value),
              required: true,
              minLength: 3,
              maxLength: editor.kind === "curso" ? 150 : editor.kind === "modulo" ? 100 : 120,
              autoFocus: true
            }
          ) }),
          editor.kind !== "licao" && /* @__PURE__ */ jsx(Field, { label: "Descrição", children: (id) => /* @__PURE__ */ jsx(
            "textarea",
            {
              id,
              className: input,
              rows: 3,
              value: description,
              onChange: (event) => setDescription(event.target.value),
              maxLength: editor.kind === "curso" ? 1e3 : 255
            }
          ) }),
          editor.kind === "curso" && !editor.item && (user.perfil_nome === "professor" ? /* @__PURE__ */ jsx(Field, { label: "Turma do curso", children: (id) => /* @__PURE__ */ jsxs(
            "select",
            {
              id,
              className: input,
              required: true,
              value: classId,
              onChange: (event) => setClassId(event.target.value),
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Selecione uma das suas turmas" }),
                classes.map((item) => /* @__PURE__ */ jsxs("option", { value: item.id, children: [
                  item.nome,
                  " · ",
                  item.ano_letivo
                ] }, item.id))
              ]
            }
          ) }) : /* @__PURE__ */ jsxs("p", { className: "rounded-xl bg-primary/10 p-3 text-sm", children: [
            "Público:",
            " ",
            user.perfil_nome === "admin" ? "todos os usuários" : user.instituicao_nome ?? "toda a escola"
          ] })),
          editor.kind !== "curso" && /* @__PURE__ */ jsx(Field, { label: "Ordem", children: (id) => /* @__PURE__ */ jsx(
            "input",
            {
              id,
              className: input,
              type: "number",
              required: true,
              min: 1,
              max: 9999,
              value: order,
              onChange: (event) => setOrder(Number(event.target.value))
            }
          ) }),
          editor.kind === "modulo" && /* @__PURE__ */ jsx(Field, { label: "Cor do módulo", children: (id) => /* @__PURE__ */ jsx(
            "input",
            {
              id,
              className: "h-10 w-20 rounded border border-border",
              type: "color",
              value: color,
              onChange: (event) => setColor(event.target.value)
            }
          ) }),
          editor.kind === "licao" && /* @__PURE__ */ jsx(Field, { label: "XP da lição", children: (id) => /* @__PURE__ */ jsx(
            "input",
            {
              id,
              className: input,
              type: "number",
              required: true,
              min: 0,
              max: 1e3,
              value: xp,
              onChange: (event) => setXp(Number(event.target.value))
            }
          ) }),
          mutation.error && /* @__PURE__ */ jsx("p", { role: "alert", className: "text-sm text-destructive", children: mutation.error.message }),
          /* @__PURE__ */ jsx(FormActions, { busy: mutation.isPending, close, label: `Salvar ${label}` })
        ] })
      ] })
    }
  );
}
function QuestionForm({
  editor,
  close,
  saved
}) {
  const [text, setText] = useState(editor.item?.texto_pergunta ?? "");
  const [explanation, setExplanation] = useState(editor.item?.explicacao ?? "");
  const [points, setPoints] = useState(Number(editor.item?.pontos_recompensa ?? 5));
  const [options, setOptions] = useState(
    editor.item?.opcoes.map((item) => item.texto_opcao) ?? ["", "", "", ""]
  );
  const [correct, setCorrect] = useState(
    editor.item ? editor.item.opcoes.findIndex((item) => Number(item.is_correta) === 1) : -1
  );
  const radioName = useId();
  const mutation = useMutation({
    mutationFn: () => apiFetch(
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
            is_correta: index === correct
          }))
        })
      }
    ),
    onSuccess: async (result) => {
      toast.success(result.mensagem);
      await saved();
    }
  });
  return /* @__PURE__ */ jsx(
    Dialog,
    {
      open: true,
      onOpenChange: (open) => {
        if (!open && !mutation.isPending) close();
      },
      children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-h-[90dvh] overflow-y-auto rounded-xl sm:max-w-2xl", children: [
        /* @__PURE__ */ jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsx(DialogTitle, { children: editor.item ? "Editar pergunta" : "Nova pergunta" }),
          /* @__PURE__ */ jsx(DialogDescription, { children: "Escreva quatro alternativas diferentes e marque uma resposta correta." })
        ] }),
        /* @__PURE__ */ jsxs(
          "form",
          {
            className: "space-y-4",
            onSubmit: (event) => {
              event.preventDefault();
              if (correct < 0) {
                toast.error("Marque a alternativa correta");
                return;
              }
              mutation.mutate();
            },
            children: [
              /* @__PURE__ */ jsx(Field, { label: "Pergunta", children: (id) => /* @__PURE__ */ jsx(
                "textarea",
                {
                  id,
                  className: input,
                  rows: 3,
                  required: true,
                  minLength: 3,
                  maxLength: 2e3,
                  value: text,
                  onChange: (event) => setText(event.target.value),
                  autoFocus: true
                }
              ) }),
              /* @__PURE__ */ jsxs("fieldset", { className: "space-y-3", children: [
                /* @__PURE__ */ jsx("legend", { className: "mb-2 text-sm font-bold", children: "Alternativas e resposta correta" }),
                options.map((value, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-end gap-3", children: [
                  /* @__PURE__ */ jsxs("label", { className: "flex shrink-0 items-center gap-1 pb-3 text-sm", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "radio",
                        name: radioName,
                        checked: correct === index,
                        onChange: () => setCorrect(index),
                        required: true,
                        "aria-label": `Alternativa ${index + 1} é a correta`
                      }
                    ),
                    String.fromCharCode(65 + index)
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "min-w-0 flex-1", children: /* @__PURE__ */ jsx(Field, { label: `Alternativa ${index + 1}`, children: (id) => /* @__PURE__ */ jsx(
                    "input",
                    {
                      id,
                      className: input,
                      required: true,
                      maxLength: 255,
                      value,
                      onChange: (event) => setOptions(
                        (current) => current.map((item, i) => i === index ? event.target.value : item)
                      )
                    }
                  ) }) })
                ] }, index))
              ] }),
              /* @__PURE__ */ jsx(Field, { label: "Explicação (opcional)", children: (id) => /* @__PURE__ */ jsx(
                "textarea",
                {
                  id,
                  className: input,
                  rows: 2,
                  maxLength: 500,
                  value: explanation,
                  onChange: (event) => setExplanation(event.target.value)
                }
              ) }),
              /* @__PURE__ */ jsx(Field, { label: "Pontos por acerto", children: (id) => /* @__PURE__ */ jsx(
                "input",
                {
                  id,
                  className: input,
                  type: "number",
                  min: 1,
                  max: 1e3,
                  required: true,
                  value: points,
                  onChange: (event) => setPoints(Number(event.target.value))
                }
              ) }),
              mutation.error && /* @__PURE__ */ jsx("p", { role: "alert", className: "text-sm text-destructive", children: mutation.error.message }),
              /* @__PURE__ */ jsx(FormActions, { busy: mutation.isPending, close, label: "Salvar pergunta" })
            ]
          }
        )
      ] })
    }
  );
}
function Field({ label, children }) {
  const id = useId();
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("label", { htmlFor: id, className: "mb-1.5 block text-sm font-semibold", children: label }),
    children(id)
  ] });
}
function FormActions({ busy, close, label }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 border-t border-border pt-4", children: [
    /* @__PURE__ */ jsx("button", { className: secondary, type: "button", disabled: busy, onClick: close, children: "Cancelar" }),
    /* @__PURE__ */ jsx("button", { className: primary, disabled: busy, children: busy ? "Salvando..." : label })
  ] });
}
function Confirm({
  label,
  title,
  description,
  disabled,
  onConfirm
}) {
  return /* @__PURE__ */ jsxs(AlertDialog, { children: [
    /* @__PURE__ */ jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx("button", { className: secondary, disabled, children: label }) }),
    /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: title }),
        /* @__PURE__ */ jsx(AlertDialogDescription, { children: description })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancelar" }),
        /* @__PURE__ */ jsx(AlertDialogAction, { onClick: onConfirm, children: "Confirmar" })
      ] })
    ] })
  ] });
}
function Publication({ published }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: `rounded-full px-3 py-1 text-xs font-bold ${published ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`,
      children: published ? "Publicado" : "Rascunho"
    }
  );
}
function Loading() {
  return /* @__PURE__ */ jsx("p", { role: "status", className: "p-12 text-center text-muted-foreground", children: "Carregando cursos..." });
}
function Empty({ children }) {
  return /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground", children });
}
function Failure({ error, retry }) {
  return /* @__PURE__ */ jsxs("div", { className: `${card} space-y-3 text-center`, children: [
    /* @__PURE__ */ jsx("p", { role: "alert", className: "text-destructive", children: error.message }),
    /* @__PURE__ */ jsx("button", { className: secondary, onClick: retry, children: "Tentar novamente" })
  ] });
}
function CoursesPage() {
  const {
    data: user,
    isPending,
    error
  } = useQuery(userQuery());
  if (isPending) return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsx("p", { role: "status", className: "p-16 text-center", children: "Verificando acesso..." }) });
  if (error || !user) return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-4 p-16 text-center", children: [
    /* @__PURE__ */ jsx("p", { role: "alert", children: error?.message ?? "Entre para continuar." }),
    /* @__PURE__ */ jsx(Link, { to: "/login", className: "text-primary underline", children: "Entrar" })
  ] }) });
  if (user.perfil_nome === "aluno") return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-4 p-16 text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold", children: "Área de gestão de conteúdo" }),
    /* @__PURE__ */ jsx(Link, { to: "/aprender", className: "text-primary underline", children: "Acessar meus cursos" })
  ] }) });
  return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsx(CourseManagement, { user }, `${user.id}-${user.perfil_nome}-${user.instituicao_id}`) });
}
export {
  CoursesPage as component
};
