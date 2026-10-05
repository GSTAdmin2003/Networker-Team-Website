import type { Dictionary } from "@/lib/i18n";
import styles from "./Hero.module.css";

export function Hero({ dict }: { dict: Dictionary }) {
  const { hero } = dict;
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h1>
          {hero.titleBefore} <span>{hero.titleHighlight}</span> {hero.titleAfter}
        </h1>
        <p>{hero.lead}</p>
        <div className={styles.buttons}>
          <a href="#contact" className="btn-primary">
            {hero.ctaPrimary}
          </a>
          <a href="#services" className="btn-secondary">
            {hero.ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  );
}
