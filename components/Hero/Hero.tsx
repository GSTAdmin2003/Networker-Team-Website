import { FaArrowRight, FaLocationDot, FaPhone, FaTelegram, FaWhatsapp } from "react-icons/fa6";
import { ExternalLink } from "@/components/ExternalLink";
import type { Dictionary } from "@/lib/i18n";
import { contacts, whatsappUrl } from "@/lib/site";
import styles from "./Hero.module.css";

export function Hero({ dict }: { dict: Dictionary }) {
  const { hero, contact } = dict;
  const greeting = whatsappUrl(dict.whatsapp.greeting);

  return (
    <section className={styles.hero} id="hero">
      <div className={styles.container}>
        <div className={styles.copy}>
          <h1>
            {hero.titleBefore} <span>{hero.titleHighlight}</span> {hero.titleAfter}
          </h1>
          <p>{hero.lead}</p>
          <div className={styles.buttons}>
            <ExternalLink href={greeting} className="btn-primary">
              <FaWhatsapp aria-hidden />
              {hero.ctaPrimary}
            </ExternalLink>
            <a href="#services" className="btn-secondary">
              {hero.ctaSecondary}
            </a>
          </div>
        </div>

        <aside className={styles.panel} aria-labelledby="hero-panel-title">
          <h2 id="hero-panel-title" className={styles.panelTitle}>
            {hero.panelTitle}
          </h2>
          <ul className={styles.channels}>
            <li>
              <a href={contacts.phone.href} className={styles.channel}>
                <span className={`${styles.chip} ${styles.phone}`}>
                  <FaPhone aria-hidden />
                </span>
                <span className={styles.channelText}>
                  <span className={styles.channelLabel}>{contact.phoneLabel}</span>
                  <span className={styles.channelValue}>{contacts.phone.display}</span>
                </span>
                <FaArrowRight className={styles.chevron} aria-hidden />
              </a>
            </li>
            <li>
              <ExternalLink href={greeting} className={styles.channel}>
                <span className={`${styles.chip} ${styles.whatsapp}`}>
                  <FaWhatsapp aria-hidden />
                </span>
                <span className={styles.channelText}>
                  <span className={styles.channelLabel}>WhatsApp</span>
                  <span className={styles.channelValue}>{hero.chat}</span>
                </span>
                <FaArrowRight className={styles.chevron} aria-hidden />
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href={contacts.telegram} className={styles.channel}>
                <span className={`${styles.chip} ${styles.telegram}`}>
                  <FaTelegram aria-hidden />
                </span>
                <span className={styles.channelText}>
                  <span className={styles.channelLabel}>Telegram</span>
                  <span className={styles.channelValue}>{hero.chat}</span>
                </span>
                <FaArrowRight className={styles.chevron} aria-hidden />
              </ExternalLink>
            </li>
          </ul>
          <p className={styles.address}>
            <FaLocationDot aria-hidden /> {contact.address.value}
          </p>
        </aside>
      </div>
    </section>
  );
}
