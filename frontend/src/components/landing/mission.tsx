import { assets } from "./assets";
import { Reveal } from "./reveal";

export function Mission() {
  return (
    <section id="missao" className="section mission" aria-labelledby="missao-title">
      <div className="wrap mission__grid">
        <Reveal className="mission__text">
          <p className="eyebrow">
            <span className="eyebrow__n">01</span>
            <span className="eyebrow__rule" />
            Nossa missão
          </p>
          <h2 id="missao-title" className="h2 mission__title">
            Transformar a educação através de <em>hortas escolares</em> interativas,
          </h2>
          <p className="lead mission__body">
            promovendo sustentabilidade, nutrição e consciência ambiental entre estudantes, professores e
            comunidades.
          </p>
        </Reveal>

        <Reveal as="figure" className="mission__figure" delay={80}>
          <div className="mission__plate" aria-hidden="true" />
          <img
            src={assets.sprout}
            width={1600}
            height={900}
            loading="lazy" decoding="async"
            alt="Muda crescendo em solo fértil, sustentada por mãos com luvas"
          />
          <figcaption className="mission__note hand" aria-hidden="true">
            uma muda de cada vez
          </figcaption>
        </Reveal>
      </div>
    </section>
  );
}
