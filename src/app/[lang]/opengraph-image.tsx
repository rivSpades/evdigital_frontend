import { ImageResponse } from "next/og";
import { getDictionary } from "@/i18n/dictionaries";
import { defaultLocale, hasLocale } from "@/i18n/config";

// Imagem de pré-visualização (LinkedIn, WhatsApp, Google) das páginas sem imagem própria.
// Cores dos tokens (tokens.css): fundo $bg-base, texto $text-primary/$text-secondary, marca
// em $accent-primary. Sem glow, sem gradiente: só tipografia (design-guardrails.md).
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "EvDigital";

export default async function OpengraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const { common } = await getDictionary(hasLocale(lang) ? lang : defaultLocale);
  // "EvDigital: descrição" -> só a descrição, sem repetir o nome.
  const semNome = common.siteDescription.replace(/^EvDigital:\s*/, "");
  const descricao = semNome.charAt(0).toLocaleUpperCase() + semNome.slice(1);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0A0A0B",
        padding: "80px",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 44,
          fontWeight: 700,
          color: "#00C77C",
        }}
      >
        EvDigital
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 72,
          fontWeight: 700,
          lineHeight: 1.1,
          color: "#F4F4F3",
          maxWidth: 980,
        }}
      >
        {descricao}
      </div>
      <div style={{ display: "flex", fontSize: 30, color: "#C4C4BF" }}>www.evdigital.eu</div>
    </div>,
    size,
  );
}
