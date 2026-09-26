import type { consultores as Source } from "../pt/consultores";

// Namespace "consultores" — en. Tem de cumprir a forma do português.
export const consultores: typeof Source = {
  lista: {
    title: "Consultants",
  },
  detalhe: {
    backToList: "Consultants",
    salario: "Expected pay",
    contrato: "Contract, per month",
    freelancer: "Freelance, per hour",
    marcarHora: "Book a time",
    enviarMensagem: "Send a message",
    contactar: "Get in touch",
    descarregarCv: "Download CV",
    percurso: "Career",
    periodo: "{inicio} to {fim}",
    desde: "Since {inicio}",
    idiomas: "Languages",
    habilitacoes: "Qualifications",
  },
  cv: {
    apresentacao: "Profile",
    competencias: "Skills",
    dominio: "evdigital.eu",
    ficheiro: "cv",
  },
  wizard: {
    escolha: "Choose an option",
  },
};
