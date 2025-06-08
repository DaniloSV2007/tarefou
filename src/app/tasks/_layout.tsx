import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function TasksLayout() {
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="[userFullName]/[taskId]"
        options={{
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="new"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
