import type { assistente as Source } from "../pt/assistente";

// Namespace "assistente" — pl. Tem de cumprir a forma do português.
export const assistente: typeof Source = {
  title: "Asystent",
  open: "Otwórz asystenta",
  balloon: "Potrzebujesz pomocy?",
  dismissHint: "Odrzuć sugestię",
  close: "Zamknij asystenta",
  intro: "Zapytaj nas o usługi. Jeśli chcesz, przekażemy Twoje zapytanie zespołowi.",
  suggestions: ["Jakie usługi oferujecie?", "Jak wygląda proces?", "Chcę porozmawiać z zespołem"],
  authors: { you: "Ty", assistant: "Asystent" },
  composer: {
    label: "Twoja wiadomość",
    placeholder: "Napisz pytanie",
    send: "Wyślij",
    sending: "Wysyłanie",
  },
  thinking: "Pisze",
  newConversation: "Nowa rozmowa",
  contactLink: "Przejdź do kontaktu",
  summary: {
    alter: "Zmień",
    cancel: "Anuluj",
    save: "Zapisz",
    send: "Wyślij zapytanie",
    sending: "Wysyłanie",
    sentTitle: "Zapytanie wysłane.",
    sentText: "Otrzymasz potwierdzenie e-mailem.",
  },
  errors: {
    unavailable: "Asystent jest teraz niedostępny. Możesz napisać do nas na stronie kontaktowej.",
    tooManyRequests: "Wysłano zbyt wiele wiadomości. Spróbuj później lub skorzystaj ze strony kontaktowej.",
    limit: "Rozmowa osiągnęła limit. Kontynuuj na stronie kontaktowej.",
    invalidRequest: "Nieprawidłowe zapytanie.",
  },
};
