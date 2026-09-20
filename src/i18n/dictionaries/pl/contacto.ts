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
    agendaTitle: "Wolą Państwo od razu umówić termin?",
    agendaText: "Proszę wybrać dzień i godzinę, które Państwu odpowiadają. Termin zostaje zarezerwowany od razu.",
    agendaPlaceholder: "Miejsce zarezerwowane na kalendarz",
    agendaButton: "Umów bezpłatną rozmowę",
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
    sending: "Wysyłanie...",
    submit: "Wyślij wiadomość",
    successTitle: "Wiadomość wysłana.",
    successText:
      "Otrzymaliśmy Państwa zapytanie i wkrótce odpowiemy. Wysłaliśmy również potwierdzenie na Państwa adres e-mail.",
    tooManyTitle: "Otrzymaliśmy już od Państwa kilka wiadomości.",
    tooManyText:
      "Proszę chwilę poczekać przed wysłaniem kolejnej. Jeśli sprawa jest pilna, proszę umówić rozmowę w panelu obok.",
    failedTitle: "Nie udało się wysłać wiadomości.",
    failedText:
      "Proszę spróbować ponownie za chwilę. Jeśli nadal nie działa, proszę umówić rozmowę w panelu obok.",
  },
  api: {
    invalidRequest: "Nieprawidłowe żądanie.",
    unavailable: "Usługa jest niedostępna. Proszę spróbować ponownie za chwilę.",
    tooManyRequests: "Otrzymaliśmy już od Państwa kilka wiadomości. Proszę chwilę poczekać.",
  },
};
