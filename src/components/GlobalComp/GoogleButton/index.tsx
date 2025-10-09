import { useThemeContext } from "@/context/ThemeContext";
import { Text, StyleSheet, View, Image, Pressable } from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { AppTheme } from "@/themes";

interface GoogleButtonProps {
  onPress: () => void;
}

export default function GoogleButton({ onPress }: GoogleButtonProps) {
  const { theme } = useThemeContext();
  const { t } = useTranslation();
  const styles = makeStyles(theme);

  return (
    <View style={{ borderRadius: 32, overflow: "hidden" }}>
      <Pressable
        style={[styles.button, { backgroundColor: theme.colors.surface }]}
        android_ripple={{
          color: theme.colors.primaryContainer,
        }}
        onPress={onPress}
      >
        <Image
          source={{
            uri: "https://img.icons8.com/?size=512&id=17949&format=png",
          }}
          style={styles.logo}
        />
        <Text style={[styles.text, { color: theme.colors.onSurface }]}>
          {t("login.loginWithGoogle")}
        </Text>
      </Pressable>
    </View>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderColor: theme.colors.outline,
      borderWidth: 1,
      borderRadius: 32,
      paddingVertical: 10,
    },
    logo: {
      width: 42,
      height: 42,
      marginRight: 12,
    },
    text: {
      fontSize: 24,
      fontWeight: "500",
    },
  });
