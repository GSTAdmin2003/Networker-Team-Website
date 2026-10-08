import type { Metadata } from "next";
import { brand, siteUrl } from "@/lib/site";
import { getDictionary } from ".";
import { localePath, locales, ogLocales, type Locale } from "./config";

/** A page other than the home page: its path suffix and its own title/description. */
type PageMeta = { path: string; title: string; description: string };

export function buildMetadata(locale: Locale, page?: PageMeta): Metadata {
  const dict = getDictionary(locale);
  const path = page?.path ?? "";
  const title = page ? `${page.title} — ${brand.title}` : dict.meta.title;
  const description = page?.description ?? dict.meta.description;
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((l) => [l, localePath(l, path)]),
  );
  languages["x-default"] = localePath("ka", path);

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: { canonical: localePath(locale, path), languages },
    openGraph: {
      type: "website",
      siteName: brand.title,
      title,
      description,
      url: localePath(locale, path),
      locale: ogLocales[locale],
      images: [{ url: "/images/logo2.png", width: 570, height: 363 }],
    },
  };
}
