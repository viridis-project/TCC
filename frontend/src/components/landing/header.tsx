import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { NavUserActions } from "@/components/site-nav";
import { useAuth } from "@/hooks/use-auth";
import { navItemsFor } from "@/lib/nav";
import { assets } from "./assets";
import { ThemeToggle } from "./theme-toggle";
import { useContent } from "./use-content";
import { useScrollSpy } from "./use-scroll-spy";

/** Largura a partir da qual o menu vira barra horizontal (o menu logado tem mais itens). */
const BREAKPOINT = { public: 1000, app: 1180 } as const;

/**
 * Cabeçalho da landing em dois estados:
 *  - visitante: âncoras das seções + tema + botão "Entrar" (/login). Nenhuma página interna é listada.
 *  - logado: itens do perfil vindos de `navItemsFor` (a mesma regra do SiteNav) + sino e avatar.
 */
export function Header() {
  const { nav } = useContent();
  const { user, role } = useAuth();
  const mode = user ? "app" : "public";
  const appItems = navItemsFor(role);
  const active = useScrollSpy(nav.map((n) => n.id));
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const bp = BREAKPOINT[mode];

  // Fechar: Esc (devolve o foco ao botão), toque fora e ao ampliar para o layout desktop.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panel.current?.contains(t) && !btn.current?.contains(t)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${bp}px)`);
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [bp]);

  return (
    <header className="hd" data-open={open || undefined} data-mode={mode}>
      <div className="hd__bar">
        <a className="hd__logo" href="#inicio" aria-label="Viridis — início">
          <img src={assets.brand.logo} alt="Viridis" width={640} height={170} />
        </a>

        <nav className="hd__nav" aria-label="Principal">
          {user
            ? appItems.map(({ to, label }) => (
                <Link key={to} to={to} title={label}>
                  {label}
                </Link>
              ))
            : nav.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  title={n.label}
                  aria-current={active === n.id ? "location" : undefined}
                >
                  {n.label}
                </a>
              ))}
        </nav>

        <div className="hd__tools">
          {user ? (
            <NavUserActions />
          ) : (
            <>
              <span className="hd__theme">
                <ThemeToggle />
              </span>
              <Link to="/login" className="btn btn--led hd__cta">
                Entrar
              </Link>
            </>
          )}
          <button
            ref={btn}
            type="button"
            className="hd__menu"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="hd__bars" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>

      <div id="menu-mobile" ref={panel} className="hd__panel" inert={!open}>
        <nav aria-label="Menu">
          {user
            ? appItems.map(({ to, label }) => (
                <Link key={to} to={to} onClick={() => setOpen(false)}>
                  {label}
                </Link>
              ))
            : nav.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  aria-current={active === n.id ? "location" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {n.label}
                </a>
              ))}
        </nav>
        {!user && (
          <div className="hd__panel-foot">
            <span>Tema</span>
            <ThemeToggle />
          </div>
        )}
      </div>
    </header>
  );
}
