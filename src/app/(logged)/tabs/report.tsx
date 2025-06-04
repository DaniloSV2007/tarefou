import GeneralReportCard from "@/components/Report/GeneralReportCard";
import ReportCard from "@/components/Report/ReportCard";
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
      <View style={{ alignItems: "center", paddingTop: "1%" }}>
        <GeneralReportCard />
        <ReportCard title="Danilo Voiski" username="@DaniloSV07" />
      </View>
    </View>
  );
}
