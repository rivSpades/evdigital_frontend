import type { contacto as Source } from "../pt/contacto";

// Namespace "contacto" — pl. Tem de cumprir a forma do português.
export const contacto: typeof Source = {
  metadata: {
    title: "Kontakt",
    description:
      "Trzydzieści minut, bez zobowiązań i bez kosztów. Jeśli dalsza współpraca nie będzie miała sensu, powiemy to wprost.",
  },
  page: {
    title: "Porozmawiajmy",
    intro:
      "Trzydzieści minut, bez zobowiązań i bez kosztów. Jeśli dalsza współpraca nie będzie miała sensu, powiemy to wprost.",
  },
  steps: {
    describe: "1. Proszę opisać, czego Państwo potrzebują",
    meeting: "2. Czy chcą Państwo umówić rozmowę?",
    summary: "3. Podsumowanie",
  },
  form: {
    needOptions: {
      site: "Wprowadzić moją firmę do internetu",
      melhorar: "Ulepszyć to, co już mam",
      avancado: "Zaawansowane rozwiązanie lub rozwiązanie na miarę",
      nao_sei: "Jeszcze nie wiem",
    },
    validation: {
      nameRequired: "Proszę wpisać imię i nazwisko.",
      emailRequired: "Proszę wpisać adres e-mail.",
      emailInvalid: "Brakuje znaku @. Proszę wpisać w formacie: imie@firma.pl",
      needRequired: "Proszę wybrać opcję.",
      messageRequired: "Proszę opisać, czego Państwo potrzebują.",
    },
    requestingProposal: "Zapytanie o ofertę dla:",
    removeServiceAria: "Usuń wstępnie wybrany produkt",
    nameLabel: "Imię i nazwisko",
    namePlaceholder: "Anna Kowalska",
    emailLabel: "E-mail",
    emailPlaceholder: "imie@firma.pl",
    phoneLabel: "Telefon",
    phonePlaceholder: "912 345 678",
    needLabel: "Czego Państwo potrzebują",
    needPlaceholder: "Proszę wybrać opcję",
    messageLabel: "Wiadomość",
    messageHint: "Wystarczą dwa lub trzy zdania.",
    messagePlaceholder: "Proszę opisać, czego potrzebuje Państwa firma.",
    honeypotLabel: "Nie wypełniać",
  },
  meeting: {
    question: "Czy chcą Państwo umówić rozmowę?",
    hint: "Opcjonalnie. Trzydzieści minut, bez zobowiązań.",
    yes: "Tak, chcę umówić termin",
    no: "Nie, chcę tylko wysłać wiadomość",
    loading: "Szukamy dostępnych terminów...",
    noSlots:
      "Brak dostępnych terminów w najbliższych dniach. Mogą Państwo kontynuować bez umawiania terminu. Skontaktujemy się, aby go ustalić.",
    loadError:
      "Nie udało się wczytać dostępnych terminów. Mogą Państwo kontynuować bez umawiania terminu.",
    chooseDay: "Proszę wybrać dzień",
    chooseTime: "Proszę wybrać godzinę",
    changeDay: "Wybierz inny dzień",
  },
  summary: {
    title: "Proszę potwierdzić dane",
    nameLabel: "Imię i nazwisko",
    emailLabel: "E-mail",
    phoneLabel: "Telefon",
    needLabel: "Czego Państwo potrzebują",
    messageLabel: "Wiadomość",
    meetingLabel: "Rozmowa",
    noMeeting: "Bez umówionej rozmowy",
    notProvided: "Nie podano",
  },
  actions: {
    continue: "Dalej",
    back: "Wstecz",
    finish: "Zakończ",
    sending: "Wysyłanie...",
  },
  result: {
    successTitle: "Wiadomość wysłana.",
    successText:
      "Otrzymaliśmy Państwa zapytanie i wkrótce odpowiemy. Wysłaliśmy również potwierdzenie na Państwa adres e-mail.",
    meetingConfirmedText:
      "Rozmowa została umówiona. Wysłaliśmy potwierdzenie na Państwa adres e-mail.",
    partialTitle: "Wiadomość wysłana.",
    partialText:
      "Nie udało się automatycznie potwierdzić terminu rozmowy. Skontaktujemy się, aby go ustalić.",
    tooManyTitle: "Otrzymaliśmy już od Państwa kilka wiadomości.",
    tooManyText: "Proszę chwilę poczekać przed wysłaniem kolejnej.",
    failedTitle: "Nie udało się wysłać wiadomości.",
    failedText: "Proszę spróbować ponownie za chwilę.",
  },
  api: {
    invalidRequest: "Nieprawidłowe żądanie.",
    unavailable: "Usługa jest niedostępna. Proszę spróbować ponownie za chwilę.",
    tooManyRequests: "Otrzymaliśmy już od Państwa kilka wiadomości. Proszę chwilę poczekać.",
  },
};
