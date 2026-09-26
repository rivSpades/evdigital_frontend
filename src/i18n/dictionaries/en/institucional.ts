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
    ctaAria: "Contact us",
    ctaText:
      "No commitment, to understand where you are and what makes sense to do next.",
    ctaButton: "Contact us",
  },
  legal: {
    updatedPrefix: "Last updated:",
  },
  privacidade: {
    metadata: {
      title: "Privacy Policy",
      description:
        "How EvDigital handles the personal data collected on the website and in the Client Area.",
    },
    title: "Privacy Policy",
    updatedAt: "24 September 2026",
    intro:
      "This page explains what data we collect when you use this website or your Client Area, what it is used for, how long we keep it and what you can demand regarding it.",
    controller: {
      title: "Who processes your data",
      p1: "EvDigital is the controller of the data collected on this website and in the Client Area. For any question about this policy or about your data, use the form on the contact page. If you already have an account, you can also write to us in a request in your Client Area.",
    },
    data: {
      title: "What data we collect",
      intro: "It depends on what you do on the website.",
      groups: [
        {
          title: "When you contact us",
          items: [
            "Name",
            "Email",
            "Phone number, if you choose to provide it (it is optional)",
            "What you need, chosen from the list",
            "The message you write",
            "If you book a meeting, the day and time you choose",
          ],
        },
        {
          title: "When you create an account in the Client Area",
          items: [
            "Name and email",
            "Password (we only store an encrypted version, never the password itself)",
            "Phone number, company and tax number, if you choose to provide them (they are optional)",
            "The projects and requests you create and the messages you exchange with us",
          ],
        },
      ],
      google: {
        title: "If you sign in with Google",
        text: "We receive your email and your name from Google. We do not receive your Google password.",
      },
      outro:
        "We do not use advertising cookies, we do not track you across sites and we neither buy nor sell contact lists.",
    },
    cookies: {
      title: "Cookies",
      p1: "We use cookies that are necessary for the website to work: one stores the language you chose and, in the Client Area, another keeps you signed in (it lasts up to 30 days or until you sign out). We do not use advertising cookies.",
      p2: "Only with your consent, given in the cookie notice, we also use Google Analytics 4 on the public site to understand how it is used (pages visited, where visits come from, device type). If you decline, nothing from Google is loaded. You can change your mind at any time via “Cookies” in the footer. Google may process this data outside the European Union. We do not use analytics in the Client Area.",
    },
    purpose: {
      title: "What it is used for",
      p1: "It is used solely to respond to your request, to maintain your account and, if we go ahead, to carry out the work you ask of us. We also keep the status of contacts and requests (for example, whether we have already replied) so that we can organise ourselves.",
      p2Bold: "We do not sign you up to newsletters or campaigns.",
      p2Rest:
        " If one day we want to send you that kind of communication, we will first ask for your express permission, and you can withdraw it whenever you wish.",
    },
    basis: {
      title: "Legal basis",
      text: "We process this data to follow up on a request that came from you and to provide you with the Client Area service (pre-contractual steps and performance of a contract, Article 6(1)(b) of the General Data Protection Regulation, GDPR).",
    },
    retention: {
      title: "How long we keep it",
      p1: "We keep contacts that did not lead to any work for 24 months, after which they are deleted. If we do work with you, the data is kept for as long as the relationship lasts and for the period required by law afterwards.",
      p2: "Account data is kept for as long as the account exists. If you ask for deletion, we delete the account and the associated data, except for what the law requires us to keep.",
      p3: "You can ask for deletion before then at any time. In the Client Area, do so in Settings, under the Security tab.",
    },
    access: {
      title: "Who has access",
      p1: "Only EvDigital and the services we use to make the website work: email delivery, Cal.com if you book a meeting (it receives your name, email, time zone and the time slot you choose) and Google if you sign in with your Google account. The data is stored in our own database and is sent by email to our internal address when you contact us.",
    },
    rights: {
      title: "Your rights",
      p1: "You can ask us, at any time and without giving a reason, to: access the data we hold about you, correct it, delete it, restrict what we do with it, object to its processing, or receive it in a format you can take elsewhere.",
      p2Before:
        "Just ask through the contact form or, if you have an account, in a request in the Client Area. We reply within one month. If you believe we have not handled the matter as we should, you can lodge a complaint with the Portuguese data protection authority, the Comissão Nacional de Proteção de Dados (",
      authorityLinkLabel: "cnpd.pt",
      authorityUrl: "https://www.cnpd.pt",
      p2After: ").",
    },
    security: {
      title: "Security",
      text: "The connection to the website is encrypted. Passwords are stored encrypted. Access to contacts and accounts is restricted and password-protected. We do not record the content of your messages in diagnostic logs.",
    },
  },
  termos: {
    metadata: {
      title: "Terms of Use",
      description: "Conditions of use of the EvDigital website.",
    },
    title: "Terms of Use",
    updatedAt: "24 September 2026",
    intro: "The conditions of use of this website and of the Client Area. They are short on purpose.",
    about: {
      title: "What this website is",
      p1: "An informational website about EvDigital's services, with a form to contact us and a Client Area where you can follow projects and make requests. We do not sell anything directly here and we do not process payments.",
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
    conta: {
      title: "Your account",
      p1: "When you create an account, give us genuine details and keep your password safe. The account is personal: do not share it.",
      p2: "A request made in the Client Area is not an order: any work is agreed through a specific written proposal.",
      p3: "We may suspend or delete accounts used for unlawful purposes. You can ask for your account to be deleted at any time, in Settings.",
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
    },
  },
};
