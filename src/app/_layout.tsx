import "@/i18n";
import "@/styles/global.css";
import { AuthProvider } from "@/context/AuthContext";
import { Slot, SplashScreen, Stack, useRouter } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useThemeContext } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { Platform, View } from "react-native";
import * as SystemUI from "expo-system-ui";
import * as Font from "expo-font";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Text, ActivityIndicator } from "react-native";
import { SQLiteProvider } from "expo-sqlite";
import { setupDB } from "@/database/setupDB";
import { deleteDatabase } from "@/database/deleteDatabase";
import { resetDatabase } from "@/database/resetDatabase";
import { useAppTheme } from "@/hooks/useAppTheme";
import * as Updates from "expo-updates";
import Update from "@/components/Update";
import * as StatusBar from "expo-status-bar";
import * as Linking from "expo-linking";
import api from "@/services/api";
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
import { db } from "../../FirebaseConfig";

function RootInnerLayout() {
  const { theme, isDark } = useThemeContext();
  const appTheme = useAppTheme();
  const auth = getAuth();
  const usersCollection = collection(db, "users");

  const { expoPushToken } = usePushNotifications();

  useQuickActionRouting();

  const { isUpdateAvailable, isDownloading, isRestarting, isUpdatePending } =
    Updates.useUpdates();

  const [updateAvailable, setIsupdateAvailable] =
    useState<boolean>(isUpdateAvailable);

  useEffect(() => {
    if (expoPushToken) {
      saveToken();
    }
  }, [expoPushToken]);

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

  useEffect(() => {
    const prepare = async () => {
      await SplashScreen.hideAsync();
    };

    prepare();
  }, []);

  useEffect(() => {
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
    if (Constants.appOwnership !== "expo") {
      checkUpdates();
    }
    checkIsNewBuild();
  }, []);

  useEffect(() => {
    if (!auth.currentUser) return;
    const setQuickActions = async () => {
      const role = await AsyncStorage.getItem("userRole");
      if (role === "FAMILY_ADMIN") {
        QuickActions.setItems([
          {
            title: "New Task",
            icon: "new_task",
            id: "0",
            params: { href: "/(logged)/tasks/new/" },
          },
        ]);
      }
      setQuickActions();
    };
  }, []);

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
    const getPushToken = await AsyncStorage.getItem("pushToken");
    if (
      !expoPushToken ||
      !username ||
      String(expoPushToken) === getPushToken ||
      !auth.currentUser
    )
      return;
    console.log(expoPushToken);
    await AsyncStorage.setItem("pushToken", String(expoPushToken));
    try {
      const q = query(usersCollection, where("username", "==", username));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userId = querySnapshot.docs[0].id;
        const userDoc = doc(db, "users", userId);
        await updateDoc(userDoc, { pushToken: String(expoPushToken) });
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
  const [isFontsLoaded, setIsFontsLoaded] = useState(false);
  const [fontError, setFontError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync(MaterialCommunityIcons.font);
        setIsFontsLoaded(true);
        setFontError(null);
      } catch (error) {
        console.error("Error loading fonts:", error);
        setFontError("Failed to load fonts");
      }
    }
    loadFonts();
  }, []);

  if (fontError) {
    return (
      <SafeAreaProvider>
        <PaperProvider>
          <Text style={{ color: "red", padding: 20 }}>
            {fontError}. Some icons might not display correctly.
          </Text>
        </PaperProvider>
      </SafeAreaProvider>
    );
  }

  if (!isFontsLoaded) {
    return (
      <SafeAreaProvider>
        <PaperProvider>
          <ActivityIndicator size="large" style={{ flex: 1 }} />
        </PaperProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <ThemeProvider>
      <RootInnerLayout />
    </ThemeProvider>
  );
}
