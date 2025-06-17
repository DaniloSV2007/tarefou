import MemberInfo from "@/components/Members/MemberInfo";
import { useAppTheme } from "@/hooks/useAppTheme";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TopBar from "@/components/TopBar";
import { useRouter } from "expo-router";
import { FAB } from "react-native-paper";
import { useTranslation } from "react-i18next";

export default function Members() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.background,
        },
        styles.container,
      ]}
    >
      <TopBar title={t("screens:members.title")} />
      <FAB
        icon={"plus"}
        style={[{ backgroundColor: theme.colors.primary }, styles.fab]}
        rippleColor={theme.custom.ripple}
        onPress={() => {}}
        color="white"
      />

      <View
        style={{
          flex: 1,
          alignItems: "center",
          paddingTop: "1%",
        }}
      >
        <MemberInfo title="Guilherme Voiski" username="@guilherme2017" />
        <MemberInfo title="Danilo Voiski" username="@DaniloSV07" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: 16,
  },
});
