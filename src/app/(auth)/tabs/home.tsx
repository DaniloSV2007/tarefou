import { useRouter } from "expo-router";
import { StyleSheet, View, Image, Pressable } from "react-native";
import { Button, Icon, Text } from "react-native-paper";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TopBar from "@/components/TopBar";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "@/hooks/useAppTheme";
import GoogleButton from "@/components/GoogleButton";

export default function Home() {
  const router = useRouter();
  const theme = useAppTheme();
  const { login } = useAuth();
  const insets = useSafeAreaInsets();
  const { i18n, t } = useTranslation();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      <TopBar
        title=""
        iconButton={"cog"}
        iconColor={theme.colors.onBackground}
        onPressButton={() => router.push("/profile/settings")}
        bottomBorder={false}
      />
      <View style={styles.content}>
        <Text
          variant="displaySmall"
          style={[styles.title, { color: theme.colors.onBackground }]}
        >
          {t("home.notLogged.title")}
        </Text>

        <Text
          variant="titleLarge"
          style={[styles.subtitle, { color: theme.colors.onBackground }]}
        >
          {t("home.notLogged.description")}
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => router.push("/(aux)/Login")}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            {t("home.notLogged.loginButton")}
          </Button>

          <GoogleButton onPress={() => {}} />

          <Button
            mode="outlined"
            onPress={() => {
              const newLang = i18n.language === "en" ? "pt" : "en";
              i18n.changeLanguage(newLang);
            }}
            style={{
              backgroundColor: theme.custom.cardTaskBackground,
              marginTop: 12,
            }}
            rippleColor={theme.custom.ripple}
            labelStyle={{ color: theme.colors.onBackground }}
          >
            {i18n.language === "en"
              ? "Mudar para Português"
              : "Switch to English"}
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 32,
    opacity: 0.8,
    lineHeight: 28,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 32,
    gap: 12,
  },
  button: {
    width: "100%",
    borderRadius: 32,
    marginTop: 16,
  },
  buttonLabel: {
    fontSize: 24,
    paddingVertical: 8,
  },
  settingsButton: {
    position: "absolute",
    top: 46,
    right: 32,
    zIndex: 1000,
  },
});
