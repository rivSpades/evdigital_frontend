import { FechoPagina } from "@/components/ui/fecho-pagina";
import { getDictionary } from "@/i18n/dictionaries";

// Frames "v2 · A vez" / Ecrã · Blog: "Secção · fecho" (o2xPT desktop, FXCXY mobile).
// ds/layout/fecho-pagina com título, na coluna principal (4 a 12 em lg). Fecha a listagem
// quando já há artigos; mesma etiqueta de CTA do resto do site (design-guardrails.md §6).

export async function BlogClosingCta() {
  const { blog: t } = await getDictionary();

  return (
    <section
      aria-labelledby="blog-fecho-titulo"
      className="pb-2xl lg:grid lg:grid-cols-12 lg:gap-x-lg lg:pb-3xl"
    >
      <FechoPagina
        titulo={t.closingTitle}
        tituloId="blog-fecho-titulo"
        texto={t.closingText}
        acao={t.closingCta}
        href="/contacto"
        className="lg:col-span-9 lg:col-start-4"
      />
    </section>
  );
}
