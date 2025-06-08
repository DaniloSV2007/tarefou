import ProfileMenu from "@/components/Profile/ProfileMenu";
import ProfileLogged from "@/screens/ProfileLogged";
import ProfileNotLogged from "@/screens/ProfileNotLogged";
import TopBar from "@/components/TopBar";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useAuth } from "@/context/AuthContext";
import React from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useTranslation } from "react-i18next";

export default function Profile() {
  const { isLoggedIn, isLoading } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const theme = useAppTheme();
  const { t } = useTranslation();
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

  if (isLoggedIn) {
    return (
      <>
        <TopBar
          title={t("screens:profile.title")}
          titleColor={theme.colors.onBackground}
          iconButton="menu"
          iconColor={theme.colors.onBackground}
          onPressButton={() => setIsMenuOpen(true)}
          barColor={theme.colors.background}
        />
        <ProfileLogged />

        {isMenuOpen && <ProfileMenu setIsMenuOpen={setIsMenuOpen} />}
      </>
    );
  }

  return (
    <>
      <TopBar
        title="Profile"
        titleColor={theme.colors.onBackground}
        iconButton="menu"
        iconColor={theme.colors.onBackground}
        onPressButton={() => setIsMenuOpen(true)}
        barColor={theme.colors.background}
      />
      <ProfileNotLogged />

      {isMenuOpen && (
        <ProfileMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
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
