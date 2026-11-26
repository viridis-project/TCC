import { DEMO, type Content } from "./content";

/**
 * Fronteira de dados da landing. O conteúdo institucional é 100% local (content.ts + config.ts):
 * não há endpoint nem backend envolvido. Se um dia vier de uma API, é só trocar aqui.
 */
export function useContent(): Content {
  return DEMO;
}
