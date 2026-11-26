import { Award, BookOpen, Sprout, TrendingUp } from "lucide-react";
import { Reveal } from "./reveal";

/**
 * Conteúdo institucional que já existia na home anterior (routes/index.tsx) e não tem equivalente
 * na landing de referência — preservado aqui. Os números de `STATS` são estáticos (herdados da home
 * anterior); NÃO vêm do backend e devem ser revisados/atualizados pela equipe antes de divulgar.
 */
const STATS = [
  { value: "24", label: "Plantas acompanhadas" },
  { value: "186", label: "Alunos participantes" },
  { value: "77 mil", label: "Pontos conquistados" },
];

const PILLARS = [
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

export function Impact() {
  return (
    <section id="impacto" className="section impact" aria-labelledby="impacto-title">
      <div className="wrap">
        <Reveal className="impact__head">
          <p className="eyebrow">
            <span className="eyebrow__rule" />
            Uma plataforma, uma jornada
          </p>
          <h2 id="impacto-title" className="h2">
            Da teoria ao <em>impacto real</em>
          </h2>
          <p className="lead">
            Recursos conectados em um fluxo claro para apoiar toda a comunidade escolar.
          </p>
        </Reveal>

        <ol className="impact__list">
          {PILLARS.map(({ icon: Icon, title, desc }, i) => (
            <Reveal as="li" key={title} delay={i * 60} className="impact__item">
              <span className="impact__n" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="impact__icon">
                <Icon width={22} height={22} aria-hidden="true" />
              </span>
              <h3 className="impact__title">{title}</h3>
              <p className="impact__text">{desc}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal as="dl" className="impact__stats" delay={80}>
          {STATS.map((s) => (
            <div key={s.label} className="impact__stat">
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
