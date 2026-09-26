import type { NavStrings } from "@/components/layout/nav-menu";

// Módulo simples (sem "use client"): corre no servidor (`Nav`) e no cliente (página de
// erro), ao contrário de uma função exportada de nav-menu.tsx, que seria uma referência de
// cliente e não se pode chamar no servidor.

/** Strings da navegação a partir do namespace `common` (usado por `Nav` e pela página de erro). */
export function navStrings(t: {
  cta: string;
  nav: {
    main: string;
    services: string;
    projects: string;
    blog: string;
    consultants: string;
    about: string;
    clientArea: string;
    openMenu: string;
    closeMenu: string;
  };
}): NavStrings {
  // Ordem das instâncias de ds/layout/nav em "v2 · A vez": Sobre antes de Blog.
  const links = [
    { label: t.nav.services, href: "/servicos" },
    { label: t.nav.projects, href: "/projetos" },
    { label: t.nav.about, href: "/sobre" },
    { label: t.nav.blog, href: "/blog" },
    { label: t.nav.consultants, href: "/consultants" },
  ];
  const clientAreaHref = "/area-cliente/entrar";
  return {
    main: t.nav.main,
    links,
    // Sem "Contacto" na lista: o CTA "Fale connosco" no fim do menu já leva a /contacto
    // (uma só etiqueta para a mesma intenção, como no desktop).
    mobileLinks: [
      ...links,
      { label: t.nav.clientArea, href: clientAreaHref },
    ],
    clientArea: t.nav.clientArea,
    clientAreaHref,
    cta: t.cta,
    openMenu: t.nav.openMenu,
    closeMenu: t.nav.closeMenu,
  };
}
