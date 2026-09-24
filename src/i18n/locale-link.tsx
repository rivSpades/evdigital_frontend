"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, type ComponentProps } from "react";
import { resolverHref } from "./area-cliente-href";
import { useAreaClienteHost } from "./area-cliente-host";
import { hasLocale, defaultLocale } from "./config";

/**
 * Substituto directo de `next/link` para caminhos internos: prefixa o idioma actual
 * (`/servicos` -> `/en/servicos`). Serve em Server e Client Components porque lê o
 * idioma do segmento `[lang]` no cliente. Links externos e âncoras passam intactos.
 *
 * Ligações `/area-cliente/...` saem já no endereço final (sem o segmento no subdomínio, ou
 * absolutas a partir do site público), para não pagarem um redirect do proxy a cada
 * clique: ver `area-cliente-href.ts`.
 *
 * Prefetch: o de omissão do `next/link` (páginas estáticas inteiras; nas dinâmicas até ao
 * loading.tsx). Dentro da Área de Cliente, ao primeiro sinal de intenção (rato por cima,
 * toque, foco) a ligação passa a `prefetch={true}` e traz a página inteira: o clique abre-a
 * logo, sem esqueleto. O esqueleto custa pelo menos 300 ms mesmo com o servidor rápido (o
 * React segura a troca esqueleto → conteúdo durante 300 ms para não piscar). O resultado
 * fica na cache do cliente durante `staleTimes.static` (next.config.ts) ou até um
 * `router.refresh()` das mutações.
 */
export default function LocaleLink({
  href,
  prefetch,
  onMouseEnter,
  onTouchStart,
  onFocus,
  ...props
}: ComponentProps<typeof Link>) {
  const { lang } = useParams<{ lang?: string }>();
  const host = useAreaClienteHost();
  const [intencao, setIntencao] = useState(false);
  const locale = hasLocale(lang) ? lang : defaultLocale;
  const resolved = typeof href === "string" ? resolverHref(locale, href, host) : href;

  const porIntencao = prefetch === undefined && host.dentroDaArea;
  if (!porIntencao) {
    return (
      <Link
        href={resolved}
        prefetch={prefetch}
        onMouseEnter={onMouseEnter}
        onTouchStart={onTouchStart}
        onFocus={onFocus}
        {...props}
      />
    );
  }

  return (
    <Link
      href={resolved}
      prefetch={intencao ? true : null}
      onMouseEnter={(e) => {
        setIntencao(true);
        onMouseEnter?.(e);
      }}
      onTouchStart={(e) => {
        setIntencao(true);
        onTouchStart?.(e);
      }}
      onFocus={(e) => {
        setIntencao(true);
        onFocus?.(e);
      }}
      {...props}
    />
  );
}
