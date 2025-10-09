import { Tabs } from "expo-router";
import CustomTabBar from "@/components/GlobalComp/CustomTabBar";
import { routes } from "@/routes/adminRoutes";
import { View } from "react-native";
import { useThemeContext } from "@/context/ThemeContext";

export default function AdminLayout() {
  const { theme } = useThemeContext();

  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <Tabs
        tabBar={() => <CustomTabBar routesProps={routes} />}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: theme.colors.background },
        }}
      />
    </View>
  );
}
