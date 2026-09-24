"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";

const SHOW_AFTER_PX = 400;

// Botão flutuante "Voltar ao topo" (montado no layout de [lang]).
// - Aparece depois de SHOW_AFTER_PX de scroll e esconde-se enquanto o rodapé (<footer>)
//   estiver no ecrã: fixo no canto inferior direito, tapava as ligações do rodapé (o
//   seletor de idioma "PL" a 375, 768 e 1280). No rodapé o topo fica a um gesto e há
//   navegação própria.
// - O rodapé muda a cada página (e há páginas sem ele, ex. Área de Cliente), por isso o
//   observador volta a ligar-se a cada mudança de rota.
// - Scroll suave, excepto com prefers-reduced-motion: aí é instantâneo.

export function ScrollToTop({ label }: { label: string }) {
  const pathname = usePathname();
  const [passouLimite, setPassouLimite] = useState(false);
  // Guardado com o caminho em que foi medido: numa página sem rodapé (ou antes da primeira
  // medição) conta como não visível, sem ter de repor o estado dentro do efeito.
  const [rodape, setRodape] = useState({ caminho: "", visivel: false });

  useEffect(() => {
    const onScroll = () => setPassouLimite(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const elemento = document.querySelector("footer");
    if (!elemento) return;
    const observer = new IntersectionObserver(([entrada]) =>
      setRodape({ caminho: pathname, visivel: entrada?.isIntersecting ?? false }),
    );
    observer.observe(elemento);
    return () => observer.disconnect();
  }, [pathname]);

  const rodapeVisivel = rodape.caminho === pathname && rodape.visivel;
  const visible = passouLimite && !rodapeVisivel;

  function voltarAoTopo() {
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduzir ? "auto" : "smooth" });
  }

  return (
    <button
      type="button"
      aria-label={label}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      onClick={voltarAoTopo}
      className={`fixed cursor-pointer bottom-lg right-lg z-40 flex size-12 items-center justify-center rounded-pill bg-accent-primary text-text-on-accent shadow-elevation-2 transition-[opacity,transform,background-color,visibility] duration-200 motion-reduce:transition-none hover:bg-accent-primary-hover active:bg-accent-primary-pressed ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none invisible translate-y-2 opacity-0"
      }`}
    >
      <ArrowUp size={20} aria-hidden="true" />
    </button>
  );
}
