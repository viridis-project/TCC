import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Carrossel por rolagem nativa (scroll-snap): toque e arraste no mobile são o próprio
 * scroll do navegador; no desktop o arraste com mouse é feito aqui. Sem autoplay.
 * O indicador de progresso é atualizado direto no DOM (sem re-renderizar a cada quadro).
 */
export function useCarousel<T extends HTMLElement>(dep?: unknown) {
  const track = useRef<T>(null);
  const thumb = useRef<HTMLSpanElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const drag = useRef({ down: false, x: 0, left: 0, moved: 0, block: false });

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const size = el.scrollWidth > 0 ? Math.min(1, el.clientWidth / el.scrollWidth) : 1;
    const ratio = max > 0 ? el.scrollLeft / max : 0;
    if (thumb.current) {
      thumb.current.style.width = `${size * 100}%`;
      thumb.current.style.transform = `translateX(${ratio * (1 / size - 1) * 100}%)`;
    }
    const start = el.scrollLeft <= 2;
    const end = el.scrollLeft >= max - 2;
    setEdge((p) => (p.start === start && p.end === end ? p : { start, end }));
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onScroll) : undefined;
    ro?.observe(el);
    update();
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
      ro?.disconnect();
    };
  }, [update, dep]); // dep: o trilho só existe quando há publicações

  const stepWidth = () => {
    const el = track.current;
    const first = el?.querySelector("li");
    if (!el || !first) return 0;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    return first.getBoundingClientRect().width + gap;
  };

  const go = useCallback((dir: 1 | -1) => {
    const el = track.current;
    const w = stepWidth();
    if (!el || !w) return;
    const visible = Math.max(1, Math.floor(el.clientWidth / w));
    el.scrollBy({ left: dir * w * visible, behavior: reduced() ? "auto" : "smooth" });
  }, []);

  /** Arraste com mouse (touch usa rolagem nativa). */
  const onPointerDown = useCallback((e: ReactPointerEvent<T>) => {
    const el = track.current;
    if (!el || e.pointerType !== "mouse" || e.button !== 0) return;
    const d = drag.current;
    d.down = true;
    d.x = e.clientX;
    d.left = el.scrollLeft;
    d.moved = 0;
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - d.x;
      d.moved = Math.max(d.moved, Math.abs(dx));
      if (d.moved > 5) {
        el.dataset.dragging = "true";
        el.scrollLeft = d.left - dx;
      }
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      d.down = false;
      if (d.moved > 5) {
        d.block = true; // evita abrir o link ao soltar depois de arrastar
        setTimeout(() => (d.block = false), 0);
        const w = stepWidth();
        delete el.dataset.dragging;
        if (w) el.scrollTo({ left: Math.round(el.scrollLeft / w) * w, behavior: reduced() ? "auto" : "smooth" });
      }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  }, []);

  const onClickCapture = useCallback((e: ReactMouseEvent) => {
    if (drag.current.block) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  return { track, thumb, edge, go, onPointerDown, onClickCapture };
}
