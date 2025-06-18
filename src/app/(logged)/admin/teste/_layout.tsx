import { Stack } from "expo-router";

export default function TesteLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Teste" }} />
      <Stack.Screen name="other" options={{ title: "Outro" }} />
    </Stack>
  );
}
