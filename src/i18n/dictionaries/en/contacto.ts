import type { contacto as Source } from "../pt/contacto";

// Namespace "contacto" — en. Tem de cumprir a forma do português.
export const contacto: typeof Source = {
  metadata: {
    title: "Contact",
    description:
      "Thirty minutes, no commitment and no cost. If it doesn't make sense to go ahead, we'll tell you.",
  },
  page: {
    title: "Let's talk",
    intro:
      "Thirty minutes, no commitment and no cost. If it doesn't make sense to go ahead, we'll tell you.",
    agendaTitle: "Prefer to book a time now?",
    agendaText: "Pick the day and time that suit you. It's booked instantly.",
    agendaPlaceholder: "Space reserved for the calendar",
    agendaButton: "Book a free conversation",
  },
  form: {
    needOptions: {
      site: "Put my business online",
      melhorar: "Improve what I already have",
      avancado: "Advanced or custom solution",
      nao_sei: "I don't know yet",
    },
    validation: {
      nameRequired: "Enter your name.",
      emailRequired: "Enter your email.",
      emailInvalid: "The @ is missing. Write it like this: name@company.com",
      needRequired: "Choose an option.",
      messageRequired: "Tell us what you need.",
    },
    requestingProposal: "Requesting a proposal for",
    removeServiceAria: "Remove pre-selected product",
    nameLabel: "Name",
    namePlaceholder: "Jane Smith",
    emailLabel: "Email",
    emailPlaceholder: "name@company.com",
    phoneLabel: "Phone",
    phonePlaceholder: "912 345 678",
    needLabel: "What you need",
    needPlaceholder: "Choose an option",
    messageLabel: "Message",
    messageHint: "Two or three sentences are enough.",
    messagePlaceholder: "Write here what you need for your business.",
    honeypotLabel: "Do not fill in",
    sending: "Sending...",
    submit: "Send message",
    successTitle: "Message sent.",
    successText:
      "We've received your request and will reply shortly. We've also sent a confirmation to your email.",
    tooManyTitle: "We've already received several messages from you.",
    tooManyText:
      "Please wait a little before sending another. If it's urgent, book a conversation using the panel next to the form.",
    failedTitle: "We couldn't send your message.",
    failedText:
      "Please try again in a moment. If it still doesn't work, book a conversation using the panel next to the form.",
  },
  api: {
    invalidRequest: "Invalid request.",
    unavailable: "Service unavailable. Please try again in a moment.",
    tooManyRequests: "We've already received several messages from you. Please wait a little.",
  },
};
