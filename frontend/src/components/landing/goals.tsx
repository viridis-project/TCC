import type { CSSProperties } from "react";
import { useContent } from "./use-content";
import { Reveal } from "./reveal";

export function Goals() {
  const { goals } = useContent();
  if (!goals.length) return null;
  return (
    <section id="ods" className="section goals" aria-labelledby="ods-title">
      <div className="wrap">
        <Reveal className="goals__head">
          <p className="eyebrow">
            <span className="eyebrow__n">02</span>
            <span className="eyebrow__rule" />
            Agenda 2030
          </p>
          <h2 id="ods-title" className="h2">
            Objetivos de Desenvolvimento Sustentável
          </h2>
          <p className="lead">O Viridis contribui diretamente para os ODS da ONU</p>
        </Reveal>

        <ul className="goals__grid">
          {goals.map((g, i) => (
            <Reveal
              as="li"
              key={g.n}
              delay={i * 60}
              className="goal-li"
            >
              <div className="goal" style={{ "--c": g.color, "--on": g.on } as CSSProperties}>
                <div className="goal__block">
                  <span className="goal__tag">ODS</span>
                  <strong className="goal__n">{g.n}</strong>
                </div>
                <p className="goal__label">{g.label}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
