import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Camera, Upload, X } from "lucide-react";
import { D as Dialog, b as DialogContent, d as DialogHeader, e as DialogTitle, f as DialogDescription, g as DialogFooter, a as apiFetch } from "./router-_glEtDMC.js";
import { toast } from "sonner";
function SubmitProofModal({
  mission,
  onOpenChange,
  onSubmitted
}) {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    if (!mission) return;
    if (description.trim().length < 5) {
      toast.error("Descreva o que foi feito com pelo menos 5 caracteres");
      return;
    }
    if (!file) return toast.error("Envie uma foto da missão");
    const form = new FormData();
    form.append("missao_id", String(mission.id));
    form.append("descricao", description.trim());
    form.append("foto", file);
    setSubmitting(true);
    try {
      const result = await apiFetch("/submissoes", {
        method: "POST",
        body: form
      });
      toast.success(result.mensagem, {
        description: `+${mission.pontos} pontos${mission.equipe ? " para cada integrante" : ""} após aprovação do professor`
      });
      setDescription("");
      setFile(null);
      onOpenChange(false);
      onSubmitted?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível enviar a comprovação");
    } finally {
      setSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsx(Dialog, { open: !!mission, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-lg overflow-hidden rounded-xl border-border/60 p-0 sm:p-0", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-gradient-hero p-6 text-primary-foreground", children: /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsx(DialogTitle, { className: "text-xl font-bold", children: "Enviar comprovação" }),
      /* @__PURE__ */ jsx(DialogDescription, { className: "text-white/80", children: mission ? `${mission.titulo} · +${mission.pontos} pts` : "" })
    ] }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-5 p-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-bold uppercase tracking-wide text-muted-foreground", children: "Descrição" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: description,
            onChange: (e) => setDescription(e.target.value),
            maxLength: 280,
            rows: 3,
            placeholder: "Conte o que vocês fizeram...",
            className: "mt-1 w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "mt-1 text-right text-[10px] text-muted-foreground", children: [
          description.length,
          "/280"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs font-bold uppercase tracking-wide text-muted-foreground", children: "Foto comprovante" }),
        /* @__PURE__ */ jsxs("label", { className: "mt-1 flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-border bg-background/60 p-4 hover:border-primary/50 hover:bg-primary/5", children: [
          /* @__PURE__ */ jsx("div", { className: "grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary", children: file ? /* @__PURE__ */ jsx(Camera, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(Upload, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "truncate text-sm font-bold text-foreground", children: file ? file.name : "Clique para enviar uma foto" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "PNG, JPG ou WebP até 5MB" })
          ] }),
          file && /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              "aria-label": "Remover foto",
              onClick: (e) => {
                e.preventDefault();
                setFile(null);
              },
              className: "grid h-7 w-7 place-items-center rounded-full bg-muted text-muted-foreground hover:bg-destructive hover:text-destructive-foreground",
              children: /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" })
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "file",
              accept: "image/*",
              className: "hidden",
              onChange: (e) => setFile(e.target.files?.[0] ?? null)
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { className: "gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => onOpenChange(false),
            className: "min-h-11 rounded-lg border border-border bg-background px-4 py-2 text-sm font-bold text-foreground hover:bg-muted",
            children: "Cancelar"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: submitting,
            className: "min-h-11 rounded-lg bg-primary px-5 py-2 text-sm font-bold text-primary-foreground shadow-soft hover:bg-primary/90 disabled:opacity-60",
            children: submitting ? "Enviando..." : "Enviar para verificação"
          }
        )
      ] })
    ] })
  ] }) });
}
export {
  SubmitProofModal as S
};
