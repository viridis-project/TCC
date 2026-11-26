import { useEffect, useState } from "react";

/**
 * Seção ativa conforme a rolagem. IntersectionObserver (sem listener de scroll) numa faixa
 * fina no terço superior da viewport; entre as seções que cruzam a faixa vale a última da página.
 */
export function useScrollSpy(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? "");
  const key = ids.join("|");

  useEffect(() => {
    const list = key ? key.split("|") : [];
    const els = list.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (!els.length || !("IntersectionObserver" in window)) return;
    const hit = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) hit.add(e.target.id);
          else hit.delete(e.target.id);
        }
        const current = [...els].reverse().find((el) => hit.has(el.id));
        if (current) setActive(current.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);

  return active;
}
