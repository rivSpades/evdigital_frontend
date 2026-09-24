import type { contacto as Source } from "../pt/contacto";

// Namespace "contacto" — en. Tem de cumprir a forma do português.
export const contacto: typeof Source = {
  metadata: {
    title: "Contact",
    description:
      "No commitment and no cost. If it doesn't make sense to go ahead, we'll tell you.",
  },
  page: {
    title: "Let's talk",
  },
  steps: {
    describe: "Tell us what you need",
    meeting: "Would you like to book a meeting?",
    summary: "Summary",
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
      emailFormat: "This email does not look right. Write it like this: name@company.com",
      needRequired: "Choose an option.",
      messageRequired: "Tell us what you need.",
    },
    nameLabel: "Name",
    namePlaceholder: "Jane Smith",
    emailLabel: "Email",
    emailPlaceholder: "name@company.com",
    phoneLabel: "Phone",
    phonePlaceholder: "912 345 678",
    needLabel: "What you need",
    needPlaceholder: "Choose an option",
    messageLabel: "Message",
    messagePlaceholder: "Write here what you need for your business.",
    honeypotLabel: "Do not fill in",
  },
  meeting: {
    question: "Would you like to book a meeting?",
    hint: "Optional. No commitment.",
    yes: "Yes, I'd like to book",
    no: "No, just send the message",
    loading: "Looking for available times...",
    noSlots:
      "No available times in the coming days. You can continue without booking. We'll reach out to arrange one.",
    loadError: "We couldn't load the available times. You can continue without booking.",
    chooseDay: "Choose a day",
    chooseTime: "Choose a time",
    changeDay: "Choose another day",
  },
  summary: {
    title: "Confirm your details",
    nameLabel: "Name",
    emailLabel: "Email",
    phoneLabel: "Phone",
    needLabel: "What you need",
    messageLabel: "Message",
    meetingLabel: "Meeting",
    noMeeting: "No meeting booked",
    notProvided: "Not provided",
    privacyBefore: "We use this data only to reply to you. Find out more in the ",
    privacyAfter: ".",
  },
  actions: {
    continue: "Continue",
    back: "Back",
    finish: "Finish",
    sending: "Sending...",
  },
  result: {
    successTitle: "Message sent.",
    successText:
      "We've received your request and will reply shortly. We've also sent a confirmation to your email.",
    meetingConfirmedText: "Your meeting is booked. We've sent the confirmation to your email.",
    partialTitle: "Message sent.",
    partialText: "We couldn't automatically confirm the meeting. We'll contact you to arrange a time.",
    tooManyTitle: "We've already received several messages from you.",
    tooManyText: "Please wait a little before sending another.",
    failedTitle: "We couldn't send your message.",
    failedText: "Please try again in a moment.",
  },
  api: {
    invalidRequest: "Invalid request.",
    unavailable: "Service unavailable. Please try again in a moment.",
    tooManyRequests: "We've already received several messages from you. Please wait a little.",
  },
};
