import { useLayoutEffect } from "react";
import { Achievements } from "./achievements";
import { Community } from "./community";
import { FaqSection } from "./faq-section";
import { Features } from "./features";
import { Footer } from "./footer";
import { Goals } from "./goals";
import { Header } from "./header";
import { Hero } from "./hero";
import { Impact } from "./impact";
import { Marquee } from "./marquee";
import { Mission } from "./mission";
import { Profiles } from "./profiles";

export function LandingPage() {
  // <html class="js"> já é marcado pelo script de tema do __root antes da pintura (sem JS o conteúdo
  // fica visível); aqui só garantimos a classe em navegações client-side.
  useLayoutEffect(() => {
    document.documentElement.classList.add("js");
  }, []);

  return (
    <div className="lp" suppressHydrationWarning>
      <a className="skip" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <Marquee />
        <Mission />
        <Goals />
        <Features />
        <Impact />
        <Achievements />
        <Profiles />
        <Community />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
