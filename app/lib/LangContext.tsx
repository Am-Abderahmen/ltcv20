"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { Lang, translations } from "./translations";

// Use a loose type so FR and DE translations are both assignable
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyTranslation = any;

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: AnyTranslation;
}

const LangContext = createContext<LangCtx>({
  lang: "FR",
  setLang: () => {},
  t: translations.FR,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("FR");
  const t = translations[lang] as AnyTranslation;
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
