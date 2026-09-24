import { Facto, Factos } from "@/components/ui/facto";

// "Ficha do pedido" do ecrã Detalhe do pedido (design-system.pen), também usada na ficha
// do projeto (antes eram duas cópias): título em $font-size-label $font-weight-label
// $letter-spacing-label com padding-bottom $space-sm e, por baixo, ds/display/facto em
// registo (régua superior do contentor). Em lg é uma coluna de 278 ao lado do conteúdo;
// abaixo de lg vem depois do conteúdo, com os factos em linha (termo de 118).

export type FactoFicha = { termo: string; valor: string; aviso?: boolean; texto?: boolean };

export function FichaLateral({
  titulo,
  factos,
}: {
  titulo: string;
  factos: FactoFicha[];
}) {
  return (
    <aside aria-labelledby="ficha-titulo" className="flex flex-col lg:w-[278px] lg:shrink-0">
      <h2
        id="ficha-titulo"
        className="pb-sm font-body text-label font-medium tracking-[var(--letter-spacing-label)] text-text-primary"
      >
        {titulo}
      </h2>
      <Factos>
        {factos.map((f) => (
          <Facto
            key={f.termo}
            termo={f.termo}
            valor={f.valor}
            valorTexto={f.texto}
            aviso={f.aviso}
            emLinha
          />
        ))}
      </Factos>
    </aside>
  );
}
