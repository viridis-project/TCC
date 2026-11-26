import { useCallback, useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "@/components/theme-sync";

export type Theme = "light" | "dark";

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<unknown> };
};

/** A fonte da verdade do tema do projeto é a classe `dark` em <html> (ver ThemeSync / __root). */
const subscribe = (onChange: () => void) => {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => mo.disconnect();
};
const getSnapshot = (): Theme =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";
const getServerSnapshot = (): Theme => "light";

/**
 * Alternância de tema para visitantes. Usa a mesma classe `dark` e a mesma chave de
 * localStorage (`viridis-tema`) do restante do app, então não cria um segundo sistema de tema.
 * Para quem está logado, o tema é o do perfil (ThemeSync); por isso o botão só aparece a visitantes.
 */
export function useLandingTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback((origin?: HTMLElement | null) => {
    const root = document.documentElement;
    const next: Theme = root.classList.contains("dark") ? "light" : "dark";
    const apply = () => root.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* armazenamento indisponível: a escolha vale só para esta sessão */
    }
    const doc = document as ViewTransitionDocument;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!doc.startViewTransition || reduce || !origin) {
      apply();
      return;
    }
    const b = origin.getBoundingClientRect();
    root.style.setProperty("--vt-x", `${b.left + b.width / 2}px`);
    root.style.setProperty("--vt-y", `${b.top + b.height / 2}px`);
    root.setAttribute("data-lp-vt", ""); // habilita a animação circular só durante a troca
    const t = doc.startViewTransition(apply);
    const done = () => root.removeAttribute("data-lp-vt");
    t.finished.then(done, done);
  }, []);

  return { theme, toggle };
}
