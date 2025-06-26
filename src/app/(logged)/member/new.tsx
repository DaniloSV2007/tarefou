import { Pressable, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Button, Icon, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";

export default function NewMember() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const [username, setUsername] = useState<string | null>(null);

  const shareWhatsapp = async () => {
    if (!username) return;

    const deepLink = `tarefou://tarefou/${username}`;

    const message = `Acesse meu perfil no Tarefou!\n${deepLink}`;

    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(message)}`;

    Linking.openURL(whatsappLink);
  };
  useEffect(() => {
    const getUsername = async () => {
      await AsyncStorage.getItem("username").then(setUsername);
    };
    getUsername();
  }, []);

  return (
    <>
      <TopBar
        title={t("screens:members.newMember.tabBar")}
        isBackButtonEnable={true}
      />
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
            paddingBottom: insets.bottom + 32,
          },
        ]}
      >
        <Text style={[{ color: theme.colors.onBackground }, styles.title]}>
          {t("screens:members.newMember.title")}
        </Text>
        <View style={styles.selection}>
          <Pressable
            android_ripple={{ color: theme.custom.ripple }}
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={() => router.push("/member/username")}
          >
            <Icon source={"account-search"} size={32} color="white" />
            <Text style={[styles.buttonText, { color: "white" }]}>
              {t("screens:members.newMember.username")}
            </Text>
          </Pressable>
          <Pressable
            android_ripple={{ color: theme.custom.ripple }}
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={() => router.push("/member/qrcode")}
          >
            <Icon source={"qrcode"} size={32} color="white" />
            <Text style={[styles.buttonText, { color: "white" }]}>QR Code</Text>
          </Pressable>
          <Pressable
            android_ripple={{ color: theme.custom.ripple }}
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={() => shareWhatsapp()}
          >
            <Icon source={"whatsapp"} size={32} color="white" />
            <Text style={[styles.buttonText, { color: "white" }]}>
              {t("screens:members.newMember.whatsapp")}
            </Text>
          </Pressable>

          <Text
            style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
          >
            {t("screens:members.newMember.subtitle")}
          </Text>

          <Pressable
            android_ripple={{ color: theme.custom.ripple }}
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={() => {}}
          >
            <Icon source={"email-newsletter"} size={32} color="white" />
            <Text style={[styles.buttonText, { color: "white" }]}>
              {t("screens:members.newMember.invite")}
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    marginLeft: 16,
    marginBottom: 12,
  },
  selection: {
    gap: 32,
    padding: 24,
    paddingHorizontal: 32,
    minHeight: 400,
    justifyContent: "center",
  },
  subtitle: {
    fontSize: 18,
  },
  buttonText: {
    fontSize: 24,
    marginLeft: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
  },
});
