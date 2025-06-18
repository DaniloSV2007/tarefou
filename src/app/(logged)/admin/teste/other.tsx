import TopBar from "@/components/TopBar";
import { View } from "react-native";

export default function Other() {
  return (
    <View>
      <TopBar title={"Outro"} isBackButtonEnable={true} />
    </View>
  );
}
