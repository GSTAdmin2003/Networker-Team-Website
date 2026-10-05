import { FaEnvelope, FaLocationDot, FaPhone } from "react-icons/fa6";
import type { Dictionary } from "@/lib/i18n";
import { brand, contacts, serviceIds } from "@/lib/site";
import styles from "./Footer.module.css";

export function Footer({ dict }: { dict: Dictionary }) {
  const { footer, nav, services, contact } = dict;
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div>
          <div className={styles.brand}>
            <span className={styles.brandTitle}>{brand.title}</span>
            <span className={styles.brandSubtitle}>{brand.subtitle}</span>
          </div>
          <p className={styles.desc}>{footer.description}</p>
        </div>

        <div>
          <h4>{footer.navigation}</h4>
          <ul className={styles.links}>
            <li>
              <a href="#top">{nav.home}</a>
            </li>
            <li>
              <a href="#services">{nav.services}</a>
            </li>
            <li>
              <a href="#about">{nav.about}</a>
            </li>
            <li>
              <a href="#contact">{nav.contact}</a>
            </li>
          </ul>
        </div>

        <div>
          <h4>{footer.services}</h4>
          <ul className={styles.links}>
            {serviceIds.map((id) => (
              <li key={id}>
                <a href="#services">{services.items[id].footerLabel}</a>
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
              <FaEnvelope aria-hidden /> <a href={contacts.email.href}>{contacts.email.display}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>
          &copy; {new Date().getFullYear()} {footer.rights}
        </p>
      </div>
    </footer>
  );
}
