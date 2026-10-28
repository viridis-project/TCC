import { Fragment, useEffect, useMemo, useState } from "react";
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
import { useSearch } from "@tanstack/react-router";

export type ScheduleCalendarItem = {
  id: number;
  missao_publicada_id?: number | null;
  grupo_id?: string | null;
  titulo: string;
  data_hora: string;
  status: "agendado" | "concluido" | "cancelado" | "nao_realizada";
  missao: string | null;
  descricao?: string | null;
  turma?: string;
  aluno?: string;
  resultados?: string | null;
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
      item.missao_publicada_id ?? "",
      item.grupo_id ?? item.id,
      item.turma ?? "",
      item.missao ?? "",
    ].join("|");
    const current = groups.get(key);
    if (current) {
      current.ids.push(item.id);
      if (item.aluno && !current.alunos.includes(item.aluno)) current.alunos.push(item.aluno);
      if (item.resultados)
        current.resultados = [current.resultados, item.resultados].filter(Boolean).join("\n\n");
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
  nao_realizada: "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200",
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
  const search = useSearch({ strict: false }) as { data?: string };
  useEffect(() => {
    if (!search.data) return;
    const parsed = new Date(`${search.data}T00:00:00`);
    if (!Number.isNaN(parsed.getTime())) setAnchor(parsed);
  }, [search.data]);
  const grouped = useMemo(() => groupItems(items), [items]);
  const [resultItem, setResultItem] = useState<GroupedItem | null>(null);
  const weekStart = startOfWeek(anchor, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(anchor, { weekStartsOn: 1 });
  const periodLabel =
    view === "week"
      ? `${format(weekStart, "dd MMM", { locale: ptBR })} — ${format(weekEnd, "dd MMM yyyy", { locale: ptBR })}`
      : format(anchor, "MMMM 'de' yyyy", { locale: ptBR });

  function movePeriod(direction: -1 | 1) {
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
            onClick={() => {
              const today = new Date();
              setAnchor(today);
              if (typeof window !== "undefined") {
                const params = new URLSearchParams(window.location.search);
                params.delete("data");
                const query = params.toString();
                window.history.replaceState(
                  null,
                  "",
                  `${window.location.pathname}${query ? `?${query}` : ""}`,
                );
              }
            }}
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
          onResults={setResultItem}
        />
      ) : (
        <MonthView anchor={anchor} items={grouped} onResults={setResultItem} />
      )}
      {resultItem && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setResultItem(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">{resultItem.titulo}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {format(resultItem.date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })} ·{" "}
                  {resultItem.status === "nao_realizada" ? "Não realizada" : "Concluída"}
                </p>
              </div>
              <button
                className="rounded-md border px-3 py-2 text-sm"
                onClick={() => setResultItem(null)}
              >
                Fechar
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase text-muted-foreground">Participantes</h3>
                <p className="mt-1 text-sm">
                  {resultItem.alunos.join(", ") || "Nenhum aluno registrado"}
                </p>
              </div>
              {resultItem.descricao && (
                <div>
                  <h3 className="text-xs font-bold uppercase text-muted-foreground">Descrição</h3>
                  <p className="mt-1 whitespace-pre-wrap text-sm">{resultItem.descricao}</p>
                </div>
              )}
              {resultItem.missao && (
                <p className="text-sm">
                  <strong>Atividade:</strong> {resultItem.missao}
                </p>
              )}
              {resultItem.resultados && (
                <div>
                  <h3 className="text-xs font-bold uppercase text-muted-foreground">
                    Resultados enviados
                  </h3>
                  <pre className="mt-1 whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm">
                    {resultItem.resultados}
                  </pre>
                </div>
              )}
            </div>
          </section>
        </div>
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
  onResults,
}: {
  anchor: Date;
  items: GroupedItem[];
  professor: boolean;
  updating: boolean;
  onStatus: (ids: number[], value: "concluido" | "cancelado") => void;
  onResults: (item: GroupedItem) => void;
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
                        onResults={onResults}
                      />
                      {entries.length > 1 && (
                        <div className="mt-1 truncate text-center text-[10px] font-bold text-primary">
                          +{entries.length - 1} {entries.length === 2 ? "missão" : "missões"}
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
  onResults,
}: {
  item: GroupedItem;
  professor: boolean;
  updating: boolean;
  onStatus: (ids: number[], value: "concluido" | "cancelado") => void;
  onResults: (item: GroupedItem) => void;
}) {
  return (
    <article
      className={cn(
        "flex h-[calc(100%-1.25rem)] min-h-0 flex-col overflow-hidden rounded-lg border p-2 text-xs",
        (item.status === "concluido" || item.status === "nao_realizada") &&
          "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        statusClass[item.status],
      )}
      title={`${item.titulo} — ${format(item.date, "HH:mm")}`}
      onClick={() =>
        (item.status === "concluido" || item.status === "nao_realizada") && onResults(item)
      }
      role={item.status === "concluido" || item.status === "nao_realizada" ? "button" : undefined}
      tabIndex={item.status === "concluido" || item.status === "nao_realizada" ? 0 : undefined}
      onKeyDown={(event) => {
        if (
          (item.status === "concluido" || item.status === "nao_realizada") &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          onResults(item);
        }
      }}
    >
      <div className="truncate font-bold">{item.titulo}</div>
      <div className="mt-0.5 tabular-nums text-muted-foreground">{format(item.date, "HH:mm")}</div>
      <div className="mt-1 truncate text-[10px] text-muted-foreground">
        {professor && item.turma ? `${item.turma} · ` : ""}
        {item.alunos.length ? `Com ${item.alunos.join(", ")}` : "Sem alunos"}
      </div>
      <div className="mt-auto flex items-end justify-between gap-1">
        <span className="truncate text-[10px] text-muted-foreground">
          {item.status === "nao_realizada"
            ? "Não realizada"
            : item.status === "concluido"
              ? "Concluída"
              : item.status === "cancelado"
                ? "Cancelada"
                : "Agendada"}
        </span>
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

function MonthView({
  anchor,
  items,
  onResults,
}: {
  anchor: Date;
  items: GroupedItem[];
  onResults: (item: GroupedItem) => void;
}) {
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
                    <button
                      key={item.ids.join("-")}
                      type="button"
                      onClick={() =>
                        (item.status === "concluido" || item.status === "nao_realizada") &&
                        onResults(item)
                      }
                      disabled={item.status !== "concluido" && item.status !== "nao_realizada"}
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
                    </button>
                  ))}
                  {entries.length > 2 && (
                    <div className="truncate px-1 text-[10px] font-bold text-primary">
                      +{entries.length - 2} missões
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
