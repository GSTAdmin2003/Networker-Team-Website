import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { FaEnvelope, FaLocationDot, FaPhone } from "react-icons/fa6";
import { ExternalLink } from "@/components/ExternalLink";
import { messengerIcons, messengerNames } from "@/components/icons";
import type { Dictionary } from "@/lib/i18n";
import { contacts, messengerIds } from "@/lib/site";
import styles from "./Contact.module.css";

function Card({
  icon: Icon,
  title,
  brand,
  children,
}: {
  icon: IconType;
  title: string;
  brand?: string;
  children: ReactNode;
}) {
  return (
    <div className={`${styles.card} ${brand ? styles[brand] : ""}`}>
      <span className={styles.icon}>
        <Icon aria-hidden />
      </span>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
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
        <div className={styles.grid}>
          <Card icon={FaLocationDot} title={contact.address.label}>
            {contact.address.value}
          </Card>
          <Card icon={FaPhone} title={contact.phoneLabel}>
            <a href={contacts.phone.href} className={styles.link}>
              {contacts.phone.display}
            </a>
          </Card>
          <Card icon={FaEnvelope} title={contact.emailLabel}>
            <a href={contacts.email.href} className={styles.link}>
              {contacts.email.display}
            </a>
          </Card>
          {messengerIds.map((id) => (
            <Card key={id} icon={messengerIcons[id]} title={messengerNames[id]} brand={id}>
              <ExternalLink href={contacts[id]} className={styles.link}>
                {contact.messengers[id]}
              </ExternalLink>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
