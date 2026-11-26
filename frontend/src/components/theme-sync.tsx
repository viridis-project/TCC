import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { userQuery } from "@/lib/api";

export const THEME_STORAGE_KEY = "viridis-tema";

/**
 * Aplica o tema escuro salvo no perfil (`tema_escuro`) em qualquer página.
 * Só lê o cache da consulta de perfil que as páginas já fazem (não dispara requisição nova)
 * e espelha o resultado no localStorage para aplicar o tema antes da pintura nas visitas seguintes.
 */
export function ThemeSync() {
  const { data } = useQuery({ ...userQuery(), enabled: false });
  const dark = data?.tema_escuro;

  useEffect(() => {
    if (dark === undefined) return;
    document.documentElement.classList.toggle("dark", !!dark);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, dark ? "dark" : "light");
    } catch {
      /* armazenamento indisponível (modo privado): só não persiste */
    }
  }, [dark]);

  return null;
}
