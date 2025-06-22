import "@/i18n";
import { AuthProvider } from "@/context/AuthContext";
import { Slot, Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useThemeContext } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { StatusBar, View } from "react-native";
import * as SystemUI from "expo-system-ui";
import * as Font from "expo-font";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Text, ActivityIndicator } from "react-native";
import { SQLiteProvider } from "expo-sqlite";
import { setupDB } from "@/database/setupDB";
import { deleteDatabase } from "@/database/deleteDatabase";
import { resetDatabase } from "@/database/resetDatabase";
import { useAppTheme } from "@/hooks/useAppTheme";

function RootInnerLayout() {
  const { theme, isDark } = useThemeContext();
  const appTheme = useAppTheme();

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
    <SQLiteProvider databaseName="tarefou.db" onInit={setupDB}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <LanguageProvider>
            <AuthProvider>
              <StatusBar
                barStyle={isDark ? "light-content" : "dark-content"}
                backgroundColor={isDark ? "#000" : "#fff"}
              />
              <View
                style={{ backgroundColor: appTheme.colors.background, flex: 1 }}
              >
                <Stack
                  screenOptions={{
                    headerShown: false,
                    animation: "none",
                    contentStyle: {
                      backgroundColor: appTheme.colors.background,
                    },
                  }}
                />
              </View>
            </AuthProvider>
          </LanguageProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </SQLiteProvider>
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
