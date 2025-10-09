import SwipeItem from "@/components/Notifications/SwipeItem";
import TopBar from "@/components/TopBar";
import { useThemeContext } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export default function Rewards() {
  const { theme } = useThemeContext();
  const { t } = useTranslation();
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <TopBar title={t("routes.rewards")} showNotification />
      <View className="flex-1 gap-4 my-4">
        <Text
          style={{ color: theme.colors.onBackground, marginHorizontal: "auto" }}
          className="text-2xl"
        >
          {t("routes.rewards")}
        </Text>
      </View>
    </View>
  );
}
