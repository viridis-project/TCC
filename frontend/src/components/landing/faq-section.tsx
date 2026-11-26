import { useCallback, useState } from "react";
import { assets } from "./assets";
import { useContent } from "./use-content";
import { ArrowIcon, CheckIcon } from "./icons";
import { FaqModal } from "./faq-modal";
import { Reveal } from "./reveal";

const MAX_CHIPS = 8; // com listas longas, o resto fica só no modal

/**
 * Seção "Dúvidas": convite para a conversa + estado do FAQ (progresso compartilhado
 * entre a seção e o modal, que continua montado e guarda o que já foi explorado).
 */
export function FaqSection() {
  const { faq } = useContent();
  const [open, setOpen] = useState(false);
  const [visited, setVisited] = useState<string[]>([]);
  const [current, setCurrent] = useState<string | null>(null);

  const select = useCallback((id: string) => {
    setCurrent(id);
    setVisited((v) => (v.includes(id) ? v : [...v, id]));
  }, []);
  const reset = useCallback(() => {
    setVisited([]);
    setCurrent(null);
  }, []);
  const openAt = (id?: string) => {
    if (id) select(id);
    setOpen(true);
  };

  if (!faq.length) return null;
  const seen = visited.filter((id) => faq.some((f) => f.id === id)).length;
  const label = seen === 0 ? "Iniciar conversa" : seen >= faq.length ? "Rever conversa" : "Continuar conversa";

  return (
    <section id="duvidas" className="section faqs" aria-labelledby="duvidas-title">
      <div className="wrap faqs__grid">
        <Reveal className="faqs__text">
          <p className="eyebrow">
            <span className="eyebrow__n">07</span>
            <span className="eyebrow__rule" />
            Dúvidas
          </p>
          <h2 id="duvidas-title" className="h2">
            Ficou com alguma <em>dúvida</em>?
          </h2>
          <p className="lead">Converse com o mascote do Viridis: escolha uma pergunta e ele responde.</p>

          <ul className="faqs__chips" aria-label="Perguntas frequentes">
            {faq.slice(0, MAX_CHIPS).map((f) => {
              const done = visited.includes(f.id);
              return (
                <li key={f.id}>
                  <button type="button" className="chip" data-visited={done || undefined} onClick={() => openAt(f.id)}>
                    {done && <CheckIcon width={14} height={14} />}
                    <span>{f.q}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <button type="button" className="btn btn--solid" onClick={() => openAt()} aria-haspopup="dialog">
            {label}
            <ArrowIcon width={18} height={18} />
          </button>
          {seen > 0 && (
            <p className="faqs__meta">
              {seen} de {faq.length} perguntas exploradas
            </p>
          )}
        </Reveal>

        <Reveal as="figure" className="faqs__figure" delay={80}>
          <div className="mission__plate" aria-hidden="true" />
          <img
            src={assets.brand.mascotHappy}
            width={360}
            height={727}
            loading="lazy"
            decoding="async"
            alt="Mascote do Viridis, um robô de jardinagem com uma muda na cabeça, sorrindo"
          />
          <figcaption className="faqs__note hand" aria-hidden="true">
            vamos conversar?
          </figcaption>
        </Reveal>
      </div>

      <FaqModal
        open={open}
        items={faq}
        visited={visited}
        current={current}
        onSelect={select}
        onReset={reset}
        onClose={() => setOpen(false)}
      />
    </section>
  );
}
