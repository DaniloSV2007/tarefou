import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../FirebaseConfig";

interface AuthContextType {
  isLoggedIn: boolean;
  token: string | null;
  login: (token: string, role: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { expoPushToken } = usePushNotifications();
  const usersCollection = collection(db, "users");

  const loadAuthState = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("userToken");
      if (storedToken) {
        setToken(storedToken);
        setIsLoggedIn(true);
      } else {
        setToken(null);
        setIsLoggedIn(false);
      }
      setError(null);
    } catch (error) {
      console.error("Error loading auth state:", error);
      setError("Failed to load authentication state");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAuthState();
  }, []);

  const saveTokenDb = async () => {
    const username = await AsyncStorage.getItem("username");
    const q = query(usersCollection, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docDb = querySnapshot.docs[0];
      const userDoc = doc(db, "users", docDb.id);
      await updateDoc(userDoc, {
        pushToken: expoPushToken?.data,
      });
    }
  };

  const login = async (newToken: string, role: string, username: string) => {
    try {
      setIsLoading(true);
      await AsyncStorage.multiSet([
        ["userToken", newToken],
        ["userRole", role],
        ["username", username],
      ]);
      await saveTokenDb();
      setToken(newToken);
      setIsLoggedIn(true);
      setError(null);
      router.replace(`/${role === "MEMBER" ? "user" : "admin"}/home`);
    } catch (error) {
      console.error("Error during login:", error);
      setError("Failed to login");
      setIsLoggedIn(false);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const versionBackup = await AsyncStorage.getItem("updateOtaNumber");
      await AsyncStorage.clear();
      await AsyncStorage.setItem("updateOtaNumber", versionBackup ?? "");
      setToken(null);
      setIsLoggedIn(false);
      setError(null);
      router.replace("/home");
    } catch (error) {
      console.error("Error during logout:", error);
      setError("Failed to logout");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, token, login, logout, isLoading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
