import type { CSSProperties } from "react";
import { assets } from "./assets";
import { useContent } from "./use-content";
import { Reveal } from "./reveal";

type Step = { rank: 1 | 2 | 3; id: string; title: string; ordinal: string; w: number; h: number };

// DOM em ordem 1º·2º·3º (leitura correta); o desenho de pódio 2º·1º·3º vem de `order` no CSS
const PODIUM: Step[] = [
  { rank: 1, id: "b03", title: "1 no Pódio", ordinal: "primeiro", w: 491, h: 520 },
  { rank: 2, id: "b02", title: "2 no Pódio", ordinal: "segundo", w: 407, h: 471 },
  { rank: 3, id: "b01", title: "3 no Pódio", ordinal: "terceiro", w: 404, h: 464 },
];

export function Achievements() {
  const { collection } = useContent();
  return (
    <section id="conquistas" className="section ach" aria-labelledby="ach-title">
      <div className="ach__bg" aria-hidden="true" />
      <div className="wrap">
        <Reveal className="ach__head">
          <p className="eyebrow eyebrow--ondark">
            <span className="eyebrow__n">04</span>
            <span className="eyebrow__rule" />
            Recompensas
          </p>
          <h2 id="ach-title" className="h2">
            Medalhas de Pódio
          </h2>
        </Reveal>

        <ol className="podium">
          {PODIUM.map((s, i) => (
            <Reveal
              as="li"
              key={s.rank}
              delay={i * 70}
              className={`step step--${s.rank}`}
              style={{ "--h": s.rank === 1 ? "1" : s.rank === 2 ? ".72" : ".56" } as CSSProperties}
            >
              <div className="step__stage">
                <img className="step__medal" src={assets.medal(s.id)} width={s.w} height={s.h} loading="lazy" decoding="async" alt="" />
                <div className="step__base">
                  <span className="step__n" aria-hidden="true">
                    {s.rank}
                  </span>
                </div>
              </div>
              <h3 className="step__title">{s.title}</h3>
              <p className="step__text">Medalha ganha pelo aluno em {s.ordinal} lugar na pontuação do ranking da sua sala.</p>
            </Reveal>
          ))}
        </ol>

        {collection.length > 0 && (
        <Reveal className="ach__collection">
          <div className="ach__collection-head">
            <h3 className="ach__sub">Mais conquistas para colecionar</h3>
            <img
              className="ach__mascot"
              src={assets.brand.mascotHappy}
              width={360}
              height={727}
              loading="lazy" decoding="async"
              alt="Mascote do Viridis comemorando"
            />
          </div>
          <ul className="reel" aria-label="Coleção de medalhas Viridis" tabIndex={0}>
            {collection.map((id) => (
              <li key={id} className="reel__item">
                <img src={assets.medal(id)} loading="lazy" decoding="async" alt="Medalha Viridis" />
              </li>
            ))}
          </ul>
        </Reveal>
        )}
      </div>
    </section>
  );
}
