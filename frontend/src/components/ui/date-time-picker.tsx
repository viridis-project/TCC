import { useState } from "react";
import { CalendarDays, Check, ChevronDown, Clock3 } from "lucide-react";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const triggerClass =
  "flex min-h-11 w-full items-center justify-between gap-2 rounded-xl border border-input bg-background px-3 py-2.5 text-left text-sm transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20";

function parseDate(value: string): Date | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function serializeDate(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function formatDate(date: Date | undefined): string {
  if (!date) return "Escolha uma data";
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function DatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = parseDate(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className={triggerClass} aria-label="Selecionar data">
          <span
            className={cn("flex min-w-0 items-center gap-2", !selected && "text-muted-foreground")}
          >
            <CalendarDays className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span className="truncate capitalize">{formatDate(selected)}</span>
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto max-w-[calc(100vw-1.5rem)] rounded-xl p-0">
        <div className="border-b border-border/60 px-4 py-3">
          <div className="text-sm font-bold">Escolha a data</div>
          <div className="text-xs text-muted-foreground">Selecione o dia da atividade.</div>
        </div>
        <Calendar
          mode="single"
          locale={ptBR}
          selected={selected}
          defaultMonth={selected ?? today}
          disabled={{ before: today }}
          onSelect={(day) => {
            if (!day) return;
            onChange(serializeDate(day));
            setOpen(false);
          }}
          className="[--cell-size:2.75rem]"
        />
      </PopoverContent>
    </Popover>
  );
}

const hours = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, "0"));
const minutes = ["00", "15", "30", "45"];

export function TimePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedHour, selectedMinute] = /^\d{2}:\d{2}$/.test(value) ? value.split(":") : ["", ""];
  const suggestedHour = String(Math.min(23, new Date().getHours() + 1)).padStart(2, "0");

  function update(hour: string, minute: string) {
    onChange(`${hour || suggestedHour}:${minute || "00"}`);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className={triggerClass} aria-label="Selecionar horário">
          <span className={cn("flex items-center gap-2", !value && "text-muted-foreground")}>
            <Clock3 className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>{value || "Escolha um horário"}</span>
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 max-w-[calc(100vw-1.5rem)] rounded-xl p-0">
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <div>
            <div className="text-sm font-bold">Escolha o horário</div>
            <div className="text-xs text-muted-foreground">Hora e minutos</div>
          </div>
          <div className="rounded-lg bg-primary/10 px-3 py-1.5 font-display text-lg font-bold tabular-nums text-primary">
            {selectedHour || "--"}:{selectedMinute || "--"}
          </div>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_7rem] gap-3 p-3">
          <fieldset>
            <legend className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Hora
            </legend>
            <div className="grid max-h-52 grid-cols-3 gap-1 overflow-y-auto pr-1">
              {hours.map((hour) => (
                <button
                  key={hour}
                  type="button"
                  aria-pressed={selectedHour === hour}
                  onClick={() => update(hour, selectedMinute)}
                  className={cn(
                    "min-h-11 rounded-lg text-sm font-semibold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selectedHour === hour
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/60 text-foreground hover:bg-accent",
                  )}
                >
                  {hour}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Minutos
            </legend>
            <div className="grid gap-1">
              {minutes.map((minute) => (
                <button
                  key={minute}
                  type="button"
                  aria-pressed={selectedMinute === minute}
                  onClick={() => update(selectedHour, minute)}
                  className={cn(
                    "min-h-11 rounded-lg text-sm font-semibold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selectedMinute === minute
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/60 text-foreground hover:bg-accent",
                  )}
                >
                  :{minute}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="flex justify-end border-t border-border/60 p-3">
          <button
            type="button"
            disabled={!value}
            onClick={() => setOpen(false)}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check className="h-4 w-4" aria-hidden="true" /> Concluir
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
