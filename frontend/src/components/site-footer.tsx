import { Sprout } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-border/70 bg-card/50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
        <div className="flex items-center gap-2 text-primary">
          <Sprout className="h-4 w-4" />
          <span className="text-sm font-bold tracking-wider">VIRIDIS</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Educação e sustentabilidade em prática · 2026
        </p>
      </div>
    </footer>
  );
}
