import type { ReactElement } from "react";
import { useContent } from "./use-content";
import { BoardIcon, ChartIcon, LeafMark, SproutIcon } from "./icons";
import { Reveal } from "./reveal";

const ICONS: Record<string, ReactElement> = {
  estudantes: <SproutIcon width={26} height={26} />,
  professores: <BoardIcon width={26} height={26} />,
  administradores: <ChartIcon width={26} height={26} />,
};

export function Profiles() {
  const { profiles } = useContent();
  if (!profiles.length) return null;
  return (
    <section id="perfis" className="section profiles" aria-labelledby="perfis-title">
      <div className="wrap">
        <Reveal className="profiles__head">
          <p className="eyebrow">
            <span className="eyebrow__n">05</span>
            <span className="eyebrow__rule" />
            Quem participa
          </p>
          <h2 id="perfis-title" className="h2">
            Múltiplos perfis de acesso
          </h2>
        </Reveal>

        <ul className="profiles__grid">
          {profiles.map((p, i) => (
            <Reveal as="li" key={p.id} delay={i * 70} className="profile-li">
              <div className={`profile profile--${p.id}`}>
              <div className="profile__top">
                <span className="profile__icon">{ICONS[p.id] ?? <LeafMark width={22} height={22} />}</span>
                <span className="profile__n" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="profile__title">{p.title}</h3>
              <p className="profile__role hand">{p.role}</p>
              {p.actions.length > 0 && (
                <ul className="profile__list">
                  {p.actions.map((a) => (
                    <li key={a}>
                      <LeafMark width={12} height={12} />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              )}
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
