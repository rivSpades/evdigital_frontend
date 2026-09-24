import Link from "@/i18n/locale-link";

// Marca de texto. Na nav, as instâncias de ds/layout/nav e ds/layout/nav--mobile nos
// frames "v2 · A vez" do .pen tiram o verde ao "Ev" (fill $text-primary) e põem as duas
// partes em $font-weight-display: a marca é neutra, o verde fica para o CTA. A variante
// "footer" mantém o master ds/layout/footer ("Ev" em $text-accent, "Digital" a 600).
function Wordmark({ size = "nav" }: { size?: "nav" | "footer" }) {
  if (size === "nav") {
    return (
      <span className="font-heading text-body-lg leading-[var(--line-height-title)] font-bold tracking-[var(--letter-spacing-title)] text-text-primary">
        EvDigital
      </span>
    );
  }
  return (
    <span className="font-heading text-title-sm tracking-[var(--letter-spacing-title)]">
      <span className="font-bold text-text-accent">Ev</span>
      <span className="font-semibold text-text-primary">Digital</span>
    </span>
  );
}

// `href`: por omissão a Início do host actual ("/"). A barra de topo da Área de Cliente
// passa `publicSiteHref(lang)` (URL absoluto do site público): no host dos clientes um
// "/" ficava na Área de Cliente em vez de chegar à landing.
export function BrandLink({
  size = "nav",
  href = "/",
}: {
  size?: "nav" | "footer";
  href?: string;
}) {
  return (
    <Link href={href} className="flex h-11 shrink-0 items-center">
      <Wordmark size={size} />
    </Link>
  );
}
