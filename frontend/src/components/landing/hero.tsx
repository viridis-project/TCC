import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { assets } from "./assets";
import { useContent } from "./use-content";
import { ArrowIcon, LeafMark } from "./icons";
import { usePlatformEntry } from "./use-platform-entry";

export function Hero() {
  const { facts } = useContent();
  const entry = usePlatformEntry();
  return (
    <section id="inicio" className="hero" aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true" />
      <div className="hero__inner wrap">
        <div className="hero__copy">
          <p className="eyebrow eyebrow--ondark hero__in" style={{ "--i": 0 } as CSSProperties}>
            <span className="eyebrow__rule" />
            Plataforma gamificada · hortas escolares
          </p>
          <h1 id="hero-title" className="hero__title hero__in" style={{ "--i": 1 } as CSSProperties}>
            <span className="hero__line">É se divertindo</span>
            <span className="hero__line hero__line--accent">que se muda</span>
            <span className="hero__line hero__line--accent">o mundo.</span>
          </h1>
          <p className="hero__lead hero__in" style={{ "--i": 2 } as CSSProperties}>
            Plataforma gamificada para hortas escolares com foco em aprendizagem socioemocional, nutrição e
            sustentabilidade
          </p>
          <div className="hero__cta hero__in" style={{ "--i": 3 } as CSSProperties}>
            <Link className="btn btn--led" to={entry.to}>
              {entry.label}
              <ArrowIcon width={18} height={18} />
            </Link>
            <a className="btn btn--ghost" href="#missao">
              Conheça a missão
            </a>
            <a className="btn btn--ghost" href="#funcionalidades">
              Ver funcionalidades
            </a>
          </div>
        </div>

        <div className="hero__stage" aria-hidden="false">
          <img
            className="hero__garden"
            src={assets.garden.src}
            width={1200}
            height={1200}
            alt="Horta isométrica com plantas e vasos sobre uma base elevada"
            fetchPriority="high"
          />
          <div className="hero__mascot">
            <p className="hero__bubble hand" aria-hidden="true">
              Vamos cultivar!
            </p>
            <img
              src={assets.brand.mascotPoint}
              width={376}
              height={511}
              alt="Mascote do Viridis: um robô de jardinagem com uma muda na cabeça, apontando para a horta"
            />
          </div>
        </div>

        {facts.length > 0 && (
        <ul className="hero__facts hero__in" style={{ "--i": 4 } as CSSProperties} aria-label="Eixos do Viridis">
          {facts.map((f) => (
            <li key={f}>
              <LeafMark width={14} height={14} />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        )}
      </div>
    </section>
  );
}
