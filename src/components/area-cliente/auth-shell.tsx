import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "@/i18n/locale-link";

// Casca dos ecrãs de autenticação da Área de Cliente (Entrar, Criar conta, Nova
// palavra-passe, Confirmar email, erro e 404 sem sessão), frames v2 "A vez" do design-system.pen.
//
// Cabeçalho de autenticação: 72 de altura, fundo $bg-base, sem régua visível (hairline
// $color-transparent), margem $space-layout-margin-narrow (24) em mobile e
// $space-layout-margin-wide (48) em desktop; marca "EvDigital" em Sora $font-size-body-lg
// $font-weight-display $text-primary (sem verde: o verde fica para o primário), ligação à
// landing pública, e, à
// direita, "Voltar ao site" (ds/action/ligacao discreta). "Voltar ao site" vai para o site
// PÚBLICO (`siteHref`, absoluto a partir de SITE_URL, ver `lib/site-url.ts`): um "/" no
// host da Área de Cliente seria /<lang>/projetos e, sem sessão, voltava a Entrar.
//
// Principal: a mesma margem. Os ecrãs de autenticação (Entrar, Criar conta, pedir ligação,
// confirmar email, nova palavra-passe) vivem numa coluna única de 448 (a largura da
// ds/layout/folha) centrada na horizontal e encostada ao topo (pedido do dono, 2026-09-24).
// Em mobile a coluna ocupa a largura entre as margens de 24. Título e texto de cada ecrã alinham à esquerda dentro da coluna.

export function AuthShell({
  backToSite,
  backLabel,
  backHref,
  area,
  siteHref = "/",
  bare = false,
  children,
}: {
  /** "Voltar ao site" (nome acessível da seta); sem ele o cabeçalho fica só com a marca (página de erro). */
  backToSite?: string;
  /**
   * Nome acessível da seta quando não volta ao site (ex. «Voltar a entrar» em
   * /recuperar-palavra-passe). Sem ele vale `backToSite`.
   */
  backLabel?: string;
  /**
   * Destino da seta (caminho interno, localizado pelo LocaleLink). Por omissão `siteHref`
   * (o site público), como em Entrar, Criar conta, Confirmar e Nova palavra-passe.
   */
  backHref?: string;
  /**
   * Título ao lado da seta na linha por baixo da barra de topo: «Área de Cliente» nos ecrãs
   * de autenticação, o do próprio ecrã em /recuperar-palavra-passe.
   */
  area?: string;
  /**
   * Destino da marca e de "Voltar ao site": `publicSiteHref(lang)` no servidor (ou
   * `useSiteHref()` num Client Component).
   */
  siteHref?: string;
  /** O conteúdo já traz o seu próprio <main> (ex. 404). */
  bare?: boolean;
  children: ReactNode;
}) {
  const seta = backLabel ?? backToSite;
  return (
    <div className="flex min-h-screen flex-col bg-bg-base">
      {/* Mesmo padrão das outras páginas da Área de Cliente (pedido do dono, 2026-09-24):
          1) barra de topo (fixa) só com o logótipo, que leva à landing do site PÚBLICO;
          2) por baixo, também fixa, a linha «seta para voltar + título». */}
      <header className="sticky top-0 z-40 border-b border-border-default bg-bg-base">
        <div className="flex h-16 items-center px-lg md:px-xl lg:px-2xl">
          <Link
            href={siteHref}
            aria-label="EvDigital"
            className="flex h-11 shrink-0 items-center font-heading text-body-lg leading-[var(--line-height-title)] font-bold tracking-[var(--letter-spacing-title)] text-text-primary"
          >
            EvDigital
          </Link>
        </div>
      </header>
      {seta ? (
        <div className="sticky top-[65px] z-30 bg-bg-base px-lg md:px-xl lg:px-2xl">
          <div className="flex min-h-14 items-center gap-x-md py-2xs md:gap-x-lg">
            <Link
              href={backHref ?? siteHref}
              aria-label={seta}
              title={seta}
              className="-ml-xs inline-flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-text-secondary transition-colors hover:bg-bg-surface-hover hover:text-text-primary"
            >
              <ArrowLeft size={20} strokeWidth={2} aria-hidden />
            </Link>
            {area ? (
              <p className="min-w-0 font-heading text-title-sm leading-[var(--line-height-title)] font-semibold tracking-[var(--letter-spacing-title)] text-text-primary md:text-title">
                {area}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
      {bare ? children : <main className="flex flex-1 flex-col px-lg md:px-xl lg:px-2xl">{children}</main>}
    </div>
  );
}

/**
 * Secção de autenticação: a coluna de 448 centrada na horizontal e encostada ao topo, com
 * a mesma margem superior em todos os ecrãs ($space-xl em mobile, $space-2xl a partir de
 * md) e $space-3xl no fundo. Sem centragem vertical: cada ecrã fica com a sua altura
 * natural e a coluna não salta ao passar de um para o outro (pedido do dono, 2026-09-24).
 * `back` ("Voltar a entrar", "Voltar") fica fora da coluna, na primeira linha a seguir ao
 * cabeçalho, alinhado à margem da página (design-guardrails.md §6), com $space-md
 * ($space-lg em desktop) até à coluna.
 */
export function AuthSection({
  back,
  children,
}: {
  back?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-md pt-xl pb-3xl md:gap-lg md:pt-2xl">
      {back ? <div className="flex">{back}</div> : null}
      <div className="mx-auto flex w-full max-w-[448px] flex-col">{children}</div>
    </section>
  );
}

/** Contexto "Área de Cliente" por cima do conteúdo de autenticação. */
export function AuthContext({
  as: Tag = "p",
  children,
}: {
  as?: "h1" | "p";
  children: string;
}) {
  return (
    <Tag className="font-heading text-body-lg font-semibold tracking-[var(--letter-spacing-title)] text-text-tertiary md:text-title-sm">
      {children}
    </Tag>
  );
}
