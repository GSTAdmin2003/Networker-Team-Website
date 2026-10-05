import { serviceIcons } from "@/components/icons";
import type { Dictionary } from "@/lib/i18n";
import { serviceIds } from "@/lib/site";
import styles from "./Services.module.css";

export function Services({ dict }: { dict: Dictionary }) {
  const { services } = dict;
  return (
    <section className={styles.section} id="services">
      <div className="section-container">
        <div className="section-title">
          <h2>{services.title}</h2>
          <p>{services.subtitle}</p>
        </div>
        <div className={styles.grid}>
          {serviceIds.map((id) => {
            const Icon = serviceIcons[id];
            const item = services.items[id];
            return (
              <article key={id} className={styles.card}>
                <div className={styles.icon}>
                  <Icon aria-hidden />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
