import { useAppTheme } from "@/hooks/useAppTheme";
import { Slot, Stack, useRouter } from "expo-router";

export default function ProfileLayout() {
  const router = useRouter();
  const theme = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: "containedTransparentModal",
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="appinfo" />
    </Stack>
  );
}
