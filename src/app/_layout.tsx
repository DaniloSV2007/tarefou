import "@/i18n";
import "@/styles/global.css";
import { AuthProvider } from "@/context/AuthContext";
import { Stack, useRouter } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useThemeContext } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { View } from "react-native";
import * as SystemUI from "expo-system-ui";
import { useEffect, useState } from "react";
import { SQLiteProvider } from "expo-sqlite";
import { setupDB } from "@/database/setupDB";
import { useAppTheme } from "@/hooks/useAppTheme";
import * as Updates from "expo-updates";
import Update from "@/components/Update";
import * as StatusBar from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as QuickActions from "expo-quick-actions";
import { useQuickActionRouting } from "expo-quick-actions/router";
import { getAuth } from "firebase/auth";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/services/FirebaseConfig";
import { t } from "i18next";
import * as Notifications from "expo-notifications";
import { resetDatabase } from "@/database/resetDatabase";
import { deleteDatabase } from "@/database/deleteDatabase";

function RootInnerLayout() {
  const { theme, isDark } = useThemeContext();
  const appTheme = useAppTheme();
  const auth = getAuth();
  const usersCollection = collection(db, "users");

  const { expoPushToken } = usePushNotifications();

  useQuickActionRouting();

  const { isUpdateAvailable } = Updates.useUpdates();
  const [updateAvailable, setIsupdateAvailable] =
    useState<boolean>(isUpdateAvailable);

  useEffect(() => {
    if (Constants.appOwnership !== "expo") {
      checkUpdates();
    }
    if (auth.currentUser) {
      setQuickActions();
    }
    checkIsNewBuild();
  }, []);

  useEffect(() => {
    if (expoPushToken?.data) {
      saveToken();
    }
  }, [expoPushToken?.data]);

  useEffect(() => {
    const updateSystemUI = async () => {
      try {
        await SystemUI.setBackgroundColorAsync(isDark ? "#000" : "#fff");
        StatusBar.setStatusBarStyle(isDark ? "light" : "dark");
        StatusBar.setStatusBarBackgroundColor(isDark ? "#000" : "#fff");
      } catch (error) {
        console.error("Error updating system UI:", error);
      }
    };
    updateSystemUI();
  }, [isDark]);

  const checkUpdates = async () => {
    try {
      const update = Updates.checkForUpdateAsync();
      if ((await update).isAvailable) {
        setIsupdateAvailable(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const setQuickActions = async () => {
    const role = await AsyncStorage.getItem("userRole");
    if (role === "FAMILY_ADMIN") {
      console.log("Quick Actions Setted");
      QuickActions.setItems([
        {
          title: t("quickActions.newTask"),
          icon: "new_task",
          id: "0",
          params: { href: "/(logged)/tasks/new/" },
        },
      ]);
    } else {
      QuickActions.setItems([
        {
          title: t("quickActions.tasks"),
          id: "0",
          params: { href: "/(logged)/user/tasks" },
        },
      ]);
    }
  };

  const checkIsNewBuild = async (): Promise<boolean> => {
    const currentVersion = Constants.expoConfig?.version ?? "1.0.0";
    const savedVersion = await AsyncStorage.getItem("appVersion");

    if (!savedVersion || savedVersion !== currentVersion) {
      await AsyncStorage.setItem("appVersion", currentVersion);
      return true;
    }

    return false;
  };

  const saveToken = async () => {
    const username = await AsyncStorage.getItem("username");
    if (!expoPushToken?.data || !username || !auth.currentUser) return;
    console.log(expoPushToken);
    await AsyncStorage.setItem("pushToken", expoPushToken.data);
    try {
      const q = query(usersCollection, where("username", "==", username));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userId = querySnapshot.docs[0].id;
        const userDoc = doc(db, "users", userId);
        await updateDoc(userDoc, { pushToken: expoPushToken.data });
      }
    } catch (error) {
      console.log("Error while saving push token: ", error);
    }
  };

  return (
    <SQLiteProvider databaseName="tarefou.db" onInit={setupDB}>
      <AuthProvider>
        <SafeAreaProvider>
          <PaperProvider theme={theme}>
            <LanguageProvider>
              <GestureHandlerRootView>
                <BottomSheetModalProvider>
                  <View
                    style={{
                      backgroundColor: appTheme.colors.background,
                      flex: 1,
                    }}
                  >
                    <Stack
                      screenOptions={{
                        headerShown: false,
                        animation: "none",
                        contentStyle: {
                          backgroundColor: appTheme.colors.background,
                        },
                      }}
                    />
                    <Update isUpdateAvailable={updateAvailable} />
                  </View>
                </BottomSheetModalProvider>
              </GestureHandlerRootView>
            </LanguageProvider>
          </PaperProvider>
        </SafeAreaProvider>
      </AuthProvider>
    </SQLiteProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootInnerLayout />
    </ThemeProvider>
  );
}
