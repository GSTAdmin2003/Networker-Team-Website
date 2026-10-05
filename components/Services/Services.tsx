import { FaArrowRight, FaWhatsapp } from "react-icons/fa6";
import { ExternalLink } from "@/components/ExternalLink";
import { serviceIcons } from "@/components/icons";
import type { Dictionary } from "@/lib/i18n";
import { contacts, serviceAnchor, serviceIds, whatsappUrl } from "@/lib/site";
import styles from "./Services.module.css";

export function Services({ dict }: { dict: Dictionary }) {
  const { services, whatsapp } = dict;
  return (
    <section className={styles.section} id="services">
      <div className={`section-container ${styles.layout}`}>
        <div className={styles.aside}>
          <h2>{services.title}</h2>
          <p className={styles.subtitle}>{services.subtitle}</p>
          <p className={styles.prompt}>{services.prompt}</p>
          <ExternalLink href={whatsappUrl(whatsapp.greeting)} className="btn-primary">
            <FaWhatsapp aria-hidden />
            {dict.hero.ctaPrimary}
          </ExternalLink>
          <p className={styles.alternatives}>
            <a href={contacts.phone.href}>{services.orCall}</a>
            <span aria-hidden>·</span>
            <ExternalLink href={contacts.telegram}>{services.orTelegram}</ExternalLink>
          </p>
        </div>

        <ol className={styles.list}>
          {serviceIds.map((id) => {
            const Icon = serviceIcons[id];
            const item = services.items[id];
            return (
              <li key={id} id={serviceAnchor(id)} className={styles.row}>
                <Icon className={styles.icon} aria-hidden />
                <div className={styles.body}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <ExternalLink
                    href={whatsappUrl(`${whatsapp.aboutService} ${item.title}`)}
                    className={styles.ask}
                  >
                    {services.askLink}
                    <FaArrowRight aria-hidden />
                  </ExternalLink>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
