import { Leaf, Sprout } from "lucide-react";

export function AuthBrandPanel({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <aside className="auth-panel relative hidden overflow-hidden lg:flex lg:min-h-screen lg:flex-col lg:justify-between lg:p-12 xl:p-16">
      <div className="relative z-10 flex items-center gap-2 text-sm font-semibold">
        <Sprout className="h-5 w-5" aria-hidden="true" /> Viridis
      </div>
      <div className="relative z-10 max-w-lg">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/65">
          {eyebrow}
        </div>
        <h2 className="mt-4 text-3xl font-bold leading-tight xl:text-4xl">{title}</h2>
        <p className="mt-4 text-sm leading-relaxed text-white/75">{description}</p>
      </div>
      <div className="relative z-10 flex items-center gap-3 border-t border-white/15 pt-6 text-xs text-white/60">
        <Leaf className="h-4 w-4" aria-hidden="true" /> Educação, cultivo e impacto no mesmo lugar.
      </div>
    </aside>
  );
}
