import ProfileMenu from "@/components/Profile/Menu";
import ProfileLogged from "@/components/ProfileLogged";
import TopBar from "@/components/TopBar";
import { useEffect, useState } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { useThemeContext } from "@/context/ThemeContext";
import * as SystemUI from "expo-system-ui";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";

export default function Profile() {
  const { isLoggedIn, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuAnimation, setMenuAnimation] = useState(false);
  const theme = useAppTheme();
  const { isDark } = useThemeContext();
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(isDark ? "#000" : "#fff");
  }, [isDark]);

  useEffect(() => {
    if (isMenuOpen) {
      SystemUI.setBackgroundColorAsync(theme.custom.cardColor);
    } else {
      SystemUI.setBackgroundColorAsync(theme.colors.background);
    }
  }, [isMenuOpen, isDark]);

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
        title={t("screens:profileLogged.title")}
        titleColor={theme.colors.onBackground}
        iconButton="menu"
        iconColor={theme.colors.onBackground}
        onPressButton={() => setIsMenuOpen(true)}
        barColor={theme.colors.background}
      />

      <ProfileLogged />

      <Button onPress={() => router.push("/userLink/DaniloSV07")}>
        Go to Admin routes
      </Button>

      {isMenuOpen && (
        <ProfileMenu
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          menuAnimation={menuAnimation}
          setMenuAnimation={setMenuAnimation}
          isAdmin={true}
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
