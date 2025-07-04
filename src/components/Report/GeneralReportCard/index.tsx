import { useAppTheme } from "@/hooks/useAppTheme";
import { StyleSheet, View } from "react-native";
import { Card, ProgressBar, Text } from "react-native-paper";
import CardInfo from "../CardInfo";
import { useTranslation } from "react-i18next";

export default function GeneralReportCard() {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const totalTasks = 20;
  const completedTasks = 15;
  const completionRate = completedTasks / totalTasks;

  const weekCompletedTasks = 22;
  const weekTotalTasks = 45;
  const weekCompletionRate = weekCompletedTasks / weekTotalTasks;

  const totalMembersInfo = {
    today: {
      completedTasks: completedTasks,
      totalCompletedTasks: totalTasks,
      completionRate: completionRate,
    },
    week: {
      completedTasks: weekCompletedTasks,
      totalCompletedTasks: weekTotalTasks,
      completionRate: weekCompletionRate,
    },
  };

  return (
    <Card
      style={{
        marginTop: 12,
        backgroundColor: theme.custom.cardColor,
        width: "90%",
        overflow: "hidden",
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 4,
      }}
    >
      <Card.Title
        title={t("report.general.title", { ns: "screens" })}
        titleStyle={{ fontSize: 28 }}
      />
      <Card.Content>
        <View style={{ gap: 16 }}>
          <CardInfo tasksInfo={totalMembersInfo.today} />
          <CardInfo tasksInfo={totalMembersInfo.week} isWeek={true} />
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  progressText: {
    marginBottom: 10,
    fontSize: 16,
  },
  percentageText: {
    fontSize: 16,
  },
});
