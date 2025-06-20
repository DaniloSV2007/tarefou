import { useAppTheme } from "@/hooks/useAppTheme";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import React from "react";
import TopBar from "@/components/TopBar";

export default function UserHome() {
  const router = useRouter();
  const theme = useAppTheme();

  return (
    <>
      <TopBar title={"Home"} />
      <View
        style={[{ backgroundColor: theme.colors.background }, styles.container]}
      >
        <Text>Welcome to User Routes!</Text>
        <Button onPress={() => router.replace("/admin/home")}>
          Go back to Admin Routes
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
