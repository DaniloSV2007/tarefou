import Menu from "@/components/Profile/Menu";
import ProfileLogged from "@/components/Profile/ProfileLogged";
import TopBar from "@/components/TopBar";
import { useCallback, useRef, useState } from "react";
import { Button } from "react-native-paper";
import { useAuth } from "@/context/AuthContext";
import { useThemeContext } from "@/context/ThemeContext";
import React from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import MenuButton from "@/components/Profile/Menu/MenuButton";
import ConfirmLogout from "@/components/Profile/Menu/ConfirmLogout";
import Constants from "expo-constants";

export default function Profile() {
  const { logout } = useAuth();
  const { theme } = useThemeContext();
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
        showNotification
      />
      <ProfileLogged />

      {Constants.appOwnership === "expo" && (
        <Button onPress={() => router.replace("/user/home")}>
          Go to User routes
        </Button>
      )}

      <Menu ref={profileMenuState} close={closeMenu}>
        <MenuButton
          close={closeMenu}
          text={t("menu.settings", { ns: "components" })}
          icon="cog"
          onPress={() => router.push("/settings")}
        />
        <MenuButton
          close={closeMenu}
          text={t("menu.logout", { ns: "components" })}
          icon="logout"
          onPress={() => setIsConfirmation(true)}
        />
      </Menu>
      {isConfirmation && (
        <ConfirmLogout
          isConfirmation={isConfirmation}
          setIsConfirmation={setIsConfirmation}
          logout={logout}
          close={closeMenu}
        />
      )}
    </>
  );
}
