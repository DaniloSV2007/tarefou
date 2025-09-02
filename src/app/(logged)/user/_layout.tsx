import CustomTabBar from "@/components/GlobalComp/CustomTabBar";
import { useAppTheme } from "@/hooks/useAppTheme";
import { routes } from "@/routes/userRoutes";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function UserLayout() {

  const theme = useAppTheme();

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
