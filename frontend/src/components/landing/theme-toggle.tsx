import { useRef } from "react";
import { useLandingTheme } from "./use-landing-theme";
import { MoonIcon, SunIcon } from "./icons";

export function ThemeToggle() {
  const { theme, toggle } = useLandingTheme();
  const ref = useRef<HTMLButtonElement>(null);
  const dark = theme === "dark";
  return (
    <button
      ref={ref}
      type="button"
      className="theme-toggle"
      aria-label={dark ? "Mudar para o tema claro" : "Mudar para o tema escuro"}
      aria-pressed={dark}
      onClick={() => toggle(ref.current)}
    >
      <SunIcon className="theme-toggle__i theme-toggle__sun" />
      <MoonIcon className="theme-toggle__i theme-toggle__moon" />
    </button>
  );
}
