import { getDictionary } from "@/i18n/dictionaries";
import { Porta } from "@/components/ui/porta";
import { Reveal } from "@/components/ui/reveal";

// Frames "v2 · A vez" / Ecrã · Início: "Secção · portas" (B2eP4 desktop, ybn4n mobile).
// Padding-bottom $space-4xl. Título visível $font-size-title ($font-size-title-sm em
// mobile) $font-weight-heading; a $space-lg dele, as duas ds/display/porta:
// - lg: lado a lado, larguras assimétricas 653 / 467 (proporção do .pen dentro da
//   coluna), gap $space-3xl, réguas superior e inferior hairline $border-default;
// - abaixo: empilhadas, régua superior no contentor e divisor inferior em cada porta.
//
// Movimento (storyboard, quadro 02): título primeiro, depois as portas pela ordem de
// leitura. Cada porta é um grupo próprio: em mobile dispara quando ela própria chega aos
// 20%; em lg as duas estão na mesma linha e entram com 70 ms entre elas.
// O "Quem" de cada porta é a frase das fichas de serviço (servicos.inicial/avancado).

export async function DuasPortas() {
  const { home, servicos } = await getDictionary();
  const t = home.doors;
  const portas = [
    {
      quem: servicos.inicial.titulo,
      frase: t.onlineTitle,
      descricao: t.onlineBody,
      href: "/servicos#comecar",
      ligacao: t.onlineCta,
      ordem: "[--reveal-i:1]",
    },
    {
      quem: servicos.avancado.titulo,
      frase: t.advancedTitle,
      descricao: t.advancedBody,
      href: "/servicos#avancadas",
      ligacao: t.advancedCta,
      ordem: "[--reveal-i:0] lg:[--reveal-i:2]",
    },
  ];
  return (
    <Reveal as="section" aria-labelledby="portas-titulo" className="pb-4xl">
      <div className="flex flex-col gap-lg">
        <h2
          id="portas-titulo"
          data-reveal=""
          className="font-heading text-title-sm font-semibold tracking-[var(--letter-spacing-title)] text-text-primary lg:text-title"
        >
          {t.title}
        </h2>

        <ul className="flex flex-col border-t border-border-default lg:grid lg:grid-cols-[653fr_467fr] lg:gap-3xl lg:border-b">
          {portas.map((porta) => (
            <Reveal
              as="li"
              key={porta.href}
              className="border-b border-border-default lg:border-b-0"
            >
              <Porta
                data-reveal=""
                className={porta.ordem}
                quem={porta.quem}
                frase={porta.frase}
                descricao={porta.descricao}
                href={porta.href}
                ligacao={porta.ligacao}
              />
            </Reveal>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
