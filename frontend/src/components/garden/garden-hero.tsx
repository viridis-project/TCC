import { motion } from "motion/react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { CountUp, EASE } from "./garden-ui";

type Point = { key: string; month: string; value: number };

export function GardenHero({
  firstName,
  points,
  growth,
  evolution,
}: {
  firstName: string;
  points: number;
  growth: Point[];
  evolution: number | null;
}) {
  const thisMonth = growth[growth.length - 1]?.value ?? 0;
  const Trend =
    evolution === null ? Minus : evolution > 0 ? TrendingUp : evolution < 0 ? TrendingDown : Minus;
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      aria-labelledby="garden-welcome"
      className="relative overflow-hidden rounded-3xl bg-gradient-garden p-5 text-white shadow-elevated sm:p-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-lime/15 blur-3xl"
      />
      <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.4fr] lg:gap-8">
        <div className="min-w-0">
          <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-mint/80">
            Meu painel do jardim
          </div>
          <h1 id="garden-welcome" className="mt-1 break-words text-2xl font-extrabold sm:text-4xl">
            Bem-vindo(a) de volta, {firstName}!
          </h1>
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            className="mt-5 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm sm:mt-6 sm:p-5"
          >
            <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-mint/80">
              Pontos totais
            </div>
            <div className="mt-1 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
              <CountUp
                value={points}
                className="text-4xl font-extrabold tracking-tight tabular-nums sm:text-5xl"
              />
              <div
                className="flex items-center gap-1.5 text-sm font-bold text-lime"
                title="Pontos aprovados neste mês em relação ao mês anterior"
              >
                <Trend className="h-4 w-4" aria-hidden="true" />
                {evolution === null ? (
                  <span>{thisMonth.toLocaleString("pt-BR")} pts neste mês</span>
                ) : (
                  <span>
                    {evolution > 0 ? "+" : ""}
                    {evolution}%<span className="sr-only"> em relação ao mês anterior</span>
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="min-w-0">
          <div className="text-xs font-semibold text-white/80">
            Crescimento nos últimos 5 meses
            <span className="ml-1.5 font-normal text-white/55">· pontos aprovados por mês</span>
          </div>
          <div
            className="mt-2 h-44 sm:h-52"
            role="img"
            aria-label="Gráfico de pontos aprovados nos últimos 5 meses"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growth} margin={{ top: 10, right: 12, bottom: 0, left: -18 }}>
                <defs>
                  <linearGradient id="gardenGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8bc34a" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#8bc34a" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  stroke="rgba(255,255,255,.65)"
                  fontSize={11}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="rgba(255,255,255,.5)"
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ stroke: "rgba(255,255,255,.35)" }}
                  formatter={(v) => [`${Number(v).toLocaleString("pt-BR")} pts`, "Aprovados"]}
                  contentStyle={{
                    background: "rgba(14,40,26,.92)",
                    border: "none",
                    borderRadius: 12,
                    color: "white",
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "#c5e9ae" }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8bc34a"
                  strokeWidth={2.5}
                  fill="url(#gardenGrowth)"
                  dot={{ r: 3.5, fill: "#fff", stroke: "#8bc34a", strokeWidth: 2 }}
                  activeDot={{ r: 5.5, fill: "#fff", stroke: "#8bc34a", strokeWidth: 2 }}
                  isAnimationActive
                  animationDuration={900}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
