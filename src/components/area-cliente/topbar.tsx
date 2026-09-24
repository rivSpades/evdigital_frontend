import { BrandLink } from "@/components/layout/brand-link";
import { TopbarNav } from "@/components/area-cliente/topbar-nav";
import { AccountMenu } from "@/components/area-cliente/account-menu";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { MeInfo } from "@/lib/area-cliente/session";

// Espelha as instâncias de ac/layout/topbar (Tqa1g, 1280) e ac/layout/topbar--mobile
// (G5XQH4, 375) nos ecrãs "v2 · A vez" do design-system.pen:
// - Barra $bg-base com régua inferior hairline $border-default, margem
//   $space-layout-margin-narrow/mid/wide (24/32/48).
// - Marca: a mesma de ds/layout/nav (BrandLink, "EvDigital" neutro em Sora body-lg
//   $font-weight-display, sem verde), ligação para a Início do site PÚBLICO (`siteHref`,
//   `publicSiteHref(lang)` no layout: um "/" no host dos clientes ficava nos projetos) e, a partir de md, o contexto "Área de Cliente" em
//   $font-mono caption $text-tertiary (gap $space-md).
// - Navegação (Projetos, Pedidos): itens de 44 com padding [0, $space-sm], gap $space-2xs;
//   o activo diz-se por peso e cor do texto ($font-weight-body-strong $text-primary contra
//   $font-weight-label $text-secondary), sem fundo nem sublinhado.
// - Conta (AccountMenu): nome em body $text-primary a partir de md e avatar de 32 com as
//   iniciais em $font-mono. "Definições" e "Terminar sessão" vivem no menu da conta.
// Desktop (md+): uma linha de 64, gap $space-lg, a navegação ocupa o espaço do meio.
// Mobile: 64 com marca e conta, e a navegação numa segunda linha (padding [0, $space-sm],
// padding-bottom $space-xs). Uma só <nav> no DOM; a ordem visual muda por CSS.
//
// Fixa no topo (`sticky`, não `fixed`): fica em fluxo normal, sem compensar padding-top em
// cada página. `z-40` fica abaixo de modais/overlays (`z-50`+).

export function Topbar({
  me,
  lang,
  t,
  siteHref,
}: {
  me: MeInfo;
  lang: Locale;
  t: Dictionary["areaCliente"];
  /** Início do site público: `publicSiteHref(lang)`, calculado no servidor. */
  siteHref: string;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border-default bg-bg-base">
      <div className="flex flex-wrap items-center justify-between px-lg pb-xs md:flex-nowrap md:justify-start md:gap-lg md:px-xl md:pb-0 lg:px-2xl">
        <div className="flex h-16 min-w-0 shrink-0 items-center gap-md">
          <BrandLink href={siteHref} />
          <p className="hidden font-mono text-caption whitespace-nowrap text-text-tertiary md:block">
            {t.topbar.area}
          </p>
        </div>
        <TopbarNav
          ariaLabel={t.topbar.area}
          className="order-last -mx-sm w-[calc(100%_+_2*var(--spacing-sm))] md:order-none md:mx-0 md:w-auto md:flex-1"
          items={[
            { href: "/area-cliente/projetos", segment: "projetos", label: t.topbar.projetos },
            { href: "/area-cliente/pedidos", segment: "pedidos", label: t.topbar.pedidos },
          ]}
        />
        <div className="flex h-16 items-center">
          <AccountMenu me={me} lang={lang} t={t} />
        </div>
      </div>
    </header>
  );
}
