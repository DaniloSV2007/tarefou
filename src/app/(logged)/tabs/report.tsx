import TopBar from "@/components/TopBar";
import { useAppTheme } from "@/hooks/useAppTheme";
import { View } from "react-native";
import { Text } from "react-native-paper";

export default function Report() {
  const theme = useAppTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <TopBar title="Family Report" />
    </View>
  );
}
