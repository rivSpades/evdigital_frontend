import type { Metadata } from "next";
import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { hasLocale, htmlLang, locales } from "@/i18n/config";
import { hostDoAmbiente } from "@/i18n/area-cliente-href";
import { AreaClienteHostProvider } from "@/i18n/area-cliente-host";
import { ConsentAnalytics } from "@/components/analytics/consent-analytics";
import { SITE_ORIGIN } from "@/lib/site-origin";
import "../globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// latin-ext: o polaco usa ą ć ę ł ń ó ś ź ż, fora do subconjunto "latin".
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { common } = await getDictionary(lang);
  return {
    metadataBase: new URL(SITE_ORIGIN),
    title: { default: "EvDigital", template: "%s | EvDigital" },
    description: common.siteDescription,
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { common } = await getDictionary(lang);

  return (
    <html
      lang={htmlLang[lang]}
      data-theme="dark"
      className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-base text-text-primary font-body">
        {/* Ligações para a Área de Cliente saem com o host final (ver area-cliente-href.ts).
            Nas páginas estáticas o valor fica fixado no build: CLIENTES_URL e SITE_URL têm
            de existir no ambiente do build tal como em runtime. */}
        <AreaClienteHostProvider value={hostDoAmbiente(false)}>
          {children}
        </AreaClienteHostProvider>
        <ScrollToTop label={common.scrollToTop} />
        {/* GA4 só com consentimento e fora da Área de Cliente (ver consent-analytics.tsx). */}
        <ConsentAnalytics
          measurementId={process.env.GA_MEASUREMENT_ID}
          clientesHost={
            process.env.CLIENTES_URL
              ? new URL(process.env.CLIENTES_URL).host
              : undefined
          }
          t={common.cookies}
        />
      </body>
    </html>
  );
}
