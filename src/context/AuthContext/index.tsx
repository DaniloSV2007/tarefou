import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useDatabase } from "@/database/useDatabase";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadLoginState = async () => {
    try {
      const state = await AsyncStorage.getItem("isLoggedIn");
      setIsLoggedIn(state === "true");
      setError(null);
    } catch (error) {
      console.error("Error loading login state:", error);
      setError("Failed to load login state");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLoginState();
  }, []);

  const login = async (email: string, password: string) => {
    const database = useDatabase();
    try {
      setIsLoading(true);

      const response = await database.login(email, password);

      if (response.success) {
        await AsyncStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(true);
        setError(null);
        router.replace("/(logged)/tabs/home");
      } else {
        setError("Failed to login");
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Failed to login");
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.setItem("isLoggedIn", "false");
      setIsLoggedIn(false);
      setError(null);
      router.replace("/(auth)/tabs/home");
    } catch (error) {
      console.error("Error during logout:", error);
      setError("Failed to logout");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, login, logout, isLoading, error }}
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
