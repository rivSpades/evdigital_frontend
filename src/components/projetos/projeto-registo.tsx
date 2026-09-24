import { EstadoTexto } from "@/components/ui/estado-texto";
import { Facto, Factos } from "@/components/ui/facto";
import { Ligacao } from "@/components/ui/ligacao";
import { LigacaoExterna } from "@/components/ui/ligacao-externa";
import type { ProjectFrontmatter } from "@/lib/content";
import { hostLabel } from "@/lib/url";
import { getDictionary } from "@/i18n/dictionaries";

// Frames "v2 · A vez" / Ecrã · Projetos: "Registo · projeto" dentro de "Projetos · com 1
// projeto" (Z3GQJ desktop 1280, I5TCAE mobile 375). Um só projeto como registo largo, não
// cartão: réguas superior e inferior hairline $border-default, padding [$space-xl, 0] em lg
// e [$space-lg, 0] abaixo.
// - lg: Coluna principal (colunas 1 a 9, gap $space-md) e Ficha rápida (colunas 10 a 12,
//   278 no .pen) lado a lado, gutter $space-lg.
// - abaixo: empilhadas, gap $space-lg; coluna principal com gap $space-sm.
// Coluna principal: ds/display/estado-texto (só a palavra), Nome ($font-size-headline em
// lg, $font-size-title abaixo), Resumo (body-lg em lg, 640 de largura) e as Ligações
// (lado a lado com gap $space-lg em lg, empilhadas abaixo).
// Ficha rápida: título caption $text-tertiary e ds/display/facto por facto do conteúdo,
// mais "Stack usada" com a stack por extenso.

export async function ProjetoRegisto({
  slug,
  frontmatter,
}: {
  slug: string;
  frontmatter: ProjectFrontmatter;
}) {
  const { title, summary, stack, quickFacts, url } = frontmatter;
  const { projetos: t } = await getDictionary();

  return (
    <article className="flex flex-col gap-lg border-y border-border-default py-lg lg:grid lg:grid-cols-12 lg:gap-x-lg lg:py-xl">
      <div className="flex flex-col gap-sm lg:col-span-9 lg:gap-md">
        {url ? <EstadoTexto tom="primario">{t.statusLive}</EstadoTexto> : null}
        <h2 className="font-heading text-title leading-[var(--line-height-title)] font-semibold tracking-[var(--letter-spacing-title)] text-text-primary lg:text-headline lg:leading-[var(--line-height-headline)] lg:tracking-[var(--letter-spacing-headline)]">
          {title}
        </h2>
        <p className="font-body text-body text-text-secondary lg:max-w-[640px] lg:text-body-lg">
          {summary}
        </p>
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-lg">
          <Ligacao href={`/projetos/${slug}`} variant="acao">
            {t.viewProject}
          </Ligacao>
          {url ? <LigacaoExterna href={url}>{hostLabel(url)}</LigacaoExterna> : null}
        </div>
      </div>

      <div className="flex flex-col gap-sm lg:col-span-3">
        <h3 className="font-body text-caption text-text-tertiary">{t.quickFacts}</h3>
        <Factos>
          {quickFacts.map((fact) => (
            <Facto key={fact.label} termo={fact.label} valor={fact.value} valorTexto />
          ))}
          {stack.length > 0 ? (
            <Facto termo={t.stackUsed} valor={stack.join(", ")} valorTexto />
          ) : null}
        </Factos>
      </div>
    </article>
  );
}
