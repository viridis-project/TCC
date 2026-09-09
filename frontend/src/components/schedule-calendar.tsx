import { Fragment, useMemo, useState } from "react";
import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CalendarDays,
  CalendarRange,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ScheduleCalendarItem = {
  id: number;
  titulo: string;
  data_hora: string;
  status: "agendado" | "concluido" | "cancelado";
  missao: string | null;
  turma?: string;
  aluno?: string;
};

type GroupedItem = ScheduleCalendarItem & { ids: number[]; alunos: string[]; date: Date };
type ViewMode = "week" | "month";

function parseDate(raw: string): Date {
  return new Date(raw.replace(" ", "T"));
}

function groupItems(items: ScheduleCalendarItem[]): GroupedItem[] {
  const groups = new Map<string, GroupedItem>();
  items.forEach((item) => {
    const key = [
      item.titulo,
      item.data_hora,
      item.status,
      item.turma ?? "",
      item.missao ?? "",
    ].join("|");
    const current = groups.get(key);
    if (current) {
      current.ids.push(item.id);
      if (item.aluno && !current.alunos.includes(item.aluno)) current.alunos.push(item.aluno);
      return;
    }
    groups.set(key, {
      ...item,
      ids: [item.id],
      alunos: item.aluno ? [item.aluno] : [],
      date: parseDate(item.data_hora),
    });
  });
  return [...groups.values()].sort((a, b) => a.date.getTime() - b.date.getTime());
}

const statusClass = {
  agendado: "border-primary/30 bg-primary/10 text-foreground",
  concluido: "border-success/30 bg-success/10 text-foreground",
  cancelado: "border-destructive/30 bg-destructive/5 text-muted-foreground",
} as const;

export function ScheduleCalendar({
  items,
  professor,
  updating,
  onStatus,
}: {
  items: ScheduleCalendarItem[];
  professor: boolean;
  updating: boolean;
  onStatus: (ids: number[], value: "concluido" | "cancelado") => void;
}) {
  const [view, setView] = useState<ViewMode>("week");
  const [anchor, setAnchor] = useState(() => new Date());
  const grouped = useMemo(() => groupItems(items), [items]);
  const weekStart = startOfWeek(anchor, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(anchor, { weekStartsOn: 1 });
  const periodLabel =
    view === "week"
      ? `${format(weekStart, "dd MMM", { locale: ptBR })} — ${format(weekEnd, "dd MMM yyyy", { locale: ptBR })}`
      : format(anchor, "MMMM 'de' yyyy", { locale: ptBR });

  function movePeriod(direction: -1 | 1) {
    setAnchor((current) =>
      view === "week" ? addWeeks(current, direction) : addMonths(current, direction),
    );
  }

  return (
    <section className="mt-6 overflow-hidden rounded-xl border border-border/60 bg-card shadow-soft">
      <div className="flex flex-col gap-3 border-b border-border/60 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => movePeriod(-1)}
            aria-label={view === "week" ? "Semana anterior" : "Mês anterior"}
            className="grid h-11 w-11 place-items-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setAnchor(new Date())}
            className="min-h-11 rounded-lg px-3 text-sm font-bold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Hoje
          </button>
          <button
            type="button"
            onClick={() => movePeriod(1)}
            aria-label={view === "week" ? "Próxima semana" : "Próximo mês"}
            className="grid h-11 w-11 place-items-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <h2 className="order-first font-display text-lg font-bold capitalize text-foreground sm:order-none">
          {periodLabel}
        </h2>

        <div className="grid grid-cols-2 rounded-lg border border-border bg-muted/50 p-1">
          <ViewButton active={view === "week"} onClick={() => setView("week")}>
            <CalendarRange className="h-4 w-4" aria-hidden="true" /> Semana
          </ViewButton>
          <ViewButton active={view === "month"} onClick={() => setView("month")}>
            <CalendarDays className="h-4 w-4" aria-hidden="true" /> Mês
          </ViewButton>
        </div>
      </div>

      {view === "week" ? (
        <WeekView
          anchor={anchor}
          items={grouped}
          professor={professor}
          updating={updating}
          onStatus={onStatus}
        />
      ) : (
        <MonthView anchor={anchor} items={grouped} />
      )}
    </section>
  );
}

function ViewButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md px-3 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function WeekView({
  anchor,
  items,
  professor,
  updating,
  onStatus,
}: {
  anchor: Date;
  items: GroupedItem[];
  professor: boolean;
  updating: boolean;
  onStatus: (ids: number[], value: "concluido" | "cancelado") => void;
}) {
  const weekStart = startOfWeek(anchor, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  const visibleItems = items.filter(
    (item) => item.date >= weekStart && item.date <= endOfWeek(anchor, { weekStartsOn: 1 }),
  );
  const hours = Array.from(
    new Set([7, 9, 11, 13, 15, ...visibleItems.map((item) => item.date.getHours())]),
  ).sort((a, b) => a - b);

  return (
    <div className="overflow-x-auto" aria-label="Calendário semanal">
      <div className="min-w-[1080px]">
        <div className="grid grid-cols-[5rem_repeat(7,minmax(0,1fr))] bg-muted/30">
          <div className="border-r border-border/60" />
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className={cn(
                "border-r border-border/60 p-3 text-center last:border-r-0",
                isSameDay(day, new Date()) && "bg-primary/5",
              )}
            >
              <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                {format(day, "EEE", { locale: ptBR })}
              </div>
              <div
                className={cn(
                  "mx-auto mt-1 grid h-8 w-8 place-items-center rounded-full text-sm font-bold",
                  isSameDay(day, new Date()) && "bg-primary text-primary-foreground",
                )}
              >
                {format(day, "dd")}
              </div>
            </div>
          ))}
        </div>
        {hours.map((hour) => (
          <div
            key={hour}
            className="grid grid-cols-[5rem_repeat(7,minmax(0,1fr))] border-t border-border/60"
          >
            <div className="flex h-32 items-start justify-end border-r border-border/60 p-3 text-xs font-bold tabular-nums text-muted-foreground">
              {String(hour).padStart(2, "0")}:00
            </div>
            {days.map((day) => {
              const entries = visibleItems.filter(
                (item) => isSameDay(item.date, day) && item.date.getHours() === hour,
              );
              return (
                <div
                  key={day.toISOString()}
                  className="h-32 min-w-0 overflow-hidden border-r border-border/60 p-1.5 last:border-r-0"
                >
                  {entries.length ? (
                    <Fragment>
                      <WeekEvent
                        item={entries[0]}
                        professor={professor}
                        updating={updating}
                        onStatus={onStatus}
                      />
                      {entries.length > 1 && (
                        <div className="mt-1 truncate text-center text-[10px] font-bold text-primary">
                          +{entries.length - 1} {entries.length === 2 ? "tarefa" : "tarefas"}
                        </div>
                      )}
                    </Fragment>
                  ) : (
                    <div className="grid h-full place-items-center text-muted-foreground/25">
                      <Clock3 className="h-4 w-4" aria-hidden="true" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function WeekEvent({
  item,
  professor,
  updating,
  onStatus,
}: {
  item: GroupedItem;
  professor: boolean;
  updating: boolean;
  onStatus: (ids: number[], value: "concluido" | "cancelado") => void;
}) {
  return (
    <article
      className={cn(
        "flex h-[calc(100%-1.25rem)] min-h-0 flex-col overflow-hidden rounded-lg border p-2 text-xs",
        statusClass[item.status],
      )}
      title={`${item.titulo} — ${format(item.date, "HH:mm")}`}
    >
      <div className="truncate font-bold">{item.titulo}</div>
      <div className="mt-0.5 tabular-nums text-muted-foreground">{format(item.date, "HH:mm")}</div>
      {professor && (
        <div className="mt-1 truncate text-[10px] text-muted-foreground">
          {item.turma}
          {item.alunos.length
            ? ` · ${item.alunos.length} aluno${item.alunos.length > 1 ? "s" : ""}`
            : ""}
        </div>
      )}
      <div className="mt-auto flex items-end justify-between gap-1">
        <span className="truncate text-[10px] capitalize text-muted-foreground">{item.status}</span>
        {professor && item.status === "agendado" && (
          <span className="flex shrink-0 gap-1">
            <button
              type="button"
              disabled={updating}
              onClick={() => onStatus(item.ids, "concluido")}
              className="grid h-9 w-9 place-items-center rounded-md bg-success text-success-foreground disabled:opacity-50"
              aria-label={`Concluir ${item.titulo}`}
            >
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              disabled={updating}
              onClick={() => onStatus(item.ids, "cancelado")}
              className="grid h-9 w-9 place-items-center rounded-md bg-destructive text-destructive-foreground disabled:opacity-50"
              aria-label={`Cancelar ${item.titulo}`}
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </span>
        )}
      </div>
    </article>
  );
}

function MonthView({ anchor, items }: { anchor: Date; items: GroupedItem[] }) {
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
      calendarStart.getDate() + 6,
    ),
  });

  return (
    <div className="overflow-x-auto" aria-label="Calendário mensal">
      <div className="min-w-[840px]">
        <div className="grid grid-cols-7 bg-muted/30">
          {weekdayLabels.map((day) => (
            <div
              key={day.toISOString()}
              className="border-r border-border/60 px-3 py-2 text-center text-[10px] font-bold uppercase tracking-wide text-muted-foreground last:border-r-0"
            >
              {format(day, "EEEE", { locale: ptBR })}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day) => {
            const entries = items.filter((item) => isSameDay(item.date, day));
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "h-32 min-w-0 overflow-hidden border-r border-t border-border/60 p-2 last:border-r-0",
                  !isSameMonth(day, anchor) && "bg-muted/20 text-muted-foreground",
                  isSameDay(day, new Date()) && "bg-primary/5",
                )}
              >
                <div
                  className={cn(
                    "mb-1 grid h-7 w-7 place-items-center rounded-full text-xs font-bold",
                    isSameDay(day, new Date()) && "bg-primary text-primary-foreground",
                  )}
                >
                  {format(day, "d")}
                </div>
                <div className="space-y-1">
                  {entries.slice(0, 2).map((item) => (
                    <div
                      key={item.ids.join("-")}
                      className={cn(
                        "flex min-w-0 items-center gap-1 rounded-md border px-1.5 py-1 text-[10px]",
                        statusClass[item.status],
                      )}
                      title={`${format(item.date, "HH:mm")} — ${item.titulo}`}
                    >
                      <span className="shrink-0 font-bold tabular-nums">
                        {format(item.date, "HH:mm")}
                      </span>
                      <span className="truncate">{item.titulo}</span>
                    </div>
                  ))}
                  {entries.length > 2 && (
                    <div className="truncate px-1 text-[10px] font-bold text-primary">
                      +{entries.length - 2} tarefas
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
