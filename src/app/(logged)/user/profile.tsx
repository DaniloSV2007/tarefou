import ProfileLogged from "@/components/ProfileLogged";
import TopBar from "@/components/TopBar";
import { useCallback, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Menu from "@/components/Profile/Menu";
import MenuButton from "@/components/Profile/Menu/MenuButton";
import ConfirmLogout from "@/components/Profile/Menu/ConfirmLogout";
import Constants from "expo-constants";

export default function Profile() {
  const { isLoggedIn, isLoading, logout } = useAuth();
  const theme = useAppTheme();
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
      />

      <ProfileLogged />
      {Constants.appOwnership === "expo" && (
        <Button onPress={() => router.replace("/admin/home")}>
          Go to admin routes
        </Button>
      )}

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
          close={closeMenu}
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
});
