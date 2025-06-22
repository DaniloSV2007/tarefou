import { useAppTheme } from "@/hooks/useAppTheme";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function MembersLayout() {
  const theme = useAppTheme();
  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          presentation: "containedTransparentModal",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="[userId]" />
      </Stack>
    </View>
  );
}
