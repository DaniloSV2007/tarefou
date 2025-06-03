import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import Constants from "expo-constants";
import { useAppTheme } from "@/hooks/useAppTheme";

export default function Home() {
  const router = useRouter();
  const theme = useAppTheme();

  return (
    <>
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Text
          variant="displayMedium"
          style={[styles.title, { color: theme.colors.onBackground }]}
        >
          Olá, mundo!
        </Text>
        <Text
          variant="headlineMedium"
          style={[styles.title, { color: theme.colors.onBackground }]}
        >
          Versão do app: {Constants.expoConfig?.version}
        </Text>
        <Button
          children="Ir para Home"
          onPress={() => router.push("/tabs/profile/settings")}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },
  title: {
    textAlign: "center",
    marginTop: 100,
  },
});
