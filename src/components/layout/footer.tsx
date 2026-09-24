import { getDictionary } from "@/i18n/dictionaries";
import { FooterView } from "@/components/layout/footer-view";

// Espelha ds/layout/footer--vez (E2nmWM) e ds/layout/footer--vez-mobile (EbRBz) do
// design-system.pen. Server Component: resolve o dicionário do idioma do pedido e delega
// em `FooterView`.

export async function Footer() {
  const { common: t } = await getDictionary();
  return <FooterView t={t} />;
}
