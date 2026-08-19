import { en } from "../messages/en/common";
import { vi } from "../messages/vi/common";

export const locales = ["vi", "en"] as const;

export type Locale = (typeof locales)[number];

export function isLocale(value: string | null | undefined): value is Locale {
  return Boolean(value && locales.includes(value as Locale));
}

export function localeFromPathname(pathname: string): Locale | null {
  const segment = pathname.split("/")[1];
  return isLocale(segment) ? segment : null;
}

export type MessageShape<T> = T extends string ? string : { [K in keyof T]: MessageShape<T[K]> };

export const messages = { vi, en } as const satisfies Record<Locale, MessageShape<typeof vi>>;

export type Messages = (typeof messages)[Locale];

export function getMessages(locale: Locale) {
  return messages[locale];
}
