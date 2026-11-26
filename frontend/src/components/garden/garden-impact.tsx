import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Droplets, Leaf, Sprout, Sun, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { GardenCard, SectionTitle } from "./garden-ui";

export type GardenSummary = {
  plantas_ativas: number;
  litros_economizados: number;
  kg_residuos_reciclados: number;
  kg_co2_reduzido: number;
  atividades_por_tipo: Record<string, number>;
};

const PIE_COLORS = ["#135934", "#8bc34a", "#d6a84f"];
const TYPE_LABEL: Record<string, string> = {
  plant: "Plantio",
  water: "Rega",
  compost: "Composto",
  share: "Partilha",
};

export function GardenImpact({ summary }: { summary: GardenSummary }) {
  const stats: { icon: LucideIcon; label: string; value: number; tile: string }[] = [
    {
      icon: Sprout,
      label: "Plantas ativas",
      value: summary.plantas_ativas,
      tile: "bg-mint/60 text-moss",
    },
    {
      icon: Droplets,
      label: "Litros economizados",
      value: summary.litros_economizados,
      tile: "bg-info/15 text-info",
    },
    {
      icon: Leaf,
      label: "Resíduos reciclados (kg)",
      value: summary.kg_residuos_reciclados,
      tile: "bg-lime/25 text-moss",
    },
    {
      icon: Sun,
      label: "kg CO₂ reduzido",
      value: summary.kg_co2_reduzido,
      tile: "bg-warning/20 text-foreground",
    },
  ];
  const activity = Object.entries(summary.atividades_por_tipo).map(([name, value]) => ({
    name: TYPE_LABEL[name] ?? name,
    value,
  }));
  const impact = [
    { name: "CO₂ reduzido", value: summary.kg_co2_reduzido },
    { name: "Água economizada", value: summary.litros_economizados },
    { name: "Resíduos reciclados", value: summary.kg_residuos_reciclados },
  ];
  const hasActivity = activity.some((a) => a.value > 0);
  const hasImpact = impact.some((a) => a.value > 0);
  return (
    <GardenCard aria-labelledby="impact-title" delay={0.05}>
      <SectionTitle id="impact-title">Resumo do jardim</SectionTitle>
      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -2 }}
            className="rounded-xl border border-border/60 bg-background/70 p-3 text-center transition-colors hover:border-forest/30"
          >
            <div className={cn("mx-auto grid h-10 w-10 place-items-center rounded-xl", s.tile)}>
              <s.icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="mt-2 text-xl font-bold tabular-nums text-foreground">
              {Number(s.value).toLocaleString("pt-BR")}
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="min-w-0">
          <div className="text-xs font-semibold text-muted-foreground">
            Atividades aprovadas por tipo
          </div>
          {hasActivity ? (
            <div
              className="mt-2 h-44"
              role="img"
              aria-label="Gráfico de atividades aprovadas por tipo"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activity} margin={{ top: 4, right: 4, bottom: 0, left: -22 }}>
                  <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis fontSize={10} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: "rgba(197,233,174,.25)" }}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--color-border)",
                      fontSize: 12,
                    }}
                  />
                  <Bar
                    dataKey="value"
                    name="Aprovadas"
                    fill="#135934"
                    radius={[8, 8, 0, 0]}
                    animationDuration={800}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="mt-2 rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
              Nenhuma atividade aprovada ainda.
            </p>
          )}
        </div>
        <div className="min-w-0">
          <div className="text-xs font-semibold text-muted-foreground">Impacto sustentável</div>
          {hasImpact ? (
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <div
                className="h-36 w-36 shrink-0"
                role="img"
                aria-label="Gráfico de impacto sustentável"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={impact}
                      dataKey="value"
                      innerRadius={36}
                      outerRadius={62}
                      paddingAngle={3}
                      animationDuration={800}
                    >
                      {impact.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="min-w-0 space-y-1.5 text-xs">
                {impact.map((d, i) => (
                  <li key={d.name} className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: PIE_COLORS[i] }}
                    />
                    <span className="text-muted-foreground">{d.name}</span>
                    <span className="font-bold text-foreground">{d.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-2 rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
              O impacto aparece quando suas atividades forem aprovadas.
            </p>
          )}
        </div>
      </div>
    </GardenCard>
  );
}
