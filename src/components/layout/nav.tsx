import { getDictionary } from "@/i18n/dictionaries";
import { BrandLink } from "@/components/layout/brand-link";
import { NavMenu } from "@/components/layout/nav-menu";
import { navStrings } from "@/components/layout/nav-strings";

// Espelha ds/layout/nav (c6d0u), ds/layout/nav--mobile (jC2h2) e
// ds/layout/nav--mobile-aberto (E4kPF) do design-system.pen.
// Server Component: resolve o dicionário e passa só strings ao NavMenu (cliente).

export { BrandLink };

export async function Nav({ currentPath }: { currentPath?: string }) {
  const { common: t } = await getDictionary();
  return <NavMenu currentPath={currentPath} strings={navStrings(t)} />;
}
