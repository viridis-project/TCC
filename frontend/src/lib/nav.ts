import {
  Home,
  BookOpen,
  Sprout,
  Award,
  User,
  Settings,
  School,
  History,
  CalendarClock,
  Trophy,
  Users,
} from "lucide-react";

/**
 * Fonte ÚNICA das regras de visibilidade da navegação por perfil.
 * Usada pelo SiteNav (páginas internas) e pelo cabeçalho da landing — não duplique estas regras.
 */
export const APP_NAV = [
  { to: "/", label: "INÍCIO", icon: Home },
  { to: "/aprender", label: "APRENDER", icon: BookOpen },
  { to: "/jardim", label: "JARDIM", icon: Sprout },
  { to: "/horarios", label: "HORÁRIOS", icon: CalendarClock },
  { to: "/ranking", label: "RANKING", icon: Trophy },
  { to: "/recompensas", label: "RECOMPENSAS", icon: Award },
  { to: "/historico", label: "HISTÓRICO", icon: History },
  { to: "/perfil", label: "PERFIL", icon: User },
  { to: "/admin", label: "ADMINISTRAÇÃO", icon: Settings },
  { to: "/professor", label: "PAINEL DOCENTE", icon: Users },
  { to: "/diretor", label: "DIREÇÃO", icon: School },
] as const;

export type NavItem = (typeof APP_NAV)[number];

/** Páginas que um visitante (não autenticado) pode ver no menu: só o início. */
const PUBLIC_PATHS: ReadonlyArray<NavItem["to"]> = ["/"];

/**
 * Itens de menu visíveis para o perfil informado.
 * `role` indefinido = visitante (deslogado ou perfil ainda carregando): só itens públicos.
 */
export function navItemsFor(role: string | undefined): NavItem[] {
  if (!role) return APP_NAV.filter((item) => PUBLIC_PATHS.includes(item.to));
  return APP_NAV.filter((item) => {
    if (
      role === "admin" &&
      (item.to === "/aprender" || item.to === "/jardim" || item.to === "/horarios")
    )
      return false;
    if (item.to === "/admin") return role === "admin";
    if (item.to === "/professor") return role === "professor";
    if (item.to === "/diretor") return role === "diretor";
    if (item.to === "/historico" || item.to === "/recompensas")
      return role === "aluno" || role === "admin";
    return true;
  });
}

export type HomePath = "/aprender" | "/professor" | "/diretor" | "/admin";

/** Página inicial de cada perfil logo após entrar (mesmo mapeamento do login). */
export function homePathFor(role: string | undefined): HomePath {
  if (role === "aluno") return "/aprender";
  if (role === "professor") return "/professor";
  if (role === "diretor") return "/diretor";
  return "/admin";
}
