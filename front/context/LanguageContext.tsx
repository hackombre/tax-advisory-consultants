"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "fr" | "en";

type LanguageContextValue = {
  lang: Language;
  setLanguage: (value: Language) => void;
  toggleLanguage: () => void;
};

const defaultContextValue: LanguageContextValue = {
  lang: "fr",
  setLanguage: () => undefined,
  toggleLanguage: () => undefined,
};

const LanguageContext = createContext<LanguageContextValue>(defaultContextValue);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("fr");

  useEffect(() => {
    const saved = window.localStorage.getItem("lang") as Language | null;
    if (saved === "fr" || saved === "en") {
      setLang(saved);
      return;
    }

    const browserLang = window.navigator.language?.toLowerCase().startsWith("en") ? "en" : "fr";
    setLang(browserLang as Language);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLanguage: (value: Language) => setLang(value),
      toggleLanguage: () => setLang((current) => (current === "fr" ? "en" : "fr")),
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
