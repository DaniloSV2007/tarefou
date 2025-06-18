import { Slot, Stack } from "expo-router";

export default function AuthTabsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: "containedTransparentModal",
        animation: "flip",
      }}
    >
      <Stack.Screen name="home" options={{ animation: "flip" }} />
      <Stack.Screen name="settings" options={{ animation: "flip" }} />
    </Stack>
  );
}
