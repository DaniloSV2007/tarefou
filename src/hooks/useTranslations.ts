import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

export const useTranslations = () => {
  const { t } = useTranslation(["translation", "components", "screens"]);

  const translate = {
    t: (key: string, options?: any) => t(key, options),

    tc: (key: string, options?: any) => t(`components:${key}`, options),

    ts: (key: string, options?: any) => t(`screens:${key}`, options),

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
