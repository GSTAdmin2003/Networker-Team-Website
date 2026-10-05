import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "@/components/Hero/Hero";
import { getDictionary } from "@/lib/i18n";

const dict = getDictionary("en");

describe("Hero", () => {
  it("opens WhatsApp with a prefilled greeting as the primary action", () => {
    render(<Hero dict={dict} />);
    const cta = screen.getByRole("link", { name: dict.hero.ctaPrimary });
    const url = new URL(cta.getAttribute("href")!);
    expect(url.origin + url.pathname).toBe("https://wa.me/995597147210");
    expect(url.searchParams.get("text")).toBe(dict.whatsapp.greeting);
    expect(cta).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("links the secondary action to the services section", () => {
    render(<Hero dict={dict} />);
    expect(screen.getByRole("link", { name: dict.hero.ctaSecondary })).toHaveAttribute(
      "href",
      "#services",
    );
  });

  it("offers phone, WhatsApp and Telegram in the quick-contact panel", () => {
    render(<Hero dict={dict} />);
    const panel = screen.getByRole("complementary", { name: dict.hero.panelTitle });
    const hrefs = within(panel)
      .getAllByRole("link")
      .map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual([
      "tel:+995597147210",
      expect.stringMatching(/^https:\/\/wa\.me\/995597147210/),
      "https://t.me/+995597205252",
    ]);
  });
});
