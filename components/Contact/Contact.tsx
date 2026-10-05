import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { FaArrowRight, FaEnvelope, FaLocationDot, FaPhone, FaTelegram, FaWhatsapp } from "react-icons/fa6";
import { ExternalLink } from "@/components/ExternalLink";
import { messengerIcons, messengerNames } from "@/components/icons";
import type { Dictionary } from "@/lib/i18n";
import { contacts, whatsappUrl } from "@/lib/site";
import styles from "./Contact.module.css";

const socials = ["viber", "instagram", "facebook", "linkedin"] as const;

function Tile({
  href,
  external,
  icon: Icon,
  brand,
  label,
  value,
}: {
  href: string;
  external?: boolean;
  icon: IconType;
  brand: string;
  label: string;
  value: ReactNode;
}) {
  const content = (
    <>
      <span className={styles.tileIcon}>
        <Icon aria-hidden />
      </span>
      <span className={styles.tileLabel}>{label}</span>
      <span className={styles.tileValue}>
        {value}
        <FaArrowRight aria-hidden />
      </span>
    </>
  );
  const className = `${styles.tile} ${styles[brand]}`;
  return external ? (
    <ExternalLink href={href} className={className}>
      {content}
    </ExternalLink>
  ) : (
    <a href={href} className={className}>
      {content}
    </a>
  );
}

export function Contact({ dict }: { dict: Dictionary }) {
  const { contact } = dict;
  return (
    <section className={styles.section} id="contact">
      <div className="section-container">
        <div className="section-title">
          <h2>{contact.title}</h2>
          <p>{contact.subtitle}</p>
        </div>

        <h3 id="contact-primary" className={styles.groupTitle}>
          {contact.primaryTitle}
        </h3>
        <ul className={styles.tiles} aria-labelledby="contact-primary">
          <li>
            <Tile
              href={whatsappUrl(dict.whatsapp.greeting)}
              external
              icon={FaWhatsapp}
              brand="whatsapp"
              label="WhatsApp"
              value={contact.messengers.whatsapp}
            />
          </li>
          <li>
            <Tile
              href={contacts.telegram}
              external
              icon={FaTelegram}
              brand="telegram"
              label="Telegram"
              value={contact.messengers.telegram}
            />
          </li>
          <li>
            <Tile
              href={contacts.phone.href}
              icon={FaPhone}
              brand="phone"
              label={contact.phoneLabel}
              value={<span className={styles.number}>{contacts.phone.display}</span>}
            />
          </li>
        </ul>

        <div className={styles.secondary}>
          <h3 className={styles.groupTitle}>{contact.secondaryTitle}</h3>
          <dl className={styles.details}>
            <div>
              <dt>
                <FaEnvelope aria-hidden /> {contact.emailLabel}
              </dt>
              <dd>
                <a href={contacts.email.href}>{contacts.email.display}</a>
              </dd>
            </div>
            <div>
              <dt>
                <FaLocationDot aria-hidden /> {contact.address.label}
              </dt>
              <dd>{contact.address.value}</dd>
            </div>
          </dl>
          <div className={styles.socials}>
            <span className={styles.socialLabel}>{contact.socialLabel}</span>
            <ul>
              {socials.map((id) => {
                const Icon = messengerIcons[id];
                return (
                  <li key={id}>
                    <ExternalLink
                      href={contacts[id]}
                      className={`${styles.social} ${styles[id]}`}
                      aria-label={messengerNames[id]}
                      title={messengerNames[id]}
                    >
                      <Icon aria-hidden />
                    </ExternalLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
