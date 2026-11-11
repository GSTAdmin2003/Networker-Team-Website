import Link from "next/link";
import { FaEnvelope, FaLocationDot, FaPhone } from "react-icons/fa6";
import type { Dictionary } from "@/lib/i18n";
import { localePath, type Locale } from "@/lib/i18n/config";
import { brand, company, contacts, legalPages, serviceAnchor, serviceIds } from "@/lib/site";
import styles from "./Footer.module.css";

type Props = {
  dict: Dictionary;
  locale: Locale;
  /** Prefix for the section anchors: empty on the home page, its path elsewhere. */
  home?: string;
};

export function Footer({ dict, locale, home = "" }: Props) {
  const { footer, nav, services, contact, legal } = dict;
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div>
          <div className={styles.brand}>
            <span className={styles.brandTitle}>{brand.title}</span>
            <span className={styles.brandSubtitle}>{brand.subtitle}</span>
          </div>
          <p className={styles.desc}>{footer.description}</p>
          <p className={styles.company}>
            {legal.companyName}
            <br />
            {legal.idLabel}: {company.id}
          </p>
        </div>

        <div>
          <h4>{footer.navigation}</h4>
          <ul className={styles.links}>
            <li>
              <a href={`${home}#top`}>{nav.home}</a>
            </li>
            <li>
              <a href={`${home}#services`}>{nav.services}</a>
            </li>
            <li>
              <a href={`${home}#about`}>{nav.about}</a>
            </li>
            <li>
              <a href={`${home}#contact`}>{nav.contact}</a>
            </li>
          </ul>
        </div>

        <div>
          <h4>{footer.services}</h4>
          <ul className={styles.links}>
            {serviceIds.map((id) => (
              <li key={id}>
                <a href={`${home}#${serviceAnchor(id)}`}>{services.items[id].footerLabel}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>{footer.contactInfo}</h4>
          <ul className={styles.contactInfo}>
            <li>
              <FaLocationDot aria-hidden /> {contact.address.value}
            </li>
            <li>
              <FaPhone aria-hidden /> <a href={contacts.phone.href}>{contacts.phone.display}</a>
            </li>
            <li>
              <FaPhone aria-hidden /> <a href={contacts.phone2.href}>{contacts.phone2.display}</a>
            </li>
            <li>
              <FaEnvelope aria-hidden /> <a href={contacts.email.href}>{contacts.email.display}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <ul className={styles.legalLinks}>
          {legalPages.map((id) => (
            <li key={id}>
              <Link href={localePath(locale, `/${id}`)}>{legal.pages[id].title}</Link>
            </li>
          ))}
        </ul>
        <p>
          &copy; {new Date().getFullYear()} {legal.companyName}. {footer.rights}
        </p>
      </div>
    </footer>
  );
}
