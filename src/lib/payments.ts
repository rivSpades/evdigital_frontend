// Meios de pagamento para a ficha "Loja online" — PRD-servicos.md §7.2. Ficheiro
// próprio (em vez de repetir no frontmatter do serviço) porque também vai servir o
// blog e propostas comerciais no futuro. O PRD original previa `content/data/
// payments.yaml`; sem parser de YAML no projecto, optou-se por um módulo TS tipado com
// o mesmo conteúdo — evita adicionar uma dependência só para isto.
//
// Factos verificados a 2026-09-05 (ver PRD-servicos.md §7.2 para as fontes):
// Stripe suporta MB WAY e Multibanco nativamente, e Klarna está disponível em Portugal.
// Fora de Portugal mostram-se só os meios internacionais.

import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { PaymentId } from "@/i18n/dictionaries/pt/servicos";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  CalendarClock,
  CreditCard,
  Globe,
  Landmark,
  Smartphone,
  Store,
  Wallet,
} from "lucide-react";

export type PaymentMethod = {
  name: string;
  icon: LucideIcon;
  why: string;
  featured: boolean;
};

type PaymentsDict = Dictionary["servicos"]["pagamentos"];

// Meios por idioma, por ordem de apresentação. MB WAY, Multibanco e Payshop são
// portugueses: só aparecem em pt. Nos restantes idiomas ficam os meios internacionais.
const ICONS: Record<PaymentId, LucideIcon> = {
  mbway: Smartphone,
  multibanco: Landmark,
  cartao: CreditCard,
  carteiras: Wallet,
  klarna: CalendarClock,
  paypal: Globe,
  payshop: Store,
  transferencia: Building2,
};

const PAYMENT_IDS: Record<Locale, { id: PaymentId; featured: boolean }[]> = {
  pt: [
    { id: "mbway", featured: true },
    { id: "multibanco", featured: true },
    { id: "cartao", featured: false },
    { id: "carteiras", featured: false },
    { id: "klarna", featured: false },
    { id: "paypal", featured: false },
    { id: "payshop", featured: false },
    { id: "transferencia", featured: false },
  ],
  en: [
    { id: "cartao", featured: true },
    { id: "carteiras", featured: true },
    { id: "paypal", featured: false },
    { id: "klarna", featured: false },
    { id: "transferencia", featured: false },
  ],
  pl: [
    { id: "cartao", featured: true },
    { id: "carteiras", featured: true },
    { id: "paypal", featured: false },
    { id: "klarna", featured: false },
    { id: "transferencia", featured: false },
  ],
};

export function getPaymentMethods(lang: Locale, t: PaymentsDict): PaymentMethod[] {
  return PAYMENT_IDS[lang].flatMap(({ id, featured }) => {
    const copy = t.metodos[id];
    return copy ? [{ name: copy.name, why: copy.why, icon: ICONS[id], featured }] : [];
  });
}
