"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PedidoLinha } from "@/components/area-cliente/pedido-linha";
import { Field, Input } from "@/components/ui/input";
import { LigacaoBotao } from "@/components/ui/ligacao";
import { Registo } from "@/components/ui/registo-linha";
import { Select, type SelectOption } from "@/components/ui/select";
import { VazioTracejado } from "@/components/ui/vazio-tracejado";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { referenciaPedido } from "@/lib/area-cliente/format";
import type { PedidoResumo } from "@/lib/area-cliente/types";

// Lista completa de pedidos com pesquisa e filtros (tipo, estado), filtrada no cliente.
// Direcção "A vez": filtros por cima (pesquisa a toda a largura e os dois seletores com
// rótulo visível, em linha a partir de lg), a contagem anunciada (aria-live) com "Limpar
// filtros" como ligação de texto, e os pedidos em registo (ds/display/registo-linha
// "pedido", o tipo e o projeto a seguir ao nome). Sem resultados: ds/feedback/vazio-tracejado.

const TODOS = "todos";

export function PedidosLista({
  pedidos,
  lang,
  t,
}: {
  pedidos: PedidoResumo[];
  lang: Locale;
  t: Dictionary["areaCliente"];
}) {
  const [pesquisa, setPesquisa] = useState("");
  const [tipo, setTipo] = useState(TODOS);
  const [estado, setEstado] = useState(TODOS);
  const f = t.pedidos;

  const tipos: SelectOption[] = [
    { value: TODOS, label: f.allTypes },
    ...Object.entries(t.tipoPedido).map(([value, label]) => ({ value, label })),
  ];
  const estados: SelectOption[] = [
    { value: TODOS, label: f.allStatuses },
    ...Object.entries(t.statusPedido).map(([value, s]) => ({ value, label: s.label })),
  ];

  const filtrados = useMemo(() => {
    const termo = pesquisa.trim().toLowerCase();
    return pedidos.filter((p) => {
      if (tipo !== TODOS && p.type !== tipo) return false;
      if (estado !== TODOS && p.status !== estado) return false;
      if (!termo) return true;
      return `${p.title} ${p.project?.title ?? ""} ${referenciaPedido(p.id)}`.toLowerCase().includes(termo);
    });
  }, [pedidos, pesquisa, tipo, estado]);

  const ativos = pesquisa.trim() !== "" || tipo !== TODOS || estado !== TODOS;
  function limpar() {
    setPesquisa("");
    setTipo(TODOS);
    setEstado(TODOS);
  }

  return (
    <section className="flex flex-col gap-lg pt-md pb-3xl">
      <div className="flex flex-col gap-md lg:flex-row lg:items-end">
        <div className="lg:flex-1">
          <Field htmlFor="filtro-pesquisa" label={f.searchLabel}>
            <Input
              id="filtro-pesquisa"
              type="search"
              placeholder={f.searchPlaceholder}
              value={pesquisa}
              icon={<Search size={20} strokeWidth={2} />}
              onChange={(e) => setPesquisa(e.target.value)}
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:w-[440px]">
          <Field htmlFor="filtro-tipo" label={f.typeLabel}>
            <Select id="filtro-tipo" name="tipo" value={tipo} onChange={setTipo} options={tipos} placeholder={f.allTypes} />
          </Field>
          <Field htmlFor="filtro-estado" label={f.statusLabel}>
            <Select id="filtro-estado" name="estado" value={estado} onChange={setEstado} options={estados} placeholder={f.allStatuses} />
          </Field>
        </div>
      </div>

      <div className="flex min-h-11 flex-wrap items-center justify-between gap-x-md">
        <p aria-live="polite" className="font-mono text-caption text-text-tertiary">
          {filtrados.length === 1 ? f.resultOne : f.resultCount.replace("{count}", String(filtrados.length))}
        </p>
        {ativos ? (
          <LigacaoBotao variant="em-linha" onClick={limpar}>
            {f.clear}
          </LigacaoBotao>
        ) : null}
      </div>

      {filtrados.length === 0 ? (
        <VazioTracejado>{`${f.noResults} ${f.noResultsHint}`}</VazioTracejado>
      ) : (
        <Registo>
          {filtrados.map((pedido) => (
            <PedidoLinha
              key={pedido.id}
              pedido={pedido}
              lang={lang}
              t={t}
              tipo={
                pedido.project
                  ? `${t.tipoPedido[pedido.type]} · ${pedido.project.title}`
                  : t.tipoPedido[pedido.type]
              }
            />
          ))}
        </Registo>
      )}
    </section>
  );
}
