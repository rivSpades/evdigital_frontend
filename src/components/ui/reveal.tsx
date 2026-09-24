"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

// Scroll reveal da Início (frames "Design System · Movimento" wiiXJ e "Movimento ·
// Storyboard da Início" Ix1bn do design-system.pen). Único ficheiro cliente do movimento:
// as secções continuam Server Components e só marcam elementos com atributos.
//
// - `RevealScope` é o <main> da Início. Um script inline, primeiro filho do <main>, corre
//   durante o parse do HTML (antes do primeiro paint) e liga o atributo `data-reveal-on`
//   só se houver IntersectionObserver e "reduzir movimento" estiver desligado (R06). Sem
//   JavaScript o atributo nunca existe e nada fica escondido (R08). Se o Reveal não
//   arrancar em 3 s, o script desliga o atributo e tudo aparece.
// - `Reveal` é um grupo (`data-reveal-group`): dispara uma vez (R10) quando cerca de
//   20% do grupo fica visível ($motion-view-threshold) e revela os `[data-reveal]` lá
//   dentro. O estado vive no DOM (atributos), não em estado React: sem re-render nem
//   diferença entre servidor e cliente.
//
// Um só IntersectionObserver partilhado, nunca listeners de scroll (R09). A rootMargin
// estende a raiz para cima: um grupo que o scroll rápido salta (passa de baixo do ecrã
// para cima dele sem nunca ter estado à vista) cruza a raiz estendida e é revelado sem
// animação (R15), tal como os que já estão acima ao recarregar a meio ou abrir uma âncora.
// As regras visuais (estado escondido, durações, atrasos, reduced motion) estão em
// globals.css, com os tokens --motion-* de tokens.css.

declare global {
  interface Window {
    __revealReady?: boolean;
    __revealGaveUp?: boolean;
  }
}

const SCOPE_ATTR = "data-reveal-on";

// Tempo máximo de uma entrada (atraso da última marca da régua + a sua duração ficam
// abaixo de 1,2 s, R14); passado isto, will-change sai do grupo (R17).
const SETTLE_MS = 1300;

// Espelha o arranque do storyboard (5.2). Corre síncrono durante o parse: o <main> é o
// pai do script. O limite de 3 s é o de R08.
const BOOT = `(function(s,w){try{if(!s||!("IntersectionObserver" in w))return;if(w.matchMedia("(prefers-reduced-motion: reduce)").matches)return;s.setAttribute("${SCOPE_ATTR}","");setTimeout(function(){if(!w.__revealReady){w.__revealGaveUp=true;s.removeAttribute("${SCOPE_ATTR}");}},3000);}catch(e){}})(document.currentScript&&document.currentScript.parentNode,window)`;

if (typeof window !== "undefined") window.__revealReady = true;

const pending = new Set<Element>();
const checked = new WeakSet<Element>();
let observer: IntersectionObserver | undefined;
let threshold = 0.2;

function show(group: Element, animate: boolean) {
  if (!pending.has(group)) return;
  pending.delete(group);
  observer?.unobserve(group);
  if (animate) {
    group.setAttribute("data-revealing", "");
    window.setTimeout(() => group.removeAttribute("data-revealing"), SETTLE_MS);
  } else {
    group.setAttribute("data-reveal-instant", "");
  }
  group.setAttribute("data-revealed", "");
}

function check(group: Element, rect: DOMRectReadOnly) {
  const viewport = window.innerHeight;
  const first = !checked.has(group);
  checked.add(group);
  if (rect.bottom <= 0) {
    show(group, false);
    return;
  }
  const visible = Math.min(rect.bottom, viewport) - Math.max(rect.top, 0);
  // Grupos mais altos que o ecrã contam 20% da altura do viewport, não do grupo. Na
  // primeira medição (carregamento, navegação) basta estar à vista: o que está acima da
  // dobra não espera por scroll (R05).
  const needed = first ? 1 : Math.min(rect.height, viewport) * threshold;
  const enough = visible > 0 && visible >= needed;
  if (enough) {
    show(group, true);
  } else if (rect.top < 0) {
    // O topo já passou (scroll rápido que parou com só uma nesga do grupo à vista):
    // revela sem animação, para nada ficar vazio acima nem na borda do ecrã (Q02).
    show(group, false);
  }
}

function getObserver() {
  if (observer) return observer;
  const token = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--motion-view-threshold"),
  );
  if (token > 0 && token < 1) threshold = token;
  const steps = [0, threshold / 4, threshold / 2, (threshold * 3) / 4, threshold];
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) check(entry.target, entry.boundingClientRect);
      for (const group of pending) {
        const rect = group.getBoundingClientRect();
        if (rect.top < 0) check(group, rect);
      }
    },
    { threshold: steps, rootMargin: "100000px 0px 0px 0px" },
  );
  return observer;
}

function canAnimate() {
  return (
    "IntersectionObserver" in window &&
    !window.__revealGaveUp &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** O <main> da Início, com o script de arranque do reveal como primeiro filho. */
export function RevealScope({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  // Navegação no cliente (A7): o script inline não volta a correr, por isso o atributo
  // é posto aqui, antes do paint e antes de os grupos começarem a observar.
  useLayoutEffect(() => {
    const scope = ref.current;
    if (scope && !scope.hasAttribute(SCOPE_ATTR) && canAnimate()) {
      scope.setAttribute(SCOPE_ATTR, "");
    }
  }, []);

  return (
    <main ref={ref} data-reveal-scope="" className={className} suppressHydrationWarning>
      <script
        // text/plain no cliente: o React não executa nem avisa sobre scripts em render
        // (guia "preventing flash before hydration" do Next); o servidor emite o script.
        type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: BOOT }}
      />
      {children}
    </main>
  );
}

type RevealTag = "div" | "section" | "li" | "ol" | "ul";

/** Um grupo de entrada: revela os `[data-reveal]` que contém, uma vez. */
export function Reveal({
  as: Tag = "div",
  children,
  ...rest
}: { as?: RevealTag; children: ReactNode } & ComponentPropsWithoutRef<"div">) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    window.__revealReady = true;
    const group = ref.current;
    if (!group?.closest(`[${SCOPE_ATTR}]`)) return;
    // Foco do teclado num elemento ainda por revelar: aparece de imediato (R12).
    const onFocus = () => show(group, false);
    group.addEventListener("focusin", onFocus);
    pending.add(group);
    getObserver().observe(group);
    return () => {
      pending.delete(group);
      observer?.unobserve(group);
      group.removeEventListener("focusin", onFocus);
    };
  }, []);

  return (
    <Tag ref={ref as never} data-reveal-group="" {...(rest as object)}>
      {children}
    </Tag>
  );
}
