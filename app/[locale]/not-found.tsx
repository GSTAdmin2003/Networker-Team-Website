import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import { defaultLocale, localePath } from "@/lib/i18n/config";

// not-found.tsx receives no params, so it renders in the default locale.
export default function NotFound() {
  const dict = getDictionary(defaultLocale);
  return (
    <main className="not-found">
      <h1>{dict.notFound.title}</h1>
      <p>{dict.notFound.body}</p>
      <Link href={localePath(defaultLocale)} className="btn-primary">
        {dict.notFound.back}
      </Link>
    </main>
  );
}
