import Link from "@/i18n/locale-link";
import { BlocoDaVez } from "@/components/ui/bloco-da-vez";
import { ButtonLink } from "@/components/ui/button";
import type { Dictionary } from "@/i18n/dictionaries";

// Frames "Ecrã · 404" (site público YhUOx / LJWAP, Área de Cliente DWhwK / NEW4X) do grupo
// "v2 · A vez" do design-system.pen. Três secções alinhadas à margem da página:
// - perdido: título em $font-size-display ($font-size-display-sm-narrow em mobile, 39 =
//   --text-headline) e texto body-lg $text-secondary com 600 de largura;
// - caminhos: rótulo e uma lista de 704 com réguas hairline $border-default (topo da lista
//   e fundo de cada linha), cada linha com nome em Sora title-sm e descrição $text-tertiary;
//   na Área de Cliente, uma nota em caption por baixo;
// - falar connosco: um ds/layout/bloco-da-vez (facto "Código de erro 404", frase, texto e
//   "Fale connosco" primário).

export type Caminho = { href: string; name: string; description?: string };

export function NaoEncontrada({
  t,
  cta,
  pathsTitle,
  paths,
  note,
}: {
  t: Dictionary["erros"]["naoEncontrada"];
  cta: string;
  pathsTitle: string;
  paths: Caminho[];
  note?: string;
}) {
  return (
    <main className="flex flex-1 flex-col px-lg md:px-xl lg:px-2xl">
      <section className="flex flex-col pt-3xl pb-2xl">
        <h1 className="font-heading text-headline leading-[var(--line-height-display)] font-bold tracking-[var(--letter-spacing-display)] text-text-primary lg:text-display">
          {t.title}
        </h1>
        <p className="max-w-[600px] pt-lg font-body text-body-lg text-text-secondary">{t.body}</p>
      </section>

      <section aria-labelledby="caminhos-titulo" className="flex flex-col pt-md pb-2xl">
        <h2
          id="caminhos-titulo"
          className="pb-md font-body text-label font-medium text-text-primary"
        >
          {pathsTitle}
        </h2>
        <ul className="w-full max-w-[704px] border-t border-border-default">
          {paths.map((caminho) => (
            <li key={caminho.href} className="border-b border-border-default">
              <Link
                href={caminho.href}
                className="group flex min-h-11 flex-col gap-2xs py-lg"
              >
                <span className="font-heading text-title-sm font-semibold tracking-[var(--letter-spacing-title)] text-text-primary transition-colors group-hover:text-text-link">
                  {caminho.name}
                </span>
                {caminho.description ? (
                  <span className="font-body text-body text-text-tertiary">
                    {caminho.description}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
        {note ? (
          <p className="max-w-[544px] pt-md font-body text-caption text-text-tertiary">{note}</p>
        ) : null}
      </section>

      <section className="flex flex-col pt-md pb-3xl">
        <BlocoDaVez fact={t.code} title={t.quote} titleAs="h2" className="max-w-[704px]">
          <p className="font-body text-body text-text-secondary">{t.quoteBody}</p>
          <div className="flex pt-xs">
            <ButtonLink href="/contacto" size="action">
              {cta}
            </ButtonLink>
          </div>
        </BlocoDaVez>
      </section>
    </main>
  );
}
