import { useAppTheme } from "@/hooks/useAppTheme";
import { View } from "react-native";

export default function Rewards() {
  const theme = useAppTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}></View>
  );
}
