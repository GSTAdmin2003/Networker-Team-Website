import { serviceIds } from "@/lib/site";
import type { Locale } from "./config";
import { en } from "./dictionaries/en";
import { ka } from "./dictionaries/ka";
import { ru } from "./dictionaries/ru";
import type { Dictionary, HeaderDictionary } from "./types";

const dictionaries: Record<Locale, Dictionary> = { ka, en, ru };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function toHeaderDictionary(dict: Dictionary): HeaderDictionary {
  return {
    nav: dict.nav,
    a11y: dict.a11y,
    languageNames: dict.languageNames,
    serviceTitles: Object.fromEntries(
      serviceIds.map((id) => [id, dict.services.items[id].title]),
    ) as HeaderDictionary["serviceTitles"],
  };
}

export type { Dictionary, HeaderDictionary } from "./types";
