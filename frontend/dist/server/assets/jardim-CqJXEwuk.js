import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect, useId, useRef } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useReducedMotion, animate, motion, AnimatePresence, MotionConfig } from "motion/react";
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, CalendarDays, ChevronDown, Clock3, Check, Sprout, Building2, ArrowLeft, CheckCircle2, RefreshCw, ArrowRight, Users, Search, Minus, TrendingUp, TrendingDown, Lock, Play, Camera, Share2, Recycle, Droplets, CalendarClock, ChevronRight, Flame, Crown, Medal, Trophy, Bug } from "lucide-react";
import { toast } from "sonner";
import { k as cn, l as buttonVariants, B as Button, h as isBrowser, a as apiFetch, D as Dialog, b as DialogContent, d as DialogHeader, e as DialogTitle, f as DialogDescription, c as backendAsset, m as missionTypes, g as DialogFooter, P as PageShell, i as isImageSource, u as userQuery, R as Route } from "./router-eJvIn0Kb.js";
import { S as SubmitProofModal } from "./submit-proof-modal-B4XPWQ_C.js";
import { ptBR } from "date-fns/locale";
import { getDefaultClassNames, DayPicker } from "react-day-picker";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-Dd06VUZ-.js";
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area } from "recharts";
import "@radix-ui/react-dialog";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-tabs";
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();
  return /* @__PURE__ */ jsx(
    DayPicker,
    {
      showOutsideDays,
      className: cn(
        "bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      ),
      captionLayout,
      formatters: {
        formatMonthDropdown: (date2) => date2.toLocaleString("default", { month: "short" }),
        ...formatters
      },
      classNames: {
        root: cn("w-fit", defaultClassNames.root),
        months: cn("relative flex flex-col gap-4 md:flex-row", defaultClassNames.months),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn("bg-popover absolute inset-0 opacity-0", defaultClassNames.dropdown),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label" ? "text-sm" : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn("w-(--cell-size) select-none", defaultClassNames.week_number_header),
        week_number: cn(
          "text-muted-foreground select-none text-[0.8rem]",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
          defaultClassNames.day
        ),
        range_start: cn("bg-accent rounded-l-md", defaultClassNames.range_start),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("bg-accent rounded-r-md", defaultClassNames.range_end),
        today: cn(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames
      },
      components: {
        Root: ({ className: className2, rootRef, ...props2 }) => {
          return /* @__PURE__ */ jsx("div", { "data-slot": "calendar", ref: rootRef, className: cn(className2), ...props2 });
        },
        Chevron: ({ className: className2, orientation, ...props2 }) => {
          if (orientation === "left") {
            return /* @__PURE__ */ jsx(ChevronLeftIcon, { className: cn("size-4", className2), ...props2 });
          }
          if (orientation === "right") {
            return /* @__PURE__ */ jsx(ChevronRightIcon, { className: cn("size-4", className2), ...props2 });
          }
          return /* @__PURE__ */ jsx(ChevronDownIcon, { className: cn("size-4", className2), ...props2 });
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props2 }) => {
          return /* @__PURE__ */ jsx("td", { ...props2, children: /* @__PURE__ */ jsx("div", { className: "flex size-(--cell-size) items-center justify-center text-center", children }) });
        },
        ...components
      },
      ...props
    }
  );
}
function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);
  return /* @__PURE__ */ jsx(
    Button,
    {
      ref,
      variant: "ghost",
      size: "icon",
      "data-day": day.date.toLocaleDateString(),
      "data-selected-single": modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle,
      "data-range-start": modifiers.range_start,
      "data-range-end": modifiers.range_end,
      "data-range-middle": modifiers.range_middle,
      className: cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-(--cell-size) flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      ),
      ...props
    }
  );
}
const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverContent = React.forwardRef(({ className, align = "center", sideOffset = 4, collisionPadding = 12, ...props }, ref) => /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  PopoverPrimitive.Content,
  {
    ref,
    align,
    sideOffset,
    collisionPadding,
    className: cn(
      "z-50 w-72 max-w-[calc(100vw-1.5rem)] rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
const triggerClass = "flex min-h-11 w-full items-center justify-between gap-2 rounded-xl border border-input bg-background px-3 py-2.5 text-left text-sm transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20";
function parseDate$1(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return void 0;
  const [year, month, day] = value.split("-").map(Number);
  const date2 = new Date(year, month - 1, day);
  return Number.isNaN(date2.getTime()) ? void 0 : date2;
}
function serializeDate(date2) {
  return [
    date2.getFullYear(),
    String(date2.getMonth() + 1).padStart(2, "0"),
    String(date2.getDate()).padStart(2, "0")
  ].join("-");
}
function formatDate(date2) {
  if (!date2) return "Escolha uma data";
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date2);
}
function DatePicker({
  value,
  onChange
}) {
  const [open, setOpen] = useState(false);
  const selected = parseDate$1(value);
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  return /* @__PURE__ */ jsxs(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs("button", { type: "button", className: triggerClass, "aria-label": "Selecionar data", children: [
      /* @__PURE__ */ jsxs(
        "span",
        {
          className: cn("flex min-w-0 items-center gap-2", !selected && "text-muted-foreground"),
          children: [
            /* @__PURE__ */ jsx(CalendarDays, { className: "h-4 w-4 shrink-0 text-primary", "aria-hidden": "true" }),
            /* @__PURE__ */ jsx("span", { className: "truncate capitalize", children: formatDate(selected) })
          ]
        }
      ),
      /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground", "aria-hidden": "true" })
    ] }) }),
    /* @__PURE__ */ jsxs(PopoverContent, { align: "start", className: "w-auto rounded-xl p-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "border-b border-border/60 px-4 py-3", children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm font-bold", children: "Escolha a data" }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Selecione o dia da atividade." })
      ] }),
      /* @__PURE__ */ jsx(
        Calendar,
        {
          mode: "single",
          locale: ptBR,
          selected,
          defaultMonth: selected ?? today,
          disabled: { before: today },
          onSelect: (day) => {
            if (!day) return;
            onChange(serializeDate(day));
            setOpen(false);
          },
          style: {
            "--cell-size": "clamp(1.25rem, calc((100vw - 3rem) / 7), 2.75rem)"
          }
        }
      )
    ] })
  ] });
}
const hours = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, "0"));
const minutes = ["00", "15", "30", "45"];
function TimePicker({
  value,
  onChange
}) {
  const [open, setOpen] = useState(false);
  const [selectedHour, selectedMinute] = /^\d{2}:\d{2}$/.test(value) ? value.split(":") : ["", ""];
  const suggestedHour = String(Math.min(23, (/* @__PURE__ */ new Date()).getHours() + 1)).padStart(2, "0");
  function update(hour, minute) {
    onChange(`${hour || suggestedHour}:${minute || "00"}`);
  }
  return /* @__PURE__ */ jsxs(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs("button", { type: "button", className: triggerClass, "aria-label": "Selecionar horário", children: [
      /* @__PURE__ */ jsxs("span", { className: cn("flex min-w-0 items-center gap-2", !value && "text-muted-foreground"), children: [
        /* @__PURE__ */ jsx(Clock3, { className: "h-4 w-4 shrink-0 text-primary", "aria-hidden": "true" }),
        /* @__PURE__ */ jsx("span", { className: "truncate", children: value || "Escolha um horário" })
      ] }),
      /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground", "aria-hidden": "true" })
    ] }) }),
    /* @__PURE__ */ jsxs(PopoverContent, { align: "end", className: "w-80 rounded-xl p-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-center justify-between gap-2 border-b border-border/60 px-3 py-3 sm:px-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-bold", children: "Escolha o horário" }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Hora e minutos" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "shrink-0 rounded-lg bg-primary/10 px-2 py-1.5 font-display text-lg font-bold tabular-nums text-primary sm:px-3", children: [
          selectedHour || "--",
          ":",
          selectedMinute || "--"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[minmax(0,1fr)_7rem] gap-3 p-3", children: [
        /* @__PURE__ */ jsxs("fieldset", { children: [
          /* @__PURE__ */ jsx("legend", { className: "mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground", children: "Hora" }),
          /* @__PURE__ */ jsx("div", { className: "grid max-h-52 grid-cols-3 gap-1 overflow-y-auto pr-1", children: hours.map((hour) => /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              "aria-pressed": selectedHour === hour,
              onClick: () => update(hour, selectedMinute),
              className: cn(
                "min-h-11 rounded-lg text-sm font-semibold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selectedHour === hour ? "bg-primary text-primary-foreground" : "bg-muted/60 text-foreground hover:bg-accent"
              ),
              children: hour
            },
            hour
          )) })
        ] }),
        /* @__PURE__ */ jsxs("fieldset", { children: [
          /* @__PURE__ */ jsx("legend", { className: "mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground", children: "Minutos" }),
          /* @__PURE__ */ jsx("div", { className: "grid gap-1", children: minutes.map((minute) => /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              "aria-pressed": selectedMinute === minute,
              onClick: () => update(selectedHour, minute),
              className: cn(
                "min-h-11 rounded-lg text-sm font-semibold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selectedMinute === minute ? "bg-primary text-primary-foreground" : "bg-muted/60 text-foreground hover:bg-accent"
              ),
              children: [
                ":",
                minute
              ]
            },
            minute
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-end border-t border-border/60 p-3", children: /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          disabled: !value,
          onClick: () => setOpen(false),
          className: "inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50",
          children: [
            /* @__PURE__ */ jsx(Check, { className: "h-4 w-4", "aria-hidden": "true" }),
            " Concluir"
          ]
        }
      ) })
    ] })
  ] });
}
const primaryBtn = "min-h-10 cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
function MissionDialog({
  mission,
  onClose,
  onProof
}) {
  const queryClient = useQueryClient();
  const [participationMode, setParticipationMode] = useState("aberto");
  const [inviteStudent, setInviteStudent] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskTime, setTaskTime] = useState("");
  useEffect(() => {
    setTaskDate("");
    setTaskTime("");
    setInviteStudent("");
    setParticipationMode("aberto");
  }, [mission?.id]);
  const { data: classmates = [] } = useQuery({
    queryKey: ["mission-classmates", mission?.id, mission?.grupo_id],
    enabled: isBrowser && !!mission && mission.max_alunos > 1 && mission.modo_participacao === "particular" && !!mission.grupo_id,
    queryFn: async () => (await apiFetch(
      `/missoes/${mission.id}/alunos?grupo_id=${mission.grupo_id}`
    )).alunos
  });
  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["jardim"] });
    await queryClient.invalidateQueries({ queryKey: ["missoes"] });
    await queryClient.invalidateQueries({ queryKey: ["agenda"] });
  };
  const acceptTask = async (taskId) => {
    if (!taskDate || !taskTime) return toast.error("Escolha a data e o horário do seu turno");
    try {
      const solo = mission?.max_alunos === 1;
      const result = await apiFetch(
        `/missoes/${taskId}/aceitar`,
        {
          method: "POST",
          // Missão individual não tem escolha de quem participa.
          body: JSON.stringify({
            data_hora: `${taskDate} ${taskTime}:00`,
            ...solo ? {} : { modo_participacao: participationMode }
          })
        }
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
  const taskAction = async (path, body, successMessage) => {
    if (!mission) return;
    try {
      const result = await apiFetch(path, {
        method: "POST",
        body: JSON.stringify(body)
      });
      toast.success(successMessage ?? result.mensagem);
      onClose();
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível atualizar a missão");
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open: !!mission, onOpenChange: (open) => !open && onClose(), children: /* @__PURE__ */ jsx(DialogContent, { className: "max-h-[calc(100dvh-1.5rem)] max-w-lg overflow-y-auto rounded-2xl border-border/60 p-0", children: mission && /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "bg-gradient-garden p-6 text-white", children: /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: mission.titulo }),
      /* @__PURE__ */ jsxs(DialogDescription, { className: "text-white/80", children: [
        "Missão publicada por ",
        mission.professor
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4 p-6", children: [
      mission.imagem && /* @__PURE__ */ jsx(
        "img",
        {
          src: backendAsset(mission.imagem),
          alt: "",
          className: "max-h-48 w-full rounded-lg object-cover"
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "whitespace-pre-wrap text-sm text-muted-foreground", children: mission.descricao || "Sem instruções adicionais." }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 text-center text-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-muted p-3", children: [
          /* @__PURE__ */ jsx("strong", { children: mission.pontos }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "pontos" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-muted p-3", children: [
          /* @__PURE__ */ jsx("strong", { children: mission.max_alunos > 1 ? `${mission.participantes}/${mission.max_alunos}` : "1" }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: mission.max_alunos > 1 ? "participantes" : "aluno (individual)" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-muted p-3", children: [
          /* @__PURE__ */ jsx("strong", { children: missionTypes[mission.tipo].label }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "tipo" })
        ] })
      ] }),
      mission.horario ? /* @__PURE__ */ jsxs("p", { className: "rounded-lg border p-3 text-sm", children: [
        "Turno escolhido:",
        " ",
        /* @__PURE__ */ jsx("strong", { children: new Date(mission.horario.replace(" ", "T")).toLocaleString("pt-BR") }),
        mission.max_alunos > 1 && ` · ${mission.modo_participacao === "aberto" ? "participação aberta" : "somente por convite"}`
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("label", { className: "text-xs", children: [
            "Data",
            /* @__PURE__ */ jsx(DatePicker, { value: taskDate, onChange: setTaskDate })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "text-xs", children: [
            "Horário",
            /* @__PURE__ */ jsx(TimePicker, { value: taskTime, onChange: setTaskTime })
          ] })
        ] }),
        mission.max_alunos > 1 && /* @__PURE__ */ jsxs("fieldset", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("legend", { className: "text-xs font-bold", children: "Quem pode participar?" }),
          /* @__PURE__ */ jsxs("label", { className: "flex gap-2 text-sm", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "radio",
                checked: participationMode === "aberto",
                onChange: () => setParticipationMode("aberto")
              }
            ),
            "Qualquer colega da turma"
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex gap-2 text-sm", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "radio",
                checked: participationMode === "particular",
                onChange: () => setParticipationMode("particular")
              }
            ),
            "Somente colegas que eu convidar"
          ] })
        ] })
      ] }),
      mission.envio_status && /* @__PURE__ */ jsxs("p", { className: "rounded-lg border p-3 text-sm", children: [
        "Comprovação:",
        " ",
        /* @__PURE__ */ jsx("strong", { children: mission.envio_status === "pending" ? "em análise pelo professor" : mission.envio_status === "approved" ? "aprovada" : "rejeitada" }),
        mission.envio_comentario && ` — ${mission.envio_comentario}`
      ] }),
      /* @__PURE__ */ jsx(DialogFooter, { className: "flex-wrap gap-2", children: !mission.horario ? /* @__PURE__ */ jsx("button", { onClick: () => void acceptTask(mission.id), className: primaryBtn, children: "Reservar meu turno" }) : mission.max_alunos > 1 && mission.convite_id ? /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => void taskAction(`/convites-missao/${mission.convite_id}/responder`, {
            aceitar: true
          }),
          className: primaryBtn,
          children: "Aceitar convite"
        }
      ) : mission.participando && mission.envio_status !== "pending" && mission.envio_status !== "approved" ? /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              onProof({
                id: mission.id,
                titulo: mission.titulo,
                pontos: mission.pontos,
                equipe: mission.max_alunos > 1
              });
              onClose();
            },
            className: primaryBtn,
            children: mission.envio_status === "rejected" ? "Reenviar comprovação" : "Enviar comprovação"
          }
        ),
        mission.max_alunos > 1 && mission.modo_participacao === "particular" && /* @__PURE__ */ jsxs("div", { className: "flex w-full gap-2", children: [
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: inviteStudent,
              onChange: (e) => setInviteStudent(e.target.value),
              className: "min-h-10 flex-1 rounded-lg border bg-background px-3",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Convidar aluno..." }),
                classmates.map((a) => /* @__PURE__ */ jsx("option", { value: a.id, children: a.nome }, a.id))
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              disabled: !inviteStudent,
              onClick: () => void taskAction(`/missoes/${mission.id}/convidar`, {
                grupo_id: mission.grupo_id,
                aluno_id: Number(inviteStudent)
              }),
              className: "min-h-10 rounded-lg border px-4 text-sm font-bold disabled:opacity-50",
              children: "Convidar"
            }
          )
        ] })
      ] }) : mission.max_alunos > 1 && mission.modo_participacao === "aberto" && !mission.participando && mission.status === "agendada" ? /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => void taskAction(`/missoes/${mission.id}/entrar`, {
            grupo_id: mission.grupo_id
          }),
          className: primaryBtn,
          children: "Participar deste turno"
        }
      ) : /* @__PURE__ */ jsx("button", { onClick: onClose, className: "min-h-10 rounded-lg border px-4 text-sm", children: "Fechar" }) })
    ] })
  ] }) }) });
}
const card = "rounded-lg border border-border/60 bg-card p-5 shadow-soft";
const button = "inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
const statuses = {
  pending: { label: "Em análise", style: "bg-warning/15 text-foreground" },
  approved: { label: "Aprovado", style: "bg-success/15 text-success" },
  rejected: { label: "Rejeitado", style: "bg-destructive/10 text-destructive" }
};
const types = {
  plant: "Plantio",
  water: "Rega",
  compost: "Compostagem",
  share: "Compartilhamento",
  outro: "Outros"
};
function date(value) {
  if (!value) return "Data não informada";
  const parsed = new Date(value.replace(" ", "T"));
  return Number.isNaN(parsed.getTime()) ? "Data não informada" : parsed.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}
function StaffGarden({
  user,
  schoolId,
  classId,
  onNavigate
}) {
  const admin = user.perfil_nome === "admin";
  const title = admin ? "Jardins das escolas" : user.perfil_nome === "professor" ? "Jardins das minhas turmas" : "Jardins da escola";
  const description = admin ? "Selecione uma escola e acompanhe as hortas de cada turma." : user.perfil_nome === "professor" ? "Acompanhe os envios e as atualizações das turmas sob sua responsabilidade." : "Acompanhe os envios e as atualizações de todas as turmas da sua escola.";
  return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsxs("div", { className: "app-page space-y-6", children: [
    /* @__PURE__ */ jsxs("section", { className: "rounded-xl bg-gradient-hero p-6 text-primary-foreground shadow-soft sm:p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white/70", children: [
        /* @__PURE__ */ jsx(Sprout, { className: "h-4 w-4" }),
        " Acompanhamento das hortas"
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "mt-2 text-2xl font-bold sm:text-3xl", children: title }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-2xl text-sm text-white/80", children: description }),
      !admin && user.instituicao_nome && /* @__PURE__ */ jsxs("p", { className: "mt-4 flex items-center gap-2 text-sm font-semibold", children: [
        /* @__PURE__ */ jsx(Building2, { className: "h-4 w-4" }),
        user.instituicao_nome
      ] })
    ] }),
    classId ? /* @__PURE__ */ jsx(ClassGarden, { user, classId, onNavigate }, classId) : admin && !schoolId ? /* @__PURE__ */ jsx(Schools, { user, onNavigate }) : /* @__PURE__ */ jsx(
      Classes,
      {
        user,
        schoolId,
        onNavigate
      },
      schoolId ?? "mine"
    )
  ] }) });
}
function Schools({ user, onNavigate }) {
  const [search, setSearch] = useState("");
  const query = useQuery({
    queryKey: ["jardim-gestao", user.id, "escolas"],
    queryFn: () => apiFetch("/jardim/escolas"),
    retry: false
  });
  if (query.isPending) return /* @__PURE__ */ jsx(Loading, {});
  if (query.isError) return /* @__PURE__ */ jsx(Failure, { error: query.error, retry: () => void query.refetch() });
  const schools = query.data.escolas.filter(
    (school) => school.nome.toLocaleLowerCase("pt-BR").includes(search.trim().toLocaleLowerCase("pt-BR"))
  );
  return /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx(
      SectionHeading,
      {
        title: "Escolas",
        description: "Escolha uma escola para visualizar suas turmas.",
        refresh: () => void query.refetch(),
        fetching: query.isFetching
      }
    ),
    /* @__PURE__ */ jsx(SearchField, { value: search, onChange: setSearch, label: "Buscar escola" }),
    !schools.length ? /* @__PURE__ */ jsx(Empty, { children: query.data.escolas.length ? "Nenhuma escola encontrada para essa busca." : "Nenhuma escola cadastrada." }) : /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: schools.map((school) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => onNavigate({ escola: Number(school.id) }),
        className: `${card} group space-y-4 text-left transition-colors hover:border-primary/50 hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`,
        children: [
          /* @__PURE__ */ jsx(Building2, { className: "h-8 w-8 text-primary" }),
          /* @__PURE__ */ jsx("h3", { className: "break-words text-lg font-bold", children: school.nome }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 text-sm", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
              Number(school.total_turmas),
              " turmas"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 font-semibold text-primary", children: [
              "Ver turmas ",
              /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
            ] })
          ] })
        ]
      },
      school.id
    )) })
  ] });
}
function Classes({
  user,
  schoolId,
  onNavigate
}) {
  const [search, setSearch] = useState("");
  const admin = user.perfil_nome === "admin";
  const query = useQuery({
    queryKey: [
      "jardim-gestao",
      user.id,
      user.perfil_nome,
      user.instituicao_id,
      "turmas",
      admin ? schoolId : null
    ],
    queryFn: () => apiFetch(
      `/jardim/turmas${admin ? `?instituicao_id=${schoolId}` : ""}`
    ),
    retry: false
  });
  const back = admin && /* @__PURE__ */ jsxs("button", { className: button, onClick: () => onNavigate({}), children: [
    /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
    "Todas as escolas"
  ] });
  if (query.isPending)
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      back,
      /* @__PURE__ */ jsx(Loading, {})
    ] });
  if (query.isError)
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      back,
      /* @__PURE__ */ jsx(Failure, { error: query.error, retry: () => void query.refetch() })
    ] });
  const classes = query.data.turmas.filter(
    (item) => `${item.nome} ${item.ano_letivo}`.toLocaleLowerCase("pt-BR").includes(search.trim().toLocaleLowerCase("pt-BR"))
  );
  return /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
    back,
    /* @__PURE__ */ jsx(
      SectionHeading,
      {
        title: admin ? query.data.escola?.nome ?? "Turmas da escola" : user.perfil_nome === "professor" ? "Minhas turmas" : "Turmas da escola",
        description: "Selecione uma turma para abrir os envios e as atualizações da horta.",
        refresh: () => void query.refetch(),
        fetching: query.isFetching
      }
    ),
    /* @__PURE__ */ jsx(SearchField, { value: search, onChange: setSearch, label: "Buscar turma ou ano letivo" }),
    !classes.length ? /* @__PURE__ */ jsx(Empty, { children: query.data.turmas.length ? "Nenhuma turma encontrada para essa busca." : user.perfil_nome === "professor" ? "Você ainda não tem turmas vinculadas. As turmas aparecerão aqui quando a direção fizer a vinculação." : "Nenhuma turma cadastrada nesta escola." }) : /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: classes.map((item) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => onNavigate({
          escola: admin ? Number(item.instituicao_id) : void 0,
          turma: Number(item.id)
        }),
        className: `${card} space-y-4 text-left transition-colors hover:border-primary/50 hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsx(Sprout, { className: "h-8 w-8 text-primary" }),
            /* @__PURE__ */ jsx("span", { className: "rounded-full bg-muted px-3 py-1 text-xs font-bold", children: item.ano_letivo })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "break-words text-xl font-bold", children: item.nome }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 break-words text-xs text-muted-foreground", children: item.escola })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" }),
              Number(item.total_alunos),
              " alunos"
            ] }),
            /* @__PURE__ */ jsxs("span", { children: [
              Number(item.total_envios),
              " envios"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold", children: [
              Number(item.pendentes),
              " em análise"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-sm font-bold text-primary", children: [
              "Abrir horta ",
              /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
            ] })
          ] })
        ]
      },
      item.id
    )) })
  ] });
}
function ClassGarden({
  user,
  classId,
  onNavigate
}) {
  const [tab, setTab] = useState("envios");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);
  const query = useQuery({
    queryKey: [
      "jardim-gestao",
      user.id,
      user.perfil_nome,
      user.instituicao_id,
      "turma",
      classId,
      tab,
      status,
      type,
      page
    ],
    queryFn: () => apiFetch(
      `/jardim/turmas/${classId}?${new URLSearchParams({ aba: tab, status, tipo: type, pagina: String(page) })}`
    ),
    placeholderData: (previous) => previous,
    retry: false
  });
  const goBack = () => onNavigate({
    escola: user.perfil_nome === "admin" ? Number(query.data?.turma.instituicao_id) || void 0 : void 0
  });
  const toggleMission = async (task) => {
    try {
      const result = await apiFetch(`/missoes/${task.id}`, { method: "PUT", body: JSON.stringify({ ativa: task.ativa ? 0 : 1 }) });
      toast.success(result.mensagem);
      await query.refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao atualizar missão");
    }
  };
  const back = /* @__PURE__ */ jsxs("button", { className: button, onClick: goBack, children: [
    /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
    query.data || user.perfil_nome !== "admin" ? "Voltar às turmas" : "Voltar às escolas"
  ] });
  return /* @__PURE__ */ jsxs("section", { className: "space-y-5", children: [
    back,
    query.data && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        SectionHeading,
        {
          title: `Horta da turma ${query.data.turma.nome}`,
          description: `${query.data.turma.escola} · Ano letivo ${query.data.turma.ano_letivo}`,
          refresh: () => void query.refetch(),
          fetching: query.isFetching
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3 lg:grid-cols-4", children: [
        { label: "Envios", value: query.data.resumo.total_envios, icon: Sprout },
        { label: "Em análise", value: query.data.resumo.pendentes, icon: Clock3 },
        { label: "Aprovados", value: query.data.resumo.aprovados, icon: CheckCircle2 },
        { label: "Rejeitados", value: query.data.resumo.rejeitados, icon: RefreshCw }
      ].map(({ label, value, icon: Icon }) => /* @__PURE__ */ jsxs("div", { className: card, children: [
        /* @__PURE__ */ jsx(Icon, { className: "mb-2 h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", children: Number(value).toLocaleString("pt-BR") }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: label })
      ] }, label)) })
    ] }),
    /* @__PURE__ */ jsxs(
      Tabs,
      {
        value: tab,
        onValueChange: (value) => {
          setTab(value);
          setPage(1);
        },
        className: "space-y-4",
        children: [
          /* @__PURE__ */ jsxs(TabsList, { className: "grid h-auto w-full grid-cols-3 sm:w-[34rem]", children: [
            /* @__PURE__ */ jsx(TabsTrigger, { value: "envios", className: "py-3", children: "Envios dos alunos" }),
            /* @__PURE__ */ jsx(TabsTrigger, { value: "alteracoes", className: "py-3", children: "Atualizações" }),
            /* @__PURE__ */ jsx(TabsTrigger, { value: "missoes", className: "py-3", children: "Missões" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3", children: tab !== "missoes" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              Filter,
              {
                label: "Status",
                value: status,
                onChange: (value) => {
                  setStatus(value);
                  setPage(1);
                },
                options: Object.entries(statuses).map(([value, item]) => ({
                  value,
                  label: item.label
                }))
              }
            ),
            /* @__PURE__ */ jsx(
              Filter,
              {
                label: "Atividade",
                value: type,
                onChange: (value) => {
                  setType(value);
                  setPage(1);
                },
                options: Object.entries(types).map(([value, label]) => ({ value, label }))
              }
            )
          ] }) }),
          tab === "missoes" && query.data && /* @__PURE__ */ jsx("div", { className: "space-y-3", children: query.data.missoes.length ? query.data.missoes.map((mission) => {
            const solo = Number(mission.max_alunos) === 1;
            const badge = {
              disponivel: ["Disponível", "bg-success/15 text-success"],
              agendada: ["Agendada", "bg-primary/15 text-primary"],
              em_analise: ["Em análise", "bg-warning/15 text-foreground"],
              concluida: ["Concluída", "bg-muted text-muted-foreground"]
            }[mission.status];
            const facts = [
              ["Pontuação", `${mission.pontos} pts`],
              ["Tipo", types[mission.tipo] ?? mission.tipo],
              [solo ? "Modalidade" : "Participantes", solo ? "Individual" : `${mission.participantes}/${mission.max_alunos}`]
            ];
            if (!solo) facts.push(["Participação", mission.modo_participacao === "escolher" ? "Aguardando aceite" : mission.modo_participacao === "aberto" ? "Aberta" : "Por convite"]);
            return /* @__PURE__ */ jsxs("article", { className: `${card} space-y-4`, children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 gap-3", children: [
                  mission.imagem && /* @__PURE__ */ jsx("img", { src: backendAsset(mission.imagem), alt: "", loading: "lazy", className: "h-16 w-16 shrink-0 rounded-lg object-cover" }),
                  /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                      /* @__PURE__ */ jsx("h3", { className: "text-base font-bold", children: mission.titulo }),
                      /* @__PURE__ */ jsx("span", { className: `rounded-full px-2.5 py-1 text-[10px] font-bold ${badge[1]}`, children: badge[0] }),
                      /* @__PURE__ */ jsx("span", { className: "rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold text-muted-foreground", children: mission.ativa ? "Publicada" : "Encerrada" })
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
                      "Criada por ",
                      mission.criador
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("button", { className: button, onClick: () => void toggleMission(mission), children: mission.ativa ? "Encerrar missão" : "Reabrir missão" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4", children: facts.map(([label, value]) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-muted/60 px-3 py-2", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-semibold uppercase text-muted-foreground", children: label }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm font-bold", children: value })
              ] }, label)) }),
              mission.inscritos.length ? /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground", children: "Turnos e alunos" }),
                /* @__PURE__ */ jsx("ul", { className: "divide-y rounded-lg border", children: mission.inscritos.map((a) => /* @__PURE__ */ jsxs("li", { className: "flex flex-wrap justify-between gap-2 px-3 py-2 text-sm", children: [
                  /* @__PURE__ */ jsxs("span", { children: [
                    a.aluno,
                    " ",
                    /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
                      "· ",
                      a.status
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: date(a.data_hora) })
                ] }, a.id)) })
              ] }) : /* @__PURE__ */ jsx(Empty, { children: "Nenhum aluno pegou esta missão ainda." })
            ] }, mission.id);
          }) : /* @__PURE__ */ jsx(Empty, { children: "Nenhuma missão publicada para esta turma." }) }),
          "        ",
          ["envios", "alteracoes"].map((value) => /* @__PURE__ */ jsxs(TabsContent, { value, className: "space-y-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: value === "envios" ? "Atividades enviadas pelos alunos da turma, da mais recente à mais antiga." : "Avaliações e mudanças de status dos envios, da mais recente à mais antiga." }),
            query.isPending || query.isPlaceholderData ? /* @__PURE__ */ jsx(Loading, {}) : query.isError ? /* @__PURE__ */ jsx(Failure, { error: query.error, retry: () => void query.refetch() }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              !query.data.registros.length ? /* @__PURE__ */ jsx(Empty, { children: status !== "all" || type !== "all" ? "Nenhum registro corresponde aos filtros selecionados." : value === "envios" ? "Os alunos desta turma ainda não enviaram atividades." : "Nenhuma avaliação registrada para esta turma." }) : /* @__PURE__ */ jsx("ul", { className: "space-y-4", children: query.data.registros.map((activity) => /* @__PURE__ */ jsx(
                ActivityCard,
                {
                  activity,
                  updates: value === "alteracoes"
                },
                activity.id
              )) }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
                /* @__PURE__ */ jsxs("p", { "aria-live": "polite", className: "text-sm text-muted-foreground", children: [
                  query.data.paginacao.total,
                  " registros"
                ] }),
                query.data.paginacao.paginas > 1 && /* @__PURE__ */ jsxs("nav", { "aria-label": "Páginas de atividades", className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      className: button,
                      disabled: query.data.paginacao.pagina <= 1,
                      onClick: () => setPage(query.data.paginacao.pagina - 1),
                      children: "Anterior"
                    }
                  ),
                  /* @__PURE__ */ jsxs("span", { className: "text-sm", children: [
                    query.data.paginacao.pagina,
                    " / ",
                    query.data.paginacao.paginas
                  ] }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      className: button,
                      disabled: query.data.paginacao.pagina >= query.data.paginacao.paginas,
                      onClick: () => setPage(query.data.paginacao.pagina + 1),
                      children: "Próxima"
                    }
                  )
                ] })
              ] })
            ] })
          ] }, value))
        ]
      }
    )
  ] });
}
function ActivityCard({ activity, updates }) {
  const badge = statuses[activity.status];
  return /* @__PURE__ */ jsxs("li", { className: `${card} flex flex-col gap-4 sm:flex-row`, children: [
    activity.url_foto && /* @__PURE__ */ jsx(
      "a",
      {
        href: backendAsset(activity.url_foto),
        target: "_blank",
        rel: "noreferrer",
        className: "shrink-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        children: /* @__PURE__ */ jsx(
          "img",
          {
            src: backendAsset(activity.url_foto),
            alt: `Foto de ${activity.atividade}, enviada por ${activity.aluno}`,
            loading: "lazy",
            className: "h-44 w-full rounded-xl object-cover sm:h-32 sm:w-32"
          }
        )
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 space-y-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "break-words font-bold", children: activity.atividade }),
        /* @__PURE__ */ jsx("span", { className: `rounded-full px-3 py-1 text-xs font-bold ${badge.style}`, children: badge.label })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "break-words text-sm font-semibold", children: [
        activity.aluno,
        " ",
        /* @__PURE__ */ jsxs("span", { className: "font-normal text-muted-foreground", children: [
          "· ",
          types[activity.tipo] ?? activity.tipo
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: updates ? `Avaliado em ${date(activity.revisado_em)}` : `Enviado em ${date(activity.data_envio)}` }),
      /* @__PURE__ */ jsx("p", { className: "whitespace-pre-wrap break-words text-sm", children: activity.descricao }),
      activity.revisado_em && /* @__PURE__ */ jsxs("div", { className: "space-y-1 rounded-xl bg-muted/50 p-3 text-sm", children: [
        /* @__PURE__ */ jsxs("p", { className: "font-semibold", children: [
          activity.status === "approved" ? "Atividade aprovada" : activity.status === "rejected" ? "Atividade rejeitada" : "Atividade avaliada",
          activity.revisor ? ` por ${activity.revisor}` : ""
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: updates ? `Envio original: ${date(activity.data_envio)}` : date(activity.revisado_em) }),
        activity.comentario_professor && /* @__PURE__ */ jsx("p", { className: "whitespace-pre-wrap break-words", children: activity.comentario_professor })
      ] })
    ] })
  ] });
}
function Filter({
  label,
  value,
  onChange,
  options
}) {
  const id = useId();
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold", children: [
    /* @__PURE__ */ jsx("label", { htmlFor: id, children: label }),
    /* @__PURE__ */ jsxs(
      "select",
      {
        id,
        value,
        onChange: (event) => onChange(event.target.value),
        className: "min-w-0 rounded-xl border border-border bg-card px-3 py-2 font-normal",
        children: [
          /* @__PURE__ */ jsx("option", { value: "all", children: "Todos" }),
          options.map((option) => /* @__PURE__ */ jsx("option", { value: option.value, children: option.label }, option.value))
        ]
      }
    )
  ] });
}
function SearchField({
  label,
  value,
  onChange
}) {
  return /* @__PURE__ */ jsxs("label", { className: "flex max-w-lg items-center gap-2 rounded-xl border border-border bg-card px-3 py-2", children: [
    /* @__PURE__ */ jsx(Search, { "aria-hidden": "true", className: "h-4 w-4 shrink-0 text-muted-foreground" }),
    /* @__PURE__ */ jsx("span", { className: "sr-only", children: label }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "search",
        value,
        onChange: (event) => onChange(event.target.value),
        placeholder: label,
        className: "min-w-0 flex-1 bg-transparent text-sm outline-none"
      }
    )
  ] });
}
function SectionHeading({
  title,
  description,
  refresh,
  fetching
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsx("h2", { className: "break-words text-xl font-bold", children: title }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: description })
    ] }),
    /* @__PURE__ */ jsxs("button", { className: button, onClick: refresh, disabled: fetching, children: [
      /* @__PURE__ */ jsx(RefreshCw, { className: `h-4 w-4 ${fetching ? "animate-spin" : ""}` }),
      "Atualizar"
    ] })
  ] });
}
function Loading() {
  return /* @__PURE__ */ jsx("p", { role: "status", className: "p-12 text-center text-muted-foreground", children: "Carregando dados da horta..." });
}
function Empty({ children }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-dashed border-border p-8 text-center", children: [
    /* @__PURE__ */ jsx(Sprout, { className: "mx-auto mb-3 h-8 w-8 text-primary" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children })
  ] });
}
function Failure({ error, retry }) {
  return /* @__PURE__ */ jsxs("div", { className: `${card} space-y-4 text-center`, children: [
    /* @__PURE__ */ jsx("p", { role: "alert", className: "text-destructive", children: error.message }),
    /* @__PURE__ */ jsx("button", { className: button, onClick: retry, children: "Tentar novamente" })
  ] });
}
const EASE = [0.22, 1, 0.36, 1];
function GardenCard({
  children,
  className,
  delay = 0,
  as = "section",
  ...rest
}) {
  const Comp = as === "div" ? motion.div : motion.section;
  return /* @__PURE__ */ jsx(
    Comp,
    {
      initial: { opacity: 0, y: 16 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-40px" },
      transition: { duration: 0.45, ease: EASE, delay },
      className: cn(
        "rounded-2xl border border-border/60 bg-card p-5 shadow-soft sm:p-6",
        className
      ),
      ...rest,
      children
    }
  );
}
function SectionTitle({
  children,
  aside,
  id
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
    /* @__PURE__ */ jsx("h2", { id, className: "text-sm font-bold uppercase tracking-wide text-foreground", children }),
    aside
  ] });
}
const TONES = {
  success: "bg-mint/70 text-moss dark:bg-success/20 dark:text-success",
  warning: "bg-warning/20 text-foreground",
  info: "bg-info/15 text-info",
  danger: "bg-destructive/10 text-destructive",
  muted: "bg-muted text-muted-foreground",
  brand: "bg-forest text-white"
};
function StatusPill({
  tone = "muted",
  children,
  className
}) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        TONES[tone],
        className
      ),
      children
    }
  );
}
function ProgressBar({
  value,
  className,
  barClassName,
  label
}) {
  const pct = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "progressbar",
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-valuenow": Math.round(pct),
      "aria-label": label,
      className: cn("h-1.5 overflow-hidden rounded-full bg-muted", className),
      children: /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { width: 0 },
          whileInView: { width: `${pct}%` },
          viewport: { once: true },
          transition: { duration: 0.9, ease: EASE },
          className: cn("h-full rounded-full bg-forest", barClassName)
        }
      )
    }
  );
}
function CountUp({ value, className }) {
  const reduce = useReducedMotion();
  const previous = useRef(0);
  const [shown, setShown] = useState(reduce ? value : 0);
  useEffect(() => {
    if (reduce) {
      previous.current = value;
      setShown(value);
      return;
    }
    const controls = animate(previous.current, value, {
      duration: 1,
      ease: EASE,
      onUpdate: (v) => setShown(Math.round(v))
    });
    previous.current = value;
    return () => controls.stop();
  }, [value, reduce]);
  return /* @__PURE__ */ jsx("span", { className, children: shown.toLocaleString("pt-BR") });
}
function InlineMessage({
  children,
  action,
  tone = "muted"
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: tone === "danger" ? "alert" : void 0,
      className: cn(
        "flex flex-col items-center gap-3 rounded-xl border border-dashed px-4 py-8 text-center text-sm",
        tone === "danger" ? "border-destructive/30 bg-destructive/5 text-destructive" : "border-border bg-background/60 text-muted-foreground"
      ),
      children: [
        /* @__PURE__ */ jsx("p", { children }),
        action
      ]
    }
  );
}
const primaryButton = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--primary-hover)] hover:shadow-elevated active:translate-y-0 active:bg-[var(--primary-active)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
const softButton = "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-forest/25 bg-mint/40 px-3 py-1.5 text-xs font-bold text-forest transition-all duration-200 hover:-translate-y-0.5 hover:bg-mint/70 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-primary";
function GardenHero({
  firstName,
  points,
  growth,
  evolution
}) {
  const thisMonth = growth[growth.length - 1]?.value ?? 0;
  const Trend = evolution === null ? Minus : evolution > 0 ? TrendingUp : evolution < 0 ? TrendingDown : Minus;
  return /* @__PURE__ */ jsxs(
    motion.section,
    {
      initial: { opacity: 0, y: 14 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, ease: EASE },
      "aria-labelledby": "garden-welcome",
      className: "relative overflow-hidden rounded-3xl bg-gradient-garden p-5 text-white shadow-elevated sm:p-8",
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            "aria-hidden": "true",
            className: "pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-lime/15 blur-3xl"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.4fr] lg:gap-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[11px] font-bold uppercase tracking-[0.12em] text-mint/80", children: "Meu painel do jardim" }),
            /* @__PURE__ */ jsxs("h1", { id: "garden-welcome", className: "mt-1 break-words text-2xl font-extrabold sm:text-4xl", children: [
              "Bem-vindo(a) de volta, ",
              firstName,
              "!"
            ] }),
            /* @__PURE__ */ jsxs(
              motion.div,
              {
                whileHover: { y: -2 },
                transition: { duration: 0.2 },
                className: "mt-5 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm sm:mt-6 sm:p-5",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "text-[11px] font-bold uppercase tracking-[0.12em] text-mint/80", children: "Pontos totais" }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-1 flex flex-wrap items-end justify-between gap-x-4 gap-y-1", children: [
                    /* @__PURE__ */ jsx(
                      CountUp,
                      {
                        value: points,
                        className: "text-4xl font-extrabold tracking-tight tabular-nums sm:text-5xl"
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      "div",
                      {
                        className: "flex items-center gap-1.5 text-sm font-bold text-lime",
                        title: "Pontos aprovados neste mês em relação ao mês anterior",
                        children: [
                          /* @__PURE__ */ jsx(Trend, { className: "h-4 w-4", "aria-hidden": "true" }),
                          evolution === null ? /* @__PURE__ */ jsxs("span", { children: [
                            thisMonth.toLocaleString("pt-BR"),
                            " pts neste mês"
                          ] }) : /* @__PURE__ */ jsxs("span", { children: [
                            evolution > 0 ? "+" : "",
                            evolution,
                            "%",
                            /* @__PURE__ */ jsx("span", { className: "sr-only", children: " em relação ao mês anterior" })
                          ] })
                        ]
                      }
                    )
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-xs font-semibold text-white/80", children: [
              "Crescimento nos últimos 5 meses",
              /* @__PURE__ */ jsx("span", { className: "ml-1.5 font-normal text-white/55", children: "· pontos aprovados por mês" })
            ] }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "mt-2 h-44 sm:h-52",
                role: "img",
                "aria-label": "Gráfico de pontos aprovados nos últimos 5 meses",
                children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(AreaChart, { data: growth, margin: { top: 10, right: 12, bottom: 0, left: -18 }, children: [
                  /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "gardenGrowth", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                    /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#8bc34a", stopOpacity: 0.55 }),
                    /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#8bc34a", stopOpacity: 0.04 })
                  ] }) }),
                  /* @__PURE__ */ jsx(
                    XAxis,
                    {
                      dataKey: "month",
                      stroke: "rgba(255,255,255,.65)",
                      fontSize: 11,
                      axisLine: false,
                      tickLine: false
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    YAxis,
                    {
                      stroke: "rgba(255,255,255,.5)",
                      fontSize: 10,
                      axisLine: false,
                      tickLine: false,
                      allowDecimals: false
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Tooltip,
                    {
                      cursor: { stroke: "rgba(255,255,255,.35)" },
                      formatter: (v) => [`${Number(v).toLocaleString("pt-BR")} pts`, "Aprovados"],
                      contentStyle: {
                        background: "rgba(14,40,26,.92)",
                        border: "none",
                        borderRadius: 12,
                        color: "white",
                        fontSize: 12
                      },
                      labelStyle: { color: "#c5e9ae" }
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Area,
                    {
                      type: "monotone",
                      dataKey: "value",
                      stroke: "#8bc34a",
                      strokeWidth: 2.5,
                      fill: "url(#gardenGrowth)",
                      dot: { r: 3.5, fill: "#fff", stroke: "#8bc34a", strokeWidth: 2 },
                      activeDot: { r: 5.5, fill: "#fff", stroke: "#8bc34a", strokeWidth: 2 },
                      isAnimationActive: true,
                      animationDuration: 900
                    }
                  )
                ] }) })
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function stateOf(m) {
  if (m.progresso >= 100) return "done";
  if (m.progresso > 0) return "progress";
  if (m.licoes?.length && m.licoes.every((l) => l.status === "locked")) return "locked";
  return "available";
}
const LABEL = {
  done: "Completo",
  progress: "Continuar",
  locked: "Bloqueado",
  available: "Disponível"
};
const TONE = { done: "success", progress: "brand", locked: "muted", available: "warning" };
function LearningPath({ modules }) {
  const visible = modules.slice(0, 6);
  return /* @__PURE__ */ jsxs(GardenCard, { "aria-labelledby": "learning-title", children: [
    /* @__PURE__ */ jsx(
      SectionTitle,
      {
        id: "learning-title",
        aside: modules.length > visible.length ? /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/aprender",
            className: "inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline",
            children: [
              "Ver todos ",
              /* @__PURE__ */ jsx(ArrowRight, { className: "h-3.5 w-3.5", "aria-hidden": "true" })
            ]
          }
        ) : void 0,
        children: "Meu caminho de aprendizado"
      }
    ),
    !visible.length ? /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(InlineMessage, { children: "Nenhum módulo disponível para você ainda." }) }) : /* @__PURE__ */ jsx("ul", { className: "mt-4 space-y-3", children: visible.map((m, i) => {
      const state = stateOf(m);
      const lessons = m.licoes ?? [];
      const completed = lessons.filter((l) => l.status === "completed").length;
      const Icon = state === "done" ? Check : state === "locked" ? Lock : state === "progress" ? Play : Sprout;
      const body = /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          motion.div,
          {
            whileHover: state === "locked" ? void 0 : { scale: 1.06 },
            className: cn(
              "grid h-12 w-12 shrink-0 place-items-center rounded-full shadow-soft",
              state === "done" && "bg-success text-white",
              state === "progress" && "bg-forest text-white",
              state === "available" && "bg-lime text-moss",
              state === "locked" && "bg-muted text-muted-foreground"
            ),
            children: /* @__PURE__ */ jsx(
              Icon,
              {
                className: "h-5 w-5",
                strokeWidth: state === "done" ? 3 : 2,
                "aria-hidden": "true"
              }
            )
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 rounded-xl border border-border/60 bg-background/70 px-4 py-3 transition-colors group-hover:border-forest/30", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-x-2 gap-y-1", children: [
            /* @__PURE__ */ jsx("div", { className: "min-w-0 break-words text-sm font-bold uppercase tracking-wide text-foreground", children: m.titulo }),
            /* @__PURE__ */ jsx(StatusPill, { tone: TONE[state], children: LABEL[state] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              ProgressBar,
              {
                value: m.progresso,
                label: `Progresso em ${m.titulo}`,
                className: "flex-1",
                barClassName: state === "done" ? "bg-success" : "bg-forest"
              }
            ),
            /* @__PURE__ */ jsxs("span", { className: "w-9 text-right text-[10px] font-bold text-muted-foreground", children: [
              m.progresso,
              "%"
            ] })
          ] }),
          lessons.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-1.5 text-[11px] text-muted-foreground", children: [
            completed,
            "/",
            lessons.length,
            " lições concluídas"
          ] })
        ] })
      ] });
      return /* @__PURE__ */ jsx(
        motion.li,
        {
          initial: { opacity: 0, x: -10 },
          whileInView: { opacity: 1, x: 0 },
          viewport: { once: true },
          transition: { duration: 0.4, ease: EASE, delay: i * 0.05 },
          children: state === "locked" ? /* @__PURE__ */ jsx("div", { className: "group flex items-center gap-3 opacity-80", children: body }) : /* @__PURE__ */ jsx(
            Link,
            {
              to: "/aprender",
              className: "group flex items-center gap-3 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              children: body
            }
          )
        },
        m.id
      );
    }) })
  ] });
}
const MISSION_CATEGORY = {
  plant: "Plantio",
  water: "Rega",
  compost: "Compostagem",
  share: "Compartilhar",
  outro: "Outra"
};
function categoryLabel(tipo) {
  return tipo && MISSION_CATEGORY[tipo] || "Outra";
}
const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
function monthLabel(key) {
  const month = Number(key.slice(5, 7));
  return MONTHS[month - 1] ?? key.slice(5);
}
function growthWindow(rows, now = /* @__PURE__ */ new Date()) {
  const byMonth = new Map(rows.map((r) => [r.mes, Number(r.valor)]));
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (4 - i), 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return { key, month: monthLabel(key), value: byMonth.get(key) ?? 0 };
  });
}
function monthEvolution(window2) {
  const current = window2[window2.length - 1]?.value ?? 0;
  const previous = window2[window2.length - 2]?.value ?? 0;
  if (previous <= 0) return null;
  return Math.round((current - previous) / previous * 100);
}
function parseDate(value) {
  if (!value) return null;
  const date2 = new Date(value.replace(" ", "T"));
  return Number.isNaN(date2.getTime()) ? null : date2;
}
function shortDate(value) {
  const date2 = parseDate(value);
  return date2 ? date2.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) : null;
}
function dateTime(value) {
  const date2 = parseDate(value);
  return date2 ? date2.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }).replace(",", "") : null;
}
function plural(n, one, many) {
  return `${n} ${n === 1 ? one : many}`;
}
const STATUS$1 = {
  pending: { label: "Em análise", tone: "warning" },
  approved: { label: "Aprovado", tone: "success" },
  rejected: { label: "Rejeitado", tone: "danger" }
};
function Thumb({ src, alt }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed || !isImageSource(src))
    return /* @__PURE__ */ jsx("div", { className: "grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-mint/50 text-forest dark:text-primary", children: /* @__PURE__ */ jsx(Sprout, { className: "h-7 w-7", "aria-hidden": "true" }) });
  return /* @__PURE__ */ jsx(
    "img",
    {
      src: backendAsset(src),
      alt,
      loading: "lazy",
      onError: () => setFailed(true),
      className: "h-20 w-20 shrink-0 rounded-xl object-cover"
    }
  );
}
function RecentMissions({
  items,
  loading,
  error,
  onRetry,
  onSubmit,
  justSubmitted
}) {
  const latest = (items ?? []).slice(0, 3);
  return /* @__PURE__ */ jsxs(GardenCard, { "aria-labelledby": "recent-title", className: "flex flex-col", delay: 0.05, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx(
          "h2",
          {
            id: "recent-title",
            className: "text-sm font-bold uppercase tracking-wide text-foreground",
            children: "Últimas missões"
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Acompanhe os seus envios mais recentes." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-mint/60 text-forest dark:text-primary", children: /* @__PURE__ */ jsx(Sprout, { className: "h-5 w-5", "aria-hidden": "true" }) })
    ] }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: justSubmitted && /* @__PURE__ */ jsx(
      motion.div,
      {
        role: "status",
        initial: { opacity: 0, height: 0, marginTop: 0 },
        animate: { opacity: 1, height: "auto", marginTop: 16 },
        exit: { opacity: 0, height: 0, marginTop: 0 },
        transition: { duration: 0.35, ease: EASE },
        className: "overflow-hidden",
        children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-xl bg-mint/60 px-3 py-2.5 text-sm font-semibold text-moss dark:bg-success/15 dark:text-success", children: [
          /* @__PURE__ */ jsx(
            motion.span,
            {
              initial: { scale: 0, rotate: -40 },
              animate: { scale: 1, rotate: 0 },
              transition: { type: "spring", stiffness: 420, damping: 16, delay: 0.1 },
              children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-5 w-5", "aria-hidden": "true" })
            }
          ),
          "Envio recebido! Ele aparece aqui até o professor revisar."
        ] })
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 flex-1 space-y-3", children: loading ? /* @__PURE__ */ jsx("div", { role: "status", className: "space-y-3", "aria-label": "Carregando missões", children: [0, 1].map((i) => /* @__PURE__ */ jsx("div", { className: "h-[104px] animate-pulse rounded-xl bg-muted/70" }, i)) }) : error ? /* @__PURE__ */ jsx(
      InlineMessage,
      {
        tone: "danger",
        action: /* @__PURE__ */ jsx("button", { onClick: onRetry, className: softButton, children: "Tentar novamente" }),
        children: error
      }
    ) : !latest.length ? /* @__PURE__ */ jsx(
      InlineMessage,
      {
        action: /* @__PURE__ */ jsxs("button", { onClick: onSubmit, className: softButton, children: [
          /* @__PURE__ */ jsx(Camera, { className: "h-4 w-4", "aria-hidden": "true" }),
          " Enviar minha primeira atividade"
        ] }),
        children: "Você ainda não enviou nenhuma missão."
      }
    ) : /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: latest.map((m, i) => {
      const status = STATUS$1[m.status] ?? STATUS$1.pending;
      const date2 = shortDate(m.data_envio);
      return /* @__PURE__ */ jsxs(
        motion.li,
        {
          layout: true,
          initial: { opacity: 0, y: 10 },
          animate: {
            opacity: 1,
            y: 0,
            boxShadow: justSubmitted && i === 0 ? [
              "0 0 0 0 rgba(139,195,74,0)",
              "0 0 0 6px rgba(139,195,74,.35)",
              "0 0 0 0 rgba(139,195,74,0)"
            ] : "0 0 0 0 rgba(139,195,74,0)"
          },
          transition: {
            duration: justSubmitted && i === 0 ? 1.4 : 0.4,
            ease: EASE,
            delay: i * 0.06
          },
          whileHover: { y: -2 },
          className: cn(
            "flex gap-3 rounded-xl border border-border/60 bg-background/70 p-3 transition-colors hover:border-forest/30"
          ),
          children: [
            /* @__PURE__ */ jsx(Thumb, { src: m.url_foto, alt: `Foto enviada em ${m.titulo}` }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                /* @__PURE__ */ jsx("h3", { className: "min-w-0 truncate text-sm font-bold text-foreground", children: m.titulo }),
                /* @__PURE__ */ jsx(StatusPill, { tone: status.tone, children: status.label })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 line-clamp-2 text-xs text-muted-foreground", children: m.descricao }),
              m.status === "rejected" && m.comentario_professor && /* @__PURE__ */ jsxs("p", { className: "mt-1 line-clamp-2 text-xs font-medium text-destructive", children: [
                "Professor: ",
                m.comentario_professor
              ] }),
              date2 && /* @__PURE__ */ jsxs("div", { className: "mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsx(CalendarDays, { className: "h-3.5 w-3.5", "aria-hidden": "true" }),
                " ",
                date2
              ] })
            ] })
          ]
        },
        m.id
      );
    }) }) }),
    /* @__PURE__ */ jsxs(Link, { to: "/historico", className: cn(primaryButton, "mt-4 w-full"), children: [
      "Ver histórico completo ",
      /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4", "aria-hidden": "true" })
    ] })
  ] });
}
const TYPE_ICON = {
  plant: { icon: Sprout, tile: "bg-mint/60 text-moss" },
  water: { icon: Droplets, tile: "bg-info/15 text-info" },
  compost: { icon: Recycle, tile: "bg-warning/20 text-foreground" },
  share: { icon: Share2, tile: "bg-lime/25 text-moss" }
};
const STATUS = {
  disponivel: { label: "Disponível", tone: "success" },
  agendada: { label: "Agendada", tone: "info" },
  em_analise: { label: "Em análise", tone: "warning" },
  concluida: { label: "Concluída", tone: "brand" }
};
const ACTION = {
  disponivel: "Reservar turno",
  agendada: "Ver detalhes",
  em_analise: "Ver detalhes",
  concluida: "Ver detalhes"
};
function ClassMissions({
  missions,
  loading,
  error,
  onRetry,
  onOpen,
  streak
}) {
  const cards = missions ?? [];
  const filled = Math.max(0, Math.min(14, streak));
  return /* @__PURE__ */ jsxs(GardenCard, { "aria-labelledby": "class-title", className: "flex flex-col", delay: 0.05, children: [
    /* @__PURE__ */ jsx("h2", { id: "class-title", className: "text-sm font-bold uppercase tracking-wide text-foreground", children: "Missões da turma" }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Escolha uma missão e envie a comprovação para ganhar pontos." }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 flex-1 space-y-3", children: loading ? /* @__PURE__ */ jsx("div", { role: "status", "aria-label": "Carregando missões", className: "space-y-3", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsx("div", { className: "h-[92px] animate-pulse rounded-xl bg-muted/70" }, i)) }) : error ? /* @__PURE__ */ jsx(
      InlineMessage,
      {
        tone: "danger",
        action: /* @__PURE__ */ jsx("button", { onClick: onRetry, className: softButton, children: "Tentar novamente" }),
        children: error
      }
    ) : !cards.length ? /* @__PURE__ */ jsx(InlineMessage, { children: "Nenhuma missão disponível no momento." }) : /* @__PURE__ */ jsx("ul", { className: "space-y-3 lg:max-h-[30rem] lg:overflow-y-auto lg:scroll-fade lg:pb-5 lg:pr-1", children: cards.map((m, i) => {
      const visual = TYPE_ICON[m.tipo] ?? {
        icon: Sprout,
        tile: "bg-muted text-muted-foreground"
      };
      const Icon = visual.icon;
      const status = STATUS[m.status];
      const when = dateTime(m.horario);
      return /* @__PURE__ */ jsxs(
        motion.li,
        {
          initial: { opacity: 0, y: 10 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.4, ease: EASE, delay: Math.min(i, 5) * 0.05 },
          whileHover: { y: -2 },
          className: "flex gap-3 rounded-xl border border-border/60 bg-background/70 p-3 transition-colors hover:border-forest/30",
          children: [
            m.imagem && isImageSource(m.imagem) ? /* @__PURE__ */ jsx(
              "img",
              {
                src: backendAsset(m.imagem),
                alt: "",
                loading: "lazy",
                className: "h-16 w-16 shrink-0 rounded-xl object-cover"
              }
            ) : /* @__PURE__ */ jsx(
              "div",
              {
                className: cn(
                  "grid h-16 w-16 shrink-0 place-items-center rounded-xl",
                  visual.tile
                ),
                children: /* @__PURE__ */ jsx(Icon, { className: "h-7 w-7", "aria-hidden": "true" })
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                /* @__PURE__ */ jsx("h3", { className: "min-w-0 text-sm font-bold leading-snug text-foreground", children: m.titulo }),
                /* @__PURE__ */ jsx(StatusPill, { tone: status.tone, children: status.label })
              ] }),
              m.descricao && /* @__PURE__ */ jsx("p", { className: "mt-0.5 line-clamp-2 text-xs text-muted-foreground", children: m.descricao }),
              /* @__PURE__ */ jsxs("div", { className: "mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-foreground/80", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-primary", children: [
                  "+",
                  m.pontos,
                  " pts"
                ] }),
                /* @__PURE__ */ jsx("span", { children: categoryLabel(m.tipo) }),
                /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 font-medium text-muted-foreground", children: [
                  /* @__PURE__ */ jsx(Users, { className: "h-3.5 w-3.5", "aria-hidden": "true" }),
                  m.max_alunos > 1 ? `${m.participantes}/${m.max_alunos} alunos` : "Individual"
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 font-medium text-muted-foreground", children: [
                  /* @__PURE__ */ jsx(CalendarClock, { className: "h-3.5 w-3.5", "aria-hidden": "true" }),
                  " ",
                  when ? `Turno ${when}` : "Escolha um turno"
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxs("button", { onClick: () => onOpen(m), className: softButton, children: [
                ACTION[m.status],
                " ",
                /* @__PURE__ */ jsx(ChevronRight, { className: "h-3.5 w-3.5", "aria-hidden": "true" })
              ] }) })
            ] })
          ]
        },
        m.id
      );
    }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-5 border-t border-border/60 pt-4", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold text-muted-foreground", children: "Sequência diária" }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "mt-2 flex items-center gap-1.5",
          role: "img",
          "aria-label": `${plural(streak, "dia seguido", "dias seguidos")}`,
          children: Array.from({ length: 14 }).map((_, i) => /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { scale: 0.6, opacity: 0 },
              whileInView: { scale: 1, opacity: 1 },
              viewport: { once: true },
              transition: { delay: i * 0.03, type: "spring", stiffness: 380, damping: 20 },
              className: cn(
                "h-7 min-w-0 flex-1 rounded-md",
                i < filled ? "bg-gradient-to-b from-destructive to-warning" : "bg-muted"
              )
            },
            i
          ))
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-1.5 text-xs font-bold text-destructive", children: [
        /* @__PURE__ */ jsx(Flame, { className: "h-4 w-4", "aria-hidden": "true" }),
        " ",
        plural(streak, "dia seguido", "dias seguidos")
      ] })
    ] })
  ] });
}
const TABS = [
  ["individual", "Individual"],
  ["turma", "Turmas da escola"],
  ["escola", "Escolas"]
];
const BADGE = {
  1: "bg-[#e8a600] text-white shadow-[0_0_0_3px_rgba(232,166,0,.22)]",
  2: "bg-[#6f7f75] text-white",
  3: "bg-[#b4690e] text-white"
};
function Row({ row, pinned = false }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors sm:px-4 sm:py-3",
        row.you ? "border-forest/40 bg-mint/50 dark:bg-success/10" : "border-border/60 bg-background/70 hover:border-forest/25",
        pinned && "shadow-soft"
      ),
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: cn(
              "relative grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold",
              BADGE[row.pos] ?? "bg-forest text-white"
            ),
            children: [
              row.pos,
              row.pos === 1 && /* @__PURE__ */ jsx(
                Crown,
                {
                  className: "absolute inset-x-0 -top-3 mx-auto h-3.5 w-3.5 text-[#e8a600]",
                  "aria-label": "Primeiro lugar"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-x-2 gap-y-0.5", children: [
            /* @__PURE__ */ jsx("span", { className: "line-clamp-2 min-w-0 break-words text-sm font-bold leading-tight text-foreground", children: row.name }),
            row.you && /* @__PURE__ */ jsx(StatusPill, { tone: "brand", className: "py-px", children: "Você" })
          ] }),
          row.members !== void 0 && /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-muted-foreground", children: [
            row.members,
            " ",
            row.members === 1 ? "aluno" : "alunos"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "shrink-0 text-right", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-bold tabular-nums text-foreground", children: row.points.toLocaleString("pt-BR") }),
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Pontos" })
        ] })
      ]
    }
  );
}
function GardenRanking({
  type,
  onTypeChange,
  rows,
  loading,
  error,
  onRetry
}) {
  const mine = rows?.find((r) => r.you);
  return /* @__PURE__ */ jsxs(GardenCard, { "aria-labelledby": "ranking-title", className: "flex flex-col", delay: 0.1, children: [
    /* @__PURE__ */ jsx(SectionTitle, { id: "ranking-title", children: "Ranking" }),
    /* @__PURE__ */ jsx("div", { className: "-mx-1 mt-3 overflow-x-auto px-1 pb-1 scrollbar-none", children: /* @__PURE__ */ jsx(
      "div",
      {
        role: "tablist",
        "aria-label": "Tipo de ranking",
        className: "inline-flex min-w-max gap-1 rounded-full border border-border bg-background p-1 text-xs font-semibold",
        children: TABS.map(([value, label]) => {
          const active = type === value;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              role: "tab",
              "aria-selected": active,
              onClick: () => onTypeChange(value),
              className: cn(
                "relative whitespace-nowrap rounded-full px-3 py-1.5 sm:px-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active ? "text-white" : "text-muted-foreground hover:text-foreground"
              ),
              children: [
                active && /* @__PURE__ */ jsx(
                  motion.span,
                  {
                    layoutId: "ranking-tab",
                    className: "absolute inset-0 rounded-full bg-forest",
                    transition: { type: "spring", stiffness: 420, damping: 34 }
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "relative", children: label })
              ]
            },
            value
          );
        })
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 flex-1", role: "tabpanel", "aria-busy": loading, children: error ? /* @__PURE__ */ jsx(
      InlineMessage,
      {
        tone: "danger",
        action: /* @__PURE__ */ jsx("button", { onClick: onRetry, className: softButton, children: "Tentar novamente" }),
        children: error
      }
    ) : !rows ? /* @__PURE__ */ jsx("div", { role: "status", "aria-label": "Carregando ranking", className: "space-y-2", children: [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsx("div", { className: "h-[58px] animate-pulse rounded-xl bg-muted/70" }, i)) }) : !rows.length ? /* @__PURE__ */ jsx(InlineMessage, { children: "Ainda não há pontuação neste ranking." }) : /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsx(
      motion.ul,
      {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: loading ? 0.55 : 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.22, ease: EASE },
        className: "max-h-[26rem] space-y-2 overflow-y-auto scroll-fade pb-5 pr-1 sm:max-h-[30rem]",
        children: rows.map((r, i) => /* @__PURE__ */ jsx(
          motion.li,
          {
            initial: { opacity: 0, x: -8 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.3, ease: EASE, delay: Math.min(i, 9) * 0.035 },
            whileHover: { x: 3 },
            children: /* @__PURE__ */ jsx(Row, { row: r })
          },
          `${type}-${r.pos}`
        ))
      },
      type
    ) }) }),
    mine && !error && /* @__PURE__ */ jsxs("div", { className: "mt-3 border-t border-border/60 pt-3", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground", children: "Sua posição" }),
      /* @__PURE__ */ jsx(Row, { row: mine, pinned: true })
    ] })
  ] });
}
const ICONS = { Sprout, Recycle, Flame, Bug, Trophy, Medal };
function GardenAchievements({ items }) {
  const earned = items.filter((a) => a.earned).length;
  return /* @__PURE__ */ jsxs(GardenCard, { "aria-labelledby": "achievements-title", delay: 0.05, children: [
    /* @__PURE__ */ jsx(
      SectionTitle,
      {
        id: "achievements-title",
        aside: /* @__PURE__ */ jsxs(
          "span",
          {
            className: "text-xs font-bold text-muted-foreground",
            "aria-label": `${earned} de ${items.length} conquistas`,
            children: [
              earned,
              "/",
              items.length
            ]
          }
        ),
        children: "Conquistas"
      }
    ),
    items.length > 0 && /* @__PURE__ */ jsx(
      ProgressBar,
      {
        value: earned / items.length * 100,
        label: "Conquistas desbloqueadas",
        className: "mt-3 h-2",
        barClassName: "bg-gradient-to-r from-forest to-lime"
      }
    ),
    !items.length ? /* @__PURE__ */ jsx("p", { className: "mt-4 rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground", children: "Nenhuma conquista cadastrada ainda." }) : /* @__PURE__ */ jsx("ul", { className: "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6", children: items.map((a, i) => {
      const Icon = ICONS[a.icon] ?? Medal;
      const date2 = shortDate(a.earnedAt);
      const pct = a.progress ? Math.min(100, a.progress.value / a.progress.target * 100) : 0;
      return /* @__PURE__ */ jsxs(
        motion.li,
        {
          initial: { opacity: 0, scale: 0.92 },
          whileInView: { opacity: 1, scale: 1 },
          viewport: { once: true },
          transition: { duration: 0.4, ease: EASE, delay: i * 0.05 },
          whileHover: { y: -3 },
          className: cn(
            "relative flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-shadow hover:shadow-elevated",
            a.earned ? "border-forest/40 bg-mint/45 dark:bg-success/10" : "border-border/60 bg-muted/40"
          ),
          children: [
            /* @__PURE__ */ jsxs(
              "span",
              {
                className: cn(
                  "absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full",
                  a.earned ? "bg-lime text-moss" : "bg-muted text-muted-foreground"
                ),
                title: a.earned ? "Desbloqueada" : "Bloqueada",
                children: [
                  a.earned ? /* @__PURE__ */ jsx(Check, { className: "h-3 w-3", strokeWidth: 3 }) : /* @__PURE__ */ jsx(Lock, { className: "h-3 w-3" }),
                  /* @__PURE__ */ jsx("span", { className: "sr-only", children: a.earned ? "Desbloqueada" : "Bloqueada" })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              motion.div,
              {
                initial: a.earned ? { scale: 0.6, rotate: -12 } : false,
                whileInView: { scale: 1, rotate: 0 },
                viewport: { once: true },
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 14,
                  delay: 0.2 + i * 0.05
                },
                className: cn(
                  "grid h-12 w-12 place-items-center rounded-full",
                  a.earned ? "bg-forest text-white shadow-soft" : "bg-muted text-muted-foreground"
                ),
                children: /* @__PURE__ */ jsx(Icon, { className: "h-6 w-6", "aria-hidden": "true" })
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: cn(
                  "text-xs font-bold",
                  a.earned ? "text-foreground" : "text-muted-foreground"
                ),
                children: a.title
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "text-[11px] leading-snug text-muted-foreground", children: a.description }),
            a.earned && date2 && /* @__PURE__ */ jsxs("div", { className: "text-[10px] font-semibold text-primary", children: [
              "Desbloqueada em ",
              date2
            ] }),
            !a.earned && a.progress && /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
              /* @__PURE__ */ jsx(
                ProgressBar,
                {
                  value: pct,
                  label: `Progresso em ${a.title}`,
                  barClassName: "bg-lime"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "mt-1 text-[10px] font-semibold text-muted-foreground", children: [
                a.progress.value,
                "/",
                a.progress.target
              ] })
            ] })
          ]
        },
        a.id
      );
    }) })
  ] });
}
function GardenPage() {
  const {
    data: user,
    isPending,
    error
  } = useQuery(userQuery());
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  if (isPending) return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsx("p", { role: "status", className: "p-16 text-center text-muted-foreground", children: "Carregando seu jardim..." }) });
  if (error || !user) return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-4 p-16 text-center", children: [
    /* @__PURE__ */ jsx("p", { role: "alert", children: error?.message ?? "Faça login para continuar" }),
    /* @__PURE__ */ jsx(Link, { to: "/login", className: "font-semibold text-primary underline", children: "Entrar na minha conta" })
  ] }) });
  if (user.perfil_nome !== "aluno") return /* @__PURE__ */ jsx(StaffGarden, { user, schoolId: search.escola, classId: search.turma, onNavigate: (next) => void navigate({
    search: next
  }) }, `${user.id}-${user.perfil_nome}-${user.instituicao_id}`);
  return /* @__PURE__ */ jsx(StudentGardenPage, {});
}
function achievementProgress(rule, modules, user) {
  if (!rule) return null;
  const lessons = modules.flatMap((m) => m.licoes ?? []);
  const done = (list) => list.filter((l) => l.status === "completed").length;
  const [kind, raw] = rule.split(":");
  const target = Number(raw);
  if (kind === "licoes" && target > 0) return {
    value: Math.min(done(lessons), target),
    target
  };
  if (kind === "streak" && target > 0) return {
    value: Math.min(Number(user.streak_dias) || 0, target),
    target
  };
  if (kind === "modulo_completo" && target > 0) {
    const module = modules.find((m) => m.ordem === target);
    if (!module?.licoes?.length) return null;
    return {
      value: done(module.licoes),
      target: module.licoes.length
    };
  }
  if (rule === "todos_modulos" && modules.length) return {
    value: modules.filter((m) => m.progresso >= 100).length,
    target: modules.length
  };
  return null;
}
function submissionTime(value) {
  if (!value) return 0;
  const time = new Date(value.replace(" ", "T")).getTime();
  return Number.isNaN(time) ? 0 : time;
}
function GardenSkeleton({
  children
}) {
  return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsxs("div", { role: "status", className: "grid place-items-center gap-3 p-16 text-center text-muted-foreground", children: [
    /* @__PURE__ */ jsx(motion.span, { animate: {
      scale: [1, 1.12, 1],
      rotate: [0, -6, 6, 0]
    }, transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }, className: "grid h-12 w-12 place-items-center rounded-full bg-mint/60 text-forest", children: /* @__PURE__ */ jsx(Sprout, { className: "h-6 w-6", "aria-hidden": "true" }) }),
    children
  ] }) });
}
function StudentGardenPage() {
  const [proof, setProof] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [rankingType, setRankingType] = useState("individual");
  const [justSubmitted, setJustSubmitted] = useState(false);
  const queryClient = useQueryClient();
  const {
    data: user,
    isLoading: loadingUser,
    error: userError
  } = useQuery(userQuery());
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ["jardim"],
    enabled: isBrowser,
    retry: false,
    queryFn: async () => {
      const [garden, moduleResult] = await Promise.all([apiFetch("/jardim/resumo"), apiFetch("/modulos")]);
      return {
        garden,
        modules: moduleResult.modulos
      };
    }
  });
  const ranking = useQuery({
    queryKey: ["ranking", rankingType],
    enabled: isBrowser,
    queryFn: () => apiFetch(`/ranking?tipo=${rankingType}`),
    retry: false
  });
  const history = useQuery({
    queryKey: ["historico", user?.id],
    enabled: isBrowser && !!user,
    retry: false,
    queryFn: () => apiFetch("/historico")
  });
  const missions = useQuery({
    queryKey: ["missoes"],
    enabled: isBrowser && !!user,
    retry: false,
    queryFn: async () => (await apiFetch("/missoes")).missoes
  });
  useEffect(() => {
    if (!justSubmitted) return;
    const timer = window.setTimeout(() => setJustSubmitted(false), 6e3);
    return () => window.clearTimeout(timer);
  }, [justSubmitted]);
  if (loadingUser || isLoading) return /* @__PURE__ */ jsx(GardenSkeleton, { children: "Cultivando seus dados..." });
  if (userError || error || !user || !data) return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsx("div", { role: "alert", className: "p-16 text-center text-destructive", children: userError?.message ?? error?.message ?? "Faça login para continuar" }) });
  const growth = growthWindow(data.garden.crescimento);
  const rankingRows = ranking.data?.ranking.map((r) => ({
    pos: r.posicao,
    name: rankingType === "escola" ? r.instituicao_nome ?? "Escola" : r.nome ?? "Sem nome",
    points: Number(r.pontos),
    you: rankingType === "individual" ? r.id === user.id : rankingType === "turma" ? r.turma_id === user.turma_id : r.instituicao_id === user.instituicao_id,
    members: rankingType === "individual" || r.alunos === void 0 ? void 0 : Number(r.alunos)
  }));
  const achievements = data.garden.conquistas.map((a) => ({
    id: a.id,
    title: a.titulo,
    description: a.descricao,
    icon: a.icone,
    earned: Boolean(a.conquistada),
    earnedAt: a.conquistada_em ?? null,
    progress: achievementProgress(a.regra, data.modules, user)
  }));
  const startFirstMission = () => {
    const list = missions.data ?? [];
    const next = list.find((m) => m.participando && m.envio_status !== "pending" && m.envio_status !== "approved") ?? list.find((m) => m.status === "disponivel");
    if (next) setSelectedTask(next);
    else toast.info("Nenhuma missão disponível no momento.");
  };
  const recentSubmissions = history.data ? [...history.data.envios].sort((a, b) => submissionTime(b.data_envio) - submissionTime(a.data_envio)).slice(0, 3) : void 0;
  return /* @__PURE__ */ jsxs(PageShell, { children: [
    /* @__PURE__ */ jsx(MotionConfig, { reducedMotion: "user", children: /* @__PURE__ */ jsxs("div", { className: "app-page space-y-6", children: [
      /* @__PURE__ */ jsx(GardenHero, { firstName: user.nome.split(" ")[0], points: Number(user.pontos_totais), growth, evolution: monthEvolution(growth) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 items-start gap-6 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsx(LearningPath, { modules: data.modules }),
        /* @__PURE__ */ jsx(RecentMissions, { items: recentSubmissions, loading: history.isPending, error: history.isError ? history.error.message : null, onRetry: () => void history.refetch(), onSubmit: startFirstMission, justSubmitted })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 items-start gap-6 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsx(ClassMissions, { missions: missions.data, loading: missions.isPending, error: missions.isError ? missions.error.message : null, onRetry: () => void missions.refetch(), onOpen: setSelectedTask, streak: Number(user.streak_dias) || 0 }),
        /* @__PURE__ */ jsx(GardenRanking, { type: rankingType, onTypeChange: setRankingType, rows: rankingRows, loading: ranking.isFetching, error: ranking.isError ? ranking.error.message : null, onRetry: () => void ranking.refetch() })
      ] }),
      /* @__PURE__ */ jsx(GardenAchievements, { items: achievements })
    ] }) }),
    /* @__PURE__ */ jsx(MissionDialog, { mission: selectedTask, onClose: () => setSelectedTask(null), onProof: setProof }),
    /* @__PURE__ */ jsx(SubmitProofModal, { mission: proof, onOpenChange: (v) => !v && setProof(null), onSubmitted: () => {
      setJustSubmitted(true);
      void queryClient.invalidateQueries({
        queryKey: ["historico"]
      });
      void queryClient.invalidateQueries({
        queryKey: ["jardim"]
      });
      void queryClient.invalidateQueries({
        queryKey: ["missoes"]
      });
      void queryClient.invalidateQueries({
        queryKey: ["agenda"]
      });
      void queryClient.invalidateQueries({
        queryKey: ["perfil"]
      });
    } })
  ] });
}
export {
  GardenPage as component
};
