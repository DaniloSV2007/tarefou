import { AuthProvider } from "@/context/AuthContext";
import { Slot } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useThemeContext } from "@/context/ThemeContext";
import { StatusBar } from "react-native";
import * as SystemUI from "expo-system-ui";
import * as Font from "expo-font";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";

function RootInnerLayout() {
  const { theme, isDark } = useThemeContext();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(isDark ? "#000" : "#fff");
  }, [isDark]);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(isDark ? "#000" : "#fff");
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <StatusBar
            barStyle={!isDark ? "dark-content" : "light-content"}
            backgroundColor={!isDark ? "#fff" : "#000"}
          />
          <Slot />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  useEffect(() => {
    Font.loadAsync(MaterialCommunityIcons.font);
  }, []);
  return (
    <ThemeProvider>
      <RootInnerLayout />
    </ThemeProvider>
  );
}
