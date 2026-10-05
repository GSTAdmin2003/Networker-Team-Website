import { FaQuoteLeft } from "react-icons/fa6";
import type { Dictionary } from "@/lib/i18n";
import styles from "./About.module.css";

export function About({ dict }: { dict: Dictionary }) {
  const { about } = dict;
  return (
    <section className={styles.section} id="about">
      <div className="section-container">
        <div className="section-title">
          <h2>{about.title}</h2>
          <p>{about.subtitle}</p>
        </div>
        <div className={styles.content}>
          <span className={styles.badge}>
            <FaQuoteLeft aria-hidden />
          </span>
          <p>{about.body}</p>
        </div>
      </div>
    </section>
  );
}
