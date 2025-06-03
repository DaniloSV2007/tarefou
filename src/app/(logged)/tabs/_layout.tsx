import { Tabs } from "expo-router";
import CustomTabBar from "@/components/CustomTabBar";

export default function LoggedTabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar />}
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
