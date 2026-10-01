import { ButtonLink } from "@/components/ui/button";

// Barra de acção colada ao fundo do ecrã, só abaixo de md (pedido do dono, 2026-10-01; mesmo
// padrão de /consultants/[slug]). Vai como FILHA DIRECTA do contentor da página, depois do
// último bloco: o `sticky` só prende dentro do pai, por isso, dentro do bloco do fecho (que
// só chega ao ecrã no fim), a barra não aparecia ao longo da página. Assim fica colada desde o
// topo e pousa no fim, depois do texto do fecho. Com o aviso de cookies aberto sobe para cima
// dele (`--cookie-banner-h`, publicada por ConsentAnalytics). `data-barra-fixa` faz o «Voltar
// ao topo» subir acima dela. Quem a usa passa `semAcaoMobile` ao FechoPagina, para o botão não
// aparecer duas vezes; a partir de md a acção volta ao fecho.

export function BarraAcaoFixa({ href, label }: { href: string; label: string }) {
  return (
    <div
      data-barra-fixa
      className="sticky bottom-[var(--cookie-banner-h,0px)] z-10 -mx-lg border-t border-border-default bg-bg-base px-lg pt-md pb-[calc(var(--spacing-md)+env(safe-area-inset-bottom))] md:hidden"
    >
      <ButtonLink
        href={href}
        size="action"
        className="w-full tracking-[var(--letter-spacing-label)]"
      >
        {label}
      </ButtonLink>
    </div>
  );
}
