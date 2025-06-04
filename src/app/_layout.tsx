import { AuthProvider } from "@/context/AuthContext";
import { Slot } from "expo-router";
import { PaperProvider, useTheme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SystemUI from "expo-system-ui";
import { ThemeProvider, useThemeContext } from "@/context/ThemeContext";
import { StatusBar } from "react-native";

import * as Font from "expo-font";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect } from "react";

function RootInnerLayout() {
  const { theme, isDark } = useThemeContext();
  const themeColor = useTheme();

  SystemUI.setBackgroundColorAsync(!isDark ? "#fff" : "transparent");
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
