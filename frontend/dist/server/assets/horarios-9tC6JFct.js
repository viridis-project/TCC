import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useMemo, useEffect, Fragment } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Rocket, ImagePlus, X, ChevronLeft, ChevronRight, CalendarRange, CalendarDays, Clock3, User, Plus } from "lucide-react";
import { m as missionTypes, a as apiFetch, D as Dialog, b as DialogContent, d as DialogHeader, e as DialogTitle, f as DialogDescription, g as DialogFooter, c as backendAsset, j as cn, l as useAuth, h as isBrowser, P as PageShell } from "./router-_glEtDMC.js";
import { toast } from "sonner";
import { S as SubmitProofModal } from "./submit-proof-modal-Cz6RAjCn.js";
import { startOfWeek, endOfWeek, format, addWeeks, addMonths, addDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSearch } from "@tanstack/react-router";
import "recharts";
import "@radix-ui/react-dialog";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-slot";
import "class-variance-authority";
function MissionFormModal({
  open,
  onOpenChange,
  turmas,
  onCreated
}) {
  const [classId, setClassId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("plant");
  const [points, setPoints] = useState(String(missionTypes.plant.points));
  const [maxStudents, setMaxStudents] = useState("1");
  const [image, setImage] = useState(null);
  const selectedClass = useMemo(
    () => turmas.find((t) => t.id === Number(classId)),
    [classId, turmas]
  );
  const preview = useMemo(() => image ? URL.createObjectURL(image) : null, [image]);
  const mutation = useMutation({
    mutationFn: () => {
      const form = new FormData();
      form.append("turma_id", classId);
      form.append("titulo", title.trim());
      form.append("descricao", description.trim());
      form.append("tipo", type);
      form.append("pontos", points);
      form.append("max_alunos", maxStudents);
      if (image) form.append("foto", image);
      return apiFetch("/missoes", { method: "POST", body: form });
    },
    onSuccess: (r) => {
      toast.success(r.mensagem);
      setTitle("");
      setDescription("");
      setImage(null);
      setType("plant");
      setPoints(String(missionTypes.plant.points));
      setMaxStudents("1");
      onOpenChange(false);
      onCreated();
    },
    onError: (e) => toast.error(e.message)
  });
  function submit(e) {
    e.preventDefault();
    if (!classId || title.trim() === "") return toast.error("Preencha turma e título da missão");
    mutation.mutate();
  }
  function chooseType(value) {
    setType(value);
    setPoints(String(missionTypes[value].points));
  }
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-h-[calc(100dvh-1.5rem)] max-w-lg overflow-y-auto rounded-xl border-border/60 p-0 sm:p-0", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-gradient-hero p-6 text-primary-foreground", children: /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2 text-xl font-bold", children: [
        /* @__PURE__ */ jsx(Rocket, { className: "h-5 w-5" }),
        "Nova missão"
      ] }),
      /* @__PURE__ */ jsx(DialogDescription, { className: "text-white/80", children: "Publique uma missão para a turma. Os alunos escolhem quem faz e quando." })
    ] }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-4 p-6", children: [
      /* @__PURE__ */ jsx(Field, { label: "Turma", children: /* @__PURE__ */ jsxs(
        "select",
        {
          value: classId,
          onChange: (e) => setClassId(e.target.value),
          className: inputCls,
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Selecione" }),
            turmas.map((t) => /* @__PURE__ */ jsx("option", { value: t.id, children: t.nome }, t.id))
          ]
        }
      ) }),
      /* @__PURE__ */ jsx("p", { className: "rounded-xl bg-muted p-3 text-xs text-muted-foreground", children: selectedClass ? `${selectedClass.alunos.length} alunos poderão ver esta missão.` : "Selecione a turma que verá a missão." }),
      /* @__PURE__ */ jsx(Field, { label: "Título da missão", children: /* @__PURE__ */ jsx(
        "input",
        {
          value: title,
          onChange: (e) => setTitle(e.target.value),
          maxLength: 150,
          className: inputCls,
          placeholder: "Ex.: Regar o canteiro"
        }
      ) }),
      /* @__PURE__ */ jsx(Field, { label: "Descrição (opcional)", children: /* @__PURE__ */ jsx(
        "textarea",
        {
          value: description,
          onChange: (e) => setDescription(e.target.value),
          maxLength: 2e3,
          rows: 3,
          className: inputCls
        }
      ) }),
      /* @__PURE__ */ jsx(Field, { label: "Imagem (opcional)", children: /* @__PURE__ */ jsxs("label", { className: "flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-border bg-background/60 p-3 hover:border-primary/50 hover:bg-primary/5", children: [
        preview ? /* @__PURE__ */ jsx("img", { src: preview, alt: "Prévia da imagem da missão", className: "h-14 w-14 rounded-lg object-cover" }) : /* @__PURE__ */ jsx("div", { className: "grid h-14 w-14 place-items-center rounded-lg bg-primary/15 text-primary", children: /* @__PURE__ */ jsx(ImagePlus, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate text-sm font-semibold", children: image ? image.name : "Clique para escolher uma imagem (JPG, PNG ou WebP, até 5 MB)" }),
        image && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            "aria-label": "Remover imagem",
            onClick: (e) => {
              e.preventDefault();
              setImage(null);
            },
            className: "grid h-7 w-7 place-items-center rounded-full bg-muted text-muted-foreground hover:bg-destructive hover:text-destructive-foreground",
            children: /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" })
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "file",
            accept: "image/jpeg,image/png,image/webp",
            className: "hidden",
            onChange: (e) => setImage(e.target.files?.[0] ?? null)
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-3", children: [
        /* @__PURE__ */ jsx(Field, { label: "Tipo", children: /* @__PURE__ */ jsx(
          "select",
          {
            value: type,
            onChange: (e) => chooseType(e.target.value),
            className: inputCls,
            children: Object.entries(missionTypes).map(([value, item]) => /* @__PURE__ */ jsx("option", { value, children: item.label }, value))
          }
        ) }),
        /* @__PURE__ */ jsx(Field, { label: "Pontos", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            min: 0,
            max: 1e4,
            value: points,
            onChange: (e) => setPoints(e.target.value),
            className: inputCls
          }
        ) }),
        /* @__PURE__ */ jsx(Field, { label: "Máx. de alunos", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            min: 1,
            max: 100,
            value: maxStudents,
            onChange: (e) => setMaxStudents(e.target.value),
            className: inputCls
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: Number(maxStudents) > 1 ? "Os pontos são creditados a cada integrante da equipe quando você aprova a comprovação." : "Missão individual: apenas um aluno poderá pegá-la." }),
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
            children: mutation.isPending ? "Publicando..." : "Publicar missão"
          }
        )
      ] })
    ] })
  ] }) });
}
const inputCls = "w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
function Field({ label, children }) {
  return /* @__PURE__ */ jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsx("span", { className: "mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground", children: label }),
    children
  ] });
}
const statusLabel = {
  agendado: "Agendada",
  em_analise: "Em análise",
  concluido: "Concluída",
  cancelado: "Cancelada",
  nao_realizada: "Não realizada"
};
const hasDetails = (item) => item.status !== "cancelado";
const canSubmitProof = (item) => Boolean(item.minha) && (item.status === "agendado" || item.status === "nao_realizada") && item.envio_status !== "pending" && item.envio_status !== "approved";
function parseDate(raw) {
  return new Date(raw.replace(" ", "T"));
}
function groupItems(items) {
  const groups = /* @__PURE__ */ new Map();
  items.forEach((item) => {
    const key = [
      item.titulo,
      item.data_hora,
      item.status,
      item.missao_id ?? "",
      item.grupo_id ?? item.id,
      item.turma ?? ""
    ].join("|");
    const current = groups.get(key);
    if (current) {
      current.ids.push(item.id);
      if (item.aluno && !current.alunos.includes(item.aluno)) current.alunos.push(item.aluno);
      if (item.minha) current.minha = 1;
      return;
    }
    groups.set(key, {
      ...item,
      ids: [item.id],
      alunos: item.aluno ? [item.aluno] : [],
      date: parseDate(item.data_hora)
    });
  });
  return [...groups.values()].sort((a, b) => a.date.getTime() - b.date.getTime());
}
const statusClass = {
  agendado: "border-primary/30 bg-primary/10 text-foreground",
  concluido: "border-success/30 bg-success/10 text-foreground",
  cancelado: "border-destructive/30 bg-destructive/5 text-muted-foreground",
  nao_realizada: "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200",
  em_analise: "border-info/40 bg-info/10 text-foreground"
};
function ScheduleCalendar({
  items,
  professor,
  updating,
  onStatus,
  onSubmitProof
}) {
  const [view, setView] = useState("week");
  const [anchor, setAnchor] = useState(() => /* @__PURE__ */ new Date());
  const search = useSearch({ strict: false });
  useEffect(() => {
    if (!search.data) return;
    const parsed = /* @__PURE__ */ new Date(`${search.data}T00:00:00`);
    if (!Number.isNaN(parsed.getTime())) setAnchor(parsed);
  }, [search.data]);
  const grouped = useMemo(() => groupItems(items), [items]);
  const [resultItem, setResultItem] = useState(null);
  const proofHandler = onSubmitProof;
  const weekStart = startOfWeek(anchor, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(anchor, { weekStartsOn: 1 });
  const periodLabel = view === "week" ? `${format(weekStart, "dd MMM", { locale: ptBR })} — ${format(weekEnd, "dd MMM yyyy", { locale: ptBR })}` : format(anchor, "MMMM 'de' yyyy", { locale: ptBR });
  function movePeriod(direction) {
    setAnchor((current) => {
      const next = view === "week" ? addWeeks(current, direction) : addMonths(current, direction);
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        params.set("data", format(next, "yyyy-MM-dd"));
        window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
      }
      return next;
    });
  }
  return /* @__PURE__ */ jsxs("section", { className: "mt-6 overflow-hidden rounded-xl border border-border/60 bg-card shadow-soft", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 border-b border-border/60 p-3 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => movePeriod(-1),
            "aria-label": view === "week" ? "Semana anterior" : "Mês anterior",
            className: "grid h-11 w-11 place-items-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4", "aria-hidden": "true" })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              const today = /* @__PURE__ */ new Date();
              setAnchor(today);
              if (typeof window !== "undefined") {
                const params = new URLSearchParams(window.location.search);
                params.delete("data");
                const query = params.toString();
                window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
              }
            },
            className: "min-h-11 rounded-lg px-3 text-sm font-bold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            children: "Hoje"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => movePeriod(1),
            "aria-label": view === "week" ? "Próxima semana" : "Próximo mês",
            className: "grid h-11 w-11 place-items-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4", "aria-hidden": "true" })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "order-first font-display text-lg font-bold capitalize text-foreground sm:order-none", children: periodLabel }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 rounded-lg border border-border bg-muted/50 p-1", children: [
        /* @__PURE__ */ jsxs(ViewButton, { active: view === "week", onClick: () => setView("week"), children: [
          /* @__PURE__ */ jsx(CalendarRange, { className: "h-4 w-4", "aria-hidden": "true" }),
          " Semana"
        ] }),
        /* @__PURE__ */ jsxs(ViewButton, { active: view === "month", onClick: () => setView("month"), children: [
          /* @__PURE__ */ jsx(CalendarDays, { className: "h-4 w-4", "aria-hidden": "true" }),
          " Mês"
        ] })
      ] })
    ] }),
    view === "week" ? /* @__PURE__ */ jsx(
      WeekView,
      {
        anchor,
        items: grouped,
        professor,
        updating,
        onStatus,
        onResults: setResultItem
      }
    ) : /* @__PURE__ */ jsx(MonthView, { anchor, items: grouped, onResults: setResultItem }),
    resultItem && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm",
        onClick: () => setResultItem(null),
        children: /* @__PURE__ */ jsxs(
          "section",
          {
            role: "dialog",
            "aria-modal": "true",
            "aria-label": resultItem.titulo,
            className: "max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-card p-6 shadow-xl",
            onClick: (event) => event.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold", children: resultItem.titulo }),
                  /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
                    format(resultItem.date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }),
                    " · ",
                    statusLabel[resultItem.status],
                    resultItem.tipo ? ` · ${missionTypes[resultItem.tipo].label}` : "",
                    resultItem.pontos ? ` · ${resultItem.pontos} pts` : ""
                  ] })
                ] }),
                /* @__PURE__ */ jsx("button", { className: "rounded-md border px-3 py-2 text-sm", onClick: () => setResultItem(null), children: "Fechar" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-4", children: [
                resultItem.imagem && /* @__PURE__ */ jsx("img", { src: backendAsset(resultItem.imagem), alt: "", className: "max-h-48 w-full rounded-lg object-cover" }),
                resultItem.descricao && /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold uppercase text-muted-foreground", children: "Descrição" }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 whitespace-pre-wrap text-sm", children: resultItem.descricao })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold uppercase text-muted-foreground", children: "Participantes" }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm", children: resultItem.alunos.join(", ") || "Nenhum aluno registrado" })
                ] }),
                resultItem.envio_status && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxs("h3", { className: "text-xs font-bold uppercase text-muted-foreground", children: [
                    "Comprovação enviada ·",
                    " ",
                    resultItem.envio_status === "pending" ? "em análise" : resultItem.envio_status === "approved" ? "aprovada" : "rejeitada"
                  ] }),
                  resultItem.envio_foto && /* @__PURE__ */ jsx("img", { src: backendAsset(resultItem.envio_foto), alt: "Comprovação", className: "max-h-60 w-full rounded-lg object-contain" }),
                  resultItem.envio_descricao && /* @__PURE__ */ jsx("p", { className: "whitespace-pre-wrap rounded-lg bg-muted p-3 text-sm", children: resultItem.envio_descricao }),
                  resultItem.envio_comentario && /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
                    "Professor: ",
                    resultItem.envio_comentario
                  ] })
                ] }),
                proofHandler && canSubmitProof(resultItem) && /* @__PURE__ */ jsx(
                  "button",
                  {
                    className: "min-h-11 w-full rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground",
                    onClick: () => {
                      proofHandler(resultItem);
                      setResultItem(null);
                    },
                    children: resultItem.envio_status === "rejected" ? "Reenviar comprovação" : "Enviar comprovação"
                  }
                )
              ] })
            ]
          }
        )
      }
    )
  ] });
}
function ViewButton({
  active,
  onClick,
  children
}) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      "aria-pressed": active,
      onClick,
      className: cn(
        "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md px-3 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
      ),
      children
    }
  );
}
function WeekView({
  anchor,
  items,
  professor,
  updating,
  onStatus,
  onResults
}) {
  const weekStart = startOfWeek(anchor, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  const visibleItems = items.filter(
    (item) => item.date >= weekStart && item.date <= endOfWeek(anchor, { weekStartsOn: 1 })
  );
  const hours = Array.from(
    /* @__PURE__ */ new Set([7, 9, 11, 13, 15, ...visibleItems.map((item) => item.date.getHours())])
  ).sort((a, b) => a - b);
  return /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", "aria-label": "Calendário semanal", children: /* @__PURE__ */ jsxs("div", { className: "min-w-[1080px]", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[5rem_repeat(7,minmax(0,1fr))] bg-muted/30", children: [
      /* @__PURE__ */ jsx("div", { className: "border-r border-border/60" }),
      days.map((day) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: cn(
            "border-r border-border/60 p-3 text-center last:border-r-0",
            isSameDay(day, /* @__PURE__ */ new Date()) && "bg-primary/5"
          ),
          children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] font-bold uppercase tracking-wide text-muted-foreground", children: format(day, "EEE", { locale: ptBR }) }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: cn(
                  "mx-auto mt-1 grid h-8 w-8 place-items-center rounded-full text-sm font-bold",
                  isSameDay(day, /* @__PURE__ */ new Date()) && "bg-primary text-primary-foreground"
                ),
                children: format(day, "dd")
              }
            )
          ]
        },
        day.toISOString()
      ))
    ] }),
    hours.map((hour) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "grid grid-cols-[5rem_repeat(7,minmax(0,1fr))] border-t border-border/60",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex h-32 items-start justify-end border-r border-border/60 p-3 text-xs font-bold tabular-nums text-muted-foreground", children: [
            String(hour).padStart(2, "0"),
            ":00"
          ] }),
          days.map((day) => {
            const entries = visibleItems.filter(
              (item) => isSameDay(item.date, day) && item.date.getHours() === hour
            );
            return /* @__PURE__ */ jsx(
              "div",
              {
                className: "h-32 min-w-0 overflow-hidden border-r border-border/60 p-1.5 last:border-r-0",
                children: entries.length ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(
                    WeekEvent,
                    {
                      item: entries[0],
                      professor,
                      updating,
                      onStatus,
                      onResults
                    }
                  ),
                  entries.length > 1 && /* @__PURE__ */ jsxs("div", { className: "mt-1 truncate text-center text-[10px] font-bold text-primary", children: [
                    "+",
                    entries.length - 1,
                    " ",
                    entries.length === 2 ? "missão" : "missões"
                  ] })
                ] }) : /* @__PURE__ */ jsx("div", { className: "grid h-full place-items-center text-muted-foreground/25", children: /* @__PURE__ */ jsx(Clock3, { className: "h-4 w-4", "aria-hidden": "true" }) })
              },
              day.toISOString()
            );
          })
        ]
      },
      hour
    ))
  ] }) });
}
function WeekEvent({
  item,
  professor,
  updating,
  onStatus,
  onResults
}) {
  return /* @__PURE__ */ jsxs(
    "article",
    {
      className: cn(
        "flex h-[calc(100%-1.25rem)] min-h-0 flex-col overflow-hidden rounded-lg border p-2 text-xs",
        hasDetails(item) && "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        statusClass[item.status]
      ),
      title: `${item.titulo} — ${format(item.date, "HH:mm")}`,
      onClick: () => hasDetails(item) && onResults(item),
      role: hasDetails(item) ? "button" : void 0,
      tabIndex: hasDetails(item) ? 0 : void 0,
      onKeyDown: (event) => {
        if (hasDetails(item) && event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onResults(item);
        }
      },
      children: [
        /* @__PURE__ */ jsx("div", { className: "truncate font-bold", children: item.titulo }),
        /* @__PURE__ */ jsx("div", { className: "mt-0.5 tabular-nums text-muted-foreground", children: format(item.date, "HH:mm") }),
        /* @__PURE__ */ jsxs("div", { className: "mt-1 truncate text-[10px] text-muted-foreground", children: [
          professor && item.turma ? `${item.turma} · ` : "",
          item.alunos.length ? `Com ${item.alunos.join(", ")}` : "Sem alunos"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-auto flex items-end justify-between gap-1", children: [
          /* @__PURE__ */ jsx("span", { className: "truncate text-[10px] text-muted-foreground", children: statusLabel[item.status] }),
          professor && item.status === "agendado" && /* @__PURE__ */ jsx("span", { className: "flex shrink-0 gap-1", children: /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              disabled: updating,
              onClick: (event) => {
                event.stopPropagation();
                onStatus(item.ids, "cancelado");
              },
              className: "grid h-9 w-9 place-items-center rounded-md bg-destructive text-destructive-foreground disabled:opacity-50",
              "aria-label": `Cancelar ${item.titulo}`,
              children: /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5", "aria-hidden": "true" })
            }
          ) })
        ] })
      ]
    }
  );
}
function MonthView({ anchor, items, onResults }) {
  const monthStart = startOfMonth(anchor);
  const monthEnd = endOfMonth(anchor);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekdayLabels = eachDayOfInterval({
    start: calendarStart,
    end: new Date(
      calendarStart.getFullYear(),
      calendarStart.getMonth(),
      calendarStart.getDate() + 6
    )
  });
  return /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", "aria-label": "Calendário mensal", children: /* @__PURE__ */ jsxs("div", { className: "min-w-[840px]", children: [
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 bg-muted/30", children: weekdayLabels.map((day) => /* @__PURE__ */ jsx(
      "div",
      {
        className: "border-r border-border/60 px-3 py-2 text-center text-[10px] font-bold uppercase tracking-wide text-muted-foreground last:border-r-0",
        children: format(day, "EEEE", { locale: ptBR })
      },
      day.toISOString()
    )) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7", children: days.map((day) => {
      const entries = items.filter((item) => isSameDay(item.date, day));
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: cn(
            "h-32 min-w-0 overflow-hidden border-r border-t border-border/60 p-2 last:border-r-0",
            !isSameMonth(day, anchor) && "bg-muted/20 text-muted-foreground",
            isSameDay(day, /* @__PURE__ */ new Date()) && "bg-primary/5"
          ),
          children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: cn(
                  "mb-1 grid h-7 w-7 place-items-center rounded-full text-xs font-bold",
                  isSameDay(day, /* @__PURE__ */ new Date()) && "bg-primary text-primary-foreground"
                ),
                children: format(day, "d")
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              entries.slice(0, 2).map((item) => /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => hasDetails(item) && onResults(item),
                  disabled: !hasDetails(item),
                  className: cn(
                    "flex min-w-0 items-center gap-1 rounded-md border px-1.5 py-1 text-[10px]",
                    statusClass[item.status]
                  ),
                  title: `${format(item.date, "HH:mm")} — ${item.titulo}`,
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "shrink-0 font-bold tabular-nums", children: format(item.date, "HH:mm") }),
                    /* @__PURE__ */ jsx("span", { className: "truncate", children: item.titulo })
                  ]
                },
                item.ids.join("-")
              )),
              entries.length > 2 && /* @__PURE__ */ jsxs("div", { className: "truncate px-1 text-[10px] font-bold text-primary", children: [
                "+",
                entries.length - 2,
                " missões"
              ] })
            ] })
          ]
        },
        day.toISOString()
      );
    }) })
  ] }) });
}
function SchedulePage() {
  const {
    user,
    role,
    isLoading: loadingUser,
    error: userError
  } = useAuth();
  const queryClient = useQueryClient();
  const [modal, setModal] = useState(false);
  const [proof, setProof] = useState(null);
  const endpoint = role === "admin" ? "/agenda/professor" : role === "professor" ? "/agenda/professor" : role === "diretor" ? "/agenda/diretor" : "/agenda/aluno";
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ["agenda", role],
    enabled: isBrowser && !!role,
    retry: false,
    queryFn: async () => {
      const result = await apiFetch(endpoint);
      return {
        agenda: result.agenda,
        turmas: result.turmas ?? []
      };
    }
  });
  const status = useMutation({
    mutationFn: async ({
      ids,
      value
    }) => {
      const results = await Promise.all(ids.map((id) => apiFetch(`/agenda/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({
          status: value
        })
      })));
      return {
        mensagem: ids.length > 1 ? `${ids.length} turnos cancelados com sucesso` : results[0].mensagem
      };
    },
    onSuccess: async (r) => {
      toast.success(r.mensagem);
      await queryClient.invalidateQueries({
        queryKey: ["agenda"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  if (loadingUser) return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsx("div", { className: "p-16 text-center text-muted-foreground", children: "Carregando agenda..." }) });
  if (isLoading) return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsx("div", { className: "p-16 text-center text-muted-foreground", children: "Carregando agenda..." }) });
  if (userError || error || !user || !data) return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsx("div", { className: "p-16 text-center text-destructive", children: userError?.message ?? error?.message ?? "Agenda indisponível" }) });
  const professor = role === "professor" || role === "admin" || role === "diretor";
  return /* @__PURE__ */ jsxs(PageShell, { children: [
    /* @__PURE__ */ jsxs("div", { className: "app-page", children: [
      /* @__PURE__ */ jsx(motion.section, { initial: {
        opacity: 0,
        y: 10
      }, animate: {
        opacity: 1,
        y: 0
      }, className: "overflow-hidden rounded-xl bg-gradient-hero p-6 text-primary-foreground shadow-soft", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "grid h-12 w-12 place-items-center rounded-lg bg-white/15", children: /* @__PURE__ */ jsx(User, { className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold", children: professor ? "Agenda das turmas" : user.nome }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-white/70", children: professor ? "Publique missões e acompanhe os turnos que os alunos reservaram" : `Veja os horários de todos os alunos da turma${user.turma ? ` · ${user.turma}` : ""}` })
          ] })
        ] }),
        professor && role !== "diretor" && /* @__PURE__ */ jsxs("button", { onClick: () => setModal(true), className: "inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-primary", "aria-label": "Nova missão", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          "Nova missão"
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(ScheduleCalendar, { items: data.agenda, professor, updating: status.isPending, onStatus: (ids, value) => status.mutate({
        ids,
        value
      }), onSubmitProof: role === "aluno" ? (item) => setProof({
        id: Number(item.missao_id),
        titulo: item.titulo,
        pontos: Number(item.pontos ?? 0),
        equipe: Number(item.participantes ?? 1) > 1
      }) : void 0 })
    ] }),
    professor && role !== "diretor" && /* @__PURE__ */ jsx(MissionFormModal, { open: modal, onOpenChange: setModal, turmas: data.turmas, onCreated: () => void queryClient.invalidateQueries({
      queryKey: ["agenda"]
    }) }),
    /* @__PURE__ */ jsx(SubmitProofModal, { mission: proof, onOpenChange: (open) => !open && setProof(null), onSubmitted: () => {
      void queryClient.invalidateQueries({
        queryKey: ["agenda"]
      });
      void queryClient.invalidateQueries({
        queryKey: ["jardim"]
      });
      void queryClient.invalidateQueries({
        queryKey: ["historico"]
      });
    } })
  ] });
}
export {
  SchedulePage as component
};
