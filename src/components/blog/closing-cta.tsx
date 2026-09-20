import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getDictionary } from "@/i18n/dictionaries";

// Frames: "Fecho · CTA" (BO2C1 no wide, wax6x no narrow). Fecha a listagem quando já há
// artigos; usa a mesma etiqueta de CTA do resto do site (design-guardrails.md §6).

export async function BlogClosingCta() {
  const { blog: t } = await getDictionary();

  return (
    <Card className="flex flex-col gap-md p-lg lg:flex-row lg:items-center lg:justify-between lg:gap-2xl lg:px-2xl lg:py-xl">
      <div className="flex flex-col gap-md lg:gap-2xs">
        <h2 className="font-heading text-body-lg font-semibold tracking-[var(--letter-spacing-title)] text-text-primary lg:text-title-sm">
          {t.closingTitle}
        </h2>
        <p className="font-body text-body text-text-secondary">
          {t.closingText}
        </p>
      </div>

      <ButtonLink href="/contacto" size="lg" className="w-full lg:w-auto">
        {t.closingCta}
      </ButtonLink>
    </Card>
  );
}
