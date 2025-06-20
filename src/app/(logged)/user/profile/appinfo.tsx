import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Divider, Text, TouchableRipple, useTheme } from "react-native-paper";
import Constants from "expo-constants";
import TopBar from "@/components/TopBar";
import { useTranslation } from "react-i18next";
import React from "react";

export default function AppInfo() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <TopBar
        title={t("appInfo.title")}
        titleColor={theme.colors.onBackground}
        isBackButtonEnable={true}
        backButtonColor={theme.colors.onBackground}
        barColor={theme.colors.background}
        backButtonHref={() => router.replace("/user/profile")}
      />
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Text
          variant="headlineMedium"
          style={[styles.text, { color: theme.colors.onBackground }]}
        >
          {t("appInfo.version")}:
        </Text>
        <Text
          variant="headlineSmall"
          style={[styles.text, { color: theme.colors.onBackground }]}
        >
          {Constants.expoConfig?.version}
        </Text>

        <Divider style={{ marginVertical: 10 }} />

        <Text
          variant="headlineMedium"
          style={[styles.text, { color: theme.colors.onBackground }]}
        >
          {t("appInfo.madeBy")}:
        </Text>
        <Text
          variant="headlineSmall"
          style={[styles.text, { color: theme.colors.onBackground }]}
        >
          DaniloSV07
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  text: {
    marginLeft: 10,
  },
});
