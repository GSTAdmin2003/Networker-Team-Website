export const locales = ["ka", "en", "ru"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ka";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Canonical path of a locale's page (home page by default); Georgian lives at
 * the root, so `/ka/privacy` is served as `/privacy`.
 */
export function localePath(locale: Locale, path = ""): string {
  if (locale === defaultLocale) return path || "/";
  return `/${locale}${path}`;
}

/** Labels shown on the language switcher. */
export const localeLabels: Record<Locale, string> = {
  ka: "GE",
  en: "EN",
  ru: "RU",
};

/** Open Graph locale codes. */
export const ogLocales: Record<Locale, string> = {
  ka: "ka_GE",
  en: "en_US",
  ru: "ru_RU",
};
