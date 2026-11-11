import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer/Footer";
import { getDictionary } from "@/lib/i18n";
import { localeLabels, localePath, locales, type Locale } from "@/lib/i18n/config";
import { brand, company, contacts, type LegalPageId } from "@/lib/site";
import styles from "./LegalPage.module.css";

/** A standalone legal page (privacy policy, terms) with the company's registry details. */
export function LegalPage({ locale, page }: { locale: Locale; page: LegalPageId }) {
  const dict = getDictionary(locale);
  const { legal, contact } = dict;
  const content = legal.pages[page];
  const home = localePath(locale);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href={home} className={styles.logo} aria-label={dict.a11y.home}>
            <Image src="/images/logo-main.svg" alt="" width={46} height={45} unoptimized priority />
            <span className={styles.brandText}>
              <span className={styles.brandTitle}>{brand.title}</span>
              <span className={styles.brandSubtitle}>{brand.subtitle}</span>
            </span>
          </Link>
          <nav aria-label={dict.a11y.languages}>
            <ul className={styles.langs}>
              {locales.map((l) => (
                <li key={l}>
                  <Link
                    href={localePath(l, `/${page}`)}
                    hrefLang={l}
                    lang={l}
                    title={dict.languageNames[l]}
                    aria-current={l === locale ? "page" : undefined}
                  >
                    {localeLabels[l]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main id="top" className={styles.main}>
        <article className={styles.article}>
          <Link href={home} className={styles.back}>
            ← {legal.backHome}
          </Link>
          <h1>{content.title}</h1>
          <p className={styles.updated}>{legal.updated}</p>
          <p className={styles.intro}>{content.intro}</p>
          {content.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}

          <section className={styles.company} aria-labelledby="company-details">
            <h2 id="company-details">{legal.companyTitle}</h2>
            <dl>
              <dt>{legal.companyName}</dt>
              <dd>
                {legal.idLabel}: {company.id}
              </dd>
              <dt>{contact.address.label}</dt>
              <dd>{contact.address.value}</dd>
              <dt>{contact.phoneLabel}</dt>
              <dd>
                <a href={contacts.phone.href}>{contacts.phone.display}</a>,{" "}
                <a href={contacts.phone2.href}>{contacts.phone2.display}</a>
              </dd>
              <dt>{contact.emailLabel}</dt>
              <dd>
                <a href={contacts.email.href}>{contacts.email.display}</a>
              </dd>
            </dl>
          </section>
        </article>
      </main>

      <Footer dict={dict} locale={locale} home={home} />
    </>
  );
}
