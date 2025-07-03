import Menu from "@/components/Profile/Menu";
import ProfileLogged from "@/components/ProfileLogged";
import TopBar from "@/components/TopBar";
import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { useThemeContext } from "@/context/ThemeContext";
import * as SystemUI from "expo-system-ui";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import * as StatusBar from "expo-status-bar";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import MenuButton from "@/components/Profile/Menu/MenuButton";
import ConfirmLogout from "@/components/Profile/Menu/ConfirmLogout";

export default function Profile() {
  const { isLoggedIn, isLoading, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuAnimation, setMenuAnimation] = useState(false);
  const theme = useAppTheme();
  const { isDark } = useThemeContext();
  const { t } = useTranslation();
  const router = useRouter();

  const [isConfirmation, setIsConfirmation] = useState(false);

  const profileMenuState = useRef<BottomSheetModal>(null);

  const openMenu = useCallback(() => {
    profileMenuState.current?.present();
  }, []);

  const closeMenu = useCallback(() => {
    profileMenuState.current?.close();
  }, []);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(isDark ? "#000" : "#fff");
  }, [isDark]);

  function LoadingPageIndicator() {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size={44} />
      </View>
    );
  }

  useEffect(() => {
    if (menuAnimation && !isDark) {
      StatusBar.setStatusBarStyle("light");
      StatusBar.setStatusBarTranslucent(false);
      StatusBar.setStatusBarBackgroundColor("#808181");
    } else {
      StatusBar.setStatusBarStyle(isDark ? "light" : "dark");
      StatusBar.setStatusBarTranslucent(true);
      StatusBar.setStatusBarBackgroundColor(theme.colors.background);
    }
  }, [menuAnimation]);

  if (isLoading) return <LoadingPageIndicator />;

  return (
    <>
      <TopBar
        title={t("profileLogged.title", { ns: "screens" })}
        titleColor={theme.colors.onBackground}
        iconButton="menu"
        iconColor={theme.colors.onBackground}
        onPressButton={openMenu}
        barColor={theme.colors.background}
        buttonSize={28}
      />
      {}
      <ProfileLogged />

      <Button onPress={() => router.replace("/user/home")}>
        Go to User routes
      </Button>

      <Menu ref={profileMenuState} close={closeMenu}>
        <MenuButton
          close={closeMenu}
          text={t("menu.appInfo", { ns: "components" })}
          icon="information-outline"
          onPress={() => router.push("/appinfo")}
        />
        <MenuButton
          close={closeMenu}
          text={t("menu.settings", { ns: "components" })}
          icon="cog"
          onPress={() => router.push("/settings")}
        />
        {isLoggedIn && (
          <MenuButton
            close={closeMenu}
            text={t("menu.logout", { ns: "components" })}
            icon="logout"
            onPress={() => setIsConfirmation(true)}
          />
        )}
      </Menu>
      {isConfirmation && (
        <ConfirmLogout
          isConfirmation={isConfirmation}
          setIsConfirmation={setIsConfirmation}
          logout={logout}
          close={close}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: "black",
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: "center",
  },
});
