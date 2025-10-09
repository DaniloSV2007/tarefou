import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { View } from "react-native";
import { useThemeContext } from "@/context/ThemeContext";
import { ActivityIndicator } from "react-native-paper";

export default function Index() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const { theme } = useThemeContext();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/(logged)");
    } else {
      router.replace("/(auth)/home");
    }
  }, []);

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: theme.colors.background }}
    >
      <ActivityIndicator />
    </View>
  );
}
