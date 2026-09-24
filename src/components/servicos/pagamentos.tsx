import { LinhaTermo } from "@/components/ui/linha-termo";
import { getPaymentMethods } from "@/lib/payments";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

// "Secção · como os seus clientes podem pagar" da ficha da Loja online (SHykB desktop, vDYa2
// mobile, grupo "Ecrã · Serviço (ficha)" de "v2 · A vez"). Só com `showPayments` no
// frontmatter; dados em src/lib/payments.ts (PRD-servicos.md §7.2).
// Gap $space-lg ($space-md em mobile), padding-bottom $space-4xl ($space-3xl em mobile).
// Título $font-size-headline ($font-size-title em mobile), introdução body-lg (body) com 760
// de largura em lg, registo de ds/display/linha-termo (os meios em destaque com o texto em
// $text-primary) e as notas em $text-tertiary, gap $space-sm, padding-top $space-xs.

export async function Pagamentos({ lang }: { lang: Locale }) {
  const t = (await getDictionary(lang)).servicos.pagamentos;
  return (
    <section
      aria-labelledby="pagamentos-titulo"
      className="flex flex-col gap-md pb-3xl lg:gap-lg lg:pb-4xl"
    >
      <h2
        id="pagamentos-titulo"
        className="font-heading text-title font-semibold tracking-[var(--letter-spacing-title)] text-text-primary lg:text-headline lg:tracking-[var(--letter-spacing-headline)]"
      >
        {t.titulo}
      </h2>
      <p className="font-body text-body text-text-secondary lg:max-w-[760px] lg:text-body-lg">
        {t.intro}
      </p>

      <ul className="flex flex-col border-t border-border-default">
        {getPaymentMethods(lang, t).map((metodo) => (
          <LinhaTermo
            key={metodo.name}
            termo={metodo.name}
            texto={metodo.why}
            destaque={metodo.featured}
          />
        ))}
      </ul>

      <div className="flex flex-col gap-sm pt-xs lg:max-w-[760px]">
        {t.notas.map((nota) => (
          <p key={nota} className="font-body text-body text-text-tertiary">
            {nota}
          </p>
        ))}
      </div>
    </section>
  );
}
