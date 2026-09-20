import type { institucional as Source } from "../pt/institucional";

// Namespace "institucional" — en. Tem de cumprir a forma do português.
export const institucional: typeof Source = {
  sobre: {
    metadata: {
      title: "About",
      description:
        "EvDigital is an IT company. We build a digital presence for those who don't have one yet, and custom solutions for those who already need more than a website.",
    },
    eyebrow: "Who we are",
    title: "EvDigital is an IT company.",
    intro:
      "We build a digital presence for those who don't have one yet, and custom solutions for those who already need more than a website.",
    whyTitle: "Why we exist",
    whyLead: "Millions of small businesses still don't exist on the internet.",
    whyP1:
      "It's not for lack of will. It's because technology is still explained in a language that excludes the people who need it most.",
    whyP2:
      "We created EvDigital to solve both ends of the same problem: those who haven't taken the first step yet, and those who already want to take the next one.",
    howTitle: "How we work",
    how: [
      "We explain before we build.",
      "We tell you what isn't worth doing.",
      "We don't disappear after delivery.",
    ],
    ctaAria: "Book a free conversation",
    ctaText:
      "Thirty minutes, no commitment, to understand where you are and what makes sense to do next.",
    ctaButton: "Book a free conversation",
  },
  legal: {
    updatedPrefix: "Last updated:",
    pending: "TO BE CONFIRMED",
  },
  privacidade: {
    metadata: {
      title: "Privacy Policy",
      description:
        "How EvDigital handles the personal data collected through the contact form.",
    },
    title: "Privacy Policy",
    updatedAt: "31 August 2026",
    intro:
      "This page explains what data we collect when you contact us through the website, what it is used for, how long we keep it and what you can demand regarding it.",
    controller: {
      title: "Who processes your data",
      p1: "EvDigital is the controller of the data collected on this website. For any question about this policy or about your data, use the form on the contact page.",
      pending:
        "[TO BE CONFIRMED: full company name, tax ID (NIF), address and contact email for privacy matters.]",
    },
    data: {
      title: "What data we collect",
      intro: "Only what you write in the contact form:",
      items: [
        "Name",
        "Email",
        "Phone number, if you choose to provide it (it is optional)",
        "What you need, chosen from the list",
        "The message you write",
      ],
      outro:
        "We do not use advertising cookies, we do not track you across sites and we neither buy nor sell contact lists.",
    },
    purpose: {
      title: "What it is used for",
      p1: "It is used solely to respond to your request and, if we go ahead, to carry out the work you ask of us. We also keep the status of the contact (for example, whether we have already replied) so that we can organise ourselves.",
      p2Bold: "We do not sign you up to newsletters or campaigns.",
      p2Rest:
        " If one day we want to send you that kind of communication, we will first ask for your express permission, and you can withdraw it whenever you wish.",
    },
    basis: {
      title: "Legal basis",
      text: "We process this data to follow up on a request that came from you (pre-contractual steps, Article 6(1)(b) of the General Data Protection Regulation, GDPR).",
    },
    retention: {
      title: "How long we keep it",
      p1: "We keep contacts that did not lead to any work for 24 months, after which they are deleted. If we do work with you, the data is kept for as long as the relationship lasts and for the period required by law afterwards.",
      p2: "You can ask for deletion before then at any time.",
    },
    access: {
      title: "Who has access",
      p1: "Only EvDigital. The data is stored in our own database and is sent by email to our internal address when you contact us.",
      pending:
        "[TO BE CONFIRMED: identify the providers that host the website, the database and the email service, and state whether any of them processes data outside the European Union.]",
    },
    rights: {
      title: "Your rights",
      p1: "You can ask us, at any time and without giving a reason, to: access the data we hold about you, correct it, delete it, restrict what we do with it, object to its processing, or receive it in a format you can take elsewhere.",
      p2Before:
        "Just ask through the contact form. We reply within one month. If you believe we have not handled the matter as we should, you can lodge a complaint with the Portuguese data protection authority, the Comissão Nacional de Proteção de Dados (",
      authorityLinkLabel: "cnpd.pt",
      authorityUrl: "https://www.cnpd.pt",
      p2After: ").",
    },
    security: {
      title: "Security",
      text: "The connection to the website is encrypted. Access to the contacts we receive is restricted and password-protected. We do not record the content of your messages in diagnostic logs.",
    },
  },
  termos: {
    metadata: {
      title: "Terms of Use",
      description: "Conditions of use of the EvDigital website.",
    },
    title: "Terms of Use",
    updatedAt: "31 August 2026",
    intro:
      "The conditions of use of this website. They are short on purpose: this is an informational website with a way to contact us.",
    about: {
      title: "What this website is",
      p1: "An informational website about EvDigital's services, with a form to contact us. We do not sell anything directly here and we do not process payments.",
      pending: "[TO BE CONFIRMED: full company name, tax ID (NIF) and registered office.]",
    },
    content: {
      title: "The website's content",
      p1: "We try to keep everything correct and up to date, but the texts describe services in general terms and do not constitute a contractual offer. Any work is agreed through a specific written proposal.",
      p2: "The market data we cite comes from identified public sources and refers to the date on which it was published.",
    },
    form: {
      title: "When using the contact form",
      p1Before:
        "We ask that you use a genuine contact, so that we can reply to you. How the data you send us is processed is described in the ",
      privacyLinkLabel: "Privacy Policy",
      p1After: ".",
      p2: "Do not use the form to send unsolicited advertising or for any unlawful purpose. We may ignore and delete messages of that kind.",
    },
    ownership: {
      title: "Ownership",
      text: "The texts, images and code of this website belong to EvDigital, unless another source is indicated. You may quote us with attribution; you may not copy the website for your own commercial use.",
    },
    availability: {
      title: "Availability",
      text: "We do our best to keep the website accessible, but it may be temporarily unavailable for maintenance or for technical reasons.",
    },
    law: {
      title: "Governing law",
      p1: "Portuguese law applies. In the event of a consumer dispute, you may turn to the competent alternative dispute resolution bodies.",
      pending:
        "[TO BE CONFIRMED: indicate the competent ADR body, mandatory for anyone providing services to consumers in Portugal.]",
    },
  },
};
