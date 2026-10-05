import type { MessengerId, ServiceId } from "@/lib/site";
import type { Locale } from "./config";

type Principle = { title: string; text: string };

export type Dictionary = {
  meta: { title: string; description: string };
  nav: {
    home: string;
    services: string;
    about: string;
    contact: string;
    ourServices: string;
  };
  hero: {
    titleBefore: string;
    titleHighlight: string;
    titleAfter: string;
    lead: string;
    /** "Write on WhatsApp" — reused everywhere that intent appears. */
    ctaPrimary: string;
    ctaSecondary: string;
    panelTitle: string;
    /** Value shown next to the messenger rows in the hero panel. */
    chat: string;
  };
  services: {
    title: string;
    subtitle: string;
    prompt: string;
    askLink: string;
    orCall: string;
    orTelegram: string;
    items: Record<
      ServiceId,
      {
        title: string;
        description: string;
        /** Shorter label used in the footer list. */
        footerLabel: string;
      }
    >;
  };
  about: {
    title: string;
    subtitle: string;
    body: string;
    principles: [Principle, Principle, Principle];
  };
  contact: {
    title: string;
    subtitle: string;
    primaryTitle: string;
    secondaryTitle: string;
    socialLabel: string;
    address: { label: string; value: string };
    phoneLabel: string;
    emailLabel: string;
    /** Call-to-action text on each messenger / social card. */
    messengers: Record<MessengerId, string>;
  };
  footer: {
    description: string;
    navigation: string;
    services: string;
    contactInfo: string;
    rights: string;
  };
  notFound: { title: string; body: string; back: string };
  actionBar: { call: string; whatsapp: string };
  whatsapp: {
    /** General prefilled WhatsApp message. */
    greeting: string;
    /** Prefix before a service title, e.g. "Hello! I'm interested in:". */
    aboutService: string;
  };
  /** Full language names, for the language switcher's tooltips. */
  languageNames: Record<Locale, string>;
  a11y: {
    openMenu: string;
    closeMenu: string;
    toggleServices: string;
    languages: string;
    home: string;
  };
};

/** The slice of the dictionary the client-side header needs. */
export type HeaderDictionary = {
  nav: Dictionary["nav"];
  a11y: Dictionary["a11y"];
  serviceTitles: Record<ServiceId, string>;
  languageNames: Dictionary["languageNames"];
};
