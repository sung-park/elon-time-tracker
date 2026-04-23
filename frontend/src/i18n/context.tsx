"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import ko, { type Translations } from "./ko";
import en from "./en";

type Lang = "ko" | "en";

interface I18nContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType>({
  lang: "ko",
  setLang: () => {},
  t: ko,
});

const translations: Record<Lang, Translations> = { ko, en };

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ko");
  return (
    <I18nContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
