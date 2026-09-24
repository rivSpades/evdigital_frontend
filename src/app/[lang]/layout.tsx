import type { Metadata } from "next";
import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { hasLocale, htmlLang, locales } from "@/i18n/config";
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

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { common } = await getDictionary(lang);
  return {
    title: { default: "EvDigital", template: "%s | EvDigital" },
    description: common.siteDescription,
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
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
        {children}
        <ScrollToTop label={common.scrollToTop} />
      </body>
    </html>
  );
}
