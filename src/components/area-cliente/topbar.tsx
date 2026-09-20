import Link from "@/i18n/locale-link";
import { LogoutButton } from "@/components/area-cliente/logout-button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import type { MeInfo } from "@/lib/area-cliente/session";

// Espelha ac/layout/topbar do design-system.pen: marca + separador + "Área de
// Cliente", navegação Projetos/Pedidos, e conta com iniciais à direita.
//
// Fixa no topo (`sticky`, não `fixed`): mantém-se em fluxo normal do documento — sem isso,
// um `fixed` exigiria compensar com padding-top em cada página para o conteúdo não ficar
// escondido por baixo. `z-40` fica acima do conteúdo da página mas abaixo de modais/overlays
// futuros (o design system reserva `z-50`+ para esse nível).

// `currentPath` é o caminho sem idioma ("/area-cliente/projetos").

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

export function Topbar({
  me,
  currentPath,
  lang,
  t,
}: {
  me: MeInfo;
  currentPath: string;
  lang: Locale;
  t: Dictionary["areaCliente"];
}) {
  const LINKS = [
    { label: t.topbar.projetos, href: "/area-cliente/projetos" },
    { label: t.topbar.pedidos, href: "/area-cliente/pedidos" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-bg-surface">
      <div className="flex h-16 items-center justify-between gap-md px-lg md:px-xl lg:px-2xl">
        <div className="flex items-center gap-sm">
          <Link href="/" className="font-heading text-label font-bold tracking-[var(--letter-spacing-title)] text-text-primary">
            <span className="text-text-accent">Ev</span>Digital
          </Link>
          <span aria-hidden className="hidden h-5 w-px bg-border-default sm:block" />
          <span className="hidden font-body text-label text-text-secondary sm:inline">
            {t.topbar.area}
          </span>
        </div>

        <nav aria-label={t.topbar.area} className="hidden items-center gap-xl md:flex">
          {LINKS.map((link) => {
            const isCurrent = currentPath.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isCurrent ? "page" : undefined}
                className={cn(
                  "flex h-16 items-center border-b-2 font-body text-label",
                  isCurrent
                    ? "border-accent-primary font-semibold text-text-primary"
                    : "border-transparent text-text-secondary hover:text-text-primary",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-sm">
          <span className="hidden font-body text-caption text-text-secondary sm:inline">
            {me.name || me.email}
          </span>
          <span className="flex size-8 items-center justify-center rounded-[var(--radius-pill)] border border-border-default bg-bg-surface-raised">
            <span className="font-body text-caption font-medium text-text-secondary">
              {iniciais(me.name || me.email)}
            </span>
          </span>
          <LogoutButton lang={lang} label={t.logout} />
        </div>
      </div>

      {/* Sem isto, o mobile não tinha nenhuma forma de chegar a "Pedidos" a partir de
          "Projetos" (ou vice-versa) — apanhado em QA real no Chrome DevTools, não no
          build nem no curl. O desktop já resolve isto na barra principal (nav acima). */}
      <nav
        aria-label={t.topbar.area}
        className="flex items-center gap-lg border-t border-border-subtle px-lg md:hidden"
      >
        {LINKS.map((link) => {
          const isCurrent = currentPath.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isCurrent ? "page" : undefined}
              className={cn(
                "flex h-11 items-center border-b-2 font-body text-label",
                isCurrent
                  ? "border-accent-primary font-semibold text-text-primary"
                  : "border-transparent text-text-secondary hover:text-text-primary",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
