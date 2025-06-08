import { View } from "react-native";
import React from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useRouter } from "expo-router";
import TopBar from "@/components/TopBar";
import { useTranslation } from "react-i18next";

export default function NewTask() {
  const theme = useAppTheme();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <TopBar
        title={t("tasks.new.title")}
        isBackButtonEnable={true}
        backButtonHref={() => router.push("/(logged)/tabs/home")}
      />
      <View style={{ flex: 1, padding: 16 }}>
        {/* TODO: Add new task form */}
      </View>
    </View>
  );
}
