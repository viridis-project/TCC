import { Link } from "@tanstack/react-router";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { ArrowRight, Eye, EyeOff, Loader2, Sprout } from "lucide-react";
import { useState, type ComponentProps, type ReactNode } from "react";
import { AuthBrandPanel } from "@/components/auth-brand-panel";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const authStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};
const authItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

/** Bloco que entra em cascata dentro de um container com `authStagger`. */
export function AuthItem({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <motion.div variants={authItem} className={className}>
      {children}
    </motion.div>
  );
}

/** Estrutura dividida compartilhada por Login e Registro (painel institucional + formulário). */
export function AuthLayout({
  panelSide,
  eyebrow,
  title,
  description,
  children,
}: {
  panelSide: "left" | "right";
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  const panelOnRight = panelSide === "right";
  return (
    <MotionConfig reducedMotion="user">
      <div className="auth-shell grid lg:grid-cols-2">
        {/* O painel vem primeiro no DOM: em telas menores fica no topo, em desktop respeita `order`. */}
        <AuthBrandPanel
          side={panelSide}
          eyebrow={eyebrow}
          title={title}
          description={description}
          className={panelOnRight ? "lg:order-2" : "lg:order-1"}
        />
        <motion.section
          initial={{ opacity: 0, x: panelOnRight ? -24 : 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease }}
          className={cn(
            "flex flex-col justify-center px-6 py-10 sm:px-12 lg:min-h-screen lg:px-16 lg:py-12 xl:px-24",
            panelOnRight ? "lg:order-1" : "lg:order-2",
          )}
        >
          <motion.div
            variants={authStagger}
            initial="hidden"
            animate="show"
            className="mx-auto w-full max-w-sm sm:max-w-md lg:mx-0 lg:max-w-sm"
          >
            {children}
          </motion.div>
        </motion.section>
      </div>
    </MotionConfig>
  );
}

export function AuthLogo() {
  return (
    <AuthItem>
      <Link
        to="/"
        className="inline-flex items-center gap-3 rounded-xl"
        aria-label="Viridis — início"
      >
        <motion.div
          whileHover={{ rotate: -6, scale: 1.04 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft"
        >
          <Sprout className="h-5 w-5" aria-hidden="true" />
        </motion.div>
        <div className="leading-tight">
          <div className="font-display text-base font-extrabold tracking-tight">VIRIDIS</div>
          <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Cultivando Sustentabilidade
          </div>
        </div>
      </Link>
    </AuthItem>
  );
}

export function AuthHeading({ title, description }: { title: string; description: string }) {
  return (
    <AuthItem className="mt-9 sm:mt-12">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </AuthItem>
  );
}

type AuthFieldProps = Omit<ComponentProps<"input">, "id"> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  /** Conteúdo ao lado do rótulo (ex.: selo de força da senha). */
  labelAside?: ReactNode;
  /** Conteúdo abaixo do campo (ex.: barra de força da senha). */
  below?: ReactNode;
  /** Adiciona o botão de mostrar/ocultar (campos de senha). */
  reveal?: boolean;
};

export function AuthField({
  id,
  label,
  error,
  hint,
  labelAside,
  below,
  reveal,
  className,
  type,
  ...inputProps
}: AuthFieldProps) {
  const [shown, setShown] = useState(false);
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <AuthItem>
      <div className="mb-1.5 flex min-h-5 items-center justify-between">
        <label htmlFor={id} className="text-xs font-semibold text-foreground">
          {label}
        </label>
        {labelAside}
      </div>
      <div className="relative">
        <input
          {...inputProps}
          id={id}
          type={reveal ? (shown ? "text" : "password") : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn("auth-input", reveal && "pr-12", className)}
        />
        {reveal && (
          <button
            type="button"
            onClick={() => setShown((v) => !v)}
            className="absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={shown ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={shown}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={shown ? "off" : "on"}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.12 }}
                className="grid place-items-center"
              >
                {shown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </motion.span>
            </AnimatePresence>
          </button>
        )}
      </div>
      {below}
      <AnimatePresence initial={false} mode="wait">
        {error ? (
          <motion.p
            key="error"
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="mt-1.5 text-[11px] font-medium text-destructive"
          >
            {error}
          </motion.p>
        ) : hint ? (
          <p key="hint" id={`${id}-hint`} className="mt-1.5 text-[11px] text-muted-foreground">
            {hint}
          </p>
        ) : null}
      </AnimatePresence>
    </AuthItem>
  );
}

export function AuthSubmit({
  loading,
  label,
  loadingLabel,
}: {
  loading: boolean;
  label: string;
  loadingLabel: string;
}) {
  return (
    <AuthItem className="pt-2">
      <motion.button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        whileHover={loading ? undefined : { y: -1 }}
        whileTap={loading ? undefined : { scale: 0.985 }}
        transition={{ duration: 0.15 }}
        className="group flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-[background-color,box-shadow] hover:bg-[var(--primary-hover)] hover:shadow-elevated active:bg-[var(--primary-active)] disabled:cursor-wait disabled:opacity-80"
      >
        <span>{loading ? loadingLabel : label}</span>
        <AnimatePresence mode="wait" initial={false}>
          {loading ? (
            <motion.span
              key="spinner"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.12 }}
            >
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            </motion.span>
          ) : (
            <motion.span
              key="arrow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
            >
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </AuthItem>
  );
}

export function AuthSwitch({
  prompt,
  to,
  label,
}: {
  prompt: string;
  to: "/login" | "/registro";
  label: string;
}) {
  return (
    <AuthItem className="mt-5">
      <p className="text-center text-xs text-muted-foreground">
        {prompt}{" "}
        <Link to={to} className="font-bold text-primary underline-offset-4 hover:underline">
          {label}
        </Link>
      </p>
    </AuthItem>
  );
}
