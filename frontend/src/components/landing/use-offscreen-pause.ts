import { useEffect, useRef } from "react";

/**
 * Pausa animações contínuas fora da tela: alterna `data-offscreen` no elemento.
 * Evita custo de composição para movimento que ninguém está vendo.
 */
export function useOffscreenPause<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) el.removeAttribute("data-offscreen");
      else el.setAttribute("data-offscreen", "");
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
