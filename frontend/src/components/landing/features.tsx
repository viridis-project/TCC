import { assets } from "./assets";
import { Reveal } from "./reveal";

export function Features() {
  return (
    <section id="funcionalidades" className="section features" aria-labelledby="func-title">
      <div className="wrap">
        <Reveal className="features__head">
          <p className="eyebrow">
            <span className="eyebrow__n">03</span>
            <span className="eyebrow__rule" />
            Funcionalidades principais
          </p>
          <h2 id="func-title" className="h2">
            Organize, jogue e <em>cultive</em> juntos.
          </h2>
        </Reveal>

        <article className="feature feature--schedule">
          <Reveal className="feature__copy">
            <span className="feature__k">Planejar</span>
            <h3 className="feature__title">Cronograma de Horários</h3>
            <p className="feature__text">
              Organize seu grupo para uma atividade planejada com fácil visualização e acesso
            </p>
          </Reveal>
          <Reveal className="feature__media" delay={80}>
            <img className="feature__leaves" src={assets.leaves} width={900} height={900} loading="lazy" decoding="async" alt="" />
            <div className="frame">
              <div className="frame__bar" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
              <img
                src={assets.schedule}
                width={1609}
                height={762}
                loading="lazy" decoding="async"
                alt="Tela do cronograma de horários: tabela com blocos de horário por dia da semana"
              />
            </div>
          </Reveal>
        </article>

        <article className="feature feature--medals">
          <Reveal className="feature__media feature__media--medals" delay={80}>
            <div className="medal-cluster" aria-hidden="true">
              <img className="mc mc--l" src={assets.medal("a01")} width={499} height={440} loading="lazy" decoding="async" alt="" />
              <img className="mc mc--r" src={assets.medal("b02")} width={407} height={471} loading="lazy" decoding="async" alt="" />
              <img className="mc mc--c" src={assets.medal("b03")} width={491} height={520} loading="lazy" decoding="async" alt="" />
            </div>
            <p className="sr-only">Medalhas do Viridis em estrela, escudo e laurel.</p>
          </Reveal>
          <Reveal className="feature__copy">
            <span className="feature__k">Reconhecer</span>
            <h3 className="feature__title">Ganhe Medalhas</h3>
            <p className="feature__text">Faça recordes, fique no pódio e mais para ganhar medalhas!</p>
          </Reveal>
        </article>
      </div>
    </section>
  );
}
