import { useAppTheme } from "@/hooks/useAppTheme";
import { StyleSheet, View } from "react-native";
import { Avatar, Card, ProgressBar, Text } from "react-native-paper";

interface ReportCardProps {
  title: string;
  username: string;
}

export default function ReportCard({ title, username }: ReportCardProps) {
  const theme = useAppTheme();

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
      <Card.Title
        title={title}
        titleStyle={{ fontSize: 28, marginLeft: 10 }}
        subtitle={username}
        subtitleStyle={{
          fontSize: 14,
          color: theme.colors.onSurfaceVariant,
          marginLeft: 10,
        }}
        left={(props) => <Avatar.Icon icon="account" size={48} />}
      />
      <Card.Content>
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
