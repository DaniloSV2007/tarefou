import { useAppTheme } from "@/hooks/useAppTheme";
import { StyleSheet, View } from "react-native";
import { Card, ProgressBar, Text } from "react-native-paper";

export default function GeneralReportCard() {
  const theme = useAppTheme();

  const totalTasks = 20;
  const completedTasks = 15;
  const completionRate = completedTasks / totalTasks;

  const weekCompletedTasks = 22;
  const weekTotalTasks = 45;
  const weekCompletionRate = weekCompletedTasks / weekTotalTasks;

  return (
    <Card
      style={{
        margin: 10,
        backgroundColor: theme.custom.cardColor,
        width: "90%",
        overflow: "hidden",
        borderRadius: 16,
        padding: 10,
      }}
    >
      <Card.Title title={"General Report"} titleStyle={{ fontSize: 28 }} />
      <Card.Content style={{ gap: 16 }}>
        <View>
          <Text
            variant="bodyMedium"
            style={[styles.progressText, { color: theme.colors.onBackground }]}
          >
            Completed Tasks: {completedTasks} / {totalTasks}
          </Text>
          <ProgressBar
            progress={completionRate}
            color={theme.colors.primary}
            style={{ height: 10, borderRadius: 8 }}
          />
          <View style={{ marginTop: 16 }}>
            <Text variant="bodySmall" style={styles.percentageText}>
              {Math.round(completionRate * 100)}% completed
            </Text>
          </View>
        </View>

        <View>
          <Text
            variant="bodyMedium"
            style={[styles.progressText, { color: theme.colors.onBackground }]}
          >
            Week Completed Tasks: {weekCompletedTasks} / {weekTotalTasks}
          </Text>
          <ProgressBar
            progress={weekCompletionRate}
            color={theme.colors.primary}
            style={{ height: 10, borderRadius: 8 }}
          />
          <View style={{ marginTop: 16 }}>
            <Text variant="bodySmall" style={styles.percentageText}>
              {Math.round(weekCompletionRate * 100)}% completed
            </Text>
          </View>
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
