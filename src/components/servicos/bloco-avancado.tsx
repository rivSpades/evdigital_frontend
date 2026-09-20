import Link from "@/i18n/locale-link";
import { Card } from "@/components/ui/card";
import { IconeServico } from "@/components/servicos/icones";
import { cn } from "@/lib/cn";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { getAllServices } from "@/lib/content";
import type { ServiceFrontmatter } from "@/lib/content";

// Frames: "Bloco · Para quem quer ir mais longe" (R1JJmv no wide, MMNb6 no narrow).
// PRD-servicos.md §2 reduziu esta família a 4 produtos, em bento 2x2: 784/392 na
// primeira linha, 588/588 na segunda, dentro dos 1200 do $grid-max-width. O primeiro
// cartão (Ferramentas à medida) é o único com fundo em gradiente e ícone maior. No
// narrow o mesmo conjunto empilha numa coluna, pela mesma ordem.

type Servico = { slug: string; frontmatter: ServiceFrontmatter };

// [classes de grelha da linha, altura mínima dos cartões dessa linha no wide]
const LINHAS: [string, string][] = [
  ["lg:grid-cols-[784fr_392fr]", "lg:min-h-[300px]"],
  ["lg:grid-cols-2", "lg:min-h-[240px]"],
  ["lg:grid-cols-2", "lg:min-h-[240px]"],
];

function CartaoServico({
  servico,
  destaque,
  minHeight,
}: {
  servico: Servico;
  destaque: boolean;
  minHeight: string;
}) {
  return (
    <Link href={`/servicos/${servico.slug}`} className="block">
      <Card
        highlight
        className={cn(
          "flex h-full flex-col gap-sm p-lg transition-colors hover:bg-bg-surface-hover",
          minHeight,
          destaque
            ? cn(
                "bg-[linear-gradient(145deg,var(--color-accent-primary-subtle)_0%,var(--card-bg)_80%)]",
                "lg:justify-between lg:bg-[linear-gradient(145deg,var(--color-accent-primary-subtle)_0%,var(--card-bg)_72%)] lg:p-xl",
              )
            : undefined,
        )}
      >
        <div className="flex flex-col gap-sm lg:gap-md">
          <span
            className={cn(
              "flex shrink-0 items-center justify-center rounded-[var(--radius-md)]",
              "border border-border-highlight bg-accent-primary-subtle",
              destaque ? "size-14 lg:size-16" : "size-11 lg:size-12",
            )}
          >
            <IconeServico
              slug={servico.slug}
              size={destaque ? 28 : 22}
              className={cn("text-text-accent", destaque ? "lg:size-8" : "lg:size-6")}
            />
          </span>

          <h3
            className={cn(
              "font-heading text-text-primary",
              destaque
                ? "text-title font-bold tracking-[var(--letter-spacing-headline)] lg:text-headline"
                : "text-title-sm font-semibold tracking-[var(--letter-spacing-title)]",
            )}
          >
            {servico.frontmatter.title}
          </h3>
        </div>

        <p
          className={cn(
            "font-body text-body",
            destaque ? "text-text-primary lg:text-body-lg" : "text-text-secondary",
          )}
        >
          {servico.frontmatter.outcome}
        </p>
      </Card>
    </Link>
  );
}

export async function BlocoAvancado({ lang }: { lang: Locale }) {
  const t = (await getDictionary(lang)).servicos.avancado;
  const servicos = getAllServices(lang).filter((s) => s.frontmatter.family === "B");
  if (servicos.length === 0) return null;

  const linhas = LINHAS.map((linha, i) => ({
    chave: i,
    grelha: linha[0],
    minHeight: linha[1],
    servicos: servicos.slice(i * 2, i * 2 + 2),
  })).filter((linha) => linha.servicos.length > 0);

  return (
    <section
      id="avancadas"
      aria-labelledby="servicos-avancado-titulo"
      className="flex scroll-mt-24 flex-col gap-xl lg:gap-2xl"
    >
      <div className="flex flex-col gap-xs lg:gap-sm">
        <h2
          id="servicos-avancado-titulo"
          className="font-heading text-headline font-bold tracking-[var(--letter-spacing-headline)] text-text-primary lg:max-w-[1000px] lg:text-display-sm"
        >
          {t.titulo}
        </h2>
        <p className="font-body text-body text-text-secondary lg:max-w-[700px] lg:text-body-lg">
          {t.subtitulo}
        </p>
      </div>

      <div className="flex flex-col gap-md lg:gap-lg">
        {linhas.map((linha, i) => (
          <div key={linha.chave} className={cn("grid gap-md lg:gap-lg", linha.grelha)}>
            {linha.servicos.map((servico) => (
              <CartaoServico
                key={servico.slug}
                servico={servico}
                destaque={i === 0 && servico === linha.servicos[0]}
                minHeight={linha.minHeight}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
