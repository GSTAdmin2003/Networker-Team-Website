import type { MessengerId, ServiceId } from "@/lib/site";

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
    ctaPrimary: string;
    ctaSecondary: string;
  };
  services: {
    title: string;
    subtitle: string;
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
  about: { title: string; subtitle: string; body: string };
  contact: {
    title: string;
    subtitle: string;
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
};
