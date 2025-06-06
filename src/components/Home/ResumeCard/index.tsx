import { useAppTheme } from "@/hooks/useAppTheme";
import { StyleSheet, View } from "react-native";
import { Card, ProgressBar, Text } from "react-native-paper";
import CardInfo from "../../Report/CardInfo";

export default function ResumeCard() {
  const theme = useAppTheme();

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
        backgroundColor: theme.custom.cardColor,
        width: "90%",
        overflow: "hidden",
        borderRadius: 16,
        padding: 10,
        marginTop: 16,
      }}
    >
      <Card.Title title={"Resume"} titleStyle={{ fontSize: 28 }} />
      <Card.Content style={{ gap: 16 }}>
        <View>
          <CardInfo tasksInfo={totalMembersInfo.today} />
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
