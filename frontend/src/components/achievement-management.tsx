import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Award,
  BookOpen,
  Bug,
  Flame,
  Leaf,
  Medal,
  Plus,
  Recycle,
  Sprout,
  Star,
  Trophy,
} from "lucide-react";
import { apiFetch, isBrowser } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type Achievement = {
  id: number;
  titulo: string;
  descricao: string;
  icone: string;
  regra: string;
};

type ModuleOption = { id: number; titulo: string; curso: string };
type RuleType = "licoes" | "streak" | "modulo_completo" | "todos_modulos" | "ranking";

const iconOptions = [
  { value: "Sprout", label: "Broto", Icon: Sprout },
  { value: "Recycle", label: "Reciclagem", Icon: Recycle },
  { value: "Flame", label: "Chama", Icon: Flame },
  { value: "Bug", label: "Inseto", Icon: Bug },
  { value: "Trophy", label: "Troféu", Icon: Trophy },
  { value: "Medal", label: "Medalha", Icon: Medal },
  { value: "BookOpen", label: "Livro", Icon: BookOpen },
  { value: "Award", label: "Prêmio", Icon: Award },
  { value: "Star", label: "Estrela", Icon: Star },
  { value: "Leaf", label: "Folha", Icon: Leaf },
] as const;

const iconMap = Object.fromEntries(iconOptions.map(({ value, Icon }) => [value, Icon]));
const inputClass =
  "min-h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-shadow focus:border-primary focus:ring-2 focus:ring-primary/20 aria-invalid:border-destructive aria-invalid:ring-destructive/15";

function ruleDescription(rule: string, modules: ModuleOption[]) {
  const [type, value] = rule.split(":");
  if (type === "licoes") return `Concluir ${value} ${value === "1" ? "lição" : "lições"}`;
  if (type === "streak") return `Manter uma sequência de ${value} dias`;
  if (type === "ranking") return `Alcançar o Top ${value} do ranking individual`;
  if (type === "todos_modulos") return "Concluir todos os módulos disponíveis";
  if (type === "modulo_completo") {
    const module = modules.find((item) => item.id === Number(value));
    return module ? `Concluir ${module.titulo}` : `Concluir o módulo ${value}`;
  }
  return rule;
}

export function AchievementManagement() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const key = ["admin-conquistas"] as const;
  const { data, isLoading, error } = useQuery({
    queryKey: key,
    enabled: isBrowser,
    queryFn: () =>
      apiFetch<{ conquistas: Achievement[]; modulos: ModuleOption[] }>("/admin/conquistas"),
  });

  if (isLoading) {
    return <div className="p-6 text-center text-muted-foreground">Carregando conquistas...</div>;
  }
  if (error || !data) {
    return (
      <div className="p-6 text-center text-destructive">
        {error?.message ?? "Não foi possível carregar as conquistas"}
      </div>
    );
  }

  return (
    <section className="rounded-lg border border-border/60 bg-card p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
            <Medal aria-hidden="true" className="size-4 text-primary" /> Conquistas
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Defina objetivos que serão liberados automaticamente para os alunos.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-ring"
        >
          <Plus aria-hidden="true" className="size-4" /> Nova conquista
        </button>
      </div>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.conquistas.map((achievement) => {
          const Icon = iconMap[achievement.icone] ?? Medal;
          return (
            <li
              key={achievement.id}
              className="flex gap-3 rounded-lg border border-border/60 bg-background/60 p-4"
            >
              <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <Icon aria-hidden="true" className="size-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold">{achievement.titulo}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{achievement.descricao}</p>
                <p className="mt-2 text-xs font-semibold text-primary">
                  {ruleDescription(achievement.regra, data.modulos)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <AchievementForm
        open={open}
        onOpenChange={setOpen}
        modules={data.modulos}
        onCreated={() => queryClient.invalidateQueries({ queryKey: key })}
      />
    </section>
  );
}

function AchievementForm({
  open,
  onOpenChange,
  modules,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modules: ModuleOption[];
  onCreated: () => Promise<unknown>;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Sprout");
  const [ruleType, setRuleType] = useState<RuleType>("licoes");
  const [target, setTarget] = useState("1");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const errorSummary = useRef<HTMLDivElement>(null);

  const reset = () => {
    setTitle("");
    setDescription("");
    setIcon("Sprout");
    setRuleType("licoes");
    setTarget("1");
    setErrors({});
  };

  const create = useMutation({
    mutationFn: () =>
      apiFetch<{ mensagem: string }>("/admin/conquistas", {
        method: "POST",
        body: JSON.stringify({
          titulo: title.trim(),
          descricao: description.trim(),
          icone: icon,
          tipo_regra: ruleType,
          meta: ruleType === "todos_modulos" ? null : Number(target),
        }),
      }),
    onSuccess: async (result) => {
      toast.success(result.mensagem);
      await onCreated();
      onOpenChange(false);
      reset();
    },
    onError: (mutationError) => setErrors({ form: mutationError.message }),
  });

  function validate() {
    const next: Record<string, string> = {};
    if (title.trim().length < 3) next.title = "Digite pelo menos 3 caracteres.";
    if (description.trim().length < 5) next.description = "Digite pelo menos 5 caracteres.";
    if (ruleType !== "todos_modulos" && (!target || Number(target) < 1)) {
      next.target =
        ruleType === "modulo_completo" ? "Escolha um módulo." : "Informe uma meta válida.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) {
      requestAnimationFrame(() => errorSummary.current?.focus());
      return false;
    }
    return true;
  }

  const SelectedIcon = iconMap[icon] ?? Medal;
  const targetLabel =
    ruleType === "streak"
      ? "Quantidade de dias"
      : ruleType === "ranking"
        ? "Posição máxima"
        : "Quantidade de lições";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next && !create.isPending) reset();
      }}
    >
      <DialogContent className="max-h-[calc(100dvh-1.5rem)] max-w-xl overflow-y-auto rounded-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SelectedIcon aria-hidden="true" className="size-5 text-primary" /> Nova conquista
          </DialogTitle>
          <DialogDescription>
            A conquista aparecerá no Jardim e será liberada quando o aluno atingir o objetivo.
          </DialogDescription>
        </DialogHeader>

        <form
          noValidate
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (validate()) create.mutate();
          }}
        >
          {Object.keys(errors).length > 0 && (
            <div
              ref={errorSummary}
              tabIndex={-1}
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive outline-none focus:ring-2 focus:ring-destructive/30"
            >
              {errors.form ?? "Revise os campos indicados antes de criar a conquista."}
            </div>
          )}

          <Field label="Título" error={errors.title} htmlFor="achievement-title">
            <input
              id="achievement-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={100}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "achievement-title-error" : undefined}
              className={inputClass}
            />
          </Field>

          <Field label="Descrição" error={errors.description} htmlFor="achievement-description">
            <textarea
              id="achievement-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={255}
              rows={3}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? "achievement-description-error" : undefined}
              className={inputClass}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ícone" htmlFor="achievement-icon">
              <select
                id="achievement-icon"
                value={icon}
                onChange={(event) => setIcon(event.target.value)}
                className={inputClass}
              >
                {iconOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Critério" htmlFor="achievement-rule">
              <select
                id="achievement-rule"
                value={ruleType}
                onChange={(event) => {
                  const next = event.target.value as RuleType;
                  setRuleType(next);
                  setTarget(next === "modulo_completo" ? String(modules[0]?.id ?? "") : "1");
                  setErrors({});
                }}
                className={inputClass}
              >
                <option value="licoes">Lições concluídas</option>
                <option value="streak">Sequência de estudos</option>
                <option value="modulo_completo">Módulo concluído</option>
                <option value="todos_modulos">Todos os módulos</option>
                <option value="ranking">Posição no ranking</option>
              </select>
            </Field>
          </div>

          {ruleType === "modulo_completo" ? (
            <Field label="Módulo" error={errors.target} htmlFor="achievement-target">
              <select
                id="achievement-target"
                value={target}
                onChange={(event) => setTarget(event.target.value)}
                aria-invalid={Boolean(errors.target)}
                aria-describedby={errors.target ? "achievement-target-error" : undefined}
                className={inputClass}
              >
                {modules.length === 0 && <option value="">Nenhum módulo geral publicado</option>}
                {modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.titulo} · {module.curso}
                  </option>
                ))}
              </select>
            </Field>
          ) : ruleType !== "todos_modulos" ? (
            <Field label={targetLabel} error={errors.target} htmlFor="achievement-target">
              <input
                id="achievement-target"
                type="number"
                min={1}
                max={ruleType === "ranking" ? 100 : ruleType === "streak" ? 3650 : 10000}
                value={target}
                onChange={(event) => setTarget(event.target.value)}
                aria-invalid={Boolean(errors.target)}
                aria-describedby={errors.target ? "achievement-target-error" : undefined}
                className={inputClass}
              />
            </Field>
          ) : (
            <p className="rounded-lg bg-primary/5 p-3 text-sm text-muted-foreground">
              O aluno desbloqueará esta conquista ao concluir todos os módulos disponíveis para ele.
            </p>
          )}

          <DialogFooter className="grid grid-cols-2 gap-2 space-x-0 sm:space-x-0">
            <button
              type="button"
              disabled={create.isPending}
              onClick={() => onOpenChange(false)}
              className="min-h-11 rounded-lg border border-border px-4 text-sm font-bold disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={create.isPending}
              className="min-h-11 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground disabled:opacity-60"
            >
              {create.isPending ? "Criando..." : "Criar conquista"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-bold uppercase tracking-wide">
        {label}
      </label>
      {children}
      {error && (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="mt-1.5 text-xs font-medium text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}
