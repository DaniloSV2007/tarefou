import SwipeItem from "@/components/Notifications/SwipeItem";
import TopBar from "@/components/TopBar";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

export default function Rewards() {
  const theme = useAppTheme();
  const { t } = useTranslation();
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <TopBar title={t("routes.rewards")} />
      <View className="flex-1 gap-4 my-4">
        <SwipeItem />
      </View>
    </View>
  );
}
