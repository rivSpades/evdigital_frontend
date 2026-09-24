import { EstadoTexto } from "@/components/ui/estado-texto";
import { Ligacao } from "@/components/ui/ligacao";
import { LigacaoExterna } from "@/components/ui/ligacao-externa";

// Espelha ds/display/projeto-linha (syl4x) do design-system.pen (direcção "A vez"): um
// projeto como linha de registo compacta, não cartão (listagem com 2 ou mais projetos).
// Régua superior hairline $border-default, padding [$space-lg, 0], gap $space-sm.
// - Estado: ds/display/estado-texto, só a palavra, $text-primary (desligado sem url)
// - Nome: $font-heading $font-weight-heading $font-size-title-sm
// - Resumo: $font-body body $text-secondary, no máximo 3 linhas
// - Stack: caption $text-tertiary, texto simples (sem pills)
// - Ligações (gap $space-lg): ds/action/ligacao "acao" para a ficha e o host em
//   $font-mono caption $text-secondary (desligado sem url)
// Em lg ficam duas lado a lado (nunca 3, design-guardrails.md §4); a grelha é do contentor.

export function ProjetoLinha({
  estado,
  nome,
  resumo,
  stack,
  href,
  ligacao,
  url,
  host,
}: {
  estado?: string;
  nome: string;
  resumo: string;
  stack: string;
  href: string;
  ligacao: string;
  url?: string;
  host?: string;
}) {
  return (
    <li className="flex flex-col gap-sm border-t border-border-default py-lg">
      {estado ? <EstadoTexto tom="primario">{estado}</EstadoTexto> : null}
      <h2 className="font-heading text-title-sm leading-[var(--line-height-title)] font-semibold tracking-[var(--letter-spacing-title)] text-text-primary">
        {nome}
      </h2>
      <p className="line-clamp-3 font-body text-body text-text-secondary">{resumo}</p>
      <p className="font-body text-caption tracking-[var(--letter-spacing-caption)] text-text-tertiary">
        {stack}
      </p>
      <div className="flex flex-wrap items-center gap-x-lg">
        <Ligacao href={href} variant="acao">
          {ligacao}
        </Ligacao>
        {url && host ? <LigacaoExterna href={url}>{host}</LigacaoExterna> : null}
      </div>
    </li>
  );
}
