import { useCallback, useEffect, useRef, useState } from "react";

const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Efeito de digitação baseado em tempo (rAF) — não depende da taxa de quadros.
 * Com movimento reduzido o texto aparece inteiro. `skip()` completa na hora e
 * interrompe o laço (senão ele sobrescreveria o estado no quadro seguinte).
 */
export function useTypewriter(text: string, cps = 70) {
  const [st, setSt] = useState({ text: "", n: 0 });
  const skipped = useRef("");
  const reduce = prefersReduced();
  const count = reduce ? text.length : st.text === text ? st.n : 0;

  useEffect(() => {
    skipped.current = "";
    if (reduce || !text) return;
    let raf = 0;
    let last = -1;
    const t0 = performance.now() + 140; // pausa curta antes de começar a "falar"
    const tick = (now: number) => {
      if (skipped.current === text) return;
      const n = Math.min(text.length, Math.max(0, Math.floor(((now - t0) / 1000) * cps)));
      if (n !== last) {
        last = n;
        setSt({ text, n });
      }
      if (n < text.length) raf = requestAnimationFrame(tick);
    };
    setSt({ text, n: 0 });
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, cps, reduce]);

  const skip = useCallback(() => {
    skipped.current = text;
    setSt({ text, n: text.length });
  }, [text]);

  const done = count >= text.length;
  return { shown: text.slice(0, count), rest: text.slice(count), done, skip };
}
