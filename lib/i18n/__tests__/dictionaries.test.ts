import { describe, expect, it } from "vitest";
import { defaultLocale, isLocale, localePath, locales } from "@/lib/i18n/config";
import { getDictionary, toHeaderDictionary } from "@/lib/i18n";
import { serviceIds } from "@/lib/site";

function keyPaths(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object") return [prefix];
  return Object.entries(value as Record<string, unknown>)
    .flatMap(([key, child]) => keyPaths(child, prefix ? `${prefix}.${key}` : key))
    .sort();
}

function leafValues(value: unknown): unknown[] {
  if (value === null || typeof value !== "object") return [value];
  return Object.values(value as Record<string, unknown>).flatMap(leafValues);
}

describe("locale config", () => {
  it("has Georgian as the default locale", () => {
    expect(locales).toEqual(["ka", "en", "ru"]);
    expect(defaultLocale).toBe("ka");
  });

  it("maps locales to their canonical paths", () => {
    expect(localePath("ka")).toBe("/");
    expect(localePath("en")).toBe("/en");
    expect(localePath("ru")).toBe("/ru");
  });

  it("recognises only supported locales", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("de")).toBe(false);
    expect(isLocale("")).toBe(false);
  });
});

describe("dictionaries", () => {
  const reference = keyPaths(getDictionary(defaultLocale));

  it.each(locales)("%s has the same keys as the Georgian dictionary", (locale) => {
    expect(keyPaths(getDictionary(locale))).toEqual(reference);
  });

  it.each(locales)("%s has no empty strings", (locale) => {
    for (const leaf of leafValues(getDictionary(locale))) {
      expect(typeof leaf).toBe("string");
      expect((leaf as string).trim()).not.toBe("");
    }
  });

  it.each(locales)("%s has a title and description for every service", (locale) => {
    const { items } = getDictionary(locale).services;
    expect(Object.keys(items).sort()).toEqual([...serviceIds].sort());
  });

  it("writes the Russian address entirely in Cyrillic", () => {
    const { address } = getDictionary("ru").contact;
    expect(address.value).toBe("Тбилиси, ул. Важа-Пшавела 45");
    expect(address.value).not.toMatch(/[A-Za-zႠ-ჿ]/);
  });

  it("builds the header dictionary from the full one", () => {
    const dict = getDictionary("en");
    const header = toHeaderDictionary(dict);
    expect(header.nav).toBe(dict.nav);
    expect(header.a11y).toBe(dict.a11y);
    expect(header.serviceTitles.cfo).toBe(dict.services.items.cfo.title);
  });
});
