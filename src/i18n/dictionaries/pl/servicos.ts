import type { servicos as Source } from "../pt/servicos";

// Namespace "servicos" — pl. Tem de cumprir a forma do português.
export const servicos: typeof Source = {
  meta: {
    title: "Usługi",
    description:
      "Od pierwszej strony internetowej po zastosowanie sztucznej inteligencji. Siedem produktów, od najprostszego do najbardziej zaawansowanego: strona internetowa, sklep online, rezerwacje, narzędzia na miarę, automatyzacja i AI.",
  },
  inicial: {
    titulo: "Dla tych, którzy dopiero zaczynają",
  },
  avancado: {
    titulo: "Dla tych, którzy chcą pójść dalej",
  },
  ficha: {
    breadcrumbAria: "Ścieżka nawigacji",
    breadcrumbServicos: "Usługi",
    marcarConversa: "Skontaktuj się",
    pedirProposta: "Poproś o ofertę",
    jaCliente: "Są już Państwo naszym klientem? Zlecenie w panelu klienta",
    oQueEParaQuem: "Czym jest i dla kogo",
    oQuePodeIncluir: "Co może obejmować",
    perguntasFrequentes: "Najczęściej zadawane pytania",
    tambemInteressar: "Może Państwa również zainteresować",
    ctaTitulo: "Porozmawiajmy o tym, czego Państwo potrzebują?",
    ctaTexto: "Trzydzieści minut, bez zobowiązań, aby sprawdzić, czy to ma dla Państwa sens.",
  },
  ganhaExige: {
    ganha: "Co Państwo zyskują",
    exigeVoce: "Czego to wymaga od Państwa",
    exigeVoces: "Czego to od Państwa wymaga",
  },
  comoFunciona: {
    titulo: "Jak to działa",
    passos: [
      { titulo: "Rozmawiamy.", descricao: "Jedno spotkanie, bez zobowiązań, aby zrozumieć Państwa firmę." },
      { titulo: "Proponujemy.", descricao: "Co warto zrobić, w jakiej kolejności i ile to kosztuje." },
      {
        titulo: "Budujemy.",
        descricao: "Postępy prac można śledzić w panelu klienta i podczas spotkań.",
      },
      {
        titulo: "Zostajemy.",
        descricao:
          "Po wdrożeniu wsparcie jest dostępne, gdy tylko będzie potrzebne: nowe zlecenia, zgłoszenia, doradztwo i inne.",
      },
    ],
  },
  tabela: {
    recomendacao: "Nasza rekomendacja",
  },
  pagamentos: {
    titulo: "Jak Państwa klienci mogą płacić",
    intro:
      "Podłączamy metody płatności, które mają sens dla Państwa odbiorców. Karta i portfele mobilne obsługują większość klientów.",
    metodos: {
      cartao: {
        name: "Karta",
        why: "Visa i Mastercard, w tym karty zagraniczne.",
      },
      carteiras: {
        name: "Apple Pay i Google Pay",
        why: "Płatność jednym dotknięciem w telefonie. Zmniejsza liczbę rezygnacji na ostatnim kroku.",
      },
      klarna: {
        name: "Klarna",
        why: "Pozwala klientowi zapłacić w trzech ratach lub za trzydzieści dni. Ma sens przy produktach o wyższej wartości.",
      },
      paypal: {
        name: "PayPal",
        why: "Dobrze znany osobom, które już robią zakupy online w innych krajach.",
      },
      transferencia: {
        name: "Przelew bankowy",
        why: "Ma sens przy dużych zamówieniach lub sprzedaży dla firm.",
      },
    },
    notas: [
      "Płatności przechodzą przez bezpieczny serwis płatniczy. Zwykle korzystamy ze Stripe, który obsługuje niemal wszystko jednym połączeniem. Alternatywy wyjaśniamy przed dokonaniem wyboru.",
      "Każdy serwis pobiera niewielką prowizję od sprzedaży. Wyjaśniamy różnice przed dokonaniem wyboru. Umowa jest zawierana na Państwa firmę.",
    ],
  },
};
