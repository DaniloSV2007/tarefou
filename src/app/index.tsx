import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { LogBox } from "react-native";

export default function Index() {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  LogBox.ignoreAllLogs(false);

  useEffect(() => {
    if (!isLoading) {
      if (isLoggedIn) {
        router.replace("/(logged)/tabs/home");
      } else {
        router.replace("/(auth)/tabs/home");
      }
    }
  }, [isLoggedIn, isLoading]);

  return null;
}
