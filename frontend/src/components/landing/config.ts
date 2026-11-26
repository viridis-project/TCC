/**
 * Configuração editável do site. Nada aqui é dado oficial inventado:
 * enquanto os campos estiverem vazios, os recursos mostram estados honestos
 * ("em breve") em vez de conteúdo de exemplo.
 */
import type { InstagramPost } from "./instagram";

/** Perfil e publicações do Instagram do Viridis. */
export const INSTAGRAM: {
  /** URL oficial do perfil, ex.: "https://www.instagram.com/<perfil>/". Vazio = sem botão de seguir. */
  profileUrl?: string;
  /** Nome exibido do perfil, ex.: "@perfil". */
  handle?: string;
  /**
   * URL de um endpoint JSON seu (função serverless/proxy) que devolve as publicações recentes.
   * O token da API do Instagram NUNCA vai para o navegador: ele fica nesse servidor.
   * Formato em instagram.ts. Não é um endpoint do backend do Viridis: é opcional e está vazio.
   */
  feedUrl?: string;
  /** Publicações fixas (curadoria manual). Usadas quando não há feedUrl. */
  posts: InstagramPost[];
} = {
  profileUrl: undefined,
  handle: undefined,
  feedUrl: undefined,
  posts: [],
};
