import { View } from "react-native";
import React from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import TopBar from "@/components/TopBar";
import { useRouter } from "expo-router";
import { collection } from "firebase/firestore";
import { db } from "@/services/FirebaseConfig";
import PressableButton from "@/components/GlobalComp/PressableButton";
import { Divider, Icon } from "react-native-paper";

export default function Account() {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const usersCollection = collection(db, "users");

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
            leftIcon={() => <Icon size={24} source={"badge-account"} />}
          />
          <Divider />
          <PressableButton
            title={t("settings.general.account.resetPassword")}
            leftIcon={() => <Icon size={24} source={"lock"} />}
          />
          <Divider />
          <PressableButton
            title={t("settings.general.account.deleteAccount")}
            titleStyle={{ color: "red" }}
            leftIcon={() => <Icon size={24} source={"account-remove"} />}
          />
        </View>
      </View>
    </>
  );
}
