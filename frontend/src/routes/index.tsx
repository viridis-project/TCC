import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BookOpen,
  GraduationCap,
  Leaf,
  ShieldCheck,
  Sprout,
  Target,
  TrendingUp,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Viridis — Plataforma gamificada de hortas escolares" },
      {
        name: "description",
        content:
          "Educação socioemocional, nutrição e sustentabilidade através de hortas escolares interativas.",
      },
    ],
  }),
  component: HomePage,
});

const stats = [
  { value: "24", label: "Plantas acompanhadas" },
  { value: "186", label: "Alunos participantes" },
  { value: "77 mil", label: "Pontos conquistados" },
];

const features = [
  {
    icon: BookOpen,
    title: "Aprendizagem aplicada",
    desc: "Conteúdo sobre plantio, nutrição, compostagem e manejo, ligado à prática na escola.",
  },
  {
    icon: Sprout,
    title: "Horta acompanhada",
    desc: "Registro de atividades e evolução do jardim com validação dos educadores.",
  },
  {
    icon: TrendingUp,
    title: "Impacto visível",
    desc: "Indicadores de participação, crescimento e sustentabilidade para apoiar decisões.",
  },
  {
    icon: Award,
    title: "Reconhecimento",
    desc: "Pontos, conquistas e benefícios de parceiros que valorizam a evolução dos alunos.",
  },
];

const profiles = [
  {
    icon: GraduationCap,
    title: "Estudantes",
    desc: "Aprendem, registram atividades e acompanham sua evolução.",
  },
  {
    icon: BookOpen,
    title: "Professores",
    desc: "Orientam turmas, validam práticas e administram conteúdos.",
  },
  {
    icon: ShieldCheck,
    title: "Gestão escolar",
    desc: "Acompanha resultados, pessoas, parcerias e iniciativas.",
  },
];

const sdg = [
  ["02", "Agricultura sustentável"],
  ["03", "Saúde e bem-estar"],
  ["04", "Educação de qualidade"],
  ["12", "Consumo responsável"],
  ["15", "Vida terrestre"],
] as const;

function HomePage() {
  return (
    <PageShell>
      <div className="app-page space-y-10">
        <section className="overflow-hidden rounded-xl border border-primary/15 bg-card">
          <div className="grid lg:grid-cols-[1.35fr_0.65fr]">
            <div className="p-6 sm:p-9 lg:p-12">
              <div className="page-eyebrow flex items-center gap-2">
                <Leaf className="h-4 w-4" aria-hidden="true" /> Educação que cria raízes
              </div>
              <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.75rem]">
                Cultive conhecimento. Transforme a escola.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                O Viridis conecta aprendizagem, prática e gestão para tornar a horta escolar uma
                experiência contínua de sustentabilidade.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/aprender"
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-[var(--primary-hover)]"
                >
                  Começar a aprender <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/jardim"
                  className="inline-flex min-h-11 items-center rounded-lg border border-input bg-card px-5 py-2.5 text-sm font-semibold hover:border-primary/30 hover:bg-accent"
                >
                  Acessar meu jardim
                </Link>
              </div>
            </div>
            <div
              className="relative hidden min-h-80 overflow-hidden bg-accent lg:block"
              aria-hidden="true"
            >
              <div className="absolute -bottom-20 -right-12 h-72 w-72 rounded-full bg-primary-glow" />
              <div className="absolute left-10 top-10 h-44 w-28 rounded-t-full bg-primary" />
              <div className="absolute bottom-10 left-1/2 grid h-28 w-28 -translate-x-1/2 place-items-center rounded-xl border border-white/40 bg-white/80 text-primary shadow-soft">
                <Sprout className="h-12 w-12" />
              </div>
            </div>
          </div>
          <dl className="grid border-t bg-background/60 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="px-6 py-5 sm:border-r sm:last:border-r-0">
                <dt className="text-xs font-medium text-muted-foreground">{stat.label}</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section
          aria-labelledby="recursos-title"
          className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr]"
        >
          <div className="page-heading">
            <div className="page-eyebrow">Uma plataforma, uma jornada</div>
            <h2 id="recursos-title" className="mt-2 text-2xl font-bold">
              Da teoria ao impacto real
            </h2>
            <p className="page-description">
              Recursos conectados em um fluxo claro para apoiar toda a comunidade escolar.
            </p>
          </div>
          <div className="divide-y border-y">
            {features.map(({ icon: Icon, title, desc }, index) => (
              <div key={title} className="grid gap-3 py-5 sm:grid-cols-[2.5rem_1fr]">
                <div className="flex items-center gap-2 text-primary">
                  <span className="text-xs font-bold tabular-nums">0{index + 1}</span>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="ods-title" className="section-divider">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="page-eyebrow">Compromisso coletivo</div>
              <h2 id="ods-title" className="mt-2 text-2xl font-bold">
                Objetivos que orientam o Viridis
              </h2>
            </div>
            <Target className="hidden h-7 w-7 text-primary sm:block" aria-hidden="true" />
          </div>
          <div className="mt-5 grid border sm:grid-cols-5">
            {sdg.map(([number, label]) => (
              <div
                key={number}
                className="border-b p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
              >
                <div className="text-xl font-bold text-primary">{number}</div>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="perfis-title" className="section-divider">
          <div className="page-eyebrow">Feito para a comunidade escolar</div>
          <h2 id="perfis-title" className="mt-2 text-2xl font-bold">
            Cada perfil enxerga o que precisa
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {profiles.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="border-l-2 border-primary/25 pl-4">
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="mt-3 font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
