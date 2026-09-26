import Link from "@/i18n/locale-link";
import type { Dictionary } from "@/i18n/dictionaries";
import { LanguageSwitcher } from "@/i18n/language-switcher";
import { navStrings } from "@/components/layout/nav-strings";
import { CookieSettingsLink } from "@/components/analytics/cookie-settings-link";
import { Ligacao } from "@/components/ui/ligacao";

// Espelha ds/layout/footer--vez (E2nmWM, lg) e ds/layout/footer--vez-mobile (EbRBz, abaixo)
// do design-system.pen (direcção "A vez"): rodapé compacto, fundo $bg-base, régua superior
// hairline $border-default, padding [$space-xl, margem de layout].
// - lg: uma linha, gap $space-lg: Marca, ligações discretas (ds/action/ligacao caption
//   $text-secondary) e o Idioma encostado à direita.
// - abaixo de lg: linhas empilhadas com gap $space-sm: Marca e ligações legais; Área de
//   Cliente e Idioma (space-between).
// Marca: "EvDigital" em $font-heading label $font-weight-display $text-primary, ligação para
// a Início com alvo de 44.
//
// Só as ligações do .pen (Privacidade, Termos, Área de Cliente) mais Consultores (decisão do dono, 2026-09-26: fora da barra de topo) e o Idioma; a navegação
// principal vive na barra de topo (decisão do dono, 2026-09-24). A frase de descrição, os
// títulos de coluna, o "© ano" e as ligações de navegação do rodapé anterior saíram.
//
// `FooterView` recebe as strings e serve em Server e Client Components (a página de erro
// é um Client Component e não pode resolver o dicionário); `Footer` (footer.tsx) resolve o
// dicionário do pedido e delega.

export function FooterView({ t }: { t: Dictionary["common"] }) {
  const { clientAreaHref } = navStrings(t);
  const legalLinks = [
    { label: t.nav.consultants, href: "/consultants" },
    { label: t.footer.privacy, href: "/privacidade" },
    { label: t.footer.terms, href: "/termos" },
  ];
  return (
    <footer className="border-t border-border-default bg-bg-base px-lg py-xl md:px-xl lg:px-2xl">
      <div className="mx-auto flex max-w-[var(--grid-max-width)] flex-col gap-sm lg:flex-row lg:items-center lg:gap-lg">
        <div className="flex flex-wrap items-center gap-x-lg lg:contents">
          <Link
            href="/"
            className="flex h-11 items-center font-heading text-label leading-[var(--line-height-title)] font-bold tracking-[var(--letter-spacing-title)] text-text-primary"
          >
            EvDigital
          </Link>
          <nav aria-label={t.footer.legal}>
            <ul className="flex flex-wrap items-center gap-x-lg">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  {/* min-w-11: alvo de 44 também na largura ("Terms" em en mede ~41). O
                      texto fica encostado à esquerda, como antes. */}
                  <Ligacao href={link.href} variant="discreta-caption" className="min-w-11">
                    {link.label}
                  </Ligacao>
                </li>
              ))}
              <li>
                <CookieSettingsLink label={t.cookies.label} />
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex items-center justify-between gap-lg lg:contents">
          <Ligacao href={clientAreaHref} variant="discreta-caption">
            {t.nav.clientArea}
          </Ligacao>
          <LanguageSwitcher label={t.language} className="lg:ml-auto" />
        </div>
      </div>
    </footer>
  );
}
