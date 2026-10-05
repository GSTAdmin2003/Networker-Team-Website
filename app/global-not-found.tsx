import type { Metadata } from "next";
import { fontVariables } from "@/app/fonts";
import { getDictionary } from "@/lib/i18n";
import { defaultLocale, localePath } from "@/lib/i18n/config";
import "./globals.css";

// Rendered for URLs that match no route at all. It bypasses the [locale]
// root layout, so it is a complete document of its own.
const dict = getDictionary(defaultLocale);
const english = getDictionary("en");

export const metadata: Metadata = {
  title: `404 — ${dict.notFound.title}`,
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang={defaultLocale} className={fontVariables}>
      <body>
        <main className="not-found">
          <h1>404</h1>
          <p>{dict.notFound.body}</p>
          <p lang="en">{english.notFound.body}</p>
          {/* Plain <a>: this page renders outside the app router tree. */}
          <a href={localePath(defaultLocale)} className="btn-primary">
            {dict.notFound.back}
          </a>
        </main>
      </body>
    </html>
  );
}
