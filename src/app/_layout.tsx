import { AuthProvider } from "@/context/AuthContext";
import { Slot } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useThemeContext } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { StatusBar } from "react-native";
import * as SystemUI from "expo-system-ui";
import * as Font from "expo-font";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Text, ActivityIndicator } from "react-native";

function RootInnerLayout() {
  const { theme, isDark } = useThemeContext();

  useEffect(() => {
    const updateSystemUI = async () => {
      try {
        await SystemUI.setBackgroundColorAsync(isDark ? "#000" : "#fff");
      } catch (error) {
        console.error("Error updating system UI:", error);
      }
    };
    updateSystemUI();
  }, [isDark]);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <LanguageProvider>
          <AuthProvider>
            <StatusBar
              barStyle={!isDark ? "dark-content" : "light-content"}
              backgroundColor={!isDark ? "#fff" : "#000"}
            />
            <Slot />
          </AuthProvider>
        </LanguageProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  const [isFontsLoaded, setIsFontsLoaded] = useState(false);
  const [fontError, setFontError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync(MaterialCommunityIcons.font);
        setIsFontsLoaded(true);
        setFontError(null);
      } catch (error) {
        console.error("Error loading fonts:", error);
        setFontError("Failed to load fonts");
      }
    }
    loadFonts();
  }, []);

  if (fontError) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <PaperProvider>
          <Text style={{ color: "red", padding: 20 }}>
            {fontError}. Some icons might not display correctly.
          </Text>
        </PaperProvider>
      </SafeAreaProvider>
    );
  }

  if (!isFontsLoaded) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <PaperProvider>
          <ActivityIndicator size="large" style={{ flex: 1 }} />
        </PaperProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <ThemeProvider>
      <RootInnerLayout />
    </ThemeProvider>
  );
}
