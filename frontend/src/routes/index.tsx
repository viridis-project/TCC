import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Sprout, BookOpen, TrendingUp, Award, Users, Target, ArrowRight,
  Leaf, GraduationCap, ShieldCheck,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Viridis — Plataforma gamificada de hortas escolares" },
      { name: "description", content: "Educação socioemocional, nutrição e sustentabilidade através de hortas escolares interativas." },
      { property: "og:title", content: "Viridis — Cultivando sustentabilidade" },
      { property: "og:description", content: "Plataforma gamificada para hortas escolares." },
    ],
  }),
  component: HomePage,
});

const stats = [
  { value: "24", label: "Plantas" },
  { value: "186", label: "Alunos" },
  { value: "77K", label: "Pontos" },
];

const sdg = [
  { num: "2", title: "Fome Zero e Agricultura Sustentável", color: "bg-warning text-warning-foreground" },
  { num: "3", title: "Saúde e Bem-Estar", color: "bg-success text-success-foreground" },
  { num: "4", title: "Educação de Qualidade", color: "bg-destructive text-destructive-foreground" },
  { num: "12", title: "Consumo e Produção Responsáveis", color: "bg-[oklch(0.62_0.14_60)] text-white" },
  { num: "15", title: "Vida Terrestre", color: "bg-[oklch(0.62_0.20_140)] text-white" },
];

const features = [
  { icon: Sprout, color: "bg-success/15 text-success", title: "Aprendizado Gamificado", desc: "Sistema de pontos, rankings e certificados estilo Duolingo para engajar estudantes." },
  { icon: BookOpen, color: "bg-success/15 text-success", title: "Módulos Educacionais", desc: "Conteúdo sobre plantio, nutrição, compostagem e controle de pragas." },
  { icon: TrendingUp, color: "bg-info/15 text-info", title: "Métricas de Impacto", desc: "Acompanhamento de crescimento, sustentabilidade e redução de CO₂." },
  { icon: Award, color: "bg-warning/15 text-warning", title: "Loja de Recompensas", desc: "Parcerias locais oferecem prêmios resgatáveis com pontos." },
  { icon: Users, color: "bg-[oklch(0.55_0.20_300)]/15 text-[oklch(0.55_0.20_300)]", title: "Gestão Educacional", desc: "Ferramentas para professores aprovarem atividades e acompanharem turmas." },
  { icon: Target, color: "bg-destructive/15 text-destructive", title: "Análise Institucional", desc: "Dashboard completo para administradores com estatísticas globais." },
];

const profiles = [
  { emoji: "🎓", icon: GraduationCap, title: "ESTUDANTES", desc: "Aprendem sobre sustentabilidade, acumulam pontos, competem em rankings e resgatam recompensas." },
  { emoji: "👩‍🏫", icon: BookOpen, title: "PROFESSORES", desc: "Aprovam atividades dos alunos, acompanham desempenho das turmas e gerenciam conteúdo." },
  { emoji: "💼", icon: ShieldCheck, title: "ADMINISTRADORES", desc: "Visualizam métricas institucionais, gerenciam parcerias e monitoram impacto dos ODS." },
];

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function HomePage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 text-primary-foreground shadow-elevated sm:p-12">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-glow/30 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[auto_1fr]">
            <motion.div
              initial={{ scale: 0.6, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 140, damping: 16 }}
              className="grid h-28 w-28 shrink-0 place-items-center rounded-3xl bg-white/15 backdrop-blur-sm"
            >
              <Leaf className="h-14 w-14" />
            </motion.div>
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl"
              >
                VIRIDIS — Cultivando Sustentabilidade
              </motion.h1>
              <p className="mt-3 max-w-2xl text-sm text-primary-foreground/80 sm:text-base">
                Plataforma gamificada para hortas escolares com foco em aprendizagem socioemocional, nutrição e sustentabilidade.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/aprender" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary shadow-soft transition-transform hover:scale-[1.02]">
                  Começar a aprender <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/jardim" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20">
                  Ver meu jardim
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-sm"
                  >
                    <div className="text-2xl font-extrabold">{s.value}</div>
                    <div className="text-[11px] uppercase tracking-widest text-white/70">{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Missão */}
        <FadeIn>
          <section className="mt-8 rounded-3xl border border-border/60 bg-card p-8 text-center shadow-soft sm:p-10">
            <h2 className="text-2xl font-extrabold text-primary sm:text-3xl">Nossa Missão</h2>
            <p className="mx-auto mt-3 max-w-3xl text-sm text-muted-foreground sm:text-base">
              Transformar a educação através de hortas escolares interativas, promovendo sustentabilidade, nutrição e
              consciência ambiental entre estudantes, professores e comunidades.
            </p>
          </section>
        </FadeIn>

        {/* ODS */}
        <FadeIn>
          <section className="mt-8 rounded-3xl border border-border/60 bg-card p-8 shadow-soft sm:p-10">
            <h2 className="text-center text-2xl font-extrabold text-primary sm:text-3xl">Objetivos de Desenvolvimento Sustentável</h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">O Viridis contribui diretamente para os ODS da ONU</p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {sdg.map((g, i) => (
                <motion.div
                  key={g.num}
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -4 }}
                  className={`flex aspect-square flex-col justify-between rounded-2xl p-4 shadow-soft ${g.color}`}
                >
                  <div className="text-3xl font-extrabold leading-none">{g.num}</div>
                  <div className="text-xs font-semibold leading-snug">{g.title}</div>
                </motion.div>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* Funcionalidades */}
        <FadeIn>
          <section className="mt-10">
            <h2 className="text-center text-2xl font-extrabold text-primary sm:text-3xl">Funcionalidades Principais</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft transition-shadow hover:shadow-elevated"
                >
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl ${f.color}`}>
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* Perfis */}
        <FadeIn>
          <section className="mt-10 rounded-3xl bg-gradient-to-b from-success/10 via-success/5 to-transparent p-8 sm:p-10">
            <h2 className="text-center text-2xl font-extrabold text-primary sm:text-3xl">Múltiplos Perfis de Acesso</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {profiles.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-border/60 bg-card p-6 text-center shadow-soft"
                >
                  <div className="text-4xl">{p.emoji}</div>
                  <h3 className="mt-3 text-base font-bold text-primary tracking-wider">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </FadeIn>
      </div>
    </PageShell>
  );
}
