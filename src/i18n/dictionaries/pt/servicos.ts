// Namespace "servicos" — português (língua de origem; define o tipo de en/pl).
export type PaymentId =
  | "mbway"
  | "multibanco"
  | "payshop"
  | "cartao"
  | "carteiras"
  | "klarna"
  | "paypal"
  | "transferencia";

// Nem todos os meios existem em todos os idiomas (MB WAY, Multibanco e Payshop só em pt):
// cada idioma traz só os seus; `lib/payments.ts` decide a ordem e o destaque.
export type PaymentMethodCopy = Partial<Record<PaymentId, { name: string; why: string }>>;

export const servicos = {
  meta: {
    title: "Serviços",
    description:
      "Do primeiro site à inteligência artificial aplicada. Sete produtos, do mais simples ao mais avançado: site, loja online, marcações, ferramentas à medida, automação e IA.",
  },
  inicial: {
    titulo: "Para quem está a começar",
  },
  avancado: {
    titulo: "Para quem já quer ir mais longe",
    consultoriaTitulo: "Consultores e outsourcing",
    consultoriaResumo: "Profissionais de tecnologia que integram a sua equipa, por contrato ou à hora.",
  },
  ficha: {
    breadcrumbAria: "Localização",
    breadcrumbServicos: "Serviços",
    marcarConversa: "Fale connosco",
    oQueEParaQuem: "O que é e para quem",
    oQuePodeIncluir: "O que poderá incluir",
    perguntasFrequentes: "Perguntas frequentes",
    tambemInteressar: "Também pode interessar",
    ctaTitulo: "Vamos falar sobre o que precisa?",
    ctaTexto: "Sem compromisso, para perceber se isto faz sentido para si.",
  },
  ganhaExige: {
    ganha: "O que ganha",
    exigeVoce: "O que isto exige de si",
    exigeVoces: "O que isto exige de vocês",
  },
  comoFunciona: {
    titulo: "Como funciona",
  },
  tabela: {
    recomendacao: "A nossa recomendação",
  },
  pagamentos: {
    titulo: "Como os seus clientes podem pagar",
    intro:
      "Ligamos os meios de pagamento que fazem sentido para o seu público. Em Portugal, quase toda a gente espera encontrar estes dois primeiros.",
    metodos: ({
      mbway: {
        name: "MB WAY",
        why: "É o que a maioria das pessoas usa para pagar no telemóvel. Sem ele, perde vendas.",
      },
      multibanco: {
        name: "Multibanco (referência)",
        why: "Para quem não gosta de dar o cartão na internet. Gera uma referência e paga no homebanking ou na caixa.",
      },
      cartao: {
        name: "Cartão",
        why: "Visa e Mastercard, incluindo cartões estrangeiros.",
      },
      carteiras: {
        name: "Apple Pay e Google Pay",
        why: "Pagamento num toque no telemóvel. Reduz as desistências no último passo.",
      },
      klarna: {
        name: "Klarna",
        why: "Deixa o cliente pagar em três vezes ou daqui a trinta dias. Faz sentido em produtos de valor mais alto.",
      },
      paypal: {
        name: "PayPal",
        why: "Habitual para quem já compra fora de Portugal.",
      },
      payshop: {
        name: "Payshop",
        why: "Pagamento em ponto físico, para quem não paga na internet de todo.",
      },
      transferencia: {
        name: "Transferência bancária",
        why: "Faz sentido em encomendas grandes ou vendas a empresas.",
      },
    }) as PaymentMethodCopy,
    notas: [
      "Os pagamentos passam por um serviço seguro de pagamentos. Normalmente usamos o Stripe, que aceita quase tudo com uma só ligação. Quando compensa, usamos um serviço português (Ifthenpay, Easypay, Eupago ou SIBS).",
      "Cada serviço cobra uma pequena comissão por venda. Explicamos as diferenças antes de escolher. O contrato fica em nome do seu negócio.",
    ],
  },
};
