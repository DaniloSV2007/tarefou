import ThemeSection from "@/components/ThemeSection";
import TopBar from "@/components/TopBar";
import { useAuth } from "@/context/AuthContext";
import { useThemeContext } from "@/context/ThemeContext";
import { StyleSheet, View } from "react-native";
import { Button, useTheme } from "react-native-paper";
import React, { useEffect } from "react";
import * as SystemUI from "expo-system-ui";

export default function Settings() {
  const theme = useTheme();
  const { isDark } = useThemeContext();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(isDark ? "#000" : "#fff");
  }, [isDark]);

  return (
    <>
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <TopBar
          title="Settings"
          titleColor={theme.colors.onBackground}
          isBackButtonEnable={true}
          backButtonColor={theme.colors.onBackground}
          barColor={theme.colors.background}
        />
        <View style={styles.content}>
          <ThemeSection />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignItems: "center",
    marginTop: 10,
  },
});
