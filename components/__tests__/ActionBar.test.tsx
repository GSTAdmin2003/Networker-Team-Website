import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ActionBar } from "@/components/ActionBar/ActionBar";
import { getDictionary } from "@/lib/i18n";

const dict = getDictionary("ka");

describe("ActionBar", () => {
  it("offers call and WhatsApp", () => {
    render(<ActionBar dict={dict} />);
    expect(screen.getByRole("link", { name: dict.actionBar.call })).toHaveAttribute(
      "href",
      "tel:+995597147210",
    );
    const wa = screen.getByRole("link", { name: dict.actionBar.whatsapp });
    expect(new URL(wa.getAttribute("href")!).searchParams.get("text")).toBe(dict.whatsapp.greeting);
    expect(wa).toHaveAttribute("rel", "noopener noreferrer");
  });
});
