import { notFound } from "next/navigation";
import { fontVariables } from "@/app/fonts";
import { isLocale, locales } from "@/lib/i18n/config";
import "../globals.css";

// Only the three supported locales exist; everything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
