import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import enIndex from "@/locales/en/index.json";
import ptIndex from "@/locales/pt/index.json";
import enComponents from "@/locales/en/components.json";
import ptComponents from "@/locales/pt/components.json";
import enScreens from "@/locales/en/screens.json";
import ptScreens from "@/locales/pt/screens.json";

const locales = Localization.getLocales();
const deviceLanguage = locales.length > 0 ? locales[0].languageCode : "en";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  lng: deviceLanguage ?? "en",
  fallbackLng: "en",
  resources: {
    en: {
      translation: enIndex,
      components: enComponents,
      screens: enScreens,
    },
    pt: {
      translation: ptIndex,
      components: ptComponents,
      screens: ptScreens,
    },
  },
  interpolation: {
    escapeValue: false,
  },
  ns: ["translation", "components", "screens"],
  defaultNS: "translation",
});

export default i18n;
