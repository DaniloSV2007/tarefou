import { useAppTheme } from "@/hooks/useAppTheme";
import {
  Text,
  StyleSheet,
  View,
  Image,
  Pressable,
} from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";

interface GoogleButtonProps {
  onPress: () => void;
}

export default function GoogleButton({ onPress }: GoogleButtonProps) {
  const theme = useAppTheme();
  const { t } = useTranslation();

  return (
    <View style={{ borderRadius: 32, overflow: "hidden" }}>
      <Pressable
        style={[
          styles.button,
          { backgroundColor: theme.custom.cardTaskBackground },
        ]}
        android_ripple={{
          color: theme.custom.ripple,
        }}
        onPress={onPress}
      >
        <Image
          source={{
            uri: "https://img.icons8.com/?size=512&id=17949&format=png",
          }}
          style={styles.logo}
        />
        <Text style={[styles.text, { color: theme.colors.onBackground }]}>
          {t("login.loginWithGoogle")}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#666",
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
