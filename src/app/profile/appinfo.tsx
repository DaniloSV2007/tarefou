import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Divider, Text, TouchableRipple, useTheme } from "react-native-paper";
import Constants from "expo-constants";
import TopBar from "@/components/TopBar";

export default function AppInfo() {
  const router = useRouter();
  const theme = useTheme();
  return (
    <>
      <TopBar
        title="App Info"
        titleColor={theme.colors.onBackground}
        isBackButtonEnable={true}
        backButtonColor={theme.colors.onBackground}
        barColor={theme.colors.background}
      />
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Text
          variant="headlineMedium"
          style={[styles.text, { color: theme.colors.onBackground }]}
        >
          App Version:
        </Text>
        <Text
          variant="headlineSmall"
          style={[styles.text, { color: theme.colors.onBackground }]}
        >
          {Constants.expoConfig?.version}
        </Text>

        <Divider style={{ marginVertical: 10 }} />

        <Text
          variant="headlineMedium"
          style={[styles.text, { color: theme.colors.onBackground }]}
        >
          Made By:
        </Text>
        <Text
          variant="headlineSmall"
          style={[styles.text, { color: theme.colors.onBackground }]}
        >
          DaniloSV07
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  text: {
    marginLeft: 10,
  },
});
