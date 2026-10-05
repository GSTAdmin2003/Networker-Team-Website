"use client";

import { useEffect, useState } from "react";

/** Top-level page sections, in document order. Service rows count as "services". */
export const sectionOrder = ["hero", "services", "about", "contact"] as const;

export type SectionId = (typeof sectionOrder)[number];

/**
 * Decides the active section. Page bottom always wins (the last section can
 * be shorter than the observer band); otherwise the last intersecting
 * section in document order; otherwise keep what we had.
 */
export function pickActive(
  intersecting: ReadonlySet<string>,
  atBottom: boolean,
  previous: SectionId,
): SectionId {
  if (atBottom) return "contact";
  for (let i = sectionOrder.length - 1; i >= 0; i--) {
    if (intersecting.has(sectionOrder[i])) return sectionOrder[i];
  }
  return previous;
}

function isAtBottom() {
  const { scrollY, innerHeight } = window;
  return scrollY > 0 && scrollY + innerHeight >= document.documentElement.scrollHeight - 2;
}

/** Scroll-spy for the header navigation. */
export function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>("hero");

  useEffect(() => {
    // No observer (very old browsers, jsdom): leave the nav without a highlight.
    if (typeof IntersectionObserver === "undefined") return;
    // IntersectionObserver only reports changes, so keep the full set here.
    const intersecting = new Set<string>();
    const reconcile = () => setActive((prev) => pickActive(intersecting, isAtBottom(), prev));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target.id);
          else intersecting.delete(entry.target.id);
        }
        reconcile();
      },
      // A thin band ~40% down the viewport: whatever crosses it is "current".
      { rootMargin: "-35% 0px -60% 0px" },
    );

    for (const id of sectionOrder) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    window.addEventListener("scroll", reconcile, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", reconcile);
    };
  }, []);

  return active;
}
