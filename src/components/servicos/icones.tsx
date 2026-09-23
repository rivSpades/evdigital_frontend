import { createElement } from "react";
import {
  AtSign,
  CalendarCheck,
  Cloud,
  Layers,
  LayoutDashboard,
  MapPin,
  MessageSquareMore,
  SearchCode,
  Store,
  Globe,
  Workflow,
  type LucideIcon,
} from "lucide-react";

// Glifos dos frames "Página · Serviços" (Czc80 / K1MKs) e das fichas de produto do
// design-system.pen, indexados pelo slug do ficheiro em content/services/. A biblioteca
// de ícones é lucide com traço 2px ($icon-stroke), fixada pelo design system.
// Catálogo de 7 produtos — PRD-servicos.md §2.

const ICONES: Record<string, LucideIcon> = {
  "site-profissional": Globe,
  "loja-online": Store,
  "negocio-no-google": MapPin,
  "marcacoes-e-reservas": CalendarCheck,
  "dominio-e-email": AtSign,
  "ferramentas-a-medida": LayoutDashboard,
  "automacao-e-integracoes": Workflow,
  "assistentes-ia": MessageSquareMore,
  "auditoria-mvp-ia": SearchCode,
  "microsoft-365-azure": Cloud,
};

// createElement em vez de `const Icone = ...; <Icone />`: evita declarar um componente
// durante o render (regra react-hooks/static-components).
export function IconeServico({
  slug,
  size,
  className,
}: {
  slug: string;
  size: number;
  className?: string;
}) {
  return createElement(ICONES[slug] ?? Layers, {
    size,
    strokeWidth: 2,
    "aria-hidden": true,
    className,
  });
}
