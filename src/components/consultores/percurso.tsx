"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { EtapaPercurso, type EstadoEtapa } from "@/components/ui/etapa-percurso";
import { PainelAno } from "@/components/ui/painel-ano";
import { numeroPasso } from "@/components/ui/passo-assistente";
import { Reveal } from "@/components/ui/reveal";

// Secção «Percurso» do detalhe do consultor (frames K5am3W/P1Q4VK desktop, x88y6j tablet,
// l81Qkh mobile; movimento na nota t395ry do design-system.pen). Único componente cliente
// da página: o resto é Server Component.
//
// Layout: régua superior $border-default, padding [$space-3xl, 0, $space-4xl, 0]
// ([$space-2xl, 0, $space-3xl, 0] em mobile). Em lg, grelha de 278 + etapas (gap $space-lg):
// coluna sticky (top 96 = barra de 72 + 24) com o título (headline) e ds/display/painel-ano
// (gap $space-xl). Abaixo de lg o título fica por cima das etapas (gap $space-2xl em tablet,
// $space-xl em mobile, $font-size-headline-narrow em mobile) e não há painel.
//
// Movimento (só opacity, translateY, scaleY e cor; nada horizontal; nunca listeners de scroll):
// 1. Carril de progresso a crescer com o scroll (CSS em globals.css: scroll-driven animation
//    onde há suporte, degraus por etapa no resto).
// 2. Etapa actual = a última cuja Marca passou a linha de leitura (40% do viewport). Um só
//    IntersectionObserver com a raiz encolhida a essa linha observa as marcas.
// 3. Cada etapa entra uma vez (opacity + translateY) pelo Reveal partilhado da Início
//    (ui/reveal.tsx): a página é um RevealScope.
// 4. Painel de ano: troca por crossfade de opacidade.
// 5. Sem JavaScript, sem IntersectionObserver ou com prefers-reduced-motion: estado BASE
//    (carril neutro, texto normal, nenhuma em destaque) e o painel com a etapa mais recente.
//    Foco de teclado dentro de uma etapa torna-a actual logo.

export type EtapaVista = {
  periodo: string;
  ano: string;
  funcao: string;
  organizacao: string;
  historia: string;
};

// Raiz = tudo o que está acima da linha de leitura (40% do viewport), estendida muito para
// cima como no reveal da Início: uma marca "passou" quando intersecta. Uma raiz de altura zero
// na linha não chegava: um salto de scroll por cima dela (âncora, scroll rápido) não muda o
// estado de intersecção e o observador não disparava.
const ACIMA_DA_LINHA = "100000px 0px -60% 0px";

export function Percurso({ titulo, etapas }: { titulo: string; etapas: EtapaVista[] }) {
  const [animado, setAnimado] = useState(false);
  const [actual, setActual] = useState(-1);
  const listaRef = useRef<HTMLOListElement>(null);
  const marcas = useRef<(HTMLSpanElement | null)[]>([]);
  // Distância (px) de cada marca ao topo da lista, para o carril por degraus.
  const [posicoes, setPosicoes] = useState<number[]>([]);
  const total = etapas.length;

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduzir.matches) return;
    // Estado externo (media query e suporte do browser) lido depois de montar: o servidor
    // desenha sempre o estado base, igual ao do primeiro render no cliente.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnimado(true);

    const passou = new Array<boolean>(total).fill(false);
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          const indice = Number((entrada.target as HTMLElement).dataset.indice);
          passou[indice] = entrada.isIntersecting;
        }
        setActual(passou.lastIndexOf(true));
      },
      { rootMargin: ACIMA_DA_LINHA, threshold: 0 },
    );
    for (const marca of marcas.current) if (marca) observador.observe(marca);
    return () => observador.disconnect();
  }, [total]);

  // Mede as marcas (e volta a medir quando a lista muda de tamanho: fontes, largura, a
  // Função da etapa actual a crescer). Só com o movimento ligado.
  useLayoutEffect(() => {
    const lista = listaRef.current;
    if (!animado || !lista) return;
    const medir = () => {
      const topo = lista.getBoundingClientRect().top;
      setPosicoes(
        marcas.current.map((marca) =>
          marca ? marca.getBoundingClientRect().top - topo + marca.offsetHeight : 0,
        ),
      );
    };
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(lista);
    return () => observador.disconnect();
  }, [animado]);

  const estadoDe = (indice: number): EstadoEtapa => {
    if (!animado) return "base";
    if (indice === actual) return "actual";
    return indice < actual ? "anterior" : "seguinte";
  };

  // Painel: sem movimento mostra a etapa mais recente; com movimento, a actual (a primeira
  // antes de a primeira marca passar a linha).
  const indicePainel = animado ? Math.max(actual, 0) : total - 1;
  const painel = etapas[indicePainel];

  const fim = posicoes.length ? posicoes[posicoes.length - 1] : 0;
  const degrau = actual >= 0 && fim > 0 ? posicoes[actual] / fim : 0;

  if (total === 0) return null;

  return (
    <section
      aria-labelledby="percurso-titulo"
      className="border-t border-border-default pt-2xl pb-3xl md:pt-3xl md:pb-4xl"
    >
      <div className="flex flex-col gap-xl md:gap-2xl lg:grid lg:grid-cols-[278px_minmax(0,1fr)] lg:items-start lg:gap-lg">
        <div className="flex flex-col gap-xl lg:sticky lg:top-24">
          <h2
            id="percurso-titulo"
            className="font-heading text-[length:var(--font-size-headline-narrow)] leading-[var(--line-height-headline)] font-semibold tracking-[var(--letter-spacing-headline)] text-text-primary md:text-headline"
          >
            {titulo}
          </h2>
          {painel ? (
            <PainelAno
              key={indicePainel}
              className="hidden lg:block"
              ano={painel.ano}
              organizacao={painel.organizacao}
              posicao={numeroPasso(indicePainel + 1, total)}
              animar={animado}
            />
          ) : null}
        </div>

        <div
          className="relative"
          style={
            {
              "--percurso-fim": `${fim}px`,
              "--percurso-degrau": degrau,
            } as CSSProperties
          }
        >
          {animado && fim > 0 ? (
            <div aria-hidden className="percurso-trilho">
              <div className="percurso-progresso" />
            </div>
          ) : null}
            <ol ref={listaRef} className="flex flex-col">
              {etapas.map((etapa, indice) => (
                <Reveal
                  as="li"
                  key={`${etapa.periodo}-${etapa.funcao}-${indice}`}
                  onFocus={animado ? () => setActual(indice) : undefined}
                >
                  <EtapaPercurso
                    periodo={etapa.periodo}
                    funcao={etapa.funcao}
                    organizacao={etapa.organizacao}
                    historia={etapa.historia}
                    estado={estadoDe(indice)}
                    ultima={indice === total - 1}
                    marcaRef={(marca) => {
                      marcas.current[indice] = marca;
                      if (marca) marca.dataset.indice = String(indice);
                    }}
                    conteudoProps={{ "data-reveal": "" }}
                  />
                </Reveal>
              ))}
            </ol>
        </div>
      </div>
    </section>
  );
}
