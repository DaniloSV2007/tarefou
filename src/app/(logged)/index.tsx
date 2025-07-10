import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import api from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function Logged() {
  const { logout, token } = useAuth();
  const router = useRouter();
  const theme = useAppTheme();

  const getRole = async () => {
    const role = await AsyncStorage.getItem("userRole");
    if (!role) {
      logout();
      return;
    }
    getRoleDatabase(role);
    if (role === "MEMBER") {
      router.replace("/user/home");
    } else {
      router.replace("/admin/home");
    }
  };

  const getRoleDatabase = async (role: string) => {
    const username = await AsyncStorage.getItem("username");
    if (!username) {
      logout();
      return;
    }
    try {
      const res = await api.get("users/" + username, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        const roleDb = res.data.role;
        roleDb !== role && (await AsyncStorage.setItem("userRole", roleDb));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getRole();
  }, []);

  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}></View>
  );
}
