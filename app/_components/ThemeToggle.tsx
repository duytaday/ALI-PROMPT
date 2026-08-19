"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { Locale } from "../../lib/i18n";
import { getMessages } from "../../lib/i18n";

type ThemePreference = "light" | "dark" | "system";

const storageKey = "aliprompt-theme-preference";

function isThemePreference(value: string | null): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

function readPreference(): ThemePreference {
  const saved = window.localStorage.getItem(storageKey);
  return isThemePreference(saved) ? saved : "system";
}

function applyTheme(preference: ThemePreference) {
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolved = preference === "system" ? (systemDark ? "dark" : "light") : preference;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.themePreference = preference;
  document.documentElement.style.colorScheme = resolved;
}

function ThemeIcon({ preference }: { preference: ThemePreference }) {
  if (preference === "light") return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="3.5" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" /></svg>;
  if (preference === "dark") return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19 15.2A7.6 7.6 0 0 1 8.8 5 7.7 7.7 0 1 0 19 15.2Z" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="4" y="5" width="16" height="11" rx="1.5" /><path d="M9 20h6M12 16v4" /></svg>;
}

export default function ThemeToggle({ locale }: { locale: Locale }) {
  const preference = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("storage", onStoreChange);
      window.addEventListener("aliprompt-theme-change", onStoreChange);
      return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener("aliprompt-theme-change", onStoreChange);
      };
    },
    readPreference,
    () => "system" as ThemePreference,
  );
  const copy = getMessages(locale).theme;

  useEffect(() => {
    applyTheme(preference);
    if (preference !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => applyTheme("system");
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [preference]);

  function select(next: ThemePreference) {
    window.localStorage.setItem(storageKey, next);
    applyTheme(next);
    window.dispatchEvent(new Event("aliprompt-theme-change"));
  }

  const nextPreference: ThemePreference = preference === "light" ? "dark" : preference === "dark" ? "system" : "light";
  const label = `${copy.label}: ${copy[preference]}. ${copy[nextPreference]}`;

  return <div className="theme-toggle">
    <button type="button" aria-label={label} title={label} onClick={() => select(nextPreference)}><ThemeIcon preference={preference} /></button>
  </div>;
}
