import type { erros as Source } from "../pt/erros";

// Namespace "erros" — en. Tem de cumprir a forma do português.
export const erros: typeof Source = {
  naoEncontrada: {
    title: "This page does not exist.",
    body: "The link may be out of date or the address has a mistake. You can go back to the home page or contact us.",
    pathsTitle: "Pages that exist",
    home: "Home",
    homeDescription: "The EvDigital home page.",
    servicesDescription: "From your first website to applied artificial intelligence.",
    code: "Error code 404",
    quote: "“I was looking for something else.”",
    quoteBody: "Tell us what. We will reply with the right link.",
    areaClientePathsTitle: "In your Client Area",
    projetosDescription: "What is in progress and what has already been delivered.",
    areaClienteNote:
      "If you opened a link someone sent you, it may belong to an account that is not yours.",
  },
  pagina: {
    title: "We could not open this page.",
    body: "Please try again in a moment. If it keeps happening, contact us.",
    retry: "Try again",
    loadTitle: "We could not load your details.",
    loadBody:
      "Your details are still saved. Please try again in a moment. If it keeps happening, contact us.",
  },
};
