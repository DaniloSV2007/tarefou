import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { View } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { getAuth } from "firebase/auth";

export default function Index() {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const theme = useAppTheme();
  const auth = getAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isLoggedIn || !auth.currentUser) {
        router.replace("/(logged)");
      } else {
        router.replace("/(auth)/home");
      }
    }
  }, [isLoggedIn, isLoading]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}></View>
  );
}
