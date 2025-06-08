import { Slot, Tabs } from "expo-router";
import { Icon, useTheme } from "react-native-paper";
import { View } from "react-native";
import TabBar from "@/app/(auth)/tabs/TabBar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function AuthTabsLayout() {
  const theme = useTheme();
  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  );
}
