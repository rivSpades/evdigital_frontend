import { CircleDot, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ProjectFrontmatter } from "@/lib/content";
import { hostLabel } from "@/lib/url";
import { getDictionary } from "@/i18n/dictionaries";

// Cartão da listagem de projetos: instância de ds/display/card--feature (idyUb) nos
// frames S0F6k (1440) e kNnUB (390).
//
// A media do master está desligada nas duas instâncias, por isso o cartão é só conteúdo.
// O painel "Ficha rápida" muda de forma entre viewports, tal como no .pen: no wide é uma
// coluna de 400px com fundo $bg-surface-sunken e contorno esquerdo hairline; no narrow
// desce para dentro do cartão, a seguir a um divisor, com rótulo e valor na mesma linha.

export async function ProjetoCard({
  slug,
  frontmatter,
}: {
  slug: string;
  frontmatter: ProjectFrontmatter;
}) {
  const { title, summary, stack, quickFacts, url } = frontmatter;
  const { projetos: t } = await getDictionary();

  return (
    <Card
      highlight
      className="flex flex-col overflow-hidden shadow-[var(--shadow-elevation-2)] lg:flex-row lg:items-stretch"
    >
      <div className="flex flex-col gap-lg p-lg lg:flex-1 lg:p-2xl">
        {url ? (
          <Badge
            tone="accent"
            className="self-start"
            icon={<CircleDot size={16} strokeWidth={2} aria-hidden />}
          >
            {t.statusLive}
          </Badge>
        ) : null}

        <div className="flex flex-col gap-xs lg:gap-sm">
          <h2 className="font-heading text-title-sm font-semibold tracking-[var(--letter-spacing-title)] text-text-primary lg:text-title">
            {title}
          </h2>
          <p className="font-body text-body text-text-secondary">{summary}</p>
        </div>

        <ul className="flex flex-wrap items-center gap-xs">
          {stack.map((item) => (
            <li key={item}>
              <Badge tone="neutral">{item}</Badge>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-xs md:flex-row md:items-center md:gap-sm">
          <ButtonLink href={`/projetos/${slug}`} className="w-full md:w-auto">
            {t.viewProject}
          </ButtonLink>

          {url ? (
            <ButtonLink
              href={url}
              variant="secondary"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto"
            >
              {hostLabel(url)}
              <ExternalLink size={20} strokeWidth={2} aria-hidden />
            </ButtonLink>
          ) : null}
        </div>

        {quickFacts.length > 0 ? (
          <>
            <span aria-hidden className="h-px w-full bg-border-subtle lg:hidden" />

            <dl className="flex flex-col gap-sm lg:hidden">
              {quickFacts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex items-start justify-between gap-sm"
                >
                  <dt className="font-body text-caption text-text-tertiary">
                    {fact.label}
                  </dt>
                  <dd className="max-w-[196px] text-right font-body text-caption font-medium text-text-primary md:max-w-none">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </>
        ) : null}
      </div>

      {quickFacts.length > 0 ? (
        <div className="hidden w-[400px] shrink-0 flex-col justify-center gap-lg border-l border-border-subtle bg-bg-surface-sunken p-xl lg:flex">
          <p className="font-body text-caption font-medium tracking-[var(--letter-spacing-caption)] text-text-tertiary">
            {t.quickFacts}
          </p>

          <dl className="flex flex-col gap-lg">
            {quickFacts.map((fact) => (
              <div key={fact.label} className="flex flex-col gap-3xs">
                <dt className="font-body text-caption text-text-tertiary">
                  {fact.label}
                </dt>
                <dd className="font-body text-body leading-[var(--line-height-label)] font-medium text-text-primary">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
    </Card>
  );
}

// Versão para 2 ou mais projetos (grelha de 2 colunas, nunca 3: design-guardrails.md §4).
// O cartão largo com painel lateral só faz sentido com um projeto; repetido seis vezes
// seria seis ecrãs de scroll sem forma de comparar. Aqui fica o essencial: estado, nome,
// resumo curto, stack e as duas ligações. A "Ficha rápida" vive na página do projeto.
export async function ProjetoCardCompacto({
  slug,
  frontmatter,
}: {
  slug: string;
  frontmatter: ProjectFrontmatter;
}) {
  const { title, summary, stack, url } = frontmatter;
  const { projetos: t } = await getDictionary();

  return (
    <Card highlight className="flex h-full flex-col gap-md p-lg lg:p-xl">
      {url ? (
        <Badge
          tone="accent"
          className="self-start"
          icon={<CircleDot size={16} strokeWidth={2} aria-hidden />}
        >
          {t.statusLive}
        </Badge>
      ) : null}

      <div className="flex flex-col gap-xs">
        <h2 className="font-heading text-title-sm font-semibold tracking-[var(--letter-spacing-title)] text-text-primary">
          {title}
        </h2>
        <p className="line-clamp-3 font-body text-body text-text-secondary">{summary}</p>
      </div>

      <ul className="flex flex-wrap items-center gap-xs">
        {stack.slice(0, 4).map((item) => (
          <li key={item}>
            <Badge tone="neutral" size="sm">
              {item}
            </Badge>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap items-center gap-sm pt-sm">
        <ButtonLink href={`/projetos/${slug}`} size="md">
          {t.viewProjectShort}
        </ButtonLink>
        {url ? (
          <ButtonLink
            href={url}
            variant="tertiary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {hostLabel(url)}
            <ExternalLink size={18} strokeWidth={2} aria-hidden />
          </ButtonLink>
        ) : null}
      </div>
    </Card>
  );
}
