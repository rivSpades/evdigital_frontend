import { NaoEncontrada } from "@/components/erros/nao-encontrada";
import { getDictionary } from "@/i18n/dictionaries";

// 404 dos `notFound()` de pedidos/[id] e projetos/[id] (o backend dá 404 a recursos de
// outra conta): o mesmo ecrã de area-cliente/not-found, mas dentro da casca (conta), com
// a barra de topo da conta que o layout já mostra.

export default async function NaoEncontradaConta() {
  const { common, erros, areaCliente } = await getDictionary();
  const t = erros.naoEncontrada;
  return (
    <NaoEncontrada
      t={t}
      cta={common.cta}
      pathsTitle={t.areaClientePathsTitle}
      paths={[
        {
          href: "/area-cliente/projetos",
          name: areaCliente.projetos.heading,
          description: t.projetosDescription,
        },
        { href: "/area-cliente/pedidos", name: areaCliente.pedidos.heading },
      ]}
      note={t.areaClienteNote}
    />
  );
}
