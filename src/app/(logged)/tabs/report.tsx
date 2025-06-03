import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export default function Report() {
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: theme.colors.onBackground }}>Tela Home</Text>
    </View>
  );
}
