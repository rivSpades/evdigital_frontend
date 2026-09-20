import { cn } from "@/lib/cn";
import { getPaymentMethods } from "@/lib/payments";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

// Bloco "Como os seus clientes podem pagar", só na ficha da Loja online (`showPayments`
// no frontmatter). Dados em src/lib/payments.ts — PRD-servicos.md §7.2.

export async function Pagamentos({ lang }: { lang: Locale }) {
  const t = (await getDictionary(lang)).servicos.pagamentos;
  return (
    <section aria-labelledby="pagamentos-titulo" className="flex flex-col gap-lg">
      <div className="flex flex-col gap-sm">
        <h2
          id="pagamentos-titulo"
          className="font-heading text-headline font-bold tracking-[var(--letter-spacing-headline)] text-text-primary"
        >
          {t.titulo}
        </h2>
        <p className="font-body text-body-lg text-text-secondary lg:max-w-[720px]">
          {t.intro}
        </p>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border-subtle">
        {getPaymentMethods(lang, t).map((metodo, i) => {
          const Icone = metodo.icon;
          return (
            <div
              key={metodo.name}
              className={cn(
                "flex flex-col gap-xs px-lg py-md lg:flex-row lg:items-center lg:gap-lg",
                i > 0 && "border-t border-border-subtle",
                metodo.featured ? "bg-bg-surface-raised" : "bg-bg-surface",
              )}
            >
              <div className="flex items-center gap-sm lg:w-[320px] lg:shrink-0">
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)]",
                    metodo.featured ? "bg-accent-primary-subtle" : "bg-bg-surface-sunken",
                  )}
                >
                  <Icone
                    size={20}
                    strokeWidth={2}
                    aria-hidden
                    className={metodo.featured ? "text-text-accent" : "text-text-secondary"}
                  />
                </span>
                <p className="font-body text-label font-semibold text-text-primary">
                  {metodo.name}
                </p>
              </div>
              <p className="font-body text-body text-text-secondary">{metodo.why}</p>
            </div>
          );
        })}
      </div>

      {t.notas.map((nota) => (
        <p key={nota} className="font-body text-body text-text-tertiary">
          {nota}
        </p>
      ))}
    </section>
  );
}
