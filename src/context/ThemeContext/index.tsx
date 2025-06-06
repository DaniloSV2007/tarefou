import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Appearance, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightTheme } from "@/themes/light";
import { darkTheme } from "@/themes/dark";
import { ThemeBase } from "react-native-paper";

type ThemePreference = 0 | 1 | 2; // 0 = system, 1 = light, 2 = dark

interface ThemeContextType {
  theme: ThemeBase;
  toggleTheme: (mode?: ThemePreference) => void;
  isDark: boolean;
  themePreference: ThemePreference;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [themePreference, setThemePreference] = useState<ThemePreference>(0);
  const [isDark, setIsDark] = useState(false);

  // Carrega a preferência salva
  useEffect(() => {
    const loadThemePref = async () => {
      const stored = await AsyncStorage.getItem("theme");
      if (stored !== null) {
        setThemePreference(parseInt(stored, 10) as ThemePreference);
      }
    };
    loadThemePref();
  }, []);

  // Atualiza o tema com base na preferência ou no sistema
  useEffect(() => {
    const effectiveDark =
      themePreference === 0
        ? systemColorScheme === "dark"
        : themePreference === 2;

    setIsDark(effectiveDark);
  }, [themePreference, systemColorScheme]);

  useEffect(() => {
    Appearance.addChangeListener(({ colorScheme }) => {
      const effectiveDark =
        themePreference === 0
          ? systemColorScheme === "dark"
          : themePreference === 2;

      setIsDark(effectiveDark);
    });
  }, []);

  // Alterna o tema manualmente
  const toggleTheme = async (mode?: ThemePreference) => {
    const newPref = mode ?? (isDark ? 1 : 2); // alterna entre claro/escuro se não especificado
    await AsyncStorage.setItem("theme", newPref.toString());
    setThemePreference(newPref);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, isDark, themePreference }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }
  return ctx;
};
