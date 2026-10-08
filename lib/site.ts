/** Locale-independent site data: contact channels, service order, origin. */

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const brand = {
  title: "NETWORKER",
  subtitle: "BUSINESS CONSULTING",
} as const;

export const contacts = {
  phone: { href: "tel:+995597147210", display: "+995 597 14 72 10" },
  phone2: { href: "tel:+995551529399", display: "+995 551 52 93 99" },
  email: { href: "mailto:info@networkerteam.ge", display: "info@networkerteam.ge" },
  telegram: "https://t.me/+995597205252",
  whatsapp: "https://wa.me/995597147210",
  viber: "viber://add?number=995597205252",
  instagram: "https://www.instagram.com/team.networker/",
  facebook: "https://www.facebook.com/profile.php?id=61586478260311",
  linkedin: "https://www.linkedin.com/company/networker-team/",
} as const;

/** Registry data of the operating entity (shown for Meta business verification). */
export const company = {
  /** Identification code in the Georgian Registry of Entrepreneurs. */
  id: "405813767",
} as const;

/** Standalone legal pages; each lives at `/<locale>/<slug>` (Georgian at `/<slug>`). */
export const legalPages = ["privacy", "terms"] as const;

export type LegalPageId = (typeof legalPages)[number];

export const serviceIds = [
  "company",
  "entrepreneur",
  "virtualZone",
  "accounting",
  "cfo",
  "workPermit",
] as const;

export type ServiceId = (typeof serviceIds)[number];

/** In-page anchor id of a service row. */
export function serviceAnchor(id: ServiceId): string {
  return `service-${id}`;
}

/** WhatsApp chat link, optionally with a prefilled message. */
export function whatsappUrl(text?: string): string {
  return text ? `${contacts.whatsapp}?text=${encodeURIComponent(text)}` : contacts.whatsapp;
}

export const messengerIds = [
  "telegram",
  "whatsapp",
  "viber",
  "instagram",
  "facebook",
  "linkedin",
] as const;

export type MessengerId = (typeof messengerIds)[number];
