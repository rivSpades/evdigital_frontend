import { getDictionary } from "@/i18n/dictionaries";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

// Frames: "Secção · CTA final" (c9yBk / o4MLu).
// Repete o gradiente radial do hero, aqui ancorado em baixo ($accent-primary-subtle
// sobre $bg-surface), fechando a página com a mesma etiqueta de CTA usada na navegação.

export async function CtaFinal() {
  const { common, home } = await getDictionary();
  return (
    <section
      aria-label={common.cta}
      className={cn(
        "border-t border-border-subtle bg-bg-surface px-lg py-3xl md:px-xl lg:border-0 lg:px-2xl lg:py-4xl",
        "bg-[radial-gradient(ellipse_80%_70%_at_50%_100%,var(--color-accent-primary-subtle)_0%,var(--color-bg-surface)_100%)]",
        "lg:bg-[radial-gradient(ellipse_60%_80%_at_50%_100%,var(--color-accent-primary-subtle)_0%,var(--color-bg-surface)_100%)]",
      )}
    >
      <div className="mx-auto flex max-w-[var(--grid-max-width)] flex-col items-center gap-md text-center lg:gap-lg">
        <p className="font-body text-body text-text-secondary lg:max-w-[680px] lg:text-body-lg">
          {home.finalCta.body}
        </p>

        <ButtonLink href="/contacto" size="lg" className="w-full lg:w-auto">
          {common.cta}
        </ButtonLink>
      </div>
    </section>
  );
}
