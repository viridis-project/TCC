import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/landing/landing-page";
import "@/styles/landing.css";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Viridis — Plataforma gamificada de hortas escolares" },
      {
        name: "description",
        content:
          "Educação socioemocional, nutrição e sustentabilidade através de hortas escolares interativas.",
      },
    ],
    links: [
      // Fontes da landing (Inter já é carregada pelo __root). Só esta rota as pede.
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=Patrick+Hand&display=swap",
      },
    ],
  }),
  component: LandingPage,
});
