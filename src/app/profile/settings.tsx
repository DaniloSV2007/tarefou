import ThemeSection from "@/components/ThemeSection";
import TopBar from "@/components/TopBar";
import { useAuth } from "@/context/AuthContext";
import { useThemeContext } from "@/context/ThemeContext";
import { StyleSheet, View } from "react-native";
import { Button, useTheme } from "react-native-paper";

export default function Settings() {
  const theme = useTheme();
  return (
    <>
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <TopBar
          title="Settings"
          titleColor={theme.colors.onBackground}
          isBackButtonEnable={true}
          backButtonColor={theme.colors.onBackground}
          barColor={theme.colors.background}
        />
        <View>
          <ThemeSection />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
