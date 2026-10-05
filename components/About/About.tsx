import { FaWhatsapp } from "react-icons/fa6";
import { ExternalLink } from "@/components/ExternalLink";
import type { Dictionary } from "@/lib/i18n";
import { whatsappUrl } from "@/lib/site";
import styles from "./About.module.css";

export function About({ dict }: { dict: Dictionary }) {
  const { about } = dict;
  return (
    <section className={styles.section} id="about">
      <div className={`section-container ${styles.layout}`}>
        <div className={styles.story}>
          <h2>{about.title}</h2>
          <p className={styles.subtitle}>{about.subtitle}</p>
          <p className={styles.body}>{about.body}</p>
          <ExternalLink href={whatsappUrl(dict.whatsapp.greeting)} className={styles.cta}>
            <FaWhatsapp aria-hidden />
            {dict.hero.ctaPrimary}
          </ExternalLink>
        </div>

        <ul className={styles.principles}>
          {about.principles.map((principle) => (
            <li key={principle.title}>
              <h3>{principle.title}</h3>
              <p>{principle.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
