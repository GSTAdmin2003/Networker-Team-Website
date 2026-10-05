import { describe, expect, it } from "vitest";
import { contacts, serviceAnchor, whatsappUrl } from "@/lib/site";

describe("whatsappUrl", () => {
  it("is the plain chat link without text", () => {
    expect(whatsappUrl()).toBe(contacts.whatsapp);
    expect(whatsappUrl()).toBe("https://wa.me/995597147210");
  });

  it("prefills an encoded message", () => {
    const url = new URL(whatsappUrl("გამარჯობა & hi"));
    expect(url.origin + url.pathname).toBe("https://wa.me/995597147210");
    expect(url.searchParams.get("text")).toBe("გამარჯობა & hi");
    expect(url.search).not.toContain(" ");
  });
});

describe("serviceAnchor", () => {
  it("prefixes the service id", () => {
    expect(serviceAnchor("cfo")).toBe("service-cfo");
  });
});
