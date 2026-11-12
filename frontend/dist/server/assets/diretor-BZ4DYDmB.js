import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar } from "recharts";
import { School, Edit3, ChevronDown, Check, ChevronUp, Users, UserMinus, X, Mail, Copy, RefreshCw, Trash2, AlertCircle, Plus, Eye } from "lucide-react";
import { a as apiFetch, D as Dialog, b as DialogContent, d as DialogHeader, e as DialogTitle, f as DialogDescription, g as DialogFooter, j as cn, A as AlertDialog, n as AlertDialogTrigger, o as AlertDialogContent, p as AlertDialogHeader, q as AlertDialogTitle, r as AlertDialogDescription, s as AlertDialogFooter, t as AlertDialogCancel, v as AlertDialogAction, h as isBrowser, l as useAuth, P as PageShell, w as RewardManagement } from "./router-_glEtDMC.js";
import { toast } from "sonner";
import * as SelectPrimitive from "@radix-ui/react-select";
import "@radix-ui/react-dialog";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-slot";
import "class-variance-authority";
function ClassFormModal({
  open,
  onOpenChange,
  onCreated
}) {
  const [name, setName] = useState("");
  const [year, setYear] = useState((/* @__PURE__ */ new Date()).getFullYear());
  const mutation = useMutation({
    mutationFn: () => apiFetch("/diretor/turmas", {
      method: "POST",
      body: JSON.stringify({ nome: name, ano_letivo: year })
    }),
    onSuccess: (r) => {
      toast.success(r.mensagem);
      setName("");
      onOpenChange(false);
      onCreated();
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-md overflow-hidden rounded-xl border-border/60 p-0 sm:p-0", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-gradient-hero p-6 text-primary-foreground", children: /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2 text-xl font-bold", children: [
        /* @__PURE__ */ jsx(School, { className: "h-5 w-5" }),
        "Nova turma"
      ] }),
      /* @__PURE__ */ jsx(DialogDescription, { className: "text-white/80", children: "Cadastre uma turma para o ano letivo." })
    ] }) }),
    /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: (e) => {
          e.preventDefault();
          if (!name.trim()) return toast.error("Informe o nome da turma");
          mutation.mutate();
        },
        className: "space-y-4 p-6",
        children: [
          /* @__PURE__ */ jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsx("span", { className: labelCls, children: "Nome" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                value: name,
                onChange: (e) => setName(e.target.value),
                className: inputCls$1,
                placeholder: "Ex.: 8B"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsx("span", { className: labelCls, children: "Ano letivo" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                min: 2020,
                max: 2100,
                value: year,
                onChange: (e) => setYear(Number(e.target.value)),
                className: inputCls$1
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => onOpenChange(false),
                className: "min-h-11 rounded-lg border border-border px-4 py-2 text-sm font-bold",
                children: "Cancelar"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                disabled: mutation.isPending,
                className: "min-h-11 rounded-lg bg-primary px-5 py-2 text-sm font-bold text-primary-foreground",
                children: mutation.isPending ? "Criando..." : "Criar turma"
              }
            )
          ] })
        ]
      }
    )
  ] }) });
}
const inputCls$1 = "w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground";
function EditTurmaModal({
  open,
  onOpenChange,
  classroom,
  onSaved
}) {
  const [name, setName] = useState("");
  const [year, setYear] = useState((/* @__PURE__ */ new Date()).getFullYear());
  useEffect(() => {
    if (open && classroom) {
      setName(classroom.nome);
      setYear(Number(classroom.ano_letivo));
    }
  }, [open, classroom]);
  const mutation = useMutation({
    mutationFn: () => apiFetch(`/diretor/turmas/${classroom.id}`, {
      method: "PUT",
      body: JSON.stringify({ nome: name, ano_letivo: year })
    }),
    onSuccess: (r) => {
      toast.success(r.mensagem);
      onOpenChange(false);
      onSaved();
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-md overflow-hidden rounded-xl border-border/60 p-0 sm:p-0", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-gradient-hero p-6 text-primary-foreground", children: /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2 text-xl font-bold", children: [
        /* @__PURE__ */ jsx(Edit3, { className: "h-5 w-5" }),
        "Editar turma"
      ] }),
      /* @__PURE__ */ jsx(DialogDescription, { className: "text-white/80", children: "Atualize o nome e o ano letivo." })
    ] }) }),
    /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: (e) => {
          e.preventDefault();
          if (!name.trim()) return toast.error("Informe o nome da turma");
          mutation.mutate();
        },
        className: "space-y-4 p-6",
        children: [
          /* @__PURE__ */ jsx(Field, { label: "Nome", children: /* @__PURE__ */ jsx("input", { value: name, onChange: (e) => setName(e.target.value), className: inputCls }) }),
          /* @__PURE__ */ jsx(Field, { label: "Ano letivo", children: /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              min: 2020,
              max: 2100,
              value: year,
              onChange: (e) => setYear(Number(e.target.value)),
              className: inputCls
            }
          ) }),
          /* @__PURE__ */ jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => onOpenChange(false),
                className: "min-h-11 rounded-lg border border-border px-4 py-2 text-sm font-bold",
                children: "Cancelar"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                disabled: mutation.isPending,
                className: "min-h-11 rounded-lg bg-primary px-5 py-2 text-sm font-bold text-primary-foreground disabled:opacity-60",
                children: mutation.isPending ? "Salvando..." : "Salvar"
              }
            )
          ] })
        ]
      }
    )
  ] }) });
}
const inputCls = "w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
function Field({ label, children }) {
  return /* @__PURE__ */ jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsx("span", { className: "mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground", children: label }),
    children
  ] });
}
const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex h-11 w-full items-center justify-between whitespace-nowrap rounded-lg border border-input bg-card px-3.5 py-2 text-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
  SelectPrimitive.Content,
  {
    ref,
    className: cn(
      "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-lg border bg-popover text-popover-foreground shadow-elevated data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsx(
        SelectPrimitive.Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Label,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex min-h-10 w-full cursor-default select-none items-center rounded-md py-2 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
function TurmaDetailModal({
  open,
  onOpenChange,
  classroom,
  classes,
  teachers,
  onChanged
}) {
  const queryClient = useQueryClient();
  const detailKey = ["diretor-turma-alunos", classroom?.id];
  const { data: students = [], isLoading } = useQuery({
    queryKey: detailKey,
    enabled: open && !!classroom,
    queryFn: async () => (await apiFetch(`/diretor/turmas/${classroom.id}/alunos`)).alunos
  });
  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: detailKey });
    onChanged();
  };
  const move = useMutation({
    mutationFn: ({ studentId, destinationId }) => apiFetch(`/diretor/turmas/${classroom.id}/alunos/${studentId}`, {
      method: "PUT",
      body: JSON.stringify({ nova_turma_id: destinationId })
    }),
    onSuccess: async (r) => {
      toast.success(r.mensagem);
      await refresh();
    },
    onError: (e) => toast.error(e.message)
  });
  const unlink = useMutation({
    mutationFn: (studentId) => apiFetch(`/diretor/turmas/${classroom.id}/alunos/${studentId}`, {
      method: "DELETE"
    }),
    onSuccess: async (r) => {
      toast.success(r.mensagem);
      await refresh();
    },
    onError: (e) => toast.error(e.message)
  });
  const assign = useMutation({
    mutationFn: (teacherId) => apiFetch(`/diretor/turmas/${classroom.id}/professores`, {
      method: "POST",
      body: JSON.stringify({ professor_id: teacherId })
    }),
    onSuccess: async (r) => {
      toast.success(r.mensagem);
      await refresh();
    },
    onError: (e) => toast.error(e.message)
  });
  const removeTeacher = useMutation({
    mutationFn: (teacherId) => apiFetch(`/diretor/turmas/${classroom.id}/professores/${teacherId}`, {
      method: "DELETE"
    }),
    onSuccess: async (r) => {
      toast.success(r.mensagem);
      await refresh();
    },
    onError: (e) => toast.error(e.message)
  });
  if (!classroom) return null;
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-h-[90vh] max-w-3xl overflow-y-auto rounded-xl border-border/60 p-0 sm:p-0", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-gradient-hero p-6 text-primary-foreground", children: /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2 text-xl font-bold", children: [
        /* @__PURE__ */ jsx(Users, { className: "h-5 w-5" }),
        "Turma ",
        classroom.nome
      ] }),
      /* @__PURE__ */ jsxs(DialogDescription, { className: "text-white/80", children: [
        classroom.ano_letivo,
        " · código ",
        classroom.codigo_acesso
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6 p-6", children: [
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold uppercase tracking-wide text-muted-foreground", children: "Alunos vinculados" }),
        /* @__PURE__ */ jsx("div", { className: "mt-3 space-y-2", children: isLoading ? /* @__PURE__ */ jsx("div", { className: "p-6 text-center text-muted-foreground", children: "Carregando alunos..." }) : students.length === 0 ? /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground", children: "Nenhum aluno vinculado." }) : students.map((student) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-background/60 p-3",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsx("div", { className: "font-bold", children: student.nome }),
                /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
                  student.email,
                  " · ",
                  Number(student.pontos).toLocaleString("pt-BR"),
                  " pontos"
                ] })
              ] }),
              /* @__PURE__ */ jsxs(
                Select,
                {
                  onValueChange: (value) => move.mutate({ studentId: student.id, destinationId: Number(value) }),
                  children: [
                    /* @__PURE__ */ jsx(SelectTrigger, { className: "w-44", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Mover para..." }) }),
                    /* @__PURE__ */ jsx(SelectContent, { children: classes.filter((item) => item.id !== classroom.id).map((item) => /* @__PURE__ */ jsx(SelectItem, { value: String(item.id), children: item.nome }, item.id)) })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(AlertDialog, { children: [
                /* @__PURE__ */ jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
                  "button",
                  {
                    className: "grid h-11 w-11 place-items-center rounded-full bg-destructive/10 text-destructive",
                    title: "Remover vínculo",
                    children: /* @__PURE__ */ jsx(UserMinus, { className: "h-4 w-4" })
                  }
                ) }),
                /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
                  /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
                    /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Remover aluno da turma?" }),
                    /* @__PURE__ */ jsx(AlertDialogDescription, { children: "O aluno ficará sem turma e sem escola até ser realocado." })
                  ] }),
                  /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
                    /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancelar" }),
                    /* @__PURE__ */ jsx(
                      AlertDialogAction,
                      {
                        onClick: () => unlink.mutate(student.id),
                        className: "bg-destructive text-destructive-foreground",
                        children: "Remover vínculo"
                      }
                    )
                  ] })
                ] })
              ] })
            ]
          },
          student.id
        )) })
      ] }),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold uppercase tracking-wide text-muted-foreground", children: "Professores responsáveis" }),
        /* @__PURE__ */ jsx("div", { className: "mt-3 flex flex-wrap gap-2", children: classroom.professores.map((teacher) => /* @__PURE__ */ jsxs(
          "span",
          {
            className: "inline-flex min-h-11 items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary",
            children: [
              teacher.nome,
              /* @__PURE__ */ jsx("button", { onClick: () => removeTeacher.mutate(teacher.id), children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" }) })
            ]
          },
          teacher.id
        )) }),
        /* @__PURE__ */ jsxs(Select, { onValueChange: (value) => assign.mutate(Number(value)), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "mt-3", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Adicionar professor responsável" }) }),
          /* @__PURE__ */ jsx(SelectContent, { children: teachers.filter(
            (teacher) => !classroom.professores.some((current) => current.id === teacher.id)
          ).map((teacher) => /* @__PURE__ */ jsx(SelectItem, { value: String(teacher.id), children: teacher.nome }, teacher.id)) })
        ] })
      ] })
    ] })
  ] }) });
}
function TeacherInviteManagement() {
  const [email, setEmail] = useState("");
  const [link, setLink] = useState("");
  const queryClient = useQueryClient();
  const key = ["diretor-convites"];
  const { data = [], isLoading } = useQuery({
    queryKey: key,
    enabled: isBrowser,
    queryFn: async () => (await apiFetch("/diretor/convites-professor")).convites
  });
  const send = useMutation({
    mutationFn: (address) => apiFetch("/diretor/convites-professor", {
      method: "POST",
      body: JSON.stringify({ email: address })
    }),
    onSuccess: async (r) => {
      toast.success("Convite enviado");
      setLink(r.link);
      setEmail("");
      await queryClient.invalidateQueries({ queryKey: key });
    },
    onError: (e) => toast.error(e.message)
  });
  const cancel = useMutation({
    mutationFn: (id) => apiFetch(`/diretor/convites-professor/${id}`, { method: "DELETE" }),
    onSuccess: async (r) => {
      toast.success(r.mensagem);
      await queryClient.invalidateQueries({ queryKey: key });
    },
    onError: (e) => toast.error(e.message)
  });
  async function copy(value) {
    await navigator.clipboard.writeText(value);
    toast.success("Link copiado");
  }
  return /* @__PURE__ */ jsxs("section", { className: "rounded-lg border border-border/60 bg-card p-6 shadow-soft", children: [
    /* @__PURE__ */ jsxs("h2", { className: "flex items-center gap-2 text-sm font-bold uppercase tracking-wide", children: [
      /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4 text-primary" }),
      "Professores"
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Convide professores com um link seguro de uso único." }),
    /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: (e) => {
          e.preventDefault();
          if (!email.trim()) return toast.error("Informe o e-mail");
          send.mutate(email);
        },
        className: "mt-4 flex gap-2",
        children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "email",
              required: true,
              value: email,
              onChange: (e) => setEmail(e.target.value),
              className: "min-w-0 flex-1 rounded-xl border border-input bg-background px-3 py-2.5 text-sm",
              placeholder: "professor@escola.edu.br"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              disabled: send.isPending,
              className: "min-h-11 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground",
              children: send.isPending ? "Enviando..." : "Enviar convite"
            }
          )
        ]
      }
    ),
    link && /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 p-3", children: [
      /* @__PURE__ */ jsx("code", { className: "min-w-0 flex-1 truncate text-xs", children: link }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => copy(link),
          className: "grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground",
          children: /* @__PURE__ */ jsx(Copy, { className: "h-3.5 w-3.5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-2", children: isLoading ? /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Carregando convites..." }) : data.map((invite) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 p-3",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "truncate text-sm font-bold", children: invite.email }),
            /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-muted-foreground", children: [
              "Expira em ",
              new Date(invite.expira_em).toLocaleString("pt-BR")
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${invite.status === "aceito" ? "bg-success/15 text-success" : invite.status === "expirado" ? "bg-destructive/10 text-destructive" : "bg-warning/15 text-warning"}`,
              children: invite.status
            }
          ),
          invite.status === "expirado" ? /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => send.mutate(invite.email),
              className: "grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary",
              title: "Reenviar",
              children: /* @__PURE__ */ jsx(RefreshCw, { className: "h-3.5 w-3.5" })
            }
          ) : invite.status === "pendente" ? /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => cancel.mutate(invite.id),
              className: "grid h-11 w-11 place-items-center rounded-full bg-destructive/10 text-destructive",
              title: "Cancelar",
              children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
            }
          ) : null
        ]
      },
      invite.id
    )) })
  ] });
}
function DirectorPage() {
  const {
    role,
    isLoading: loadingAuth
  } = useAuth();
  const queryClient = useQueryClient();
  const [newClass, setNewClass] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const key = ["diretor"];
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: key,
    enabled: isBrowser && role === "diretor",
    queryFn: async () => {
      const [dashboard, classes, teachers] = await Promise.all([apiFetch("/diretor/dashboard"), apiFetch("/diretor/turmas"), apiFetch("/diretor/professores-disponiveis")]);
      return {
        dashboard,
        classes: classes.turmas,
        teachers: teachers.professores
      };
    }
  });
  const refresh = () => queryClient.invalidateQueries({
    queryKey: key
  });
  const regenerate = useMutation({
    mutationFn: (id) => apiFetch(`/diretor/turmas/${id}/regenerar-codigo`, {
      method: "POST"
    }),
    onSuccess: async (r) => {
      toast.success(`${r.mensagem}: ${r.codigo_acesso}`);
      await refresh();
    },
    onError: (e) => toast.error(e.message)
  });
  const removeClass = useMutation({
    mutationFn: (id) => apiFetch(`/diretor/turmas/${id}`, {
      method: "DELETE"
    }),
    onSuccess: async (r) => {
      toast.success(r.mensagem);
      await refresh();
    },
    onError: (e) => toast.error(e.message)
  });
  async function copy(code) {
    await navigator.clipboard.writeText(code);
    toast.success("Código copiado");
  }
  if (loadingAuth) return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsx("div", { className: "p-16 text-center text-muted-foreground", children: "Verificando acesso..." }) });
  if (role !== "diretor") return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-xl p-16 text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold", children: "Acesso negado" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-muted-foreground", children: "Esta área é exclusiva para a direção." }),
    /* @__PURE__ */ jsx(Link, { to: "/", className: "mt-4 inline-block font-bold text-primary", children: "Voltar ao início" })
  ] }) });
  if (isLoading) return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsx("div", { className: "p-16 text-center text-muted-foreground", children: "Carregando painel da escola..." }) });
  if (error || !data) return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsx("div", { className: "p-16 text-center text-destructive", children: error?.message ?? "Não foi possível carregar" }) });
  const points = data.dashboard.pontos_por_turma.map((p) => ({
    name: p.turma,
    points: Number(p.pontos)
  }));
  const pending = data.dashboard.pendencias_por_turma.reduce((sum, p) => sum + Number(p.pendencias), 0);
  const editing = data.classes.find((item) => item.id === editingId) ?? null;
  const detail = data.classes.find((item) => item.id === detailId) ?? null;
  return /* @__PURE__ */ jsxs(PageShell, { children: [
    /* @__PURE__ */ jsxs("div", { className: "app-page space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "page-heading", children: [
        /* @__PURE__ */ jsx("div", { className: "page-eyebrow", children: "Painel da Direção" }),
        /* @__PURE__ */ jsx("h1", { className: "page-title", children: "Visão geral da escola" }),
        /* @__PURE__ */ jsx("p", { className: "page-description", children: "Turmas, professores, desempenho e recompensas da instituição." })
      ] }),
      /* @__PURE__ */ jsx("dl", { className: "grid divide-y border-y bg-card sm:grid-cols-3 sm:divide-x sm:divide-y-0", children: [{
        icon: Users,
        label: "Total de alunos",
        value: data.dashboard.total_alunos
      }, {
        icon: School,
        label: "Turmas",
        value: data.classes.length
      }, {
        icon: AlertCircle,
        label: "Pendências",
        value: pending
      }].map((stat) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 p-5", children: [
        /* @__PURE__ */ jsx(stat.icon, { className: "h-5 w-5 shrink-0 text-primary", "aria-hidden": "true" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("dd", { className: "text-2xl font-bold tabular-nums", children: stat.value }),
          /* @__PURE__ */ jsx("dt", { className: "text-xs text-muted-foreground", children: stat.label })
        ] })
      ] }, stat.label)) }),
      /* @__PURE__ */ jsxs("section", { className: "rounded-lg border border-border/60 bg-card p-6 shadow-soft", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-sm font-bold uppercase tracking-wide", children: "Pontos por turma" }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 h-64", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(BarChart, { data: points, children: [
          /* @__PURE__ */ jsx(XAxis, { dataKey: "name" }),
          /* @__PURE__ */ jsx(YAxis, {}),
          /* @__PURE__ */ jsx(Tooltip, {}),
          /* @__PURE__ */ jsx(Bar, { dataKey: "points", fill: "var(--color-success)", radius: [8, 8, 0, 0] })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "rounded-lg border border-border/60 bg-card p-6 shadow-soft", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm font-bold uppercase tracking-wide", children: "Turmas da escola" }),
          /* @__PURE__ */ jsxs("button", { onClick: () => setNewClass(true), className: "inline-flex min-h-11 items-center gap-1 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground", children: [
            /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
            "Nova turma"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 grid gap-4 lg:grid-cols-2", children: data.classes.map((classroom, index) => /* @__PURE__ */ jsxs(motion.article, { initial: {
          opacity: 0,
          y: 8
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          delay: index * 0.04
        }, className: "rounded-lg border border-border/60 bg-background/60 p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("h3", { className: "text-lg font-bold", children: [
                "Turma ",
                classroom.nome
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
                classroom.ano_letivo,
                " · ",
                classroom.total_alunos,
                " alunos"
              ] })
            ] }),
            /* @__PURE__ */ jsx(School, { className: "h-5 w-5 text-primary" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("code", { className: "rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-bold tracking-wide text-primary", children: classroom.codigo_acesso }),
            /* @__PURE__ */ jsx("button", { onClick: () => copy(classroom.codigo_acesso), className: "grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary", title: "Copiar código", children: /* @__PURE__ */ jsx(Copy, { className: "h-3.5 w-3.5" }) }),
            /* @__PURE__ */ jsxs(AlertDialog, { children: [
              /* @__PURE__ */ jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs("button", { className: "inline-flex min-h-11 items-center gap-1 rounded-lg bg-warning/15 px-3 py-1.5 text-xs font-bold text-warning", children: [
                /* @__PURE__ */ jsx(RefreshCw, { className: "h-3 w-3" }),
                "Gerar novo"
              ] }) }),
              /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
                /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
                  /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Gerar um novo código?" }),
                  /* @__PURE__ */ jsx(AlertDialogDescription, { children: "O código atual deixará de funcionar imediatamente." })
                ] }),
                /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
                  /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancelar" }),
                  /* @__PURE__ */ jsx(AlertDialogAction, { onClick: () => regenerate.mutate(classroom.id), children: "Gerar novo código" })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-3 flex flex-wrap gap-1.5", children: classroom.professores.map((teacher) => /* @__PURE__ */ jsx("span", { className: "rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary", children: teacher.nome }, teacher.id)) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsxs("button", { onClick: () => setDetailId(classroom.id), className: "inline-flex min-h-11 items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground", children: [
              /* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" }),
              "Gerenciar"
            ] }),
            /* @__PURE__ */ jsxs("button", { onClick: () => setEditingId(classroom.id), className: "inline-flex min-h-11 items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary", children: [
              /* @__PURE__ */ jsx(Edit3, { className: "h-3.5 w-3.5" }),
              "Editar"
            ] }),
            /* @__PURE__ */ jsxs(AlertDialog, { children: [
              /* @__PURE__ */ jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs("button", { className: "inline-flex min-h-11 items-center gap-1 rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-bold text-destructive", children: [
                /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }),
                "Excluir"
              ] }) }),
              /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
                /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
                  /* @__PURE__ */ jsxs(AlertDialogTitle, { children: [
                    "Excluir a turma ",
                    classroom.nome,
                    "?"
                  ] }),
                  /* @__PURE__ */ jsx(AlertDialogDescription, { children: "A exclusão só será permitida se não houver alunos vinculados." })
                ] }),
                /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
                  /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancelar" }),
                  /* @__PURE__ */ jsx(AlertDialogAction, { onClick: () => removeClass.mutate(classroom.id), className: "bg-destructive text-destructive-foreground", children: "Excluir turma" })
                ] })
              ] })
            ] })
          ] })
        ] }, classroom.id)) })
      ] }),
      /* @__PURE__ */ jsxs(Link, { to: "/cursos", className: "block rounded-lg border border-primary/30 bg-primary/5 p-5 text-primary", children: [
        /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Gerenciar cursos e quizzes da escola" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm", children: "Crie cursos, módulos, lições e perguntas para todos os alunos da instituição." })
      ] }),
      /* @__PURE__ */ jsx(TeacherInviteManagement, {}),
      /* @__PURE__ */ jsx(RewardManagement, { endpoint: "/diretor/recompensas", title: "Recompensas da escola" })
    ] }),
    /* @__PURE__ */ jsx(ClassFormModal, { open: newClass, onOpenChange: setNewClass, onCreated: () => void refresh() }),
    /* @__PURE__ */ jsx(EditTurmaModal, { open: !!editing, onOpenChange: (value) => !value && setEditingId(null), classroom: editing, onSaved: () => void refresh() }),
    /* @__PURE__ */ jsx(TurmaDetailModal, { open: !!detail, onOpenChange: (value) => !value && setDetailId(null), classroom: detail, classes: data.classes, teachers: data.teachers, onChanged: () => void refresh() })
  ] });
}
export {
  DirectorPage as component
};
