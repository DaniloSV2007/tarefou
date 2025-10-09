import CustomTabBar from "@/components/GlobalComp/CustomTabBar";
import { useThemeContext } from "@/context/ThemeContext";
import { routes } from "@/routes/userRoutes";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function UserLayout() {
  const { theme } = useThemeContext();

  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <Tabs
        tabBar={() => <CustomTabBar routesProps={routes} />}
        screenOptions={{
          headerShown: false,
          sceneStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      />
    </View>
  );
}
