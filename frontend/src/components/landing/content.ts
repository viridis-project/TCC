import { INSTAGRAM } from "./config";
import type { InstagramPost } from "./instagram";

/** Todo o conteúdo editorial da página. Textos originais do projeto Viridis preservados. */

export type NavItem = { id: string; label: string };
export type Goal = { n: string; label: string; color: string; on: string };
export type Profile = { id: string; title: string; role: string; actions: string[] };
export type FaqItem = { id: string; q: string; a: string };

export type Content = {
  nav: NavItem[];
  marquee: string[];
  facts: string[];
  goals: Goal[];
  profiles: Profile[];
  collection: string[];
  instagram: { profileUrl?: string; handle?: string; feedUrl?: string; posts: InstagramPost[] };
  faq: FaqItem[];
};

export const NAV: NavItem[] = [
  { id: "inicio", label: "Início" },
  { id: "missao", label: "Missão" },
  { id: "ods", label: "ODS" },
  { id: "funcionalidades", label: "Funcionalidades" },
  { id: "conquistas", label: "Conquistas" },
  { id: "perfis", label: "Perfis" },
  { id: "comunidade", label: "Comunidade" },
  { id: "duvidas", label: "Dúvidas" },
];

/**
 * Cores oficiais dos ODS (ONU). `on` = cor de texto com contraste suficiente sobre o bloco colorido.
 */
export const GOALS: Goal[] = [
  { n: "2", label: "Fome Zero e Agricultura Sustentável", color: "#dda63a", on: "#14241a" },
  { n: "3", label: "Saúde e Bem-Estar", color: "#4c9f38", on: "#14241a" },
  { n: "4", label: "Educação de Qualidade", color: "#c5192d", on: "#ffffff" },
  { n: "12", label: "Consumo e Produção Responsáveis", color: "#bf8b2e", on: "#14241a" },
  { n: "15", label: "Vida Terrestre", color: "#56c02b", on: "#14241a" },
];

export const PROFILES: Profile[] = [
  {
    id: "estudantes",
    title: "Estudantes",
    role: "Aprender jogando",
    actions: [
      "Aprendem sobre sustentabilidade",
      "Acumulam pontos",
      "Competem em rankings",
      "Resgatam recompensas",
    ],
  },
  {
    id: "professores",
    title: "Professores",
    role: "Acompanhar a turma",
    actions: [
      "Aprovam atividades dos alunos",
      "Acompanham desempenho das turmas",
      "Gerenciam conteúdo",
    ],
  },
  {
    id: "administradores",
    title: "Administradores",
    role: "Enxergar o impacto",
    actions: [
      "Visualizam métricas institucionais",
      "Gerenciam parcerias",
      "Monitoram impacto dos ODS",
    ],
  },
];

/** Medalhas extras (recortes da folha de medalhas original). b01–b03 formam o pódio. */
export const COLLECTION = [
  "a01", "b04", "a09", "b07", "a03", "b08", "a05", "b05", "a02", "b09", "a07", "a04", "b10", "a06", "a08",
];

/**
 * FAQ — todas as respostas vêm do conteúdo já publicado na página (missão, perfis,
 * gamificação, medalhas, cronograma e ODS). Nenhuma informação nova foi inventada.
 */
export const FAQ: FaqItem[] = [
  {
    id: "o-que-e",
    q: "O que é o Viridis?",
    a: "O Viridis é uma plataforma gamificada para hortas escolares, com foco em aprendizagem socioemocional, nutrição e sustentabilidade. Nosso lema: é se divertindo que se muda o mundo!",
  },
  {
    id: "missao",
    q: "Qual é a missão do Viridis?",
    a: "Transformar a educação através de hortas escolares interativas, promovendo sustentabilidade, nutrição e consciência ambiental entre estudantes, professores e comunidades.",
  },
  {
    id: "quem-participa",
    q: "Quem participa da plataforma?",
    a: "Existem três perfis de acesso: estudantes, professores e administradores. Os estudantes aprendem e acumulam pontos, os professores acompanham as turmas e os administradores visualizam as métricas e o impacto.",
  },
  {
    id: "gamificacao",
    q: "Como funciona a gamificação?",
    a: "Os estudantes aprendem sobre sustentabilidade, acumulam pontos, competem em rankings e resgatam recompensas.",
  },
  {
    id: "medalhas",
    q: "Como eu ganho medalhas?",
    a: "Fazendo recordes e ficando no pódio! Há medalhas para o primeiro, o segundo e o terceiro lugar na pontuação do ranking da sua sala.",
  },
  {
    id: "cronograma",
    q: "Para que serve o cronograma de horários?",
    a: "Para organizar seu grupo em uma atividade planejada, com fácil visualização e acesso.",
  },
  {
    id: "ods",
    q: "Quais ODS o Viridis apoia?",
    a: "O Viridis contribui diretamente para cinco ODS da ONU: 2 (Fome Zero e Agricultura Sustentável), 3 (Saúde e Bem-Estar), 4 (Educação de Qualidade), 12 (Consumo e Produção Responsáveis) e 15 (Vida Terrestre).",
  },
];

export const DEMO: Content = {
  nav: NAV,
  marquee: ["Cultivar", "Aprender", "Transformar", "Sustentabilidade", "Educação"],
  facts: ["Aprendizagem socioemocional", "Nutrição", "Sustentabilidade", "Comunidade escolar"],
  goals: GOALS,
  profiles: PROFILES,
  collection: COLLECTION,
  instagram: INSTAGRAM,
  faq: FAQ,
};
