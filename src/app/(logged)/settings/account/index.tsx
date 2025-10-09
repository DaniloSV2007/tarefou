import { View } from "react-native";
import React from "react";
import { useThemeContext } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import TopBar from "@/components/TopBar";
import { useRouter } from "expo-router";
import PressableButton from "@/components/GlobalComp/PressableButton";
import { Divider, Icon } from "react-native-paper";

export default function Account() {
  const { theme } = useThemeContext();
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <>
      <TopBar title={t("settings.general.account.title")} isBackButtonEnable />
      <View
        className="flex-1 px-6"
        style={{ backgroundColor: theme.colors.background }}
      >
        <View>
          <PressableButton
            title={t("settings.general.account.accountInfo.title")}
            chevronIcon
            onPress={() => router.push("/settings/account/info")}
            leftIcon={() => (
              <Icon
                size={24}
                color={theme.colors.onBackground}
                source={"badge-account"}
              />
            )}
          />
          <Divider />
          <PressableButton
            title={t("settings.general.account.resetPassword")}
            leftIcon={() => (
              <Icon
                size={24}
                color={theme.colors.onBackground}
                source={"lock"}
              />
            )}
          />
          <Divider />
          <PressableButton
            title={t("settings.general.account.deleteAccount")}
            titleStyle={{ color: "red" }}
            leftIcon={() => (
              <Icon
                size={24}
                color={theme.colors.onBackground}
                source={"account-remove"}
              />
            )}
          />
        </View>
      </View>
    </>
  );
}
