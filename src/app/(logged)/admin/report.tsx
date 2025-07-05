import GeneralReportCard from "@/components/Report/GeneralReportCard";
import ReportCard from "@/components/Report/ReportCard";
import TopBar from "@/components/TopBar";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";
import React from "react";
import { Card } from "react-native-paper";
import ContentLoader, { Circle, List, Rect } from "react-content-loader/native";
import CustomCard from "@/components/CustomCard";
import CardInfo from "@/components/Report/CardInfo";
import { UserTasksType } from "./home";
import { Task } from "../tasks/[tasks]";

export default function Report() {
  const theme = useAppTheme();
  const { t } = useTranslation();

  const totalTasks = 20;
  const completedTasks = 15;
  const completionRate = completedTasks / totalTasks;

  const weekCompletedTasks = 22;
  const weekTotalTasks = 45;
  const weekCompletionRate = weekCompletedTasks / weekTotalTasks;

  const totalMembersInfo: Task[] = [];

  const MyLoader = () => (
    <ContentLoader
      viewBox="0 0 380 70"
      animate={true}
      speed={2}
      backgroundColor={theme.custom.cardTaskBackground}
      foregroundColor="gray"
      width={476}
      height={364}
    >
      <Circle cx="74" cy="19" r="19" />
      <Rect x="108" y="6" rx="4" ry="4" width="200" height="16" />
      <Rect x="108" y="28" rx="2" ry="2" width="100" height="8" />
      <Rect x="55" y="48" rx="4" ry="4" width="180" height="12" />
      <Rect x="55" y="68" rx="4" ry="4" width="270" height="12" />
      <Rect x="55" y="88" rx="4" ry="4" width="100" height="12" />
      <Rect x="55" y="118" rx="4" ry="4" width="180" height="12" />
      <Rect x="55" y="138" rx="4" ry="4" width="270" height="12" />
      <Rect x="55" y="158" rx="4" ry="4" width="100" height="12" />
    </ContentLoader>
  );

  return (
    <>
      <TopBar title={t("report.title", { ns: "screens" })} />
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignItems: "center", gap: 16, paddingBottom: 12 }}>
          <CustomCard title={t("report.general.title", { ns: "screens" })}>
            <CardInfo tasksInfo={totalMembersInfo} />
            {totalMembersInfo.length > 0 && (
              <CardInfo tasksInfo={totalMembersInfo} isWeek={true} />
            )}
          </CustomCard>

          <Card
            style={{
              backgroundColor: theme.custom.cardColor,
              width: "90%",
              overflow: "hidden",
              paddingVertical: 12,
              paddingBottom: 0,
              borderRadius: 16,
            }}
          >
            <Card.Content
              style={{ minHeight: 250, alignItems: "center", marginTop: -140 }}
            >
              <MyLoader />
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </>
  );
}
