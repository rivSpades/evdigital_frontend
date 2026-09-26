import type { consultores as Source } from "../pt/consultores";

// Namespace "consultores" — pl. Tem de cumprir a forma do português.
export const consultores: typeof Source = {
  lista: {
    title: "Konsultanci",
  },
  detalhe: {
    backToList: "Konsultanci",
    salario: "Oczekiwane wynagrodzenie",
    contrato: "Umowa, miesięcznie",
    freelancer: "Freelance, za godzinę",
    marcarHora: "Umów termin",
    enviarMensagem: "Wyślij wiadomość",
    contactar: "Skontaktuj się",
    descarregarCv: "Pobierz CV",
    percurso: "Doświadczenie",
    periodo: "od {inicio} do {fim}",
    desde: "Od {inicio}",
  },
  cv: {
    apresentacao: "Profil",
    competencias: "Umiejętności",
    dominio: "evdigital.eu",
    ficheiro: "cv",
  },
  wizard: {
    escolha: "Wybierz opcję",
  },
};
