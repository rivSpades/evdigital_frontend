import type { areaCliente as Source } from "../pt/areaCliente";

// Namespace "areaCliente" — pl. Tem de cumprir a forma do português.
export const areaCliente: typeof Source = {
  meta: {
    entrarTitle: "Strefa Klienta",
    entrarDescription:
      "Zaloguj się lub załóż konto, aby śledzić swoje projekty i składać zgłoszenia.",
    projetosTitle: "Państwa projekty",
    pedidosTitle: "Państwa zgłoszenia",
    novoPedidoTitle: "Nowe zgłoszenie",
    detalheTitle: "Szczegóły zgłoszenia",
    confirmarTitle: "Potwierdzenie adresu e-mail",
  },
  topbar: {
    area: "Strefa Klienta",
    projetos: "Projekty",
    pedidos: "Zgłoszenia",
  },
  logout: "Wyloguj się",
  breadcrumbAria: "Ścieżka nawigacji",
  statusPedido: {
    submetido: { label: "Przyjęte", description: "Dotarło do nas. Przyjrzymy się temu." },
    em_analise: {
      label: "W analizie",
      description: "Sprawdzamy, czego to dotyczy i ile będzie kosztować.",
    },
    informacao_necessaria: {
      label: "Czekamy na Państwa",
      description: "Potrzebujemy Państwa odpowiedzi, aby kontynuować.",
    },
    proposta_enviada: {
      label: "Oferta wysłana",
      description: "Wysłaliśmy propozycję: co zrobimy, w jakiej kolejności i za ile.",
    },
    aceite: { label: "Zaakceptowane", description: "Zatwierdzone. Trafia do kolejki prac." },
    recusado: { label: "Nie będzie realizowane", description: "Zawsze wyjaśniamy dlaczego." },
    em_curso: { label: "W realizacji", description: "Trwają prace." },
    concluido: {
      label: "Zakończone",
      description: "Dostarczone. Jeśli coś się pojawi, proszę otworzyć nowe zgłoszenie.",
    },
  },
  statusProjeto: {
    em_curso: "W realizacji",
    entregue: "Dostarczony",
    em_pausa: "Wstrzymany",
  },
  servicos: {
    "site-profissional": "Profesjonalna strona internetowa",
    "loja-online": "Sklep internetowy",
    "marcacoes-e-reservas": "Rezerwacje i umawianie wizyt",
    "negocio-no-google": "Państwa firma w Google",
    "ferramentas-a-medida": "Narzędzia na miarę",
    "automacao-e-integracoes": "Automatyzacja i integracje",
    "assistentes-ia": "Asystenci i agenci AI",
    "auditoria-mvp-ia": "Kończymy to, co zaczęto z pomocą AI",
    "microsoft-365-azure": "Zarządzanie Microsoft 365 i Azure",
    nao_sei: "Jeszcze nie wiem",
  },
  tipoPedido: {
    ticket: "Problem",
    feature: "Nowa funkcja",
    novo_projeto: "Nowy projekt",
  },
  entrar: {
    heading: "Strefa Klienta",
    intro:
      "Tutaj śledzą Państwo swoje projekty i składają nowe zgłoszenia bez umawiania spotkania.",
    backToSite: "Wróć na stronę",
    tabEntrar: "Logowanie",
    tabCriarConta: "Załóż konto",
    googleError:
      "Nie udało się zalogować przez Google. Proszę spróbować ponownie lub użyć adresu e-mail.",
    google: "Kontynuuj z Google",
    or: "lub",
    email: "E-mail",
    emailPlaceholder: "imie@firma.pl",
    password: "Hasło",
    submit: "Zaloguj się",
    submitting: "Logowanie...",
    errUnconfirmed:
      "Adres e-mail nie został jeszcze potwierdzony. Właśnie wysłaliśmy link ponownie.",
    errCredentials: "Adres e-mail lub hasło są nieprawidłowe.",
    errLogin: "Nie udało się teraz zalogować. Proszę spróbować ponownie.",
    createdTitle: "Należy jeszcze potwierdzić adres e-mail.",
    createdBody:
      "Wysłaliśmy link na adres {email}. Proszę otworzyć wiadomość i kliknąć w link, aby zacząć korzystać ze Strefy Klienta.",
    name: "Imię i nazwisko",
    namePlaceholder: "Państwa imię i nazwisko",
    phone: "Telefon",
    phonePlaceholder: "512 345 678",
    passwordHint: "Proszę użyć co najmniej ośmiu znaków. Nie są potrzebne żadne dziwne symbole.",
    register: "Załóż konto",
    registering: "Zakładanie konta...",
    errRegister: "Nie udało się teraz założyć konta. Proszę spróbować ponownie.",
    registerNote: "Po założeniu konta wyślemy wiadomość e-mail w celu potwierdzenia adresu.",
    contactPrompt: "Nie są Państwo jeszcze naszym klientem i chcą porozmawiać?",
    contactCta: "Umów bezpłatną rozmowę",
  },
  confirmar: {
    okTitle: "Adres e-mail potwierdzony",
    okBody: "Mogą Państwo się teraz zalogować i zacząć korzystać ze Strefy Klienta.",
    okCta: "Zaloguj się",
    failTitle: "Ten link jest już nieważny",
    failBody:
      "Proszę spróbować zalogować się ponownie. Jeśli konto nadal nie jest potwierdzone, wyślemy kolejny link.",
    failCta: "Wróć do Strefy Klienta",
  },
  projetos: {
    heading: "Państwa projekty",
    intro: "To, co jest w toku, i to, co już dostarczono.",
    newRequest: "Złóż zgłoszenie",
    emptyTitle: "Nie ma tu jeszcze Państwa projektów.",
    emptyBody:
      "Jeśli już rozmawialiśmy, projekt pojawi się, gdy tylko ruszą prace. Jeśli chcą Państwo o coś poprosić, proszę zacząć tutaj.",
    requestsHeading: "Państwa zgłoszenia",
    requestsEmpty: "Nie ma jeszcze otwartych zgłoszeń.",
    requestsAll: "Zobacz wszystkie zgłoszenia",
  },
  pedidos: {
    heading: "Państwa zgłoszenia",
    newRequest: "Złóż zgłoszenie",
    empty: "Nie złożono jeszcze żadnego zgłoszenia.",
  },
  novoPedido: {
    heading: "Czego potrzebują Państwo?",
    intro:
      "Proszę opisać to własnymi słowami. Nie trzeba znać terminów technicznych, a jeśli wolą Państwo porozmawiać, to też jest możliwe.",
    breadcrumbCurrent: "Nowe zgłoszenie",
    form: {
      typeQuestion: "Jakiego rodzaju jest to zgłoszenie?",
      tipos: {
        ticket: {
          titulo: "Mam problem",
          descricao:
            "Coś przestało działać lub wyświetla błąd w pracy, którą już dostarczyliśmy.",
        },
        feature: {
          titulo: "Chcę coś dodać",
          descricao: "To, co jest, działa, ale brakuje funkcji lub zmiany.",
        },
        novo_projeto: {
          titulo: "Chcę nowy projekt",
          descricao: "Coś nowego, czego jeszcze nie ma.",
        },
      },
      urgencias: {
        quando_possivel: "Kiedy będzie to możliwe",
        esta_semana: "W tym tygodniu",
        urgente: "Blokuje działalność firmy",
      },
      errType: "Proszę wybrać rodzaj zgłoszenia.",
      projectLabel: "Którego projektu dotyczy?",
      projectPlaceholder: "Proszę wybrać projekt",
      titleLabel: "Tytuł zgłoszenia",
      titlePlaceholder: "Formularz kontaktowy nie wysyła wiadomości e-mail",
      descriptionLabel: "Proszę opisać, czego potrzebują Państwo",
      descriptionHint:
        "Im konkretniej, tym szybciej odpowiemy. Jeśli trudno to wyjaśnić, proszę napisać mimo to. Resztę dopytamy.",
      descriptionPlaceholder: "Proszę pisać tutaj.",
      urgencyLabel: "Pilność",
      urgencyHint: "Pilność pomaga nam ustalić kolejność. Nie jest zobowiązaniem co do terminu.",
      urgencyPlaceholder: "Proszę wybrać",
      attachments:
        "Załączniki pojawią się w następnym etapie. Jeśli to pomoże, proszę opisać, co byłoby widać na zrzucie ekranu.",
      errGeneral: "Nie udało się teraz wysłać zgłoszenia. Proszę spróbować ponownie.",
      submit: "Wyślij zgłoszenie",
      submitting: "Wysyłanie...",
      talkInstead: "Wolą Państwo porozmawiać niż tłumaczyć? Umów rozmowę",
    },
  },
  detalhe: {
    submittedOn: "zgłoszono",
    progressHeading: "Na jakim etapie jest zgłoszenie",
    conversationHeading: "Rozmowa",
    noMessages:
      "Nie ma jeszcze wiadomości. Jeśli chcą Państwo coś dodać do zgłoszenia, proszę napisać tutaj.",
    teamName: "EvDigital",
    sheetHeading: "Karta zgłoszenia",
    sheetType: "Rodzaj",
    sheetProject: "Projekt",
    sheetNoProject: "Brak powiązanego projektu",
    sheetSubmitted: "Zgłoszono",
    sheetUpdated: "Ostatnia aktualizacja",
    sheetReason: "Powód",
    talkHeading: "Łatwiej porozmawiać?",
    talkBody:
      "Jeśli wolą Państwo wyjaśnić to własnymi słowami, proszę umówić rozmowę na temat tego zgłoszenia.",
    talkCta: "Umów rozmowę",
    comment: {
      ariaLabel: "Proszę napisać odpowiedź",
      placeholder: "Proszę napisać odpowiedź.",
      errEmpty: "Proszę napisać wiadomość.",
      errSend: "Nie udało się teraz wysłać wiadomości. Proszę spróbować ponownie.",
      submit: "Odpowiedz",
      submitting: "Wysyłanie...",
    },
  },
};
