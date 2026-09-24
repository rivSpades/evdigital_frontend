import { BackLink } from "@/components/area-cliente/back-link";
import { PaginaFormulario } from "@/components/area-cliente/cabecalho-pagina";
import { EsqueletoBloco, EsqueletoLinha } from "@/components/ui/esqueleto";
import { cn } from "@/lib/cn";

// Esqueletos das páginas autenticadas da Área de Cliente (loading.tsx), com
// ds/feedback/esqueleto-bloco e ds/feedback/esqueleto-linha do design-system.pen. Só o
// <main>: a barra de topo vive no layout (conta) e fica sempre visível. Como nos frames
// "a carregar" do .pen ("Os seus projetos · a carregar"), o que não depende de dados (o
// topo da página, os títulos de secção, o Voltar) aparece já com o texto real; só os
// registos e os campos são esqueleto. Mesmas margens e larguras das páginas, para não
// haver saltos quando o conteúdo chega. Sem brilho animado; a região fica com aria-busy e
// os blocos são aria-hidden.

/** Registo a carregar: régua superior e `quantas` linhas (título e texto, ou só título). */
export function EsqueletoLinhas({
  quantas,
  simples = false,
  className,
}: {
  quantas: number;
  simples?: boolean;
  className?: string;
}) {
  const larguras = [
    ["w-1/2", "w-5/6"],
    ["w-2/5", "w-3/4"],
    ["w-1/3", "w-2/3"],
  ];
  return (
    <div aria-hidden className={cn("flex w-full flex-col border-t border-border-default", className)}>
      {Array.from({ length: quantas }, (_, i) => (
        <EsqueletoLinha
          key={i}
          titleWidth={larguras[i % 3][0]}
          textWidth={larguras[i % 3][1]}
          single={simples}
        />
      ))}
    </div>
  );
}

function Campos({ quantos }: { quantos: number }) {
  return (
    <>
      {Array.from({ length: quantos }, (_, i) => (
        <div key={i} className="flex flex-col gap-2xs">
          <EsqueletoBloco className="h-4 w-32" />
          <EsqueletoBloco className="h-11 w-full rounded-[var(--input-radius)]" />
        </div>
      ))}
    </>
  );
}

/** Folha de formulário a carregar (ds/layout/folha com campos e a acção). */
export function EsqueletoFolha({ campos = 3, className }: { campos?: number; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex w-full flex-col gap-lg border border-border-subtle bg-bg-surface px-md py-lg md:p-xl",
        className,
      )}
    >
      <Campos quantos={campos} />
      <EsqueletoBloco className="mt-xs h-14 w-full sm:w-44" />
    </div>
  );
}

/** Detalhe (pedido ou projeto) a carregar: Voltar real, título e metadados, e o conteúdo. */
export function EsqueletoDetalhe({ voltarHref, voltar }: { voltarHref: string; voltar: string }) {
  return (
    <main aria-busy="true" className="flex flex-1 flex-col px-lg md:px-xl lg:px-2xl">
      <section className="flex flex-col pt-xl pb-lg">
        <BackLink href={voltarHref} label={voltar} />
        <div aria-hidden className="flex flex-col gap-sm pt-sm">
          <EsqueletoBloco className="h-10 w-full max-w-[620px]" />
          <EsqueletoBloco className="h-5 w-2/3 max-w-[420px]" />
        </div>
      </section>
      <div className="flex flex-col gap-3xl pt-2xl pb-3xl lg:flex-row lg:gap-lg">
        <div className="flex min-w-0 flex-1 flex-col gap-md">
          <EsqueletoBloco className="h-8 w-56" />
          <EsqueletoLinhas quantas={3} />
        </div>
        <div aria-hidden className="flex flex-col gap-sm lg:order-first lg:w-[278px]">
          <EsqueletoBloco className="h-5 w-32" />
          <EsqueletoLinhas quantas={4} simples />
        </div>
      </div>
    </main>
  );
}

/**
 * Definições a carregar, na mesma estrutura da página (`PaginaFormulario`): Voltar, título
 * e introdução já com o texto real, separadores e uma folha com campos em esqueleto.
 */
export function EsqueletoDefinicoes({
  voltar,
  titulo,
  introducao,
}: {
  voltar: string;
  titulo: string;
  introducao: string;
}) {
  return (
    <PaginaFormulario
      busy
      voltarHref="/area-cliente/projetos"
      voltar={voltar}
      titulo={titulo}
      introducao={introducao}
      separadores={<EsqueletoBloco className="h-[54px] w-60 rounded-[var(--radius-pill)]" />}
    >
      <EsqueletoFolha campos={5} />
    </PaginaFormulario>
  );
}
