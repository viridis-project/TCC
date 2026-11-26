import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useRef, useEffect, useState, useCallback, useId, useSyncExternalStore, useLayoutEffect } from "react";
import { Link } from "@tanstack/react-router";
import { n as useAuth, j as homePathFor, T as THEME_STORAGE_KEY, E as navItemsFor, N as NavUserActions } from "./router-eJvIn0Kb.js";
import { BookOpen, Sprout, TrendingUp, Award } from "lucide-react";
import "@tanstack/react-query";
import "sonner";
import "motion/react";
import "recharts";
import "@radix-ui/react-dialog";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-slot";
import "class-variance-authority";
const O = "/landing/opt";
const B = "/landing/brand";
const M = "/landing/medals";
const assets = {
  brand: {
    logo: `${B}/logo.webp`,
    // 640×170
    symbol: `${B}/symbol.webp`,
    mascotPoint: `${B}/mascot-point.webp`,
    // 376×511
    mascotHappy: `${B}/mascot-happy.webp`
    // 360×727
  },
  garden: { src: `${O}/garden.webp` },
  sprout: `${O}/sprout.webp`,
  leaves: `${O}/leaves.webp`,
  schedule: `${O}/schedule.webp`,
  medal: (id) => `${M}/${id}.webp`
};
const INSTAGRAM = {
  profileUrl: void 0,
  handle: void 0,
  feedUrl: void 0,
  posts: []
};
const NAV = [
  { id: "inicio", label: "Início" },
  { id: "missao", label: "Missão" },
  { id: "ods", label: "ODS" },
  { id: "funcionalidades", label: "Funcionalidades" },
  { id: "conquistas", label: "Conquistas" },
  { id: "perfis", label: "Perfis" },
  { id: "comunidade", label: "Comunidade" },
  { id: "duvidas", label: "Dúvidas" }
];
const GOALS = [
  { n: "2", label: "Fome Zero e Agricultura Sustentável", color: "#dda63a", on: "#14241a" },
  { n: "3", label: "Saúde e Bem-Estar", color: "#4c9f38", on: "#14241a" },
  { n: "4", label: "Educação de Qualidade", color: "#c5192d", on: "#ffffff" },
  { n: "12", label: "Consumo e Produção Responsáveis", color: "#bf8b2e", on: "#14241a" },
  { n: "15", label: "Vida Terrestre", color: "#56c02b", on: "#14241a" }
];
const PROFILES = [
  {
    id: "estudantes",
    title: "Estudantes",
    role: "Aprender jogando",
    actions: [
      "Aprendem sobre sustentabilidade",
      "Acumulam pontos",
      "Competem em rankings",
      "Resgatam recompensas"
    ]
  },
  {
    id: "professores",
    title: "Professores",
    role: "Acompanhar a turma",
    actions: [
      "Aprovam atividades dos alunos",
      "Acompanham desempenho das turmas",
      "Gerenciam conteúdo"
    ]
  },
  {
    id: "administradores",
    title: "Administradores",
    role: "Enxergar o impacto",
    actions: [
      "Visualizam métricas institucionais",
      "Gerenciam parcerias",
      "Monitoram impacto dos ODS"
    ]
  }
];
const COLLECTION = [
  "a01",
  "b04",
  "a09",
  "b07",
  "a03",
  "b08",
  "a05",
  "b05",
  "a02",
  "b09",
  "a07",
  "a04",
  "b10",
  "a06",
  "a08"
];
const FAQ = [
  {
    id: "o-que-e",
    q: "O que é o Viridis?",
    a: "O Viridis é uma plataforma gamificada para hortas escolares, com foco em aprendizagem socioemocional, nutrição e sustentabilidade. Nosso lema: é se divertindo que se muda o mundo!"
  },
  {
    id: "missao",
    q: "Qual é a missão do Viridis?",
    a: "Transformar a educação através de hortas escolares interativas, promovendo sustentabilidade, nutrição e consciência ambiental entre estudantes, professores e comunidades."
  },
  {
    id: "quem-participa",
    q: "Quem participa da plataforma?",
    a: "Existem três perfis de acesso: estudantes, professores e administradores. Os estudantes aprendem e acumulam pontos, os professores acompanham as turmas e os administradores visualizam as métricas e o impacto."
  },
  {
    id: "gamificacao",
    q: "Como funciona a gamificação?",
    a: "Os estudantes aprendem sobre sustentabilidade, acumulam pontos, competem em rankings e resgatam recompensas."
  },
  {
    id: "medalhas",
    q: "Como eu ganho medalhas?",
    a: "Fazendo recordes e ficando no pódio! Há medalhas para o primeiro, o segundo e o terceiro lugar na pontuação do ranking da sua sala."
  },
  {
    id: "cronograma",
    q: "Para que serve o cronograma de horários?",
    a: "Para organizar seu grupo em uma atividade planejada, com fácil visualização e acesso."
  },
  {
    id: "ods",
    q: "Quais ODS o Viridis apoia?",
    a: "O Viridis contribui diretamente para cinco ODS da ONU: 2 (Fome Zero e Agricultura Sustentável), 3 (Saúde e Bem-Estar), 4 (Educação de Qualidade), 12 (Consumo e Produção Responsáveis) e 15 (Vida Terrestre)."
  }
];
const DEMO = {
  nav: NAV,
  marquee: ["Cultivar", "Aprender", "Transformar", "Sustentabilidade", "Educação"],
  facts: ["Aprendizagem socioemocional", "Nutrição", "Sustentabilidade", "Comunidade escolar"],
  goals: GOALS,
  profiles: PROFILES,
  collection: COLLECTION,
  instagram: INSTAGRAM,
  faq: FAQ
};
function useContent() {
  return DEMO;
}
let shared = null;
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
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
  }
  return shared;
}
function Reveal({
  as: Tag = "div",
  delay = 0,
  className,
  children,
  style,
  ...rest
}) {
  const ref = useRef(null);
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
  return /* @__PURE__ */ jsx(
    Tag,
    {
      ref,
      "data-reveal": "",
      className,
      style: delay ? { ...style, transitionDelay: `${delay}ms` } : style,
      ...rest,
      children
    }
  );
}
const PODIUM = [
  { rank: 1, id: "b03", title: "1 no Pódio", ordinal: "primeiro", w: 491, h: 520 },
  { rank: 2, id: "b02", title: "2 no Pódio", ordinal: "segundo", w: 407, h: 471 },
  { rank: 3, id: "b01", title: "3 no Pódio", ordinal: "terceiro", w: 404, h: 464 }
];
function Achievements() {
  const { collection } = useContent();
  return /* @__PURE__ */ jsxs("section", { id: "conquistas", className: "section ach", "aria-labelledby": "ach-title", children: [
    /* @__PURE__ */ jsx("div", { className: "ach__bg", "aria-hidden": "true" }),
    /* @__PURE__ */ jsxs("div", { className: "wrap", children: [
      /* @__PURE__ */ jsxs(Reveal, { className: "ach__head", children: [
        /* @__PURE__ */ jsxs("p", { className: "eyebrow eyebrow--ondark", children: [
          /* @__PURE__ */ jsx("span", { className: "eyebrow__n", children: "04" }),
          /* @__PURE__ */ jsx("span", { className: "eyebrow__rule" }),
          "Recompensas"
        ] }),
        /* @__PURE__ */ jsx("h2", { id: "ach-title", className: "h2", children: "Medalhas de Pódio" })
      ] }),
      /* @__PURE__ */ jsx("ol", { className: "podium", children: PODIUM.map((s, i) => /* @__PURE__ */ jsxs(
        Reveal,
        {
          as: "li",
          delay: i * 70,
          className: `step step--${s.rank}`,
          style: { "--h": s.rank === 1 ? "1" : s.rank === 2 ? ".72" : ".56" },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "step__stage", children: [
              /* @__PURE__ */ jsx("img", { className: "step__medal", src: assets.medal(s.id), width: s.w, height: s.h, loading: "lazy", decoding: "async", alt: "" }),
              /* @__PURE__ */ jsx("div", { className: "step__base", children: /* @__PURE__ */ jsx("span", { className: "step__n", "aria-hidden": "true", children: s.rank }) })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "step__title", children: s.title }),
            /* @__PURE__ */ jsxs("p", { className: "step__text", children: [
              "Medalha ganha pelo aluno em ",
              s.ordinal,
              " lugar na pontuação do ranking da sua sala."
            ] })
          ]
        },
        s.rank
      )) }),
      collection.length > 0 && /* @__PURE__ */ jsxs(Reveal, { className: "ach__collection", children: [
        /* @__PURE__ */ jsxs("div", { className: "ach__collection-head", children: [
          /* @__PURE__ */ jsx("h3", { className: "ach__sub", children: "Mais conquistas para colecionar" }),
          /* @__PURE__ */ jsx(
            "img",
            {
              className: "ach__mascot",
              src: assets.brand.mascotHappy,
              width: 360,
              height: 727,
              loading: "lazy",
              decoding: "async",
              alt: "Mascote do Viridis comemorando"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("ul", { className: "reel", "aria-label": "Coleção de medalhas Viridis", tabIndex: 0, children: collection.map((id) => /* @__PURE__ */ jsx("li", { className: "reel__item", children: /* @__PURE__ */ jsx("img", { src: assets.medal(id), loading: "lazy", decoding: "async", alt: "Medalha Viridis" }) }, id)) })
      ] })
    ] })
  ] });
}
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function useCarousel(dep) {
  const track = useRef(null);
  const thumb = useRef(null);
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
    setEdge((p) => p.start === start && p.end === end ? p : { start, end });
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
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onScroll) : void 0;
    ro?.observe(el);
    update();
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
      ro?.disconnect();
    };
  }, [update, dep]);
  const stepWidth = () => {
    const el = track.current;
    const first = el?.querySelector("li");
    if (!el || !first) return 0;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    return first.getBoundingClientRect().width + gap;
  };
  const go = useCallback((dir) => {
    const el = track.current;
    const w = stepWidth();
    if (!el || !w) return;
    const visible = Math.max(1, Math.floor(el.clientWidth / w));
    el.scrollBy({ left: dir * w * visible, behavior: reduced() ? "auto" : "smooth" });
  }, []);
  const onPointerDown = useCallback((e) => {
    const el = track.current;
    if (!el || e.pointerType !== "mouse" || e.button !== 0) return;
    const d = drag.current;
    d.down = true;
    d.x = e.clientX;
    d.left = el.scrollLeft;
    d.moved = 0;
    const move = (ev) => {
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
        d.block = true;
        setTimeout(() => d.block = false, 0);
        const w = stepWidth();
        delete el.dataset.dragging;
        if (w) el.scrollTo({ left: Math.round(el.scrollLeft / w) * w, behavior: reduced() ? "auto" : "smooth" });
      }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  }, []);
  const onClickCapture = useCallback((e) => {
    if (drag.current.block) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);
  return { track, thumb, edge, go, onPointerDown, onClickCapture };
}
function useInstagramPosts(feedUrl, fixed) {
  const url = void 0;
  const [state, setState] = useState(() => ({
    status: fixed.length ? "ready" : "empty",
    posts: fixed
  }));
  useEffect(() => {
    {
      setState({ status: fixed.length ? "ready" : "empty", posts: fixed });
      return;
    }
  }, [url, fixed]);
  return state;
}
function relativeTime(iso) {
  if (!iso) return void 0;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return void 0;
  const diff = (t - Date.now()) / 1e3;
  const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });
  const units = [
    ["year", 31536e3],
    ["month", 2592e3],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60]
  ];
  for (const [u, s] of units) if (Math.abs(diff) >= s) return rtf.format(Math.round(diff / s), u);
  return rtf.format(0, "second");
}
const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false
};
const SunIcon = (p) => /* @__PURE__ */ jsxs("svg", { ...base, ...p, children: [
  /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "4" }),
  /* @__PURE__ */ jsx("path", { d: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" })
] });
const MoonIcon = (p) => /* @__PURE__ */ jsx("svg", { ...base, ...p, children: /* @__PURE__ */ jsx("path", { d: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" }) });
const ArrowIcon = (p) => /* @__PURE__ */ jsx("svg", { ...base, ...p, children: /* @__PURE__ */ jsx("path", { d: "M5 12h14M13 6l6 6-6 6" }) });
const ArrowUpIcon = (p) => /* @__PURE__ */ jsx("svg", { ...base, ...p, children: /* @__PURE__ */ jsx("path", { d: "M12 19V5M6 11l6-6 6 6" }) });
const SproutIcon = (p) => /* @__PURE__ */ jsxs("svg", { ...base, ...p, children: [
  /* @__PURE__ */ jsx("path", { d: "M12 21v-9" }),
  /* @__PURE__ */ jsx("path", { d: "M12 12c0-3.5-2.5-6-6.5-6 0 3.8 2.5 6 6.5 6z" }),
  /* @__PURE__ */ jsx("path", { d: "M12 14.5c0-3 2.2-5.5 6-5.5 0 3.4-2.3 5.5-6 5.5z" })
] });
const BoardIcon = (p) => /* @__PURE__ */ jsxs("svg", { ...base, ...p, children: [
  /* @__PURE__ */ jsx("rect", { x: "3", y: "4", width: "18", height: "12", rx: "2" }),
  /* @__PURE__ */ jsx("path", { d: "M8 21l4-5 4 5" }),
  /* @__PURE__ */ jsx("path", { d: "M8.5 10l2.2 2.2L15.5 8" })
] });
const ChartIcon = (p) => /* @__PURE__ */ jsx("svg", { ...base, ...p, children: /* @__PURE__ */ jsx("path", { d: "M4 20V10M10 20V4M16 20v-7M22 20H2" }) });
const LeafMark = (p) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", "aria-hidden": true, focusable: "false", ...p, children: /* @__PURE__ */ jsx("path", { d: "M3 21C3 11 9 3 21 3c0 12-8 18-18 18z", fill: "currentColor" }) });
const CloseIcon = (p) => /* @__PURE__ */ jsx("svg", { ...base, ...p, children: /* @__PURE__ */ jsx("path", { d: "M6 6l12 12M18 6L6 18" }) });
const CheckIcon = (p) => /* @__PURE__ */ jsx("svg", { ...base, strokeWidth: 2.4, ...p, children: /* @__PURE__ */ jsx("path", { d: "M5 12.5l4.5 4.5L19 7.5" }) });
const ChevronLeftIcon = (p) => /* @__PURE__ */ jsx("svg", { ...base, ...p, children: /* @__PURE__ */ jsx("path", { d: "M15 5l-7 7 7 7" }) });
const ChevronRightIcon = (p) => /* @__PURE__ */ jsx("svg", { ...base, ...p, children: /* @__PURE__ */ jsx("path", { d: "M9 5l7 7-7 7" }) });
const PhotoIcon = (p) => /* @__PURE__ */ jsxs("svg", { ...base, ...p, children: [
  /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "5" }),
  /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "4" }),
  /* @__PURE__ */ jsx("circle", { cx: "17.2", cy: "6.8", r: "0.9", fill: "currentColor", stroke: "none" })
] });
const PlayIcon = (p) => /* @__PURE__ */ jsx("svg", { ...base, ...p, children: /* @__PURE__ */ jsx("path", { d: "M8 5.5v13l11-6.5z", fill: "currentColor" }) });
const ExternalIcon = (p) => /* @__PURE__ */ jsx("svg", { ...base, ...p, children: /* @__PURE__ */ jsx("path", { d: "M7 17L17 7M9 7h8v8" }) });
const TYPE_LABEL = {
  image: "Post",
  video: "Vídeo",
  carousel: "Álbum"
};
function PostCard({ post }) {
  const [broken, setBroken] = useState(false);
  const type = post.type ?? "image";
  const when = relativeTime(post.timestamp);
  return /* @__PURE__ */ jsx("li", { className: "igcard", children: /* @__PURE__ */ jsxs(
    "a",
    {
      className: "igcard__link",
      href: post.permalink,
      target: "_blank",
      rel: "noopener noreferrer",
      draggable: false,
      "aria-label": post.caption ? void 0 : "Ver publicação no Instagram",
      children: [
        /* @__PURE__ */ jsxs("figure", { className: "igcard__media", children: [
          broken ? /* @__PURE__ */ jsx("span", { className: "igcard__fallback", "aria-hidden": "true", children: /* @__PURE__ */ jsx("img", { src: assets.brand.symbol, alt: "", width: 120, height: 120 }) }) : /* @__PURE__ */ jsx(
            "img",
            {
              src: post.image,
              alt: post.alt ?? "",
              loading: "lazy",
              decoding: "async",
              draggable: false,
              onError: () => setBroken(true)
            }
          ),
          /* @__PURE__ */ jsxs("span", { className: "igcard__badge", children: [
            type === "video" ? /* @__PURE__ */ jsx(PlayIcon, { width: 12, height: 12 }) : /* @__PURE__ */ jsx(PhotoIcon, { width: 12, height: 12 }),
            TYPE_LABEL[type]
          ] }),
          post.sample && /* @__PURE__ */ jsx("span", { className: "igcard__sample", children: "Exemplo de layout" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "igcard__body", children: [
          /* @__PURE__ */ jsx("p", { className: "igcard__cap", children: post.caption || "Publicação do Instagram" }),
          /* @__PURE__ */ jsxs("div", { className: "igcard__foot", children: [
            /* @__PURE__ */ jsx("time", { dateTime: post.timestamp, children: when ?? "Instagram" }),
            /* @__PURE__ */ jsxs("span", { className: "igcard__view", children: [
              "Ver no Instagram",
              /* @__PURE__ */ jsx(ExternalIcon, { width: 14, height: 14 }),
              /* @__PURE__ */ jsx("span", { className: "sr-only", children: " (abre em nova aba)" })
            ] })
          ] })
        ] })
      ]
    }
  ) });
}
function Placeholders({ busy }) {
  return /* @__PURE__ */ jsx("ul", { className: "igreel igreel--static", "aria-hidden": "true", "aria-busy": busy, children: [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsxs("li", { className: "igcard igcard--ph", children: [
    /* @__PURE__ */ jsxs("div", { className: "igcard__media", children: [
      /* @__PURE__ */ jsx("span", { className: "igcard__fallback", children: /* @__PURE__ */ jsx("img", { src: assets.brand.symbol, alt: "", width: 120, height: 120 }) }),
      /* @__PURE__ */ jsx("span", { className: "igcard__badge", children: busy ? "Carregando" : "Em breve" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "igcard__body", children: [
      /* @__PURE__ */ jsx("span", { className: "igcard__bar" }),
      /* @__PURE__ */ jsx("span", { className: "igcard__bar igcard__bar--s" })
    ] })
  ] }, i)) });
}
function Community() {
  const { instagram } = useContent();
  const { status, posts } = useInstagramPosts(instagram.feedUrl, instagram.posts);
  const { track, thumb, edge, go, onPointerDown, onClickCapture } = useCarousel(status === "ready" ? posts.length : 0);
  const id = useId();
  const profile = void 0;
  const lead = status === "ready" ? "Acompanhe as publicações mais recentes do Viridis." : status === "error" ? "Não foi possível carregar as publicações agora. Tente novamente mais tarde." : status === "loading" ? "Carregando as publicações mais recentes." : "As publicações do Viridis vão aparecer aqui.";
  return /* @__PURE__ */ jsxs("section", { id: "comunidade", className: "section ach ig", "aria-labelledby": "ig-title", children: [
    /* @__PURE__ */ jsx("div", { className: "ach__bg", "aria-hidden": "true" }),
    /* @__PURE__ */ jsxs("div", { className: "wrap", children: [
      /* @__PURE__ */ jsxs(Reveal, { className: "ach__head", children: [
        /* @__PURE__ */ jsxs("p", { className: "eyebrow eyebrow--ondark", children: [
          /* @__PURE__ */ jsx("span", { className: "eyebrow__n", children: "06" }),
          /* @__PURE__ */ jsx("span", { className: "eyebrow__rule" }),
          "Comunidade"
        ] }),
        /* @__PURE__ */ jsx("h2", { id: "ig-title", className: "h2", children: "Viridis no Instagram" }),
        /* @__PURE__ */ jsx("p", { className: "ig__lead", role: "status", children: lead }),
        profile
      ] }),
      status === "ready" && posts.length > 0 ? /* @__PURE__ */ jsxs(Reveal, { className: "ig__car", role: "region", "aria-roledescription": "carousel", "aria-label": "Publicações do Instagram", delay: 80, children: [
        /* @__PURE__ */ jsx(
          "ul",
          {
            ref: track,
            id,
            className: "igreel",
            onPointerDown,
            onClickCapture,
            children: posts.map((p) => /* @__PURE__ */ jsx(PostCard, { post: p }, p.id))
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "igctl", children: [
          /* @__PURE__ */ jsx("div", { className: "igprog", "aria-hidden": "true", children: /* @__PURE__ */ jsx("span", { ref: thumb }) }),
          /* @__PURE__ */ jsxs("div", { className: "igbtns", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "igbtn",
                "aria-label": "Publicações anteriores",
                "aria-controls": id,
                "aria-disabled": edge.start,
                onClick: () => !edge.start && go(-1),
                children: /* @__PURE__ */ jsx(ChevronLeftIcon, {})
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "igbtn",
                "aria-label": "Próximas publicações",
                "aria-controls": id,
                "aria-disabled": edge.end,
                onClick: () => !edge.end && go(1),
                children: /* @__PURE__ */ jsx(ChevronRightIcon, {})
              }
            )
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsx(Reveal, { className: "ig__soon", delay: 80, children: /* @__PURE__ */ jsx(Placeholders, { busy: status === "loading" }) })
    ] })
  ] });
}
const prefersReduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function useTypewriter(text, cps = 70) {
  const [st, setSt] = useState({ text: "", n: 0 });
  const skipped = useRef("");
  const reduce = prefersReduced();
  const count = reduce ? text.length : st.text === text ? st.n : 0;
  useEffect(() => {
    skipped.current = "";
    if (reduce || !text) return;
    let raf = 0;
    let last = -1;
    const t0 = performance.now() + 140;
    const tick = (now) => {
      if (skipped.current === text) return;
      const n = Math.min(text.length, Math.max(0, Math.floor((now - t0) / 1e3 * cps)));
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
function usePlatformEntry() {
  const { user, role } = useAuth();
  if (user && role) {
    return { to: homePathFor(role), label: "Ir para o meu espaço", authed: true };
  }
  return { to: "/login", label: "Entrar na plataforma", authed: false };
}
function Mascot({ mood, talking }) {
  const happy = mood !== "talk";
  return /* @__PURE__ */ jsxs("div", { className: "mascot", "data-mood": mood, "data-talking": talking || void 0, children: [
    /* @__PURE__ */ jsx(
      "img",
      {
        className: "mascot__img",
        "data-on": !happy || void 0,
        src: assets.brand.mascotPoint,
        width: 376,
        height: 511,
        alt: ""
      }
    ),
    /* @__PURE__ */ jsx(
      "img",
      {
        className: "mascot__img",
        "data-on": happy || void 0,
        src: assets.brand.mascotHappy,
        width: 360,
        height: 727,
        alt: ""
      }
    )
  ] });
}
const GREETING = "Oi! Eu sou o mascote do Viridis. Escolha uma pergunta e eu te conto tudo.";
const OUTRO = "Você explorou todas as dúvidas! Que tal conhecer o Viridis mais de perto?";
function FaqModal({ open, items, visited, current, onSelect, onReset, onClose }) {
  const dialog = useRef(null);
  const choices = useRef([]);
  const closing = useRef(false);
  const stage = useRef(null);
  const total = items.length;
  const count = visited.length;
  const complete = total > 0 && count >= total;
  const item = items.find((i) => i.id === current) ?? null;
  const text = item ? item.a : GREETING;
  const { shown, rest, done, skip } = useTypewriter(open ? text : "");
  const mood = complete && done ? "cheer" : item ? "talk" : "greet";
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) {
      closing.current = false;
      d.showModal();
      requestAnimationFrame(() => requestAnimationFrame(() => d.dataset.state = "open"));
      const first = choices.current.find((b, i) => b && !visited.includes(items[i]?.id)) ?? choices.current[0];
      first?.focus({ preventScroll: true });
    }
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
      reduce ? 0 : 170
    );
  }, [onClose]);
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onCancel = (e) => {
      e.preventDefault();
      requestClose();
    };
    d.addEventListener("cancel", onCancel);
    return () => d.removeEventListener("cancel", onCancel);
  }, [requestClose]);
  const pick = (id) => {
    onSelect(id);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => stage.current?.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" }));
  };
  const onKeyDown = (e) => {
    const t = e.target;
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
  return /* @__PURE__ */ jsx(
    "dialog",
    {
      ref: dialog,
      className: "faq",
      "aria-labelledby": "faq-title",
      onClick: (e) => e.target === dialog.current && requestClose(),
      onKeyDown,
      children: /* @__PURE__ */ jsxs("div", { className: "faq__panel", children: [
        /* @__PURE__ */ jsxs("header", { className: "faq__head", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("p", { className: "eyebrow eyebrow--ondark", children: [
              /* @__PURE__ */ jsx("span", { className: "eyebrow__rule" }),
              "Conversa com o mascote"
            ] }),
            /* @__PURE__ */ jsx("h2", { id: "faq-title", className: "faq__title", children: "Dúvidas frequentes" })
          ] }),
          /* @__PURE__ */ jsx("button", { type: "button", className: "faq__close", onClick: requestClose, "aria-label": "Fechar conversa", children: /* @__PURE__ */ jsx(CloseIcon, {}) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "faq__progress", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "faq__bar",
              role: "progressbar",
              "aria-label": "Perguntas exploradas",
              "aria-valuemin": 0,
              "aria-valuemax": total,
              "aria-valuenow": count,
              "aria-valuetext": `${count} de ${total} perguntas exploradas`,
              children: /* @__PURE__ */ jsx("span", { style: { transform: `scaleX(${pct})` } })
            }
          ),
          /* @__PURE__ */ jsxs("p", { className: "faq__count", "aria-hidden": "true", children: [
            /* @__PURE__ */ jsx("strong", { children: count }),
            " de ",
            total
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "faq__stage", ref: stage, children: [
          /* @__PURE__ */ jsx(Mascot, { mood, talking: !done }),
          /* @__PURE__ */ jsxs("div", { className: "faq__bubble", onClick: skip, "data-done": done || void 0, children: [
            /* @__PURE__ */ jsx("p", { className: "sr-only", role: "status", "aria-live": "polite", children: done ? text : "" }),
            /* @__PURE__ */ jsxs("p", { className: "faq__text", "aria-hidden": "true", children: [
              shown,
              /* @__PURE__ */ jsx("span", { className: "faq__ghost", children: rest })
            ] }),
            !done && /* @__PURE__ */ jsx("button", { type: "button", className: "faq__skip", onClick: skip, children: "Pular" })
          ] })
        ] }),
        complete && done && /* @__PURE__ */ jsxs("div", { className: "faq__reward", role: "group", "aria-label": "Recompensa", children: [
          /* @__PURE__ */ jsxs("div", { className: "faq__medal", "aria-hidden": "true", children: [
            /* @__PURE__ */ jsx("img", { src: assets.medal("b03"), alt: "", width: 491, height: 520 }),
            Array.from({ length: 8 }, (_, i) => /* @__PURE__ */ jsx(LeafMark, { className: "faq__spark", style: { "--a": `${i * 45}deg` }, width: 16, height: 16 }, i))
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "faq__reward-copy", children: [
            /* @__PURE__ */ jsx("p", { className: "faq__reward-title", children: "Conversa completa!" }),
            /* @__PURE__ */ jsx("p", { className: "faq__reward-text", children: OUTRO }),
            /* @__PURE__ */ jsxs("div", { className: "faq__reward-cta", children: [
              /* @__PURE__ */ jsxs(Link, { className: "btn btn--led", to: entry.to, onClick: requestClose, children: [
                entry.label,
                /* @__PURE__ */ jsx(ArrowIcon, { width: 18, height: 18 })
              ] }),
              /* @__PURE__ */ jsx("a", { className: "btn btn--ghost", href: "#funcionalidades", onClick: requestClose, children: "Conhecer as funcionalidades" }),
              /* @__PURE__ */ jsx("button", { type: "button", className: "btn btn--ghost", onClick: onReset, children: "Recomeçar" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "faq__choices", children: [
          /* @__PURE__ */ jsx("p", { className: "faq__prompt hand", id: "faq-prompt", children: "Escolha uma pergunta" }),
          /* @__PURE__ */ jsx("ul", { "aria-labelledby": "faq-prompt", children: items.map((it, i) => {
            const seen = visited.includes(it.id);
            const on = it.id === current;
            return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                ref: (el) => {
                  choices.current[i] = el;
                },
                className: "choice",
                "data-visited": seen || void 0,
                "aria-current": on || void 0,
                onClick: () => pick(it.id),
                children: [
                  /* @__PURE__ */ jsx("span", { className: "choice__mark", "aria-hidden": "true", children: seen ? /* @__PURE__ */ jsx(CheckIcon, { width: 14, height: 14 }) : /* @__PURE__ */ jsx("span", { className: "choice__n", children: i + 1 }) }),
                  /* @__PURE__ */ jsx("span", { className: "choice__q", children: it.q }),
                  seen && /* @__PURE__ */ jsx("span", { className: "sr-only", children: " (já explorada)" })
                ]
              }
            ) }, it.id);
          }) })
        ] })
      ] })
    }
  );
}
const MAX_CHIPS = 8;
function FaqSection() {
  const { faq } = useContent();
  const [open, setOpen] = useState(false);
  const [visited, setVisited] = useState([]);
  const [current, setCurrent] = useState(null);
  const select = useCallback((id) => {
    setCurrent(id);
    setVisited((v) => v.includes(id) ? v : [...v, id]);
  }, []);
  const reset = useCallback(() => {
    setVisited([]);
    setCurrent(null);
  }, []);
  const openAt = (id) => {
    if (id) select(id);
    setOpen(true);
  };
  if (!faq.length) return null;
  const seen = visited.filter((id) => faq.some((f) => f.id === id)).length;
  const label = seen === 0 ? "Iniciar conversa" : seen >= faq.length ? "Rever conversa" : "Continuar conversa";
  return /* @__PURE__ */ jsxs("section", { id: "duvidas", className: "section faqs", "aria-labelledby": "duvidas-title", children: [
    /* @__PURE__ */ jsxs("div", { className: "wrap faqs__grid", children: [
      /* @__PURE__ */ jsxs(Reveal, { className: "faqs__text", children: [
        /* @__PURE__ */ jsxs("p", { className: "eyebrow", children: [
          /* @__PURE__ */ jsx("span", { className: "eyebrow__n", children: "07" }),
          /* @__PURE__ */ jsx("span", { className: "eyebrow__rule" }),
          "Dúvidas"
        ] }),
        /* @__PURE__ */ jsxs("h2", { id: "duvidas-title", className: "h2", children: [
          "Ficou com alguma ",
          /* @__PURE__ */ jsx("em", { children: "dúvida" }),
          "?"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "lead", children: "Converse com o mascote do Viridis: escolha uma pergunta e ele responde." }),
        /* @__PURE__ */ jsx("ul", { className: "faqs__chips", "aria-label": "Perguntas frequentes", children: faq.slice(0, MAX_CHIPS).map((f) => {
          const done = visited.includes(f.id);
          return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", { type: "button", className: "chip", "data-visited": done || void 0, onClick: () => openAt(f.id), children: [
            done && /* @__PURE__ */ jsx(CheckIcon, { width: 14, height: 14 }),
            /* @__PURE__ */ jsx("span", { children: f.q })
          ] }) }, f.id);
        }) }),
        /* @__PURE__ */ jsxs("button", { type: "button", className: "btn btn--solid", onClick: () => openAt(), "aria-haspopup": "dialog", children: [
          label,
          /* @__PURE__ */ jsx(ArrowIcon, { width: 18, height: 18 })
        ] }),
        seen > 0 && /* @__PURE__ */ jsxs("p", { className: "faqs__meta", children: [
          seen,
          " de ",
          faq.length,
          " perguntas exploradas"
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Reveal, { as: "figure", className: "faqs__figure", delay: 80, children: [
        /* @__PURE__ */ jsx("div", { className: "mission__plate", "aria-hidden": "true" }),
        /* @__PURE__ */ jsx(
          "img",
          {
            src: assets.brand.mascotHappy,
            width: 360,
            height: 727,
            loading: "lazy",
            decoding: "async",
            alt: "Mascote do Viridis, um robô de jardinagem com uma muda na cabeça, sorrindo"
          }
        ),
        /* @__PURE__ */ jsx("figcaption", { className: "faqs__note hand", "aria-hidden": "true", children: "vamos conversar?" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      FaqModal,
      {
        open,
        items: faq,
        visited,
        current,
        onSelect: select,
        onReset: reset,
        onClose: () => setOpen(false)
      }
    )
  ] });
}
function Features() {
  return /* @__PURE__ */ jsx("section", { id: "funcionalidades", className: "section features", "aria-labelledby": "func-title", children: /* @__PURE__ */ jsxs("div", { className: "wrap", children: [
    /* @__PURE__ */ jsxs(Reveal, { className: "features__head", children: [
      /* @__PURE__ */ jsxs("p", { className: "eyebrow", children: [
        /* @__PURE__ */ jsx("span", { className: "eyebrow__n", children: "03" }),
        /* @__PURE__ */ jsx("span", { className: "eyebrow__rule" }),
        "Funcionalidades principais"
      ] }),
      /* @__PURE__ */ jsxs("h2", { id: "func-title", className: "h2", children: [
        "Organize, jogue e ",
        /* @__PURE__ */ jsx("em", { children: "cultive" }),
        " juntos."
      ] })
    ] }),
    /* @__PURE__ */ jsxs("article", { className: "feature feature--schedule", children: [
      /* @__PURE__ */ jsxs(Reveal, { className: "feature__copy", children: [
        /* @__PURE__ */ jsx("span", { className: "feature__k", children: "Planejar" }),
        /* @__PURE__ */ jsx("h3", { className: "feature__title", children: "Cronograma de Horários" }),
        /* @__PURE__ */ jsx("p", { className: "feature__text", children: "Organize seu grupo para uma atividade planejada com fácil visualização e acesso" })
      ] }),
      /* @__PURE__ */ jsxs(Reveal, { className: "feature__media", delay: 80, children: [
        /* @__PURE__ */ jsx("img", { className: "feature__leaves", src: assets.leaves, width: 900, height: 900, loading: "lazy", decoding: "async", alt: "" }),
        /* @__PURE__ */ jsxs("div", { className: "frame", children: [
          /* @__PURE__ */ jsxs("div", { className: "frame__bar", "aria-hidden": "true", children: [
            /* @__PURE__ */ jsx("i", {}),
            /* @__PURE__ */ jsx("i", {}),
            /* @__PURE__ */ jsx("i", {})
          ] }),
          /* @__PURE__ */ jsx(
            "img",
            {
              src: assets.schedule,
              width: 1609,
              height: 762,
              loading: "lazy",
              decoding: "async",
              alt: "Tela do cronograma de horários: tabela com blocos de horário por dia da semana"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("article", { className: "feature feature--medals", children: [
      /* @__PURE__ */ jsxs(Reveal, { className: "feature__media feature__media--medals", delay: 80, children: [
        /* @__PURE__ */ jsxs("div", { className: "medal-cluster", "aria-hidden": "true", children: [
          /* @__PURE__ */ jsx("img", { className: "mc mc--l", src: assets.medal("a01"), width: 499, height: 440, loading: "lazy", decoding: "async", alt: "" }),
          /* @__PURE__ */ jsx("img", { className: "mc mc--r", src: assets.medal("b02"), width: 407, height: 471, loading: "lazy", decoding: "async", alt: "" }),
          /* @__PURE__ */ jsx("img", { className: "mc mc--c", src: assets.medal("b03"), width: 491, height: 520, loading: "lazy", decoding: "async", alt: "" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "sr-only", children: "Medalhas do Viridis em estrela, escudo e laurel." })
      ] }),
      /* @__PURE__ */ jsxs(Reveal, { className: "feature__copy", children: [
        /* @__PURE__ */ jsx("span", { className: "feature__k", children: "Reconhecer" }),
        /* @__PURE__ */ jsx("h3", { className: "feature__title", children: "Ganhe Medalhas" }),
        /* @__PURE__ */ jsx("p", { className: "feature__text", children: "Faça recordes, fique no pódio e mais para ganhar medalhas!" })
      ] })
    ] })
  ] }) });
}
function Footer() {
  const { nav } = useContent();
  return /* @__PURE__ */ jsx("footer", { className: "ft", children: /* @__PURE__ */ jsxs("div", { className: "wrap ft__inner", children: [
    /* @__PURE__ */ jsxs("p", { className: "ft__slogan", children: [
      "É se divertindo",
      /* @__PURE__ */ jsx("br", {}),
      "que se ",
      /* @__PURE__ */ jsx("em", { children: "muda o mundo." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "ft__row", children: [
      /* @__PURE__ */ jsxs("div", { className: "ft__brand", children: [
        /* @__PURE__ */ jsx("span", { className: "ft__plate", children: /* @__PURE__ */ jsx("img", { src: assets.brand.logo, alt: "Viridis", width: 640, height: 170, loading: "lazy", decoding: "async" }) }),
        /* @__PURE__ */ jsx("p", { children: "Cultivando sustentabilidade através da educação • 2026" })
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "ft__nav", "aria-label": "Rodapé", children: [
        /* @__PURE__ */ jsx("p", { className: "ft__h", children: "Explorar" }),
        /* @__PURE__ */ jsx("ul", { children: nav.map((n) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: `#${n.id}`, children: n.label }) }, n.id)) })
      ] }),
      /* @__PURE__ */ jsxs("a", { className: "ft__top btn btn--ghost", href: "#inicio", children: [
        "Voltar ao topo",
        /* @__PURE__ */ jsx(ArrowUpIcon, { width: 18, height: 18 })
      ] })
    ] })
  ] }) });
}
function Goals() {
  const { goals } = useContent();
  if (!goals.length) return null;
  return /* @__PURE__ */ jsx("section", { id: "ods", className: "section goals", "aria-labelledby": "ods-title", children: /* @__PURE__ */ jsxs("div", { className: "wrap", children: [
    /* @__PURE__ */ jsxs(Reveal, { className: "goals__head", children: [
      /* @__PURE__ */ jsxs("p", { className: "eyebrow", children: [
        /* @__PURE__ */ jsx("span", { className: "eyebrow__n", children: "02" }),
        /* @__PURE__ */ jsx("span", { className: "eyebrow__rule" }),
        "Agenda 2030"
      ] }),
      /* @__PURE__ */ jsx("h2", { id: "ods-title", className: "h2", children: "Objetivos de Desenvolvimento Sustentável" }),
      /* @__PURE__ */ jsx("p", { className: "lead", children: "O Viridis contribui diretamente para os ODS da ONU" })
    ] }),
    /* @__PURE__ */ jsx("ul", { className: "goals__grid", children: goals.map((g, i) => /* @__PURE__ */ jsx(
      Reveal,
      {
        as: "li",
        delay: i * 60,
        className: "goal-li",
        children: /* @__PURE__ */ jsxs("div", { className: "goal", style: { "--c": g.color, "--on": g.on }, children: [
          /* @__PURE__ */ jsxs("div", { className: "goal__block", children: [
            /* @__PURE__ */ jsx("span", { className: "goal__tag", children: "ODS" }),
            /* @__PURE__ */ jsx("strong", { className: "goal__n", children: g.n })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "goal__label", children: g.label })
        ] })
      },
      g.n
    )) })
  ] }) });
}
const subscribe = (onChange) => {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => mo.disconnect();
};
const getSnapshot = () => document.documentElement.classList.contains("dark") ? "dark" : "light";
const getServerSnapshot = () => "light";
function useLandingTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const toggle = useCallback((origin) => {
    const root = document.documentElement;
    const next = root.classList.contains("dark") ? "light" : "dark";
    const apply = () => root.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
    }
    const doc = document;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!doc.startViewTransition || reduce || !origin) {
      apply();
      return;
    }
    const b = origin.getBoundingClientRect();
    root.style.setProperty("--vt-x", `${b.left + b.width / 2}px`);
    root.style.setProperty("--vt-y", `${b.top + b.height / 2}px`);
    root.setAttribute("data-lp-vt", "");
    const t = doc.startViewTransition(apply);
    const done = () => root.removeAttribute("data-lp-vt");
    t.finished.then(done, done);
  }, []);
  return { theme, toggle };
}
function ThemeToggle() {
  const { theme, toggle } = useLandingTheme();
  const ref = useRef(null);
  const dark = theme === "dark";
  return /* @__PURE__ */ jsxs(
    "button",
    {
      ref,
      type: "button",
      className: "theme-toggle",
      "aria-label": dark ? "Mudar para o tema claro" : "Mudar para o tema escuro",
      "aria-pressed": dark,
      onClick: () => toggle(ref.current),
      children: [
        /* @__PURE__ */ jsx(SunIcon, { className: "theme-toggle__i theme-toggle__sun" }),
        /* @__PURE__ */ jsx(MoonIcon, { className: "theme-toggle__i theme-toggle__moon" })
      ]
    }
  );
}
function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0] ?? "");
  const key = ids.join("|");
  useEffect(() => {
    const list = key ? key.split("|") : [];
    const els = list.map((id) => document.getElementById(id)).filter((el) => !!el);
    if (!els.length || !("IntersectionObserver" in window)) return;
    const hit = /* @__PURE__ */ new Set();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) hit.add(e.target.id);
          else hit.delete(e.target.id);
        }
        const current = [...els].reverse().find((el) => hit.has(el.id));
        if (current) setActive(current.id);
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);
  return active;
}
const BREAKPOINT = { public: 1e3, app: 1180 };
function Header() {
  const { nav } = useContent();
  const { user, role } = useAuth();
  const mode = user ? "app" : "public";
  const appItems = navItemsFor(role);
  const active = useScrollSpy(nav.map((n) => n.id));
  const [open, setOpen] = useState(false);
  const btn = useRef(null);
  const panel = useRef(null);
  const bp = BREAKPOINT[mode];
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    const onDown = (e) => {
      const t = e.target;
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
  return /* @__PURE__ */ jsxs("header", { className: "hd", "data-open": open || void 0, "data-mode": mode, children: [
    /* @__PURE__ */ jsxs("div", { className: "hd__bar", children: [
      /* @__PURE__ */ jsx("a", { className: "hd__logo", href: "#inicio", "aria-label": "Viridis — início", children: /* @__PURE__ */ jsx("img", { src: assets.brand.logo, alt: "Viridis", width: 640, height: 170 }) }),
      /* @__PURE__ */ jsx("nav", { className: "hd__nav", "aria-label": "Principal", children: user ? appItems.map(({ to, label }) => /* @__PURE__ */ jsx(Link, { to, title: label, children: label }, to)) : nav.map((n) => /* @__PURE__ */ jsx(
        "a",
        {
          href: `#${n.id}`,
          title: n.label,
          "aria-current": active === n.id ? "location" : void 0,
          children: n.label
        },
        n.id
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "hd__tools", children: [
        user ? /* @__PURE__ */ jsx(NavUserActions, {}) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("span", { className: "hd__theme", children: /* @__PURE__ */ jsx(ThemeToggle, {}) }),
          /* @__PURE__ */ jsx(Link, { to: "/login", className: "btn btn--led hd__cta", children: "Entrar" })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            ref: btn,
            type: "button",
            className: "hd__menu",
            "aria-expanded": open,
            "aria-controls": "menu-mobile",
            "aria-label": open ? "Fechar menu" : "Abrir menu",
            onClick: () => setOpen((v) => !v),
            children: /* @__PURE__ */ jsxs("span", { className: "hd__bars", "aria-hidden": "true", children: [
              /* @__PURE__ */ jsx("i", {}),
              /* @__PURE__ */ jsx("i", {})
            ] })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { id: "menu-mobile", ref: panel, className: "hd__panel", inert: !open, children: [
      /* @__PURE__ */ jsx("nav", { "aria-label": "Menu", children: user ? appItems.map(({ to, label }) => /* @__PURE__ */ jsx(Link, { to, onClick: () => setOpen(false), children: label }, to)) : nav.map((n) => /* @__PURE__ */ jsx(
        "a",
        {
          href: `#${n.id}`,
          "aria-current": active === n.id ? "location" : void 0,
          onClick: () => setOpen(false),
          children: n.label
        },
        n.id
      )) }),
      !user && /* @__PURE__ */ jsxs("div", { className: "hd__panel-foot", children: [
        /* @__PURE__ */ jsx("span", { children: "Tema" }),
        /* @__PURE__ */ jsx(ThemeToggle, {})
      ] })
    ] })
  ] });
}
function Hero() {
  const { facts } = useContent();
  const entry = usePlatformEntry();
  return /* @__PURE__ */ jsxs("section", { id: "inicio", className: "hero", "aria-labelledby": "hero-title", children: [
    /* @__PURE__ */ jsx("div", { className: "hero__bg", "aria-hidden": "true" }),
    /* @__PURE__ */ jsxs("div", { className: "hero__inner wrap", children: [
      /* @__PURE__ */ jsxs("div", { className: "hero__copy", children: [
        /* @__PURE__ */ jsxs("p", { className: "eyebrow eyebrow--ondark hero__in", style: { "--i": 0 }, children: [
          /* @__PURE__ */ jsx("span", { className: "eyebrow__rule" }),
          "Plataforma gamificada · hortas escolares"
        ] }),
        /* @__PURE__ */ jsxs("h1", { id: "hero-title", className: "hero__title hero__in", style: { "--i": 1 }, children: [
          /* @__PURE__ */ jsx("span", { className: "hero__line", children: "É se divertindo" }),
          /* @__PURE__ */ jsx("span", { className: "hero__line hero__line--accent", children: "que se muda" }),
          /* @__PURE__ */ jsx("span", { className: "hero__line hero__line--accent", children: "o mundo." })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "hero__lead hero__in", style: { "--i": 2 }, children: "Plataforma gamificada para hortas escolares com foco em aprendizagem socioemocional, nutrição e sustentabilidade" }),
        /* @__PURE__ */ jsxs("div", { className: "hero__cta hero__in", style: { "--i": 3 }, children: [
          /* @__PURE__ */ jsxs(Link, { className: "btn btn--led", to: entry.to, children: [
            entry.label,
            /* @__PURE__ */ jsx(ArrowIcon, { width: 18, height: 18 })
          ] }),
          /* @__PURE__ */ jsx("a", { className: "btn btn--ghost", href: "#missao", children: "Conheça a missão" }),
          /* @__PURE__ */ jsx("a", { className: "btn btn--ghost", href: "#funcionalidades", children: "Ver funcionalidades" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "hero__stage", "aria-hidden": "false", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            className: "hero__garden",
            src: assets.garden.src,
            width: 1200,
            height: 1200,
            alt: "Horta isométrica com plantas e vasos sobre uma base elevada",
            fetchPriority: "high"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "hero__mascot", children: [
          /* @__PURE__ */ jsx("p", { className: "hero__bubble hand", "aria-hidden": "true", children: "Vamos cultivar!" }),
          /* @__PURE__ */ jsx(
            "img",
            {
              src: assets.brand.mascotPoint,
              width: 376,
              height: 511,
              alt: "Mascote do Viridis: um robô de jardinagem com uma muda na cabeça, apontando para a horta"
            }
          )
        ] })
      ] }),
      facts.length > 0 && /* @__PURE__ */ jsx("ul", { className: "hero__facts hero__in", style: { "--i": 4 }, "aria-label": "Eixos do Viridis", children: facts.map((f) => /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx(LeafMark, { width: 14, height: 14 }),
        /* @__PURE__ */ jsx("span", { children: f })
      ] }, f)) })
    ] })
  ] });
}
const STATS = [
  { value: "24", label: "Plantas acompanhadas" },
  { value: "186", label: "Alunos participantes" },
  { value: "77 mil", label: "Pontos conquistados" }
];
const PILLARS = [
  {
    icon: BookOpen,
    title: "Aprendizagem aplicada",
    desc: "Conteúdo sobre plantio, nutrição, compostagem e manejo, ligado à prática na escola."
  },
  {
    icon: Sprout,
    title: "Horta acompanhada",
    desc: "Registro de atividades e evolução do jardim com validação dos educadores."
  },
  {
    icon: TrendingUp,
    title: "Impacto visível",
    desc: "Indicadores de participação, crescimento e sustentabilidade para apoiar decisões."
  },
  {
    icon: Award,
    title: "Reconhecimento",
    desc: "Pontos, conquistas e benefícios de parceiros que valorizam a evolução dos alunos."
  }
];
function Impact() {
  return /* @__PURE__ */ jsx("section", { id: "impacto", className: "section impact", "aria-labelledby": "impacto-title", children: /* @__PURE__ */ jsxs("div", { className: "wrap", children: [
    /* @__PURE__ */ jsxs(Reveal, { className: "impact__head", children: [
      /* @__PURE__ */ jsxs("p", { className: "eyebrow", children: [
        /* @__PURE__ */ jsx("span", { className: "eyebrow__rule" }),
        "Uma plataforma, uma jornada"
      ] }),
      /* @__PURE__ */ jsxs("h2", { id: "impacto-title", className: "h2", children: [
        "Da teoria ao ",
        /* @__PURE__ */ jsx("em", { children: "impacto real" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "lead", children: "Recursos conectados em um fluxo claro para apoiar toda a comunidade escolar." })
    ] }),
    /* @__PURE__ */ jsx("ol", { className: "impact__list", children: PILLARS.map(({ icon: Icon, title, desc }, i) => /* @__PURE__ */ jsxs(Reveal, { as: "li", delay: i * 60, className: "impact__item", children: [
      /* @__PURE__ */ jsx("span", { className: "impact__n", "aria-hidden": "true", children: String(i + 1).padStart(2, "0") }),
      /* @__PURE__ */ jsx("span", { className: "impact__icon", children: /* @__PURE__ */ jsx(Icon, { width: 22, height: 22, "aria-hidden": "true" }) }),
      /* @__PURE__ */ jsx("h3", { className: "impact__title", children: title }),
      /* @__PURE__ */ jsx("p", { className: "impact__text", children: desc })
    ] }, title)) }),
    /* @__PURE__ */ jsx(Reveal, { as: "dl", className: "impact__stats", delay: 80, children: STATS.map((s) => /* @__PURE__ */ jsxs("div", { className: "impact__stat", children: [
      /* @__PURE__ */ jsx("dt", { children: s.label }),
      /* @__PURE__ */ jsx("dd", { children: s.value })
    ] }, s.label)) })
  ] }) });
}
function useOffscreenPause() {
  const ref = useRef(null);
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
const COPIES = 4;
function Marquee() {
  const { marquee } = useContent();
  const ref = useOffscreenPause();
  if (!marquee.length) return null;
  return /* @__PURE__ */ jsxs("div", { className: "marquee", ref, children: [
    /* @__PURE__ */ jsxs("p", { className: "sr-only", children: [
      marquee.join(", "),
      "."
    ] }),
    /* @__PURE__ */ jsx("div", { className: "marquee__track", "aria-hidden": "true", children: Array.from({ length: COPIES }, (_, c) => /* @__PURE__ */ jsx("ul", { className: "marquee__group", "data-copy": c > 0 || void 0, children: marquee.map((w, i) => /* @__PURE__ */ jsxs("li", { className: i % 2 ? "is-outline" : void 0, children: [
      /* @__PURE__ */ jsx("span", { children: w }),
      /* @__PURE__ */ jsx(LeafMark, { className: "marquee__leaf", width: 22, height: 22 })
    ] }, w)) }, c)) })
  ] });
}
function Mission() {
  return /* @__PURE__ */ jsx("section", { id: "missao", className: "section mission", "aria-labelledby": "missao-title", children: /* @__PURE__ */ jsxs("div", { className: "wrap mission__grid", children: [
    /* @__PURE__ */ jsxs(Reveal, { className: "mission__text", children: [
      /* @__PURE__ */ jsxs("p", { className: "eyebrow", children: [
        /* @__PURE__ */ jsx("span", { className: "eyebrow__n", children: "01" }),
        /* @__PURE__ */ jsx("span", { className: "eyebrow__rule" }),
        "Nossa missão"
      ] }),
      /* @__PURE__ */ jsxs("h2", { id: "missao-title", className: "h2 mission__title", children: [
        "Transformar a educação através de ",
        /* @__PURE__ */ jsx("em", { children: "hortas escolares" }),
        " interativas,"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "lead mission__body", children: "promovendo sustentabilidade, nutrição e consciência ambiental entre estudantes, professores e comunidades." })
    ] }),
    /* @__PURE__ */ jsxs(Reveal, { as: "figure", className: "mission__figure", delay: 80, children: [
      /* @__PURE__ */ jsx("div", { className: "mission__plate", "aria-hidden": "true" }),
      /* @__PURE__ */ jsx(
        "img",
        {
          src: assets.sprout,
          width: 1600,
          height: 900,
          loading: "lazy",
          decoding: "async",
          alt: "Muda crescendo em solo fértil, sustentada por mãos com luvas"
        }
      ),
      /* @__PURE__ */ jsx("figcaption", { className: "mission__note hand", "aria-hidden": "true", children: "uma muda de cada vez" })
    ] })
  ] }) });
}
const ICONS = {
  estudantes: /* @__PURE__ */ jsx(SproutIcon, { width: 26, height: 26 }),
  professores: /* @__PURE__ */ jsx(BoardIcon, { width: 26, height: 26 }),
  administradores: /* @__PURE__ */ jsx(ChartIcon, { width: 26, height: 26 })
};
function Profiles() {
  const { profiles } = useContent();
  if (!profiles.length) return null;
  return /* @__PURE__ */ jsx("section", { id: "perfis", className: "section profiles", "aria-labelledby": "perfis-title", children: /* @__PURE__ */ jsxs("div", { className: "wrap", children: [
    /* @__PURE__ */ jsxs(Reveal, { className: "profiles__head", children: [
      /* @__PURE__ */ jsxs("p", { className: "eyebrow", children: [
        /* @__PURE__ */ jsx("span", { className: "eyebrow__n", children: "05" }),
        /* @__PURE__ */ jsx("span", { className: "eyebrow__rule" }),
        "Quem participa"
      ] }),
      /* @__PURE__ */ jsx("h2", { id: "perfis-title", className: "h2", children: "Múltiplos perfis de acesso" })
    ] }),
    /* @__PURE__ */ jsx("ul", { className: "profiles__grid", children: profiles.map((p, i) => /* @__PURE__ */ jsx(Reveal, { as: "li", delay: i * 70, className: "profile-li", children: /* @__PURE__ */ jsxs("div", { className: `profile profile--${p.id}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "profile__top", children: [
        /* @__PURE__ */ jsx("span", { className: "profile__icon", children: ICONS[p.id] ?? /* @__PURE__ */ jsx(LeafMark, { width: 22, height: 22 }) }),
        /* @__PURE__ */ jsx("span", { className: "profile__n", "aria-hidden": "true", children: String(i + 1).padStart(2, "0") })
      ] }),
      /* @__PURE__ */ jsx("h3", { className: "profile__title", children: p.title }),
      /* @__PURE__ */ jsx("p", { className: "profile__role hand", children: p.role }),
      p.actions.length > 0 && /* @__PURE__ */ jsx("ul", { className: "profile__list", children: p.actions.map((a) => /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx(LeafMark, { width: 12, height: 12 }),
        /* @__PURE__ */ jsx("span", { children: a })
      ] }, a)) })
    ] }) }, p.id)) })
  ] }) });
}
function LandingPage() {
  useLayoutEffect(() => {
    document.documentElement.classList.add("js");
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "lp", suppressHydrationWarning: true, children: [
    /* @__PURE__ */ jsx("a", { className: "skip", href: "#conteudo", children: "Pular para o conteúdo" }),
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("main", { id: "conteudo", tabIndex: -1, children: [
      /* @__PURE__ */ jsx(Hero, {}),
      /* @__PURE__ */ jsx(Marquee, {}),
      /* @__PURE__ */ jsx(Mission, {}),
      /* @__PURE__ */ jsx(Goals, {}),
      /* @__PURE__ */ jsx(Features, {}),
      /* @__PURE__ */ jsx(Impact, {}),
      /* @__PURE__ */ jsx(Achievements, {}),
      /* @__PURE__ */ jsx(Profiles, {}),
      /* @__PURE__ */ jsx(Community, {}),
      /* @__PURE__ */ jsx(FaqSection, {})
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const SplitComponent = LandingPage;
export {
  SplitComponent as component
};
