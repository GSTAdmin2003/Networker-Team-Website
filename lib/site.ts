/** Locale-independent site data: contact channels, service order, origin. */

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const brand = {
  title: "NETWORKER",
  subtitle: "BUSINESS CONSULTING",
} as const;

export const contacts = {
  phone: { href: "tel:+995597147210", display: "+995 597 14 72 10" },
  email: { href: "mailto:info@networkerteam.ge", display: "info@networkerteam.ge" },
  telegram: "https://t.me/+995597205252",
  whatsapp: "https://wa.me/995597147210",
  viber: "viber://add?number=995597205252",
  instagram: "https://www.instagram.com/team.networker/",
  facebook: "https://www.facebook.com/profile.php?id=61586478260311",
  linkedin: "https://www.linkedin.com/company/networker-team/",
} as const;

export const serviceIds = [
  "company",
  "entrepreneur",
  "virtualZone",
  "accounting",
  "cfo",
  "workPermit",
] as const;

export type ServiceId = (typeof serviceIds)[number];

export const messengerIds = [
  "telegram",
  "whatsapp",
  "viber",
  "instagram",
  "facebook",
  "linkedin",
] as const;

export type MessengerId = (typeof messengerIds)[number];
