import { FaPhone, FaWhatsapp } from "react-icons/fa6";
import { ExternalLink } from "@/components/ExternalLink";
import type { Dictionary } from "@/lib/i18n";
import { contacts, whatsappUrl } from "@/lib/site";
import styles from "./ActionBar.module.css";

/** Fixed bottom bar on phones: the two fastest ways to reach us, one thumb away. */
export function ActionBar({ dict }: { dict: Dictionary }) {
  return (
    <nav className={styles.bar} aria-label={dict.contact.primaryTitle}>
      <a href={contacts.phone.href} className={`${styles.action} ${styles.call}`}>
        <FaPhone aria-hidden />
        {dict.actionBar.call}
      </a>
      <ExternalLink
        href={whatsappUrl(dict.whatsapp.greeting)}
        className={`${styles.action} ${styles.whatsapp}`}
      >
        <FaWhatsapp aria-hidden />
        {dict.actionBar.whatsapp}
      </ExternalLink>
    </nav>
  );
}
