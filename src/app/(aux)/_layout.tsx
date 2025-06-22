import { useAppTheme } from "@/hooks/useAppTheme";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function Layout() {
  const theme = useAppTheme();
  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <Stack
        screenOptions={{ headerShown: false, animation: "slide_from_right" }}
      />
    </View>
  );
}
