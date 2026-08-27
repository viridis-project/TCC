import { Link, useRouterState } from "@tanstack/react-router";
import { Home, BookOpen, Sprout, Award, User, Settings, Menu, X, Bell, School } from "lucide-react";
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
  { to: "/recompensas", label: "RECOMPENSAS", icon: Award },
  { to: "/perfil", label: "PERFIL", icon: User },
  { to: "/admin", label: "ADMINISTRAÇÃO", icon: Settings },
  { to: "/diretor", label: "DIREÇÃO", icon: School },
] as const;

export function SiteNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [notificationsOpen,setNotificationsOpen]=useState(false);
  const { user,role } = useAuth();
  const {data:unread=0}=useQuery({queryKey:["notificacoes-contagem"],enabled:isBrowser&&!!user,refetchInterval:30000,queryFn:async()=>(await apiFetch<{contagem:number}>("/notificacoes/contagem-nao-lidas")).contagem});
  const visibleNav = NAV.filter((item) => item.to === "/admin" ? role === "professor" || role === "admin" : item.to === "/diretor" ? role === "diretor" : true);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-hero text-primary-foreground shadow-soft transition-transform group-hover:scale-105">
            <Sprout className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-base font-bold tracking-tight text-foreground">VIRIDIS</div>
            <div className="hidden text-[10px] font-medium uppercase tracking-widest text-muted-foreground sm:block">
              Cultivando Sustentabilidade
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
          {user&&<button onClick={()=>setNotificationsOpen(true)} className="relative grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-card text-foreground" aria-label="Notificações"><Bell className="h-4 w-4"/>{unread>0&&<span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-destructive px-1 text-[10px] font-extrabold text-destructive-foreground">{unread>99?"99+":unread}</span>}</button>}
          <Link to={user ? "/perfil" : "/login"} className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-gradient-hero text-sm font-bold text-primary-foreground shadow-soft">
            {user?.avatar ? <img src={user.avatar} alt={user.nome} className="h-full w-full object-cover" /> : (user?.nome.charAt(0) ?? "?")}
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
      <NotificationsModal open={notificationsOpen} onOpenChange={setNotificationsOpen}/>
    </header>
  );
}
