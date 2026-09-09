export const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:8081/api").replace(
  /\/$/,
  "",
);
export const isImageSource = (value: string | null | undefined) =>
  Boolean(value && /^(?:https?:\/\/|\/|blob:|data:image\/)/i.test(value));

export const backendAsset = (path: string) =>
  /^(?:https?:\/\/|blob:|data:)/i.test(path) ? path : `${new URL(API_URL).origin}${path}`;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = payload.detalhe ? ` (${payload.detalhe})` : "";
    throw new ApiError(
      `${payload.erro ?? "Não foi possível concluir a operação"}${detail}`,
      response.status,
    );
  }
  return payload as T;
}

export const isBrowser = typeof window !== "undefined";

export interface User {
  id: number;
  nome: string;
  username: string;
  email: string;
  telefone: string | null;
  avatar: string | null;
  turma: string | null;
  turma_id?: number | null;
  instituicao_id?: number | null;
  pontos_totais: number;
  nivel: number;
  xp: number;
  xp_proximo_nivel: number;
  streak_dias: number;
  notificacoes_ativas: boolean;
  tema_escuro: boolean;
  perfil_nome: "aluno" | "professor" | "admin" | "diretor";
  instituicao_nome?: string | null;
}

export interface Lesson {
  id: number;
  titulo: string;
  kind: "lesson" | "challenge" | "exam" | "certificate" | "trophy";
  xp: number;
  ordem: number;
  status: "completed" | "current" | "available" | "locked";
}

export interface Module {
  curso_id: number;
  curso_titulo: string;
  curso_descricao: string;
  escopo: "app" | "escola" | "turma";
  id: number;
  titulo: string;
  descricao: string;
  cor: string;
  ordem: number;
  progresso: number;
  licoes: Lesson[];
}

export interface Mission {
  id: number;
  titulo: string;
  descricao: string;
  tipo: "plant" | "water" | "compost" | "share";
  pontos_recompensa: number;
}

export function userQuery() {
  return {
    queryKey: ["perfil"] as const,
    queryFn: async () => (await apiFetch<{ usuario: User }>("/perfil")).usuario,
    enabled: isBrowser,
    retry: false,
  };
}
