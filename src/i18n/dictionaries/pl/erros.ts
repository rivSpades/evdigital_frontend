import type { erros as Source } from "../pt/erros";

// Namespace "erros" — pl. Tem de cumprir a forma do português.
export const erros: typeof Source = {
  naoEncontrada: {
    title: "Ta strona nie istnieje.",
    body: "Link może być nieaktualny albo adres zawiera błąd. Można wrócić na stronę główną lub skontaktować się z nami.",
    pathsTitle: "Strony, które istnieją",
    home: "Strona główna",
    homeDescription: "Strona główna EvDigital.",
    servicesDescription: "Od pierwszej strony internetowej po zastosowanie sztucznej inteligencji.",
    code: "Kod błędu 404",
    quote: "„Szukałem czegoś innego.”",
    quoteBody: "Proszę napisać, czego. Odpowiemy właściwym linkiem.",
    areaClientePathsTitle: "W Państwa Strefie Klienta",
    projetosDescription: "Co jest w realizacji, a co zostało już dostarczone.",
    areaClienteNote:
      "Jeśli otworzyli Państwo link od kogoś innego, może on należeć do konta, które nie jest Państwa.",
  },
  pagina: {
    title: "Nie udało się otworzyć tej strony.",
    body: "Proszę spróbować ponownie za chwilę. Jeśli problem się powtórzy, prosimy o kontakt.",
    retry: "Spróbuj ponownie",
    loadTitle: "Nie udało się wczytać Państwa danych.",
    loadBody:
      "Państwa dane są nadal zapisane. Proszę spróbować ponownie za chwilę. Jeśli problem się powtórzy, prosimy o kontakt.",
  },
};
