import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { About } from "@/components/About/About";
import { Contact } from "@/components/Contact/Contact";
import { Footer } from "@/components/Footer/Footer";
import { Services } from "@/components/Services/Services";
import { getDictionary } from "@/lib/i18n";
import { serviceIds } from "@/lib/site";

const dict = getDictionary("en");

describe("Services", () => {
  it("renders the six services in the canonical order", () => {
    render(<Services dict={dict} />);
    const titles = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(titles).toEqual(serviceIds.map((id) => dict.services.items[id].title));
  });

  it("is the #services anchor target", () => {
    const { container } = render(<Services dict={dict} />);
    expect(container.querySelector("section#services")).not.toBeNull();
  });

  it("gives every service its own anchor and a prefilled WhatsApp question", () => {
    const { container } = render(<Services dict={dict} />);
    for (const id of serviceIds) {
      const row = container.querySelector(`#service-${id}`) as HTMLElement;
      expect(row).not.toBeNull();
      const ask = within(row).getByRole("link", { name: new RegExp(dict.services.askLink) });
      const text = new URL(ask.getAttribute("href")!).searchParams.get("text");
      expect(text).toBe(`${dict.whatsapp.aboutService} ${dict.services.items[id].title}`);
    }
  });

  it("offers call and Telegram as alternatives to WhatsApp", () => {
    render(<Services dict={dict} />);
    expect(screen.getByRole("link", { name: dict.services.orCall })).toHaveAttribute(
      "href",
      "tel:+995597147210",
    );
    expect(screen.getByRole("link", { name: dict.services.orTelegram })).toHaveAttribute(
      "href",
      "https://t.me/+995597205252",
    );
  });

  it("opens every external link safely", () => {
    const { container } = render(<Services dict={dict} />);
    const external = container.querySelectorAll('a[target="_blank"]');
    expect(external.length).toBe(serviceIds.length + 2);
    external.forEach((a) => expect(a).toHaveAttribute("rel", "noopener noreferrer"));
  });
});

describe("Contact", () => {
  it("leads with three direct channels: WhatsApp, Telegram, phone", () => {
    render(<Contact dict={dict} />);
    const primary = screen.getByRole("list", { name: dict.contact.primaryTitle });
    const hrefs = within(primary)
      .getAllByRole("link")
      .map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual([
      expect.stringMatching(/^https:\/\/wa\.me\/995597147210\?text=/),
      "https://t.me/+995597205252",
      "tel:+995597147210",
    ]);
  });

  it("links the email and shows the address", () => {
    render(<Contact dict={dict} />);
    expect(screen.getByRole("link", { name: "info@networkerteam.ge" })).toHaveAttribute(
      "href",
      "mailto:info@networkerteam.ge",
    );
    expect(screen.getByText(dict.contact.address.value)).toBeInTheDocument();
  });

  it("has named social buttons", () => {
    render(<Contact dict={dict} />);
    for (const name of ["Viber", "Instagram", "Facebook", "LinkedIn"]) {
      expect(screen.getByRole("link", { name })).toBeInTheDocument();
    }
  });

  it("opens every external link safely in a new tab", () => {
    const { container } = render(<Contact dict={dict} />);
    const external = container.querySelectorAll('a[target="_blank"]');
    expect(external.length).toBe(6);
    external.forEach((a) => expect(a).toHaveAttribute("rel", "noopener noreferrer"));
  });
});

describe("About", () => {
  it("lists the three principles and offers WhatsApp", () => {
    render(<About dict={dict} />);
    for (const principle of dict.about.principles) {
      expect(screen.getByRole("heading", { name: principle.title })).toBeInTheDocument();
    }
    const cta = screen.getByRole("link", { name: dict.hero.ctaPrimary });
    expect(cta.getAttribute("href")).toMatch(/^https:\/\/wa\.me\/995597147210\?text=/);
  });
});

describe("Footer", () => {
  it("links phone and email and lists every service", () => {
    render(<Footer dict={dict} />);
    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByRole("link", { name: /597 14 72 10/ })).toHaveAttribute(
      "href",
      "tel:+995597147210",
    );
    expect(within(footer).getByRole("link", { name: /info@networkerteam\.ge/ })).toHaveAttribute(
      "href",
      "mailto:info@networkerteam.ge",
    );
    for (const id of serviceIds) {
      expect(within(footer).getByText(dict.services.items[id].footerLabel)).toBeInTheDocument();
    }
  });
});
