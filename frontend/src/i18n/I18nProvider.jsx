import { createContext, useContext, useMemo, useState } from "react";
import ptBR from "./messages/pt-BR";

const dictionaries = {
  "pt-BR": ptBR
};

const I18nContext = createContext({
  locale: "pt-BR",
  setLocale: () => undefined,
  t: (key) => key,
  availableLocales: ["pt-BR"]
});

export function I18nProvider({ children, defaultLocale = "pt-BR" }) {
  const [locale, setLocale] = useState(defaultLocale);

  const value = useMemo(() => {
    const dictionary = dictionaries[locale] || dictionaries["pt-BR"];

    return {
      locale,
      setLocale,
      t: (key) => dictionary[key] || key,
      availableLocales: Object.keys(dictionaries)
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18nContext() {
  return useContext(I18nContext);
}
