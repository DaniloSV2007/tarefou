import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function Logged() {
  const { logout } = useAuth();
  const router = useRouter();
  const theme = useAppTheme();

  const getRole = async () => {
    const role = await AsyncStorage.getItem("userRole");
    if (!role) {
      logout();
      return;
    }
    if (role === "MEMBER") {
      router.replace("/user/home");
    } else {
      router.replace("/admin/home");
    }
  };

  useEffect(() => {
    getRole();
  }, []);

  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}></View>
  );
}
