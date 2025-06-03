// app/(auth)/tabs/_layout.tsx
import { Tabs } from "expo-router";
import { Icon, useTheme } from "react-native-paper";
import { View } from "react-native";
import TabBar from "@/app/(auth)/tabs/TabBar";

export default function AuthTabsLayout() {
  const theme = useTheme();
  return (
    <Tabs
      tabBar={() => <TabBar />}
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
