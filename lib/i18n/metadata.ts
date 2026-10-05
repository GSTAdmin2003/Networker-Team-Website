import type { Metadata } from "next";
import { brand, siteUrl } from "@/lib/site";
import { getDictionary } from ".";
import { localePath, locales, ogLocales, type Locale } from "./config";

export function buildMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale);
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((l) => [l, localePath(l)]),
  );
  languages["x-default"] = localePath("ka");

  return {
    metadataBase: new URL(siteUrl),
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: { canonical: localePath(locale), languages },
    openGraph: {
      type: "website",
      siteName: brand.title,
      title: dict.meta.title,
      description: dict.meta.description,
      url: localePath(locale),
      locale: ogLocales[locale],
      images: [{ url: "/images/logo2.png", width: 570, height: 363 }],
    },
  };
}
