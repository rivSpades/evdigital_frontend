import { getDictionary } from "@/i18n/dictionaries";
import { Accordion } from "@/components/ui/accordion";
import { Reveal } from "@/components/ui/reveal";

// Frames "v2 · A vez" / Ecrã · Início: "Secção · perguntas frequentes" (VPCCf desktop,
// pi5ze mobile). Padding [$space-3xl, 0]. Em lg: título na Margem (colunas 1 a 3,
// $font-size-title) e a lista na coluna principal (4 a 12), gutter $space-layout-gutter-
// wide. Em mobile empilham com gap $space-md e o título em $font-size-title-sm. Lista:
// régua superior hairline $border-default e ds/disclosure/accordion-item na variante
// "vez"; a primeira pergunta abre por defeito.
//
// Movimento (quadro 05): um só grupo (a secção); título e perguntas pela ordem da lista,
// com o limite de stagger (a 4.ª entra com a 3.ª; em mobile a 3.ª com a 2.ª). Abrir ou
// fechar depois da entrada não volta a disparar nada.
// `id="perguntas"`: âncora directa (teste Q09 do storyboard). `scroll-mt-24` (96 = barra
// fixa de 72 + $space-lg) para o título não ficar escondido sob o cabeçalho sticky.

export async function Faq() {
  const { home } = await getDictionary();
  const t = home.faq;
  return (
    <Reveal
      as="section"
      id="perguntas"
      aria-labelledby="faq-titulo"
      className="flex scroll-mt-24 flex-col gap-md py-3xl lg:grid lg:grid-cols-12 lg:gap-x-lg lg:gap-y-0"
    >
      <h2
        id="faq-titulo"
        data-reveal=""
        className="font-heading text-title-sm font-semibold tracking-[var(--letter-spacing-title)] text-text-primary lg:col-span-3 lg:text-title"
      >
        {t.title}
      </h2>
      <Accordion
        items={t.items}
        variant="vez"
        revealFrom={1}
        className="border-t border-border-default lg:col-span-9"
      />
    </Reveal>
  );
}
