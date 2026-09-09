import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  BookOpen,
  Sprout,
  Award,
  User,
  Settings,
  Menu,
  X,
  Bell,
  School,
  History,
  CalendarClock,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch, isBrowser } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { NotificationsModal } from "@/components/modals/notifications-modal";

const NAV = [
  { to: "/", label: "INÍCIO", icon: Home },
  { to: "/aprender", label: "APRENDER", icon: BookOpen },
  { to: "/jardim", label: "JARDIM", icon: Sprout },
  { to: "/horarios", label: "HORÁRIOS", icon: CalendarClock },
  { to: "/recompensas", label: "RECOMPENSAS", icon: Award },
  { to: "/historico", label: "HISTÓRICO", icon: History },
  { to: "/perfil", label: "PERFIL", icon: User },
  { to: "/admin", label: "ADMINISTRAÇÃO", icon: Settings },
  { to: "/diretor", label: "DIREÇÃO", icon: School },
] as const;

export function SiteNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { user, role } = useAuth();
  const { data: unread = 0 } = useQuery({
    queryKey: ["notificacoes-contagem"],
    enabled: isBrowser && !!user,
    refetchInterval: 30000,
    queryFn: async () =>
      (await apiFetch<{ contagem: number }>("/notificacoes/contagem-nao-lidas")).contagem,
  });
  const visibleNav = NAV.filter((item) => {
    if (item.to === "/admin") return role === "professor" || role === "admin";
    if (item.to === "/diretor") return role === "diretor";
    if (item.to === "/historico" || item.to === "/recompensas") return role === "aluno";
    return true;
  });

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          aria-label="Viridis — ir para o início"
          className="group flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
        >
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-primary bg-background text-primary shadow-soft transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
            <svg
              viewBox="0 0 40 40"
              className="h-7 w-7"
              aria-hidden="true"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 31V18.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path
                d="M19.6 20.3c-5.7-.2-9.3-3.8-9.6-9.8 5.8.2 9.4 3.7 9.6 9.8Z"
                fill="currentColor"
                fillOpacity=".2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M20.4 17.5c.7-5.2 4.2-8 9.8-8.1-.4 5.2-4.1 8-9.8 8.1Z"
                fill="currentColor"
                fillOpacity=".42"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path d="M12.5 31h15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="min-w-0 leading-none">
            <div className="font-display text-[19px] font-extrabold tracking-[-0.045em] text-primary">
              Viridis
            </div>
            <div className="mt-1 hidden items-center gap-1.5 sm:flex">
              <span className="h-px w-3 bg-accent-foreground/45" aria-hidden="true" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Cultivando sustentabilidade
              </span>
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-border/70 bg-card/60 p-1 shadow-soft lg:flex">
          {visibleNav.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className="relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                {active && (
                  <motion.span
                    layoutId="navbubble"
                    className="absolute inset-0 -z-10 rounded-full bg-gradient-hero shadow-soft"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon className={`h-3.5 w-3.5 ${active ? "text-primary-foreground" : ""}`} />
                <span className={active ? "text-primary-foreground" : ""}>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-2.5 py-1 sm:flex">
            <span className="text-base leading-none">🇧🇷</span>
          </div>
          {user && (
            <button
              onClick={() => setNotificationsOpen(true)}
              className="relative grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-card text-foreground"
              aria-label="Notificações"
            >
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-destructive px-1 text-[10px] font-extrabold text-destructive-foreground">
                  {unread > 99 ? "99+" : unread}
                </span>
              )}
            </button>
          )}
          <Link
            to={user ? "/perfil" : "/login"}
            className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-gradient-hero text-sm font-bold text-primary-foreground shadow-soft"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user.nome} className="h-full w-full object-cover" />
            ) : (
              (user?.nome.charAt(0) ?? "?")
            )}
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-card text-foreground lg:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border/60 bg-background/95 lg:hidden"
          >
            <div className="mx-auto grid max-w-7xl gap-1 px-4 py-3">
              {visibleNav.map(({ to, label, icon: Icon }) => {
                const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-gradient-hero text-primary-foreground"
                        : "text-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className="h-4 w-4" /> {label}
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
      <NotificationsModal open={notificationsOpen} onOpenChange={setNotificationsOpen} />
    </header>
  );
}
