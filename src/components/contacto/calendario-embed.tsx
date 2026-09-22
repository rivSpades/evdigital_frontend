"use client";

import Script from "next/script";

// Embed inline do Cal.com, no espaço reservado da página de Contacto
// (TODO(Fase 4.5) resolvido — PRD-servicos.md §S-B4).
//
// Snippet oficial deles (Cal.com → Event Type → Embed → Inline), copiado tal e
// qual para dentro de um <Script>: evita puxar o pacote @calcom/embed-react só
// para isto, o site não tem mais nenhuma dependência de terceiros além do
// essencial (ver package.json). Tema fixo em "dark" porque o site não tem
// alternância de tema (`data-theme="dark"` em app/[lang]/layout.tsx).
//
// Uma marcação feita aqui não fica só no calendário: o Cal.com chama
// <BACKEND_BASE_URL>/api/webhooks/cal-com/, que cria a Lead no admin
// (apps/leads/views.py:CalComWebhookView, backend).

const CAL_NAMESPACE = "30min";
const CAL_LINK = process.env.NEXT_PUBLIC_CALCOM_LINK ?? "ric-rose-8rzdwe/30min";

// Exportado para o fallback <noscript> da página — sem JS, o embed não carrega.
export const CAL_BOOKING_URL = `https://cal.com/${CAL_LINK}`;

export function CalendarioEmbed({ placeholder }: { placeholder: string }) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-md)] border border-border-default bg-bg-surface-sunken">
      {/* O Cal.com substitui o conteúdo por um iframe assim que o script carrega;
          até lá, ou sem JS, fica o texto de espaço reservado. */}
      <div id="cal-inline-embed" className="min-h-[560px] w-full">
        <p className="font-body text-caption tracking-[var(--letter-spacing-caption)] flex h-[560px] items-center justify-center text-center text-text-tertiary">
          {placeholder}
        </p>
      </div>

      <Script id="cal-embed-init" strategy="afterInteractive">
        {`
          (function (C, A, L) {
            let p = function (a, ar) { a.q.push(ar); };
            let d = C.document;
            C.Cal = C.Cal || function () {
              let cal = C.Cal;
              let ar = arguments;
              if (!cal.loaded) {
                cal.ns = {};
                cal.q = cal.q || [];
                d.head.appendChild(d.createElement("script")).src = A;
                cal.loaded = true;
              }
              if (ar[0] === L) {
                const api = function () { p(api, arguments); };
                const namespace = ar[1];
                api.q = api.q || [];
                if (typeof namespace === "string") {
                  cal.ns[namespace] = cal.ns[namespace] || api;
                  p(cal.ns[namespace], ar);
                  p(cal, ["initNamespace", namespace]);
                } else p(cal, ar);
                return;
              }
              p(cal, ar);
            };
          })(window, "https://app.cal.com/embed/embed.js", "init");

          Cal("init", "${CAL_NAMESPACE}", { origin: "https://cal.com" });

          Cal.ns["${CAL_NAMESPACE}"]("inline", {
            elementOrSelector: "#cal-inline-embed",
            calLink: "${CAL_LINK}",
            config: { layout: "month_view", theme: "dark" },
          });

          Cal.ns["${CAL_NAMESPACE}"]("ui", {
            theme: "dark",
            hideEventTypeDetails: false,
            layout: "month_view",
          });
        `}
      </Script>
    </div>
  );
}
