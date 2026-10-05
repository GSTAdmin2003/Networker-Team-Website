import { describe, expect, it } from "vitest";
import { buildMetadata } from "@/lib/i18n/metadata";
import { getDictionary } from "@/lib/i18n";

describe("buildMetadata", () => {
  it("points the Georgian canonical at the root, never /ka", () => {
    const meta = buildMetadata("ka");
    expect(meta.alternates?.canonical).toBe("/");
  });

  it("uses the locale path as canonical for other locales", () => {
    expect(buildMetadata("en").alternates?.canonical).toBe("/en");
    expect(buildMetadata("ru").alternates?.canonical).toBe("/ru");
  });

  it("lists every language alternate plus x-default", () => {
    expect(buildMetadata("en").alternates?.languages).toEqual({
      ka: "/",
      en: "/en",
      ru: "/ru",
      "x-default": "/",
    });
  });

  it("uses the locale's dictionary for title and description", () => {
    const dict = getDictionary("ru");
    const meta = buildMetadata("ru");
    expect(meta.title).toBe(dict.meta.title);
    expect(meta.description).toBe(dict.meta.description);
    expect(meta.openGraph).toMatchObject({ locale: "ru_RU", siteName: "NETWORKER" });
  });

  it("resolves relative URLs against the configured site origin", () => {
    expect(String(buildMetadata("ka").metadataBase)).toBe("http://localhost:3000/");
  });
});
