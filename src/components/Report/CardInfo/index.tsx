import { useAppTheme } from "@/hooks/useAppTheme";
import { View, StyleSheet } from "react-native";
import { Text, ProgressBar } from "react-native-paper";
import { useTranslation } from "react-i18next";

interface CardInfoProps {
  tasksInfo: {
    completedTasks: number;
    totalCompletedTasks: number;
    completionRate: number;
  };
  isWeek?: boolean;
}
export default function CardInfo({ tasksInfo, isWeek = false }: CardInfoProps) {
  const theme = useAppTheme();
  const { t } = useTranslation();

  return (
    <View>
      <Text
        variant="bodyMedium"
        style={[styles.progressText, { color: theme.colors.onBackground }]}
      >
        {t(isWeek ? "home.resume.week" : "home.resume.today")}:{" "}
        {tasksInfo.completedTasks}/{tasksInfo.totalCompletedTasks}
      </Text>
      <ProgressBar
        progress={tasksInfo.completionRate}
        color={theme.colors.primary}
        style={{
          height: 10,
          borderRadius: 8,
          backgroundColor: theme.colors.surface,
        }}
      />
      <View style={{ marginTop: 16 }}>
        <Text variant="bodySmall" style={styles.percentageText}>
          {Math.round(tasksInfo.completionRate * 100)}%{" "}
          {t("home.resume.completed")}
        </Text>
      </View>
    </View>
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
