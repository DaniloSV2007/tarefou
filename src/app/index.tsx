import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isLoggedIn) {
        router.replace("/(logged)");
      } else {
        router.replace("/(auth)/home");
      }
    }
  }, [isLoggedIn, isLoading]);

  return null;
}
