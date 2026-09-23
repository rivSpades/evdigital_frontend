import Link from "@/i18n/locale-link";
import { TopbarNav } from "@/components/area-cliente/topbar-nav";
import { AccountMenu } from "@/components/area-cliente/account-menu";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { MeInfo } from "@/lib/area-cliente/session";

// Espelha ac/layout/topbar do design-system.pen: marca + separador + "Área de
// Cliente" (link para a lista de projetos — o "home" da Área de Cliente) + conta com
// iniciais à direita. "Definições" e "Terminar sessão" vivem dentro do menu da conta
// (`AccountMenu`), não na navegação principal.
//
// Navegação principal: Projetos e Pedidos (`TopbarNav`, com estado activo pelo segmento
// da rota). "Pedidos" lista todos os pedidos; cada projeto continua a mostrar os seus.
//
// Fixa no topo (`sticky`, não `fixed`): mantém-se em fluxo normal do documento — sem isso,
// um `fixed` exigiria compensar com padding-top em cada página para o conteúdo não ficar
// escondido por baixo. `z-40` fica acima do conteúdo da página mas abaixo de modais/overlays
// futuros (o design system reserva `z-50`+ para esse nível).

export function Topbar({
  me,
  lang,
  t,
}: {
  me: MeInfo;
  lang: Locale;
  t: Dictionary["areaCliente"];
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-bg-surface">
      <div className="flex h-16 items-center justify-between gap-md px-lg md:px-xl lg:px-2xl">
        <div className="flex items-center gap-sm">
          <Link href="/" className="font-heading text-label font-bold tracking-[var(--letter-spacing-title)] text-text-primary">
            <span className="text-text-accent">Ev</span>Digital
          </Link>
          <span aria-hidden className="hidden h-5 w-px bg-border-default sm:block" />
          <TopbarNav
            ariaLabel={t.topbar.area}
            items={[
              { href: "/area-cliente/projetos", segment: "projetos", label: t.topbar.projetos },
              { href: "/area-cliente/pedidos", segment: "pedidos", label: t.topbar.pedidos },
            ]}
          />
        </div>

        <AccountMenu me={me} lang={lang} t={t} />
      </div>
    </header>
  );
}
