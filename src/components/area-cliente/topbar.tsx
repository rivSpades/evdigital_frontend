import Link from "@/i18n/locale-link";
import { AccountMenu } from "@/components/area-cliente/account-menu";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { MeInfo } from "@/lib/area-cliente/session";

// Espelha ac/layout/topbar do design-system.pen: marca + separador + "Área de
// Cliente" (link para a lista de projetos — o "home" da Área de Cliente) + conta com
// iniciais à direita. "Definições" e "Terminar sessão" vivem dentro do menu da conta
// (`AccountMenu`), não na navegação principal.
//
// Sem nav de secções Projetos/Pedidos: pedidos deixaram de ser um destino de topo par
// com Projetos — cada pedido vive dentro do seu projeto (`projetos/[id]`), por isso um
// separador de abas aqui deixou de fazer sentido. "Os seus pedidos" continua acessível
// a partir da lista de projetos e do detalhe de cada projeto.
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
          <Link
            href="/area-cliente/projetos"
            className="hidden font-body text-label text-text-secondary hover:text-text-primary sm:inline"
          >
            {t.topbar.area}
          </Link>
        </div>

        <AccountMenu me={me} lang={lang} t={t} />
      </div>
    </header>
  );
}
