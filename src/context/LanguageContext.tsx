import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

type LanguageContextType = {
  languagePreference: number;
  toggleLanguage: (value: number) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  languagePreference: 0,
  toggleLanguage: () => {},
});

export const useLanguageContext = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [languagePreference, setLanguagePreference] = useState(0);
  const { i18n } = useTranslation();

  useEffect(() => {
    loadLanguagePreference();
  }, []);

  useEffect(() => {
    handleLanguageChange();
  }, [languagePreference]);

  const loadLanguagePreference = async () => {
    try {
      const value = await AsyncStorage.getItem("@language_preference");
      if (value !== null && Number(value) <= 2) {
        setLanguagePreference(Number(value));
      }
    } catch (error) {
      console.error("Error loading language preference:", error);
    }
  };

  const handleLanguageChange = async () => {
    try {
      let targetLanguage = "en";

      switch (languagePreference) {
        case 0:
          const locales = Localization.getLocales();
          targetLanguage = locales[0]?.languageCode || "en";
          if (!["en", "pt"].includes(targetLanguage)) {
            targetLanguage = "en";
          }
          break;
        case 1:
          targetLanguage = "en";
          break;
        case 2:
          targetLanguage = "pt";
          break;
      }

      await i18n.changeLanguage(targetLanguage);
      await AsyncStorage.setItem(
        "@language_preference",
        languagePreference.toString()
      );
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  const toggleLanguage = (value: number) => {
    setLanguagePreference(value);
  };

  return (
    <LanguageContext.Provider value={{ languagePreference, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
