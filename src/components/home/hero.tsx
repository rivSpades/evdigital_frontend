import { getDictionary } from "@/i18n/dictionaries";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

// Frames: wzYyU/"Secção · Hero" (mJENw) e EZ3bZ/"Secção · Hero" (weryh).
// O fundo do .pen é $bg-base com um gradiente radial de $accent-primary-subtle: no
// Pencil o `size` é o diâmetro normalizado, por isso em CSS o raio é metade
// (1.5 x 1.9 -> 75% 95%, no narrow 2 x 1.6 -> 100% 80%).

export async function Hero() {
  const { common, home } = await getDictionary();
  const t = home.hero;
  return (
    <section
      className={cn(
        "bg-bg-base px-lg py-3xl md:px-xl",
        "lg:flex lg:min-h-[620px] lg:items-center lg:px-2xl lg:py-0",
        "bg-[radial-gradient(ellipse_100%_80%_at_15%_5%,var(--color-accent-primary-subtle)_0%,var(--color-bg-base)_100%)]",
        "lg:bg-[radial-gradient(ellipse_75%_95%_at_18%_10%,var(--color-accent-primary-subtle)_0%,var(--color-bg-base)_100%)]",
      )}
    >
      <div className="mx-auto flex w-full max-w-[var(--grid-max-width)] flex-col gap-lg">
        <p className="font-body text-caption font-medium tracking-[var(--letter-spacing-overline)] text-text-accent uppercase">
          {t.overline}
        </p>

        <h1 className="font-heading text-headline font-bold tracking-[var(--letter-spacing-headline)] text-text-primary lg:max-w-[1080px] lg:text-display lg:tracking-[var(--letter-spacing-display)]">
          {t.title}
        </h1>

        <p className="font-body text-body text-text-secondary lg:max-w-[720px] lg:text-body-lg">
          {t.lead}
        </p>

        <div className="flex flex-col gap-sm md:flex-row md:gap-md">
          <ButtonLink href="/contacto" size="lg" className="w-full md:w-auto">
            {common.cta}
          </ButtonLink>
          <ButtonLink
            href="/servicos"
            variant="secondary"
            size="lg"
            className="w-full md:w-auto"
          >
            {t.secondaryCta}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
