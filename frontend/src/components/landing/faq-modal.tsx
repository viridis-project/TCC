import { useCallback, useEffect, useRef, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { Link } from "@tanstack/react-router";
import { assets } from "./assets";
import type { FaqItem } from "./content";
import { useTypewriter } from "./use-typewriter";
import { ArrowIcon, CheckIcon, CloseIcon, LeafMark } from "./icons";
import { usePlatformEntry } from "./use-platform-entry";
import { Mascot, type Mood } from "./mascot";

const GREETING = "Oi! Eu sou o mascote do Viridis. Escolha uma pergunta e eu te conto tudo.";
const OUTRO = "Você explorou todas as dúvidas! Que tal conhecer o Viridis mais de perto?";

type Props = {
  open: boolean;
  items: FaqItem[];
  visited: string[];
  current: string | null;
  onSelect: (id: string) => void;
  onReset: () => void;
  onClose: () => void;
};

/**
 * FAQ em formato de diálogo de RPG. Usa <dialog> nativo (foco preso, Esc, fundo inerte).
 * Texto "digitado" fica oculto aos leitores de tela; o texto completo é exposto uma única vez.
 */
export function FaqModal({ open, items, visited, current, onSelect, onReset, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const choices = useRef<(HTMLButtonElement | null)[]>([]);
  const closing = useRef(false);
  const stage = useRef<HTMLDivElement>(null);

  const total = items.length;
  const count = visited.length;
  const complete = total > 0 && count >= total;
  const item = items.find((i) => i.id === current) ?? null;
  const text = item ? item.a : GREETING;
  // `open` só vira falso depois da animação de saída; fechado, nada é digitado em segundo plano
  const { shown, rest, done, skip } = useTypewriter(open ? text : "");

  const mood: Mood = complete && done ? "cheer" : item ? "talk" : "greet";

  /* abrir / fechar (com animação) */
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) {
      closing.current = false;
      d.showModal();
      requestAnimationFrame(() => requestAnimationFrame(() => (d.dataset.state = "open")));
      const first = choices.current.find((b, i) => b && !visited.includes(items[i]?.id)) ?? choices.current[0];
      first?.focus({ preventScroll: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const requestClose = useCallback(() => {
    const d = dialog.current;
    if (!d || !d.open || closing.current) return;
    closing.current = true;
    d.dataset.state = "closed";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(
      () => {
        d.close();
        closing.current = false;
        onClose();
      },
      reduce ? 0 : 170,
    );
  }, [onClose]);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onCancel = (e: Event) => {
      e.preventDefault(); // Esc: fecha com a animação de saída
      requestClose();
    };
    d.addEventListener("cancel", onCancel);
    return () => d.removeEventListener("cancel", onCancel);
  }, [requestClose]);

  /* escolher: em listas longas o painel rola; traz o balão de volta para a vista */
  const pick = (id: string) => {
    onSelect(id);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => stage.current?.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" }));
  };

  /* teclado: 1–9 escolhem; setas movem entre as opções; Enter/Espaço pulam a digitação */
  const onKeyDown = (e: ReactKeyboardEvent) => {
    const t = e.target as HTMLElement;
    const idx = choices.current.findIndex((b) => b === t);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (idx < 0) return;
      e.preventDefault();
      const n = (idx + (e.key === "ArrowDown" ? 1 : -1) + total) % total;
      choices.current[n]?.focus();
    } else if (/^[1-9]$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const i = Number(e.key) - 1;
      if (items[i]) {
        e.preventDefault();
        pick(items[i].id);
        choices.current[i]?.focus();
      }
    }
  };

  const entry = usePlatformEntry();
  const pct = total ? count / total : 0;

  return (
    <dialog
      ref={dialog}
      className="faq"
      aria-labelledby="faq-title"
      onClick={(e) => e.target === dialog.current && requestClose()}
      onKeyDown={onKeyDown}
    >
      <div className="faq__panel">
        <header className="faq__head">
          <div>
            <p className="eyebrow eyebrow--ondark">
              <span className="eyebrow__rule" />
              Conversa com o mascote
            </p>
            <h2 id="faq-title" className="faq__title">
              Dúvidas frequentes
            </h2>
          </div>
          <button type="button" className="faq__close" onClick={requestClose} aria-label="Fechar conversa">
            <CloseIcon />
          </button>
        </header>

        <div className="faq__progress">
          <div
            className="faq__bar"
            role="progressbar"
            aria-label="Perguntas exploradas"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={count}
            aria-valuetext={`${count} de ${total} perguntas exploradas`}
          >
            <span style={{ transform: `scaleX(${pct})` }} />
          </div>
          <p className="faq__count" aria-hidden="true">
            <strong>{count}</strong> de {total}
          </p>
        </div>

        <div className="faq__stage" ref={stage}>
          <Mascot mood={mood} talking={!done} />
          <div className="faq__bubble" onClick={skip} data-done={done || undefined}>
            {/* texto completo, uma vez, para leitores de tela */}
            <p className="sr-only" role="status" aria-live="polite">
              {done ? text : ""}
            </p>
            <p className="faq__text" aria-hidden="true">
              {shown}
              <span className="faq__ghost">{rest}</span>
            </p>
            {!done && (
              <button type="button" className="faq__skip" onClick={skip}>
                Pular
              </button>
            )}
          </div>
        </div>

        {complete && done && (
          <div className="faq__reward" role="group" aria-label="Recompensa">
            <div className="faq__medal" aria-hidden="true">
              <img src={assets.medal("b03")} alt="" width={491} height={520} />
              {Array.from({ length: 8 }, (_, i) => (
                <LeafMark key={i} className="faq__spark" style={{ "--a": `${i * 45}deg` } as CSSProperties} width={16} height={16} />
              ))}
            </div>
            <div className="faq__reward-copy">
              <p className="faq__reward-title">Conversa completa!</p>
              <p className="faq__reward-text">{OUTRO}</p>
              <div className="faq__reward-cta">
                <Link className="btn btn--led" to={entry.to} onClick={requestClose}>
                  {entry.label}
                  <ArrowIcon width={18} height={18} />
                </Link>
                <a className="btn btn--ghost" href="#funcionalidades" onClick={requestClose}>
                  Conhecer as funcionalidades
                </a>
                <button type="button" className="btn btn--ghost" onClick={onReset}>
                  Recomeçar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="faq__choices">
          <p className="faq__prompt hand" id="faq-prompt">
            Escolha uma pergunta
          </p>
          <ul aria-labelledby="faq-prompt">
            {items.map((it, i) => {
              const seen = visited.includes(it.id);
              const on = it.id === current;
              return (
                <li key={it.id}>
                  <button
                    type="button"
                    ref={(el) => {
                      choices.current[i] = el;
                    }}
                    className="choice"
                    data-visited={seen || undefined}
                    aria-current={on || undefined}
                    onClick={() => pick(it.id)}
                  >
                    <span className="choice__mark" aria-hidden="true">
                      {seen ? <CheckIcon width={14} height={14} /> : <span className="choice__n">{i + 1}</span>}
                    </span>
                    <span className="choice__q">{it.q}</span>
                    {seen && <span className="sr-only"> (já explorada)</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </dialog>
  );
}
