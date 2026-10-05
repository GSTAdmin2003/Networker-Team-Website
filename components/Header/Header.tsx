"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FocusEvent } from "react";
import { FaBars, FaChevronDown, FaTelegram, FaWhatsapp, FaXmark } from "react-icons/fa6";
import { ExternalLink } from "@/components/ExternalLink";
import { serviceIcons } from "@/components/icons";
import type { HeaderDictionary } from "@/lib/i18n";
import { localeLabels, localePath, type Locale } from "@/lib/i18n/config";
import { brand, contacts, serviceAnchor, serviceIds } from "@/lib/site";
import { useActiveSection, type SectionId } from "@/lib/useActiveSection";
import styles from "./Header.module.css";

// Order of the pills matches the original site.
const switcherOrder: Locale[] = ["ka", "ru", "en"];

export function Header({ locale, dict }: { locale: Locale; dict: HeaderDictionary }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  // Desktop mega menu opens on :hover / :focus-within in CSS; this flag
  // lets Escape (or picking a link) hide it until the next fresh interaction.
  const [megaDismissed, setMegaDismissed] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      setServicesOpen(false);
      setMegaDismissed(true);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Lets page-level CSS react to the open menu (the mobile action bar hides).
  useEffect(() => {
    const root = document.documentElement;
    if (menuOpen) root.setAttribute("data-menu-open", "");
    else root.removeAttribute("data-menu-open");
    return () => root.removeAttribute("data-menu-open");
  }, [menuOpen]);

  const active = useActiveSection();
  const current = (section: SectionId) =>
    active === section ? { "aria-current": "location" as const, className: styles.active } : {};

  function closeAll() {
    setMenuOpen(false);
    setServicesOpen(false);
    setMegaDismissed(true);
  }

  function onServicesBlur(event: FocusEvent<HTMLLIElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setMegaDismissed(false);
    }
  }

  const megaClasses = [
    styles.navItem,
    styles.hasMegaMenu,
    servicesOpen ? styles.open : "",
    megaDismissed ? styles.dismissed : "",
  ].join(" ");

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link
          href={`${localePath(locale)}#top`}
          className={styles.logo}
          aria-label={dict.a11y.home}
          onClick={closeAll}
        >
          <Image
            src="/images/logo-main.svg"
            alt=""
            width={46}
            height={45}
            className={styles.logoImg}
            unoptimized
            priority
          />
          <span className={styles.brandText}>
            <span className={styles.brandTitle}>{brand.title}</span>
            <span className={styles.brandSubtitle}>{brand.subtitle}</span>
          </span>
        </Link>

        <nav id="mainNav" className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <a href="#top" onClick={closeAll} {...current("hero")}>
                {dict.nav.home}
              </a>
            </li>
            <li
              className={megaClasses}
              onPointerLeave={() => setMegaDismissed(false)}
              onBlur={onServicesBlur}
            >
              <div className={styles.servicesRow}>
                <a href="#services" onClick={closeAll} {...current("services")}>
                  {dict.nav.services}
                  <FaChevronDown className={styles.arrow} aria-hidden />
                </a>
                <button
                  type="button"
                  className={styles.servicesToggle}
                  aria-expanded={servicesOpen}
                  aria-controls="servicesMenu"
                  aria-label={dict.a11y.toggleServices}
                  onClick={() => setServicesOpen((open) => !open)}
                >
                  <FaChevronDown className={styles.arrow} aria-hidden />
                </button>
              </div>
              <div className={styles.megaMenu} id="servicesMenu">
                <div className={styles.megaContent}>
                  <h4>{dict.nav.ourServices}</h4>
                  <ul className={styles.servicesList}>
                    {serviceIds.map((id) => {
                      const Icon = serviceIcons[id];
                      return (
                        <li key={id}>
                          <a href={`#${serviceAnchor(id)}`} onClick={closeAll}>
                            <Icon aria-hidden /> {dict.serviceTitles[id]}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </li>
            <li className={styles.navItem}>
              <a href="#about" onClick={closeAll} {...current("about")}>
                {dict.nav.about}
              </a>
            </li>
            <li className={styles.navItem}>
              <a href="#contact" onClick={closeAll} {...current("contact")}>
                {dict.nav.contact}
              </a>
            </li>
          </ul>
        </nav>

        <div className={styles.utils}>
          <nav className={styles.langSwitch} aria-label={dict.a11y.languages}>
            {switcherOrder.map((l) => (
              <Link
                key={l}
                href={localePath(l)}
                hrefLang={l}
                title={dict.languageNames[l]}
                className={`${styles.langPill} ${l === locale ? styles.langActive : ""}`}
                aria-current={l === locale ? "page" : undefined}
              >
                {localeLabels[l]}
              </Link>
            ))}
          </nav>
          <div className={styles.socials}>
            <ExternalLink
              href={contacts.telegram}
              className={`${styles.social} ${styles.telegram}`}
              aria-label="Telegram"
            >
              <FaTelegram aria-hidden />
            </ExternalLink>
            <ExternalLink
              href={contacts.whatsapp}
              className={`${styles.social} ${styles.whatsapp}`}
              aria-label="WhatsApp"
            >
              <FaWhatsapp aria-hidden />
            </ExternalLink>
          </div>
          <button
            type="button"
            className={styles.menuToggle}
            aria-controls="mainNav"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? dict.a11y.closeMenu : dict.a11y.openMenu}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <FaXmark aria-hidden /> : <FaBars aria-hidden />}
          </button>
        </div>
      </div>
    </header>
  );
}
