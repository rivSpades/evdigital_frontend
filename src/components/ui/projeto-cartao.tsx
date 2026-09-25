import Image from "next/image";
import { EstadoTexto } from "@/components/ui/estado-texto";
import { Ligacao } from "@/components/ui/ligacao";
import { LigacaoExterna } from "@/components/ui/ligacao-externa";
import Link from "@/i18n/locale-link";
import { cn } from "@/lib/cn";

// Substitui ds/display/projeto-linha (syl4x) e o registo largo na listagem: um projeto como cartão aberto
// com capa (captura do produto), sem contorno no cartão (design-guardrails.md §4) — só a
// capa tem hairline $border-default, porque é imagem e precisa de limite sobre o fundo.
// - Capa: 2:1, ligação para a ficha (alt vazio: o nome já está no título). Sem capa, um
//   bloco $bg-surface com o nome em $font-heading, para a grelha não ter buracos.
// - Estado: ds/display/estado-texto, só a palavra. Nome: $font-size-title-sm.
// - Resumo: body $text-secondary, no máximo 3 linhas. Stack: caption $text-tertiary, texto
//   simples (sem pills). Ligações: ficha (acao) + host em mono.
// `destaque` (um único projeto): em lg capa e texto lado a lado, a ocupar a largura toda,
// para a grelha de 2 colunas nunca ficar com uma célula vazia.

export function ProjetoCartao({
  estado,
  nome,
  resumo,
  stack,
  href,
  ligacao,
  cover,
  url,
  host,
  destaque = false,
  prioritaria = false,
}: {
  estado?: string;
  nome: string;
  resumo: string;
  stack: string;
  href: string;
  ligacao: string;
  cover?: string;
  url?: string;
  host?: string;
  destaque?: boolean;
  prioritaria?: boolean;
}) {
  return (
    <li
      className={cn(
        "flex flex-col gap-md border-t border-border-default py-lg",
        destaque && "lg:col-span-2 lg:grid lg:grid-cols-2 lg:items-center lg:gap-x-xl",
      )}
    >
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block aspect-[2/1] overflow-hidden border border-border-default bg-bg-surface"
      >
        {cover ? (
          <Image
            src={cover}
            alt=""
            fill
            priority={prioritaria}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-top"
          />
        ) : (
          <span className="flex size-full items-center justify-center font-heading text-title-sm font-semibold text-text-tertiary">
            {nome}
          </span>
        )}
      </Link>

      <div className="flex flex-col gap-sm">
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
      </div>
    </li>
  );
}
