import { Sprout } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/60 bg-background/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-8 text-center">
        <div className="flex items-center gap-2 text-primary">
          <Sprout className="h-4 w-4" />
          <span className="text-sm font-bold tracking-wider">VIRIDIS</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Cultivando sustentabilidade através da educação • 2026
        </p>
      </div>
    </footer>
  );
}
