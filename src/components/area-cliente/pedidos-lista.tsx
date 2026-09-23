"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import Link from "@/i18n/locale-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import { StatusPill } from "@/components/area-cliente/status-pill";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatarData, pedidoStatus, referenciaPedido } from "@/lib/area-cliente/format";
import type { PedidoResumo } from "@/lib/area-cliente/types";

const TOM = (status: string) =>
  status === "informacao_necessaria" ? "warning" : status === "concluido" ? "neutral" : "accent";

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
    <div className="flex flex-col gap-lg">
      <div className="flex flex-col gap-md lg:flex-row lg:items-center">
        <div className="flex-1">
          <Input
            type="search"
            aria-label={f.searchLabel}
            placeholder={f.searchPlaceholder}
            value={pesquisa}
            icon={<Search size={20} strokeWidth={2} />}
            onChange={(e) => setPesquisa(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:w-[440px]">
          <Select id="filtro-tipo" name="tipo" value={tipo} onChange={setTipo} options={tipos} placeholder={f.typeLabel} />
          <Select id="filtro-estado" name="estado" value={estado} onChange={setEstado} options={estados} placeholder={f.statusLabel} />
        </div>
      </div>

      <div className="flex items-center justify-between gap-md">
        <p aria-live="polite" className="font-body text-caption text-text-tertiary">
          {filtrados.length === 1 ? f.resultOne : f.resultCount.replace("{count}", String(filtrados.length))}
        </p>
        {ativos ? (
          <Button type="button" variant="tertiary" size="compact" onClick={limpar}>
            <X size={16} strokeWidth={2} aria-hidden />
            {f.clear}
          </Button>
        ) : null}
      </div>

      {filtrados.length === 0 ? (
        <div className="flex flex-col gap-xs rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface p-xl text-center">
          <p className="font-body text-body-lg font-semibold text-text-primary">{f.noResults}</p>
          <p className="font-body text-body text-text-secondary">{f.noResultsHint}</p>
        </div>
      ) : (
        <ul className="flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border-subtle">
          {filtrados.map((pedido, i) => (
            <li key={pedido.id} className={i > 0 ? "border-t border-border-subtle" : undefined}>
              <Link
                href={`/area-cliente/pedidos/${pedido.id}`}
                className="flex flex-col gap-sm bg-bg-surface p-lg transition-colors hover:bg-bg-surface-hover sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-col gap-2xs">
                  <p className="font-body text-caption font-medium text-text-tertiary">
                    {referenciaPedido(pedido.id)}
                  </p>
                  <p className="font-body text-body-lg font-semibold text-text-primary">{pedido.title}</p>
                  <p className="font-body text-caption text-text-tertiary">
                    {t.tipoPedido[pedido.type]}
                    {pedido.project ? ` · ${pedido.project.title}` : ""}
                    {" · "}
                    {t.detalhe.submittedOn} {formatarData(lang, pedido.created_at)}
                  </p>
                </div>
                <StatusPill
                  label={pedidoStatus(t, pedido.status, pedido.status_label).label}
                  tone={TOM(pedido.status)}
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
