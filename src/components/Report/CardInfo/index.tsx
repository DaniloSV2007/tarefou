import { useAppTheme } from "@/hooks/useAppTheme";
import { View, StyleSheet } from "react-native";
import { Text, ProgressBar } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { Task } from "@/app/(logged)/tasks/[tasks]";
import { useEffect, useState } from "react";
import tasks from "@/app/(logged)/user/tasks";
import React from "react";

interface CardInfoProps {
  tasksInfo: Task[];
  isWeek?: boolean;
  isMember?: boolean;
}
export default function CardInfo({
  tasksInfo,
  isWeek = false,
  isMember = false,
}: CardInfoProps) {
  const theme = useAppTheme();
  const { t } = useTranslation();

  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalTask, setTotalTask] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);

  useEffect(() => {
    getStatistics();
  }, []);

  useEffect(() => {
    if (totalTask > 0) {
      setCompletionRate(completedTasks / totalTask);
    }
  }, [totalTask, completedTasks]);

  const getStatistics = () => {
    getTotalTasks();
    getCompletedTasks();
  };

  const getTotalTasks = () => {
    if (tasksInfo.length > 0) {
      const allTasks = tasksInfo.filter((task) => {
        if (!task.deadline) return true;
        const date = new Date();
        const noShowIf = new Date(task.deadline);
        noShowIf.setDate(noShowIf.getDate() + 2);
        if (date >= noShowIf) return false;
        return true;
      });
      setTotalTask(allTasks.length);
    }
  };

  const getCompletedTasks = () => {
    if (tasksInfo.length > 0) {
      const tasksCompleted = tasksInfo.filter((task) => task.isCompleted);
      setCompletedTasks(tasksCompleted.length);
    }
  };

  return (
    <View>
      {tasksInfo.length > 0 ? (
        <>
          <Text
            variant="bodyMedium"
            style={[styles.progressText, { color: theme.colors.onBackground }]}
          >
            {t(isWeek ? "home.resume.week" : "home.resume.today")}:{" "}
            {completedTasks}/{totalTask}
          </Text>
          <ProgressBar
            progress={completionRate}
            color={theme.colors.primary}
            style={{
              height: 10,
              borderRadius: 8,
              backgroundColor: theme.colors.surface,
            }}
          />
          <View style={{ marginTop: 16 }}>
            <Text variant="bodySmall" style={styles.percentageText}>
              {Math.round(completionRate * 100)}% {t("home.resume.completed")}
            </Text>
          </View>
        </>
      ) : (
        <View className="items-center py-8">
          <Text>{t("tasks.common.noTasksFound", { ns: "screens" })}</Text>
        </View>
      )}
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
