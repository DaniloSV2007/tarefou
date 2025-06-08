import { useAppTheme } from "@/hooks/useAppTheme";
import { StyleSheet, View } from "react-native";
import { Card, ProgressBar, Text } from "react-native-paper";
import CardInfo from "../../Report/CardInfo";
import { useTranslation } from "react-i18next";

interface MemberStats {
  today: {
    completedTasks: number;
    totalCompletedTasks: number;
    completionRate: number;
  };
  week: {
    completedTasks: number;
    totalCompletedTasks: number;
    completionRate: number;
  };
}

export default function ResumeCard({ stats }: { stats: MemberStats }) {
  const theme = useAppTheme();
  const { t } = useTranslation();

  return (
    <Card
      style={{
        backgroundColor: theme.custom.cardColor,
        width: "90%",
        overflow: "hidden",
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 4,
        marginTop: 16,
      }}
    >
      <Card.Title
        title={t("home.resume.title")}
        titleStyle={{ fontSize: 28 }}
      />
      <Card.Content style={{ gap: 16 }}>
        <View>
          <CardInfo tasksInfo={stats.today} />
        </View>
        <View>
          <CardInfo tasksInfo={stats.week} isWeek={true} />
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
