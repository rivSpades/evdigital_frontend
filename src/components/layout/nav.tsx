import { getDictionary } from "@/i18n/dictionaries";
import { BrandLink } from "@/components/layout/brand-link";
import { NavMenu } from "@/components/layout/nav-menu";

// Espelha ds/layout/nav (c6d0u), ds/layout/nav--mobile (jC2h2) e
// ds/layout/nav--mobile-aberto (E4kPF) do design-system.pen.
// Server Component: resolve o dicionário e passa só strings ao NavMenu (cliente).

export { BrandLink };

export async function Nav({ currentPath }: { currentPath?: string }) {
  const { common: t } = await getDictionary();
  const links = [
    { label: t.nav.services, href: "/servicos" },
    { label: t.nav.projects, href: "/projetos" },
    { label: t.nav.blog, href: "/blog" },
    { label: t.nav.about, href: "/sobre" },
  ];
  const clientAreaHref = "/area-cliente/entrar";
  return (
    <NavMenu
      currentPath={currentPath}
      strings={{
        main: t.nav.main,
        links,
        mobileLinks: [
          ...links,
          { label: t.nav.contact, href: "/contacto" },
          { label: t.nav.clientArea, href: clientAreaHref },
        ],
        clientArea: t.nav.clientArea,
        clientAreaHref,
        cta: t.cta,
        openMenu: t.nav.openMenu,
        closeMenu: t.nav.closeMenu,
      }}
    />
  );
}
