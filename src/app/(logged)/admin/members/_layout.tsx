import { Stack } from "expo-router";

export default function MembersLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: "containedTransparentModal",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[userId]" />
    </Stack>
  );
}
