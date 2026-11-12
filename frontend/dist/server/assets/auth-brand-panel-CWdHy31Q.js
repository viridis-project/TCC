import { jsxs, jsx } from "react/jsx-runtime";
import { Sprout, Leaf } from "lucide-react";
function AuthBrandPanel({
  eyebrow,
  title,
  description
}) {
  return /* @__PURE__ */ jsxs("aside", { className: "auth-panel relative hidden overflow-hidden lg:flex lg:min-h-screen lg:flex-col lg:justify-between lg:p-12 xl:p-16", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center gap-2 text-sm font-semibold", children: [
      /* @__PURE__ */ jsx(Sprout, { className: "h-5 w-5", "aria-hidden": "true" }),
      " Viridis"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 max-w-lg", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-white/65", children: eyebrow }),
      /* @__PURE__ */ jsx("h2", { className: "mt-4 text-3xl font-bold leading-tight xl:text-4xl", children: title }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm leading-relaxed text-white/75", children: description })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center gap-3 border-t border-white/15 pt-6 text-xs text-white/60", children: [
      /* @__PURE__ */ jsx(Leaf, { className: "h-4 w-4", "aria-hidden": "true" }),
      " Educação, cultivo e impacto no mesmo lugar."
    ] })
  ] });
}
export {
  AuthBrandPanel as A
};
