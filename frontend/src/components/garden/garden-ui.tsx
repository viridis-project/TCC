import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Card base do módulo Jardim: cantos arredondados, borda suave, sombra discreta e entrada progressiva. */
export function GardenCard({
  children,
  className,
  delay = 0,
  as = "section",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "section" | "div";
} & Omit<React.HTMLAttributes<HTMLElement>, "children">) {
  const Comp = as === "div" ? motion.div : motion.section;
  return (
    <Comp
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: EASE, delay }}
      className={cn(
        "rounded-2xl border border-border/60 bg-card p-5 shadow-soft sm:p-6",
        className,
      )}
      {...(rest as object)}
    >
      {children}
    </Comp>
  );
}

export function SectionTitle({
  children,
  aside,
  id,
}: {
  children: ReactNode;
  aside?: ReactNode;
  id?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 id={id} className="text-sm font-bold uppercase tracking-wide text-foreground">
        {children}
      </h2>
      {aside}
    </div>
  );
}

const TONES = {
  success: "bg-mint/70 text-moss dark:bg-success/20 dark:text-success",
  warning: "bg-warning/20 text-foreground",
  info: "bg-info/15 text-info",
  danger: "bg-destructive/10 text-destructive",
  muted: "bg-muted text-muted-foreground",
  brand: "bg-forest text-white",
} as const;

export type Tone = keyof typeof TONES;

export function StatusPill({
  tone = "muted",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Barra de progresso animada ao entrar na tela. */
export function ProgressBar({
  value,
  className,
  barClassName,
  label,
}: {
  value: number;
  className?: string;
  barClassName?: string;
  label?: string;
}) {
  const pct = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      aria-label={label}
      className={cn("h-1.5 overflow-hidden rounded-full bg-muted", className)}
    >
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${pct}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE }}
        className={cn("h-full rounded-full bg-forest", barClassName)}
      />
    </div>
  );
}

/** Número que conta até o valor atual (a partir do valor anterior quando ele muda). */
export function CountUp({ value, className }: { value: number; className?: string }) {
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
      onUpdate: (v) => setShown(Math.round(v)),
    });
    previous.current = value;
    return () => controls.stop();
  }, [value, reduce]);
  return <span className={className}>{shown.toLocaleString("pt-BR")}</span>;
}

export function InlineMessage({
  children,
  action,
  tone = "muted",
}: {
  children: ReactNode;
  action?: ReactNode;
  tone?: "muted" | "danger";
}) {
  return (
    <div
      role={tone === "danger" ? "alert" : undefined}
      className={cn(
        "flex flex-col items-center gap-3 rounded-xl border border-dashed px-4 py-8 text-center text-sm",
        tone === "danger"
          ? "border-destructive/30 bg-destructive/5 text-destructive"
          : "border-border bg-background/60 text-muted-foreground",
      )}
    >
      <p>{children}</p>
      {action}
    </div>
  );
}

export const primaryButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--primary-hover)] hover:shadow-elevated active:translate-y-0 active:bg-[var(--primary-active)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

export const softButton =
  "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-forest/25 bg-mint/40 px-3 py-1.5 text-xs font-bold text-forest transition-all duration-200 hover:-translate-y-0.5 hover:bg-mint/70 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-primary";
