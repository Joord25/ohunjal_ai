"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import ko from "@/locales/ko.json";
import en from "@/locales/en.json";

export type Locale = "ko" | "en";

const translations: Record<Locale, Record<string, string>> = { ko, en };

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: "ko",
  setLocale: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // 회의 2026-04-28: SSR-safe — 초기값은 항상 "ko" (SSR HTML과 일치). mount 후 localStorage 읽어 갱신.
  // useState lazy init에서 localStorage 읽으면 React 19에서 hydration mismatch (#418) 발화.
  const [locale, setLocaleState] = useState<Locale>("ko");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("ohunjal_language") as Locale | null;
    if (stored === "ko" || stored === "en") {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("ohunjal_language", newLocale);
  }, []);

  const t = useCallback((key: string, vars?: Record<string, string>) => {
    const localeVal = translations[locale]?.[key];
    let text = localeVal !== undefined ? localeVal : (translations.ko[key] ?? key);
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, "g"), v);
      });
    }
    return text;
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
