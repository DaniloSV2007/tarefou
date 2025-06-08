import "@/i18n";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

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
