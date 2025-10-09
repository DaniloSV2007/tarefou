import { useAuth } from "@/context/AuthContext";
import { useThemeContext } from "@/context/ThemeContext";
import { db } from "@/services/FirebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect } from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function Logged() {
  const { logout } = useAuth();
  const router = useRouter();
  const { theme } = useThemeContext();
  const usersCollection = collection(db, "users");

  const getRole = async () => {
    let role = await AsyncStorage.getItem("userRole");
    if (!role) {
      role = await getRoleDatabase();
      await AsyncStorage.setItem("userRole", role as string);
    }

    if (role === "MEMBER") {
      router.replace("/user/home");
    } else {
      router.replace("/admin/home");
    }
  };

  const getRoleDatabase = async () => {
    const username = await AsyncStorage.getItem("username");
    if (!username) {
      const timer = setTimeout(() => {
        logout();
      }, 200);
      return () => {
        clearTimeout(timer);
      };
    }
    try {
      const q = query(usersCollection, where("username", "==", username));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const user = querySnapshot.docs[0];
        const userData = user.data();
        return userData.role;
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getRole();
  }, []);

  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <ActivityIndicator />
    </View>
  );
}
