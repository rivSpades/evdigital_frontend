import { getDictionary } from "@/i18n/dictionaries";
import { SectionTitle } from "@/components/home/section-heading";

// Frames: "Secção · Como trabalhamos" (EzxmZ / Yisyd).
// Lista numerada com divisor superior por passo, não cartões: o .pen usa deliberadamente
// uma família de layout diferente da secção anterior (design-guardrails.md §4).

export async function ComoTrabalhamos() {
  const { home } = await getDictionary();
  const t = home.how;
  return (
    <section
      aria-labelledby="como-trabalhamos-titulo"
      className="flex flex-col gap-lg lg:gap-xl"
    >
      <SectionTitle id="como-trabalhamos-titulo">{t.title}</SectionTitle>

      <ol className="flex flex-col">
        {t.steps.map((descricao, index) => (
          <li
            key={index}
            className="flex gap-md border-t border-border-subtle py-md lg:gap-xl lg:py-lg"
          >
            <span
              aria-hidden
              className="w-10 shrink-0 font-mono text-body-lg font-semibold text-text-accent lg:w-[88px] lg:text-title"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="font-body text-body text-text-secondary">{descricao}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
