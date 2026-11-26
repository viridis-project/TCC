import type { SVGProps } from "react";

/** Ícones de traço (currentColor), mesma linguagem de `svg.i` do Showcase: 1.75 / round. */
const base: SVGProps<SVGSVGElement> = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
};

type P = SVGProps<SVGSVGElement>;

export const SunIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

export const MoonIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

export const ArrowIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ArrowUpIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
);

/** Estudante: broto — aprender e crescer. */
export const SproutIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 21v-9" />
    <path d="M12 12c0-3.5-2.5-6-6.5-6 0 3.8 2.5 6 6.5 6z" />
    <path d="M12 14.5c0-3 2.2-5.5 6-5.5 0 3.4-2.3 5.5-6 5.5z" />
  </svg>
);

/** Professor: quadro com check — aprovar e acompanhar. */
export const BoardIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M8 21l4-5 4 5" />
    <path d="M8.5 10l2.2 2.2L15.5 8" />
  </svg>
);

/** Administrador: painel de métricas. */
export const ChartIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </svg>
);

/** Folha — separador do marquee e marcador de lista (preenchida). */
export const LeafMark = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden focusable="false" {...p}>
    <path d="M3 21C3 11 9 3 21 3c0 12-8 18-18 18z" fill="currentColor" />
  </svg>
);

export const CloseIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const CheckIcon = (p: P) => (
  <svg {...base} strokeWidth={2.4} {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const ChevronLeftIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
);

export const ChevronRightIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M9 5l7 7-7 7" />
  </svg>
);

/** Glifo genérico de foto/publicação (não é a marca do Instagram). */
export const PhotoIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const PlayIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
  </svg>
);

export const ExternalIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);
