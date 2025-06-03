import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadLoginState = async () => {
    const state = await AsyncStorage.getItem("isLoggedIn");
    setIsLoggedIn(state === "true");
    setIsLoading(false);
  };

  useEffect(() => {
    loadLoginState();
  }, []);

  const login = async () => {
    await AsyncStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
    router.replace("/(logged)/tabs/home");
  };

  const logout = async () => {
    await AsyncStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
    router.replace("/(auth)/tabs/home");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, isLoading }}>
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
