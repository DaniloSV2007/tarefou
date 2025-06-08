import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { resources } from "@/i18n";

type TranslationKeys = keyof typeof resources.en.translation;
type ComponentKeys = keyof typeof resources.en.components;
type ScreenKeys = keyof typeof resources.en.screens;

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${"" extends P ? "" : "."}${P}`
    : never
  : never;

type Paths<T> = T extends object
  ? {
      [K in keyof T]: K extends string | number
        ? K | Join<K, Paths<T[K]>>
        : never;
    }[keyof T]
  : never;

type TranslationNestedKeys = Paths<typeof resources.en.translation>;
type ComponentNestedKeys = Paths<typeof resources.en.components>;
type ScreenNestedKeys = Paths<typeof resources.en.screens>;

export const useTranslations = () => {
  const { t } = useTranslation();

  const translate = {
    t: (key: TranslationNestedKeys, options?: any) => t(key, options),

    tc: (key: ComponentNestedKeys, options?: any) =>
      t(`components:${key}`, options),

    ts: (key: ScreenNestedKeys, options?: any) => t(`screens:${key}`, options),

    changeLanguage: (lang: "en" | "pt") => {
      return i18n.changeLanguage(lang);
    },

    getCurrentLanguage: () => i18n.language,

    toggleLanguage: () => {
      const currentLang = i18n.language;
      const newLang = currentLang === "en" ? "pt" : "en";
      return i18n.changeLanguage(newLang);
    },
  };

  return translate;
};
