import { assets } from "./assets";
import { useContent } from "./use-content";
import { ArrowUpIcon } from "./icons";

export function Footer() {
  const { nav } = useContent();
  return (
    <footer className="ft">
      <div className="wrap ft__inner">
        <p className="ft__slogan">
          É se divertindo
          <br />
          que se <em>muda o mundo.</em>
        </p>

        <div className="ft__row">
          <div className="ft__brand">
            <span className="ft__plate">
              <img src={assets.brand.logo} alt="Viridis" width={640} height={170} loading="lazy" decoding="async" />
            </span>
            <p>Cultivando sustentabilidade através da educação • 2026</p>
          </div>

          <nav className="ft__nav" aria-label="Rodapé">
            <p className="ft__h">Explorar</p>
            <ul>
              {nav.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`}>{n.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <a className="ft__top btn btn--ghost" href="#inicio">
            Voltar ao topo
            <ArrowUpIcon width={18} height={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
