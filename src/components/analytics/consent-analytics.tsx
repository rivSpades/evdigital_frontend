"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import Link from "@/i18n/locale-link";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/i18n/dictionaries";

// Google Analytics 4 só depois de consentimento (RGPD + Lei das Comunicações Eletrónicas):
// nada do Google carrega antes de "Aceitar" e a recusa tem o mesmo peso visual que a
// aceitação (dois `secondary`). A escolha vive em localStorage; o link «Cookies» do rodapé
// (`CookieSettingsLink`) volta a abrir o aviso. Não corre na Área de Cliente (autenticada).
//
// Aviso: painel fixo ao fundo, `bg-bg-surface` com régua superior hairline, sem glow, sem
// barra lateral nem marcador; dispensável só por uma das duas escolhas (banner.md do
// checklist: não é aviso crítico, mas exige decisão).

const KEY = "ev-cookie-consent";
const CHANGE = "ev-cookie-consent-change";
export const OPEN_SETTINGS = "ev-cookie-settings";

type Choice = "granted" | "denied" | "";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE, onChange);
  };
}

function read(): Choice {
  try {
    const value = localStorage.getItem(KEY);
    return value === "granted" || value === "denied" ? value : "";
  } catch {
    return "";
  }
}

function save(choice: Exclude<Choice, "">) {
  try {
    localStorage.setItem(KEY, choice);
  } catch {
    // Sem armazenamento: a escolha vale só nesta página.
  }
  window.dispatchEvent(new Event(CHANGE));
}

// Apaga os cookies do GA (`_ga`, `_ga_<ID>`) ao retirar o consentimento.
function clearGaCookies() {
  const hostParts = location.hostname.split(".");
  const domains = [
    location.hostname,
    ...hostParts.map((_, i) => `.${hostParts.slice(i).join(".")}`),
  ];
  for (const { name } of document.cookie
    .split(";")
    .map((c) => ({ name: c.split("=")[0].trim() }))) {
    if (!name.startsWith("_ga")) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
    }
  }
}

export function ConsentAnalytics({
  measurementId,
  clientesHost,
  t,
}: {
  measurementId?: string;
  clientesHost?: string;
  t: Dictionary["common"]["cookies"];
}) {
  const pathname = usePathname();
  // `null` no servidor: o aviso nunca faz parte do HTML pré-renderizado (sem flash).
  const choice = useSyncExternalStore<Choice | null>(
    subscribe,
    read,
    () => null,
  );
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    const open = () => setReopened(true);
    window.addEventListener(OPEN_SETTINGS, open);
    return () => window.removeEventListener(OPEN_SETTINGS, open);
  }, []);

  const foraDeAlcance =
    !measurementId ||
    pathname.split("/").includes("area-cliente") ||
    (!!clientesHost &&
      typeof location !== "undefined" &&
      location.host === clientesHost);

  useEffect(() => {
    if (measurementId) document.documentElement.dataset.analytics = "on";
  }, [measurementId]);

  useEffect(() => {
    if (choice === "denied" && measurementId) {
      (window as unknown as Record<string, boolean>)[
        `ga-disable-${measurementId}`
      ] = true;
      clearGaCookies();
    }
  }, [choice, measurementId]);

  if (foraDeAlcance || choice === null) return null;

  const decide = (value: "granted" | "denied") => {
    save(value);
    setReopened(false);
  };

  return (
    <>
      {choice === "granted" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${measurementId}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {(choice === "" || reopened) && (
        <section
          aria-label={t.title}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-border-default bg-bg-surface px-lg py-md md:px-xl"
        >
          <div className="mx-auto flex max-w-[var(--grid-max-width)] flex-col gap-md md:flex-row md:items-center md:gap-xl">
            <div className="flex flex-col gap-xs md:flex-1">
              <p className="font-heading text-body font-semibold text-text-primary">
                {t.title}
              </p>
              <p className="text-caption text-text-secondary">
                {t.text}{" "}
                <Link
                  href="/privacidade"
                  className="text-text-link hover:text-text-accent"
                >
                  {t.privacy}
                </Link>
              </p>
            </div>
            <div className="flex gap-sm md:shrink-0 [&>button]:flex-1 md:[&>button]:flex-none">
              <Button
                variant="secondary"
                size="md"
                onClick={() => decide("denied")}
              >
                {t.reject}
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => decide("granted")}
              >
                {t.accept}
              </Button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
