import { useAuth } from "@/hooks/use-auth";
import { homePathFor } from "@/lib/nav";

/**
 * Destino do CTA principal da landing: visitante → /login; logado → página inicial do seu perfil
 * (mesmo mapeamento do login, em @/lib/nav).
 */
export function usePlatformEntry() {
  const { user, role } = useAuth();
  if (user && role) {
    return { to: homePathFor(role), label: "Ir para o meu espaço", authed: true as const };
  }
  return { to: "/login" as const, label: "Entrar na plataforma", authed: false as const };
}
