import TopBar from "@/components/TopBar";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { Text } from "react-native-paper";

export default function UserProfile() {
  const theme = useAppTheme();
  const router = useRouter();
  return (
    <View style={{ flex: 1 }}>
      <TopBar
        title={"Gulherme Voiski"}
        isBackButtonEnable={true}
        backButtonHref={() => router.push("/tabs/members")}
      />
      <Text>User Profile Page</Text>
    </View>
  );
}
