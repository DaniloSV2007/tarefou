import { useRouter } from "expo-router";
import { StyleSheet, View, Image, Pressable } from "react-native";
import { Button, Icon, Text, useTheme } from "react-native-paper";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TopBar from "@/components/TopBar";

export default function Home() {
  const router = useRouter();
  const theme = useTheme();
  const { login } = useAuth();
  const insets = useSafeAreaInsets();
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
          Welcome to Tarefou!
        </Text>

        <Text
          variant="titleLarge"
          style={[styles.subtitle, { color: theme.colors.onBackground }]}
        >
          To access all app resources, you need to login first.
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => router.push("/(aux)/Login")}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Login In
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
  },
  button: {
    width: "100%",
    borderRadius: 12,
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
