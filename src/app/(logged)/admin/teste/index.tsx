import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Teste() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
      }}
    >
      <Text>Teste</Text>
      <Link href={"/admin/teste/other"}>Ir para Outros</Link>
    </View>
  );
}
