import GeneralReportCard from "@/components/Report/GeneralReportCard";
import ReportCard from "@/components/Report/ReportCard";
import TopBar from "@/components/TopBar";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";
import React from "react";

export default function Report() {
  const theme = useAppTheme();
  const { t } = useTranslation();

  return (
    <>
      <TopBar title={t("screens:report.title")} />
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignItems: "center", paddingTop: "1%" }}>
          <GeneralReportCard />
          <ReportCard title="Danilo Voiski" username="@DaniloSV07" />
          <ReportCard title="Guilherme Voiski" username="@guilherme2017" />
        </View>
      </ScrollView>
    </>
  );
}
