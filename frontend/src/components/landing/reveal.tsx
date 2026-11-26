import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

type Props = {
  as?: ElementType;
  /** Atraso em ms — use passos de 30–80ms para escalonar grupos. */
  delay?: number;
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
  [key: string]: unknown;
};

/** Um único IntersectionObserver para todos os blocos; criado sob demanda (seguro para SSR). */
let shared: IntersectionObserver | null = null;
function getObserver() {
  if (!shared) {
    shared = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-in", "");
          shared?.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
  }
  return shared;
}

/**
 * Revelação ao rolar (ver landing.css). Cada bloco se registra sozinho: funciona também para
 * elementos que aparecem depois da primeira renderização. Sem IntersectionObserver, fica visível.
 */
export function Reveal({
  as: Tag = "div",
  delay = 0,
  className,
  children,
  style,
  ...rest
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.setAttribute("data-in", "");
      return;
    }
    const io = getObserver();
    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      className={className}
      style={delay ? { ...style, transitionDelay: `${delay}ms` } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
