import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Header } from "@/components/Header/Header";
import { getDictionary, toHeaderDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

function setup(locale: Locale = "en") {
  const dict = toHeaderDictionary(getDictionary(locale));
  const user = userEvent.setup();
  const utils = render(<Header locale={locale} dict={dict} />);
  const toggle = screen.getByRole("button", { name: dict.a11y.openMenu });
  return { ...utils, dict, user, toggle };
}

describe("Header mobile menu", () => {
  it("toggles aria-expanded and its label", async () => {
    const { dict, user, toggle } = setup();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveAttribute("aria-controls", "mainNav");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAccessibleName(dict.a11y.closeMenu);

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("flags the open menu on <html> only while it is open", async () => {
    const { user, toggle, unmount } = setup();
    const root = document.documentElement;
    expect(root).not.toHaveAttribute("data-menu-open");
    await user.click(toggle);
    expect(root).toHaveAttribute("data-menu-open");
    await user.click(toggle);
    expect(root).not.toHaveAttribute("data-menu-open");
    await user.click(toggle);
    unmount();
    expect(root).not.toHaveAttribute("data-menu-open");
  });

  it("closes on Escape", async () => {
    const { user, toggle } = setup();
    await user.click(toggle);
    await user.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("closes when a nav link is followed", async () => {
    const { dict, user, toggle } = setup();
    await user.click(toggle);
    await user.click(screen.getByRole("link", { name: dict.nav.about }));
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});

describe("Header services menu", () => {
  it("lists every service and has a disclosure button", async () => {
    const { dict, user, container } = setup();
    for (const [id, title] of Object.entries(dict.serviceTitles)) {
      expect(screen.getByRole("link", { name: title })).toHaveAttribute("href", `#service-${id}`);
    }
    const disclosure = screen.getByRole("button", { name: dict.a11y.toggleServices });
    expect(disclosure).toHaveAttribute("aria-expanded", "false");
    await user.click(disclosure);
    expect(disclosure).toHaveAttribute("aria-expanded", "true");
    expect(container.querySelector(".hasMegaMenu")).toHaveClass("open");
  });

  it("dismisses the mega menu on Escape even while it is hovered or focused", async () => {
    const { dict, user, container } = setup();
    const item = container.querySelector(".hasMegaMenu")!;
    screen.getByRole("link", { name: dict.serviceTitles.cfo }).focus();
    await user.keyboard("{Escape}");
    expect(item).toHaveClass("dismissed");
  });

  it("returns focus to the Services link when Escape hides the mega menu", async () => {
    const { dict, user } = setup();
    screen.getByRole("link", { name: dict.serviceTitles.cfo }).focus();
    await user.keyboard("{Escape}");
    expect(screen.getByRole("link", { name: dict.nav.services })).toHaveFocus();
  });

  it("re-arms the mega menu once the pointer leaves", async () => {
    const { dict, user, container } = setup();
    const item = container.querySelector(".hasMegaMenu")!;
    await user.hover(screen.getByRole("link", { name: dict.nav.services }));
    await user.keyboard("{Escape}");
    expect(item).toHaveClass("dismissed");
    await user.unhover(item);
    expect(item).not.toHaveClass("dismissed");
  });
});

describe("Header language switch", () => {
  it("links to each locale's canonical path and marks the current one", () => {
    setup("ru");
    const nav = screen.getByRole("navigation", { name: getDictionary("ru").a11y.languages });
    const links = Array.from(nav.querySelectorAll("a"));
    expect(links.map((a) => [a.textContent, a.getAttribute("href")])).toEqual([
      ["GE", "/"],
      ["RU", "/ru"],
      ["EN", "/en"],
    ]);
    expect(links[1]).toHaveAttribute("aria-current", "page");
    expect(links[0]).not.toHaveAttribute("aria-current");
    expect(links.map((a) => a.getAttribute("title"))).toEqual(["ქართული", "Русский", "English"]);
  });

  it("opens messengers safely in a new tab", () => {
    const { container } = setup();
    const external = container.querySelectorAll('a[target="_blank"]');
    expect(external.length).toBe(2);
    external.forEach((a) => expect(a).toHaveAttribute("rel", "noopener noreferrer"));
  });
});
