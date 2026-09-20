import Link from "@/i18n/locale-link";
import { getDictionary } from "@/i18n/dictionaries";
import { LanguageSwitcher } from "@/i18n/language-switcher";
import { BrandLink } from "@/components/layout/brand-link";

// Espelha ds/layout/footer (HH9R0) e ds/layout/footer--mobile (QndOu) do
// design-system.pen. Abaixo de lg as colunas empilham, como no frame estreito.

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-xs lg:w-[200px]">
      <h2 className="font-body text-caption font-semibold tracking-[var(--letter-spacing-caption)] text-text-tertiary">
        {title}
      </h2>
      <ul className="flex flex-col">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="flex h-11 items-center font-body text-label text-text-secondary transition-colors hover:text-text-primary"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function Footer() {
  const { common: t } = await getDictionary();
  const navigationLinks = [
    { label: t.nav.services, href: "/servicos" },
    { label: t.nav.projects, href: "/projetos" },
    { label: t.nav.blog, href: "/blog" },
    { label: t.nav.about, href: "/sobre" },
    { label: t.nav.contact, href: "/contacto" },
  ];
  const legalLinks = [
    { label: t.footer.privacy, href: "/privacidade" },
    { label: t.footer.terms, href: "/termos" },
  ];
  return (
    <footer className="border-t border-border-subtle bg-bg-surface-sunken px-lg py-2xl md:px-xl lg:px-2xl lg:py-3xl">
      <div className="mx-auto flex max-w-[var(--grid-max-width)] flex-col gap-xl lg:gap-2xl">
        <div className="flex flex-col gap-xl lg:flex-row lg:justify-between lg:gap-4xl">
          <div className="flex flex-col gap-sm lg:w-[420px]">
            <BrandLink size="footer" />
            <p className="font-body text-body text-text-secondary">{t.footer.description}</p>
          </div>

          <div className="flex flex-col gap-xl lg:flex-row lg:gap-4xl">
            <FooterColumn title={t.footer.navigation} links={navigationLinks} />
            <FooterColumn title={t.footer.legal} links={legalLinks} />
          </div>
        </div>

        <span className="h-px w-full bg-border-subtle" />

        <div className="flex flex-wrap items-center justify-between gap-md">
          <p className="font-body text-caption tracking-[var(--letter-spacing-caption)] text-text-tertiary">
            © {new Date().getFullYear()} EvDigital.
          </p>
          <LanguageSwitcher label={t.language} />
        </div>
      </div>
    </footer>
  );
}
