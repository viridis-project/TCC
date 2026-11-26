import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { MotionConfig, motion, AnimatePresence } from "motion/react";
import { Sprout, EyeOff, Eye, Loader2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { A as AuthBrandPanel } from "./auth-brand-panel-Csh7AqVc.js";
import { k as cn } from "./router-eJvIn0Kb.js";
const ease = [0.22, 1, 0.36, 1];
const authStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } }
};
const authItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } }
};
function AuthItem({ className, children }) {
  return /* @__PURE__ */ jsx(motion.div, { variants: authItem, className, children });
}
function AuthLayout({
  panelSide,
  eyebrow,
  title,
  description,
  children
}) {
  const panelOnRight = panelSide === "right";
  return /* @__PURE__ */ jsx(MotionConfig, { reducedMotion: "user", children: /* @__PURE__ */ jsxs("div", { className: "auth-shell grid lg:grid-cols-2", children: [
    /* @__PURE__ */ jsx(
      AuthBrandPanel,
      {
        side: panelSide,
        eyebrow,
        title,
        description,
        className: panelOnRight ? "lg:order-2" : "lg:order-1"
      }
    ),
    /* @__PURE__ */ jsx(
      motion.section,
      {
        initial: { opacity: 0, x: panelOnRight ? -24 : 24 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.55, ease },
        className: cn(
          "flex flex-col justify-center px-6 py-10 sm:px-12 lg:min-h-screen lg:px-16 lg:py-12 xl:px-24",
          panelOnRight ? "lg:order-1" : "lg:order-2"
        ),
        children: /* @__PURE__ */ jsx(
          motion.div,
          {
            variants: authStagger,
            initial: "hidden",
            animate: "show",
            className: "mx-auto w-full max-w-sm sm:max-w-md lg:mx-0 lg:max-w-sm",
            children
          }
        )
      }
    )
  ] }) });
}
function AuthLogo() {
  return /* @__PURE__ */ jsx(AuthItem, { children: /* @__PURE__ */ jsxs(
    Link,
    {
      to: "/",
      className: "inline-flex items-center gap-3 rounded-xl",
      "aria-label": "Viridis — início",
      children: [
        /* @__PURE__ */ jsx(
          motion.div,
          {
            whileHover: { rotate: -6, scale: 1.04 },
            transition: { type: "spring", stiffness: 300, damping: 18 },
            className: "grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft",
            children: /* @__PURE__ */ jsx(Sprout, { className: "h-5 w-5", "aria-hidden": "true" })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "leading-tight", children: [
          /* @__PURE__ */ jsx("div", { className: "font-display text-base font-extrabold tracking-tight", children: "VIRIDIS" }),
          /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium uppercase tracking-wide text-muted-foreground", children: "Cultivando Sustentabilidade" })
        ] })
      ]
    }
  ) });
}
function AuthHeading({ title, description }) {
  return /* @__PURE__ */ jsxs(AuthItem, { className: "mt-9 sm:mt-12", children: [
    /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl", children: title }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm leading-relaxed text-muted-foreground", children: description })
  ] });
}
function AuthField({
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
}) {
  const [shown, setShown] = useState(false);
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : void 0;
  return /* @__PURE__ */ jsxs(AuthItem, { children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-1.5 flex min-h-5 items-center justify-between", children: [
      /* @__PURE__ */ jsx("label", { htmlFor: id, className: "text-xs font-semibold text-foreground", children: label }),
      labelAside
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          ...inputProps,
          id,
          type: reveal ? shown ? "text" : "password" : type,
          "aria-invalid": error ? true : void 0,
          "aria-describedby": describedBy,
          className: cn("auth-input", reveal && "pr-12", className)
        }
      ),
      reveal && /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setShown((v) => !v),
          className: "absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
          "aria-label": shown ? "Ocultar senha" : "Mostrar senha",
          "aria-pressed": shown,
          children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsx(
            motion.span,
            {
              initial: { opacity: 0, scale: 0.7 },
              animate: { opacity: 1, scale: 1 },
              exit: { opacity: 0, scale: 0.7 },
              transition: { duration: 0.12 },
              className: "grid place-items-center",
              children: shown ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
            },
            shown ? "off" : "on"
          ) })
        }
      )
    ] }),
    below,
    /* @__PURE__ */ jsx(AnimatePresence, { initial: false, mode: "wait", children: error ? /* @__PURE__ */ jsx(
      motion.p,
      {
        id: `${id}-error`,
        role: "alert",
        initial: { opacity: 0, y: -4 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0 },
        transition: { duration: 0.18 },
        className: "mt-1.5 text-[11px] font-medium text-destructive",
        children: error
      },
      "error"
    ) : hint ? /* @__PURE__ */ jsx("p", { id: `${id}-hint`, className: "mt-1.5 text-[11px] text-muted-foreground", children: hint }, "hint") : null })
  ] });
}
function AuthSubmit({
  loading,
  label,
  loadingLabel
}) {
  return /* @__PURE__ */ jsx(AuthItem, { className: "pt-2", children: /* @__PURE__ */ jsxs(
    motion.button,
    {
      type: "submit",
      disabled: loading,
      "aria-busy": loading,
      whileHover: loading ? void 0 : { y: -1 },
      whileTap: loading ? void 0 : { scale: 0.985 },
      transition: { duration: 0.15 },
      className: "group flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-[background-color,box-shadow] hover:bg-[var(--primary-hover)] hover:shadow-elevated active:bg-[var(--primary-active)] disabled:cursor-wait disabled:opacity-80",
      children: [
        /* @__PURE__ */ jsx("span", { children: loading ? loadingLabel : label }),
        /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", initial: false, children: loading ? /* @__PURE__ */ jsx(
          motion.span,
          {
            initial: { opacity: 0, scale: 0.6 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.6 },
            transition: { duration: 0.12 },
            children: /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin", "aria-hidden": "true" })
          },
          "spinner"
        ) : /* @__PURE__ */ jsx(
          motion.span,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.12 },
            children: /* @__PURE__ */ jsx(
              ArrowRight,
              {
                className: "h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5",
                "aria-hidden": "true"
              }
            )
          },
          "arrow"
        ) })
      ]
    }
  ) });
}
function AuthSwitch({
  prompt,
  to,
  label
}) {
  return /* @__PURE__ */ jsx(AuthItem, { className: "mt-5", children: /* @__PURE__ */ jsxs("p", { className: "text-center text-xs text-muted-foreground", children: [
    prompt,
    " ",
    /* @__PURE__ */ jsx(Link, { to, className: "font-bold text-primary underline-offset-4 hover:underline", children: label })
  ] }) });
}
export {
  AuthLayout as A,
  AuthLogo as a,
  AuthHeading as b,
  AuthField as c,
  AuthSubmit as d,
  AuthSwitch as e
};
