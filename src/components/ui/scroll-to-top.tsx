"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";

const SHOW_AFTER_PX = 400;

// Botão flutuante "Voltar ao topo" (montado no layout de [lang]).
// - Aparece depois de SHOW_AFTER_PX de scroll e fica SEMPRE visível (também no fim da página).
//   Fixo no canto inferior direito, tapava as ligações do rodapé (o seletor de idioma "PL"
//   a 375, 768 e 1280): por isso, quando o rodapé (<footer>) entra no ecrã, o botão SOBE a
//   altura visível do rodapé e fica por cima dele, encostado ao seu topo. Esconder o botão
//   no fim da página foi um erro (2026-09-24): é aí que mais falta faz.
// - Páginas com uma barra de acção colada ao fundo (position: sticky; ex. «Entre em contacto» em
//   /consultants/<slug>, só em mobile) marcam-na com `data-barra-fixa`: o botão sobe até ficar
//   acima dela, também quando a barra assenta em cima do rodapé no fim da página.
// - O rodapé muda a cada página (e há páginas sem ele, ex. Área de Cliente), por isso o
//   observador volta a ligar-se a cada mudança de rota.
// - Scroll suave, excepto com prefers-reduced-motion: aí é instantâneo.

export function ScrollToTop({ label }: { label: string }) {
  const pathname = usePathname();
  const [passouLimite, setPassouLimite] = useState(false);
  // Altura (px) do rodapé que está visível no ecrã, guardada com o caminho em que foi medida:
  // numa página sem rodapé (ou antes da primeira medição) conta como 0, sem ter de repor o
  // estado dentro do efeito.
  const [rodape, setRodape] = useState({ caminho: "", altura: 0 });
  // Altura (px) do ecrã ocupada por uma barra sticky de acção (do topo dela ao fundo do ecrã).
  const [barra, setBarra] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setPassouLimite(window.scrollY > SHOW_AFTER_PX);
      const elemento = document.querySelector<HTMLElement>("[data-barra-fixa]");
      if (!elemento || getComputedStyle(elemento).position !== "sticky") return setBarra(0);
      const { top, bottom } = elemento.getBoundingClientRect();
      setBarra(bottom > 0 && top < window.innerHeight ? Math.round(window.innerHeight - top) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    const elemento = document.querySelector("footer");
    if (!elemento) return;
    // Limiares finos: a altura visível acompanha o scroll sem listener de scroll próprio.
    const limiares = Array.from({ length: 101 }, (_, i) => i / 100);
    const observer = new IntersectionObserver(
      ([entrada]) =>
        setRodape({
          caminho: pathname,
          altura: entrada?.isIntersecting ? Math.round(entrada.intersectionRect.height) : 0,
        }),
      { threshold: limiares },
    );
    observer.observe(elemento);
    return () => observer.disconnect();
  }, [pathname]);

  const alturaRodape = rodape.caminho === pathname ? rodape.altura : 0;
  const reservado = Math.max(alturaRodape, barra);
  const visible = passouLimite;

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
      style={{ bottom: `calc(var(--spacing-lg) + ${reservado}px)` }}
      className={`fixed cursor-pointer right-lg z-40 flex size-12 items-center justify-center rounded-pill bg-accent-primary text-text-on-accent shadow-elevation-2 transition-[opacity,transform,background-color,visibility] duration-200 motion-reduce:transition-none hover:bg-accent-primary-hover active:bg-accent-primary-pressed ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none invisible translate-y-2 opacity-0"
      }`}
    >
      <ArrowUp size={20} aria-hidden="true" />
    </button>
  );
}
