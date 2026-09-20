import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getDictionary } from "@/i18n/dictionaries";

// Frames: "Estado B · sem artigos" (YJMi0 no wide, SZuC7 no narrow).
// É o estado real do lançamento: content/blog/ está vazio por decisão de privacidade
// (PRD §4.3), por isso este ecrã não é um erro, é a página tal como ela existe hoje.
// Simplificado a pedido (2026-09-20): dizer só o que é verdade, sem enfeites.

export async function BlogEmptyState() {
  const { blog: t } = await getDictionary();

  return (
    <Card className="flex flex-col items-center gap-md px-lg py-2xl text-center">
      <h2 className="font-heading text-title-sm font-semibold tracking-[var(--letter-spacing-title)] text-text-primary">
        {t.emptyTitle}
      </h2>

      <ButtonLink href="/servicos" variant="tertiary">
        {t.emptyCta}
      </ButtonLink>
    </Card>
  );
}
