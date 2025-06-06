import GeneralReportCard from "@/components/Report/GeneralReportCard";
import ReportCard from "@/components/Report/ReportCard";
import TopBar from "@/components/TopBar";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";

export default function Report() {
  const theme = useAppTheme();

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
      showsVerticalScrollIndicator={false}
    >
      <TopBar title="Family Report" />
      <View style={{ alignItems: "center", paddingTop: "1%" }}>
        <GeneralReportCard />
        <ReportCard title="Danilo Voiski" username="@DaniloSV07" />
        <ReportCard title="Guilherme Voiski" username="@guilherme2017" />
      </View>
    </ScrollView>
  );
}
