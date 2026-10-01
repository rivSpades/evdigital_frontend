import type { assistente as Source } from "../pt/assistente";

// Namespace "assistente" — en. Tem de cumprir a forma do português.
export const assistente: typeof Source = {
  title: "Assistant",
  open: "Open the assistant",
  balloon: "Need help?",
  dismissHint: "Dismiss the suggestion",
  close: "Close the assistant",
  intro: "Ask us about our services. If you like, we pass your request on to the team.",
  suggestions: ["What services do you offer?", "How does the process work?", "I want to talk to the team"],
  authors: { you: "You", assistant: "Assistant" },
  composer: {
    label: "Your message",
    placeholder: "Write your question",
    send: "Send",
    sending: "Sending",
  },
  thinking: "Typing",
  newConversation: "New conversation",
  contactLink: "Go to contact",
  summary: {
    alter: "Edit",
    cancel: "Cancel",
    save: "Save",
    send: "Send request",
    sending: "Sending",
    sentTitle: "Request sent.",
    sentText: "You will receive a confirmation by email.",
  },
  errors: {
    unavailable: "The assistant is not available right now. You can write to us on the contact page.",
    tooManyRequests: "You sent too many messages. Try later or use the contact page.",
    limit: "This conversation reached its limit. Please continue on the contact page.",
    invalidRequest: "Invalid request.",
  },
};
