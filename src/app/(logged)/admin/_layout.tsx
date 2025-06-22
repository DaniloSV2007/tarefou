import { Tabs, usePathname } from "expo-router";
import CustomTabBar from "@/components/CustomTabBar";
import { routes } from "@/routes/adminRoutes";
import { View } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useEffect, useState } from "react";

export default function AdminLayout() {
  const pathname = usePathname();
  const theme = useAppTheme();
  const [previousTab, setPreviousTab] = useState(pathname);

  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <Tabs
        tabBar={(props) => <CustomTabBar routesProps={routes} />}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: theme.colors.background },
        }}
      />
    </View>
  );
}
