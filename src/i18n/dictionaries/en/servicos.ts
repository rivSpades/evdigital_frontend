import type { servicos as Source } from "../pt/servicos";

// Namespace "servicos" — en. Tem de cumprir a forma do português.
export const servicos: typeof Source = {
  meta: {
    title: "Services",
    description:
      "From your first website to applied artificial intelligence. Seven products, from the simplest to the most advanced: website, online store, bookings, custom tools, automation and AI.",
  },
  inicial: {
    titulo: "For those just getting started",
    subtitulo: "We explain everything without technical jargon.",
    verComoFunciona: "See how it works",
  },
  avancado: {
    titulo: "For those ready to go further",
    subtitulo: "You already have a digital presence. What's missing is getting operations off manual work.",
  },
  ficha: {
    breadcrumbAria: "Breadcrumb",
    breadcrumbServicos: "Services",
    marcarConversa: "Book a free conversation",
    pedirProposta: "Request a proposal",
    jaCliente: "Already a client? Submit a request in your area",
    oQueEParaQuem: "What it is and who it is for",
    oQuePodeIncluir: "What it may include",
    perguntasFrequentes: "Frequently asked questions",
    tambemInteressar: "You may also be interested in",
    ctaTitulo: "Shall we talk about what you need?",
    ctaTexto: "Thirty minutes, no commitment, to see whether this makes sense for you.",
  },
  ganhaExige: {
    ganha: "What you gain",
    exigeVoce: "What this requires from you",
    exigeVoces: "What this requires from you",
  },
  comoFunciona: {
    titulo: "How it works",
    passos: [
      { titulo: "We talk.", descricao: "One meeting, no commitment, to understand your business." },
      { titulo: "We propose.", descricao: "What makes sense to do, in what order, and how much it costs." },
      {
        titulo: "We build.",
        descricao: "You follow the development in the client area and in meetings.",
      },
      {
        titulo: "We stay.",
        descricao:
          "Once delivered, you keep getting support whenever you need it: new requests, tickets, consulting, and more.",
      },
    ],
  },
  tabela: {
    recomendacao: "Our recommendation",
  },
  pagamentos: {
    titulo: "How your customers can pay",
    intro:
      "We connect the payment methods that make sense for your audience. Card and mobile wallets cover most customers.",
    metodos: {
      cartao: {
        name: "Card",
        why: "Visa and Mastercard, including foreign cards.",
      },
      carteiras: {
        name: "Apple Pay and Google Pay",
        why: "One-tap payment on the phone. It reduces drop-offs at the last step.",
      },
      klarna: {
        name: "Klarna",
        why: "Lets the customer pay in three instalments or thirty days later. Makes sense for higher-value products.",
      },
      paypal: {
        name: "PayPal",
        why: "Familiar to people who already buy online from other countries.",
      },
      transferencia: {
        name: "Bank transfer",
        why: "Makes sense for large orders or sales to businesses.",
      },
    },
    notas: [
      "Payments go through a secure payment service. We usually use Stripe, which accepts almost everything through a single integration. We explain the alternatives before you choose.",
      "Each service charges a small fee per sale. We explain the differences before you choose. The contract is in your business's name.",
    ],
  },
};
