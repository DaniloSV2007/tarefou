import ThemeSection from "@/components/Settings/ThemeSection";
import LanguageSection from "@/components/Settings/LanguageSection";
import TopBar from "@/components/TopBar";
import { StyleSheet, View } from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";
import OptionsSection from "@/components/Settings/OptionsSection";
import Option from "@/components/Settings/OptionsSection/Option";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeContext } from "@/context/ThemeContext";

export default function Settings() {
  const { theme } = useThemeContext();
  const { t } = useTranslation();
  const router = useRouter();

  const insets = useSafeAreaInsets();

  return (
    <>
      <TopBar
        title={t("settings.title")}
        titleColor={theme.colors.onBackground}
        isBackButtonEnable={true}
        backButtonColor={theme.colors.onBackground}
        barColor={theme.colors.background}
      />
      <ScrollView
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
          },
        ]}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <OptionsSection>
            <Option
              title={t("settings.general.appInfo.title")}
              onPress={() => router.push("settings/appinfo")}
            />
            <Option
              title={t("settings.general.account.title")}
              onPress={() => router.push("settings/account")}
            />
          </OptionsSection>
          <ThemeSection />
          <LanguageSection />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignItems: "center",
    paddingVertical: 16,
    gap: 16,
  },
});
