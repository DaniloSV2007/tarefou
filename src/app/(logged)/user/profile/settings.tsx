import ThemeSection from "@/components/ThemeSection";
import LanguageSection from "@/components/LanguageSection";
import TopBar from "@/components/TopBar";
import { useAuth } from "@/context/AuthContext";
import { useThemeContext } from "@/context/ThemeContext";
import { StyleSheet, View } from "react-native";
import { Button, useTheme } from "react-native-paper";
import React, { useEffect } from "react";
import * as SystemUI from "expo-system-ui";
import { useTranslation } from "react-i18next";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";

export default function Settings() {
  const theme = useTheme();
  const { isDark } = useThemeContext();
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(isDark ? "#000" : "#fff");
  }, [isDark]);

  return (
    <>
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <TopBar
          title={t("settings.title")}
          titleColor={theme.colors.onBackground}
          isBackButtonEnable={true}
          backButtonColor={theme.colors.onBackground}
          barColor={theme.colors.background}
          backButtonHref={() => router.replace("/user/profile")}
        />
        <View style={styles.content}>
          <ThemeSection />
          <Text>User</Text>
          <LanguageSection />
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
