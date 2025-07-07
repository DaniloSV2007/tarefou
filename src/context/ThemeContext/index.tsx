import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { Appearance, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightTheme } from "@/themes/light";
import { darkTheme } from "@/themes/dark";
import { ThemeBase } from "react-native-paper";

type ThemePreference = 0 | 1 | 2;

interface ThemeContextType {
  theme: ThemeBase;
  toggleTheme: (mode?: ThemePreference) => Promise<void>;
  isDark: boolean;
  themePreference: ThemePreference;
  error: string | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [themePreference, setThemePreference] = useState<ThemePreference>(0);
  const [isDark, setIsDark] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadThemePref = async () => {
      try {
        const stored = await AsyncStorage.getItem("theme");
        console.log(stored);
        if (stored !== null && isMounted) {
          const parsed = parseInt(stored, 10);
          if ([0, 1, 2].includes(parsed)) {
            setThemePreference(parsed as ThemePreference);
          }
        }
        if (isMounted) {
          setError(null);
        }
      } catch (error) {
        console.error("Error loading theme preference:", error);
        if (isMounted) {
          setError("Failed to load theme preference");
        }
      }
    };

    loadThemePref();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const effectiveDark =
      themePreference === 0
        ? systemColorScheme === "dark"
        : themePreference === 2;

    setIsDark(effectiveDark);
  }, [themePreference, systemColorScheme]);

  useEffect(() => {
    const effectiveDark =
      themePreference === 0
        ? systemColorScheme === "dark"
        : themePreference === 2;

    setIsDark(effectiveDark);
  }, [themePreference, systemColorScheme]);

  const toggleTheme = async (mode?: ThemePreference) => {
    try {
      let newPref: ThemePreference;

      if (mode !== undefined) {
        newPref = mode;
      } else {
        newPref = themePreference === 2 ? 1 : 2;
      }

      await AsyncStorage.setItem("theme", newPref.toString());
      setThemePreference(newPref);
      setError(null);
    } catch (error) {
      console.error("Error saving theme preference:", error);
      setError("Failed to save theme preference");
    }
  };

  const theme = useMemo(() => {
    try {
      const baseTheme = isDark ? darkTheme : lightTheme;
      return {
        ...baseTheme,
        colors: {
          ...baseTheme.colors,
          secondaryContainer: "transparent",
        },
      };
    } catch {
      return lightTheme;
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, isDark, themePreference, error }}
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
