import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Award, Building2, Globe2, Sparkles, Tag } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { RedeemRewardModal, type Reward } from "@/components/modals/redeem-reward-modal";
import { apiFetch, isBrowser, userQuery } from "@/lib/api";

export const Route = createFileRoute("/recompensas")({
  head: () => ({ meta: [{ title: "Recompensas — Viridis" }] }),
  component: RewardsPage,
});

function RewardsPage() {
  const [selected, setSelected] = useState<Reward | null>(null);
  const queryClient = useQueryClient();
  const { data: user, isLoading: loadingUser, error: userError } = useQuery(userQuery());
  const { data: rewards = [], isLoading, error } = useQuery({
    queryKey: ["recompensas"], enabled: isBrowser, retry: false,
    queryFn: async () => {
      const result = await apiFetch<{ recompensas: {id:number;titulo:string;pontos:number;imagem:string|null;parceiro:string;escopo:"app"|"escola"}[] }>("/recompensas");
      return result.recompensas.map((r) => ({ id:r.id,title:r.titulo,points:Number(r.pontos),image:r.imagem ?? "🎁",partner:r.parceiro,scope:r.escopo }));
    },
  });
  const points = Number(user?.pontos_totais ?? 0);
  if (loadingUser || isLoading) return <PageShell><div className="p-16 text-center text-muted-foreground">Carregando recompensas...</div></PageShell>;
  if (userError || error || !user) return <PageShell><div className="p-16 text-center text-destructive">{userError?.message ?? error?.message ?? "Faça login para continuar"}</div></PageShell>;

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl bg-gradient-hero p-6 text-primary-foreground shadow-elevated sm:p-8"
        >
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/70">
                <Award className="h-3.5 w-3.5" /> Loja de Recompensas
              </div>
              <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">Resgate prêmios de parceiros locais</h1>
              <p className="mt-1 text-sm text-white/80">Cada ponto cultivado vira impacto real na sua comunidade.</p>
            </div>
            <div className="shrink-0 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-right backdrop-blur-sm">
              <div className="text-[11px] uppercase tracking-widest text-white/70">Seus pontos</div>
              <div className="text-2xl font-extrabold">{points.toLocaleString("pt-BR")}</div>
            </div>
          </div>
        </motion.section>

        <RewardSection
          title="Recompensas da sua escola"
          description="Benefícios oferecidos exclusivamente pela sua comunidade escolar."
          icon={Building2}
          rewards={rewards.filter((reward) => reward.scope === "escola")}
          points={points}
          onSelect={setSelected}
        />
        <RewardSection
          title="Recompensas gerais"
          description="Prêmios disponíveis para toda a comunidade Viridis."
          icon={Globe2}
          rewards={rewards.filter((reward) => reward.scope !== "escola")}
          points={points}
          onSelect={setSelected}
        />
      </div>

      <RedeemRewardModal
        reward={selected}
        userPoints={points}
        onOpenChange={(v) => !v && setSelected(null)}
        onConfirm={async (reward) => {
          await apiFetch("/resgates", { method:"POST", body:JSON.stringify({ recompensa_id:reward.id }) });
          await queryClient.invalidateQueries({ queryKey:["perfil"] });
        }}
      />
    </PageShell>
  );
}

function RewardSection({title,description,icon:Icon,rewards,points,onSelect}:{title:string;description:string;icon:typeof Building2;rewards:Reward[];points:number;onSelect:(reward:Reward)=>void}) {
  return <section className="mt-8">
    <div className="mb-4 flex items-start gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
      <div><h2 className="text-xl font-extrabold text-foreground">{title}</h2><p className="text-sm text-muted-foreground">{description}</p></div>
    </div>
    {rewards.length===0 ? <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Nenhuma recompensa disponível nesta categoria.</div> :
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rewards.map((r, i) => {
            const can = points >= r.points;
            return (
              <motion.article
                key={r.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -5 }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft transition-shadow hover:shadow-elevated"
              >
                <div className="relative grid h-36 place-items-center bg-gradient-to-b from-success/20 to-success/5 text-6xl">
                  <motion.span whileHover={{ scale: 1.15, rotate: -4 }}>{r.image}</motion.span>
                  <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-bold text-primary-foreground">
                    {r.scope === "escola" ? <Building2 className="h-3 w-3" /> : <Globe2 className="h-3 w-3" />}
                    {r.scope === "escola" ? "Escola" : "Viridis"}
                  </div>
                  <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-[10px] font-bold text-foreground backdrop-blur-sm">
                    <Tag className="h-3 w-3" /> {r.partner}
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <h3 className="text-base font-bold text-foreground">{r.title}</h3>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2.5 py-1 text-xs font-extrabold text-warning">
                      <Sparkles className="h-3.5 w-3.5" /> {r.points} pts
                    </div>
                    <button
                      disabled={!can}
                      onClick={() => onSelect(r)}
                      className="rounded-full bg-primary px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-primary-foreground shadow-soft transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
                    >
                      {can ? "Resgatar" : "Pontos insuficientes"}
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>}
  </section>;
}
