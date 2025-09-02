import { useAppTheme } from "@/hooks/useAppTheme";
import { View, StyleSheet } from "react-native";
import { Text, ProgressBar } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { Task } from "@/app/(logged)/tasks/[tasks]";
import { useCallback, useEffect, useState } from "react";
import React from "react";
import { deleteDoc, doc } from "@firebase/firestore";
import { db } from "@/services/FirebaseConfig";

interface CardInfoProps {
  tasksInfo: Task[];
  isWeek?: boolean;
  isMember?: boolean;
  reflesh: () => void;
}
export default function CardInfo({
  tasksInfo,
  isWeek = false,
  reflesh,
}: CardInfoProps) {
  const theme = useAppTheme();
  const { t } = useTranslation();

  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalTask, setTotalTask] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);

  useEffect(() => {
    getTotalTasks();
    getCompletedTasks();
  }, []);

  useEffect(() => {
    if (totalTask > 0) {
      setCompletionRate(completedTasks / totalTask);
    }
  }, [totalTask, completedTasks]);

  const getTotalTasks = useCallback(() => {
    if (tasksInfo.length > 0) {
      const allTasks = tasksInfo.filter((task) => {
        if (!task.deadline) return true;
        const date = new Date();
        const noShowIfDeadline = new Date(task.deadline);
        noShowIfDeadline.setDate(noShowIfDeadline.getDate() + 2);
        if (date >= noShowIfDeadline) {
          deleteFromDatabase(task);
          return false;
        }

        if (task.isCompleted && task.updatedAt) {
          const deleteIf = new Date(task.updatedAt);
          deleteIf.setDate(deleteIf.getDate() + 2);
          if (date >= deleteIf) deleteFromDatabase(task);
        }

        return true;
      });
      setTotalTask(allTasks.length);
    }
  }, []);

  const getCompletedTasks = () => {
    if (tasksInfo.length > 0) {
      const tasksCompleted = tasksInfo.filter((task) => task.isCompleted);
      setCompletedTasks(tasksCompleted.length);
    }
  };

  const deleteFromDatabase = async (task: Task) => {
    try {
      if (!task) throw new Error("Task not provided");
      const taskDoc = doc(db, "tasks", task.id);
      await deleteDoc(taskDoc);

      reflesh();
    } catch (error) {
      console.error(error);
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
        !isWeek && (
          <View className="items-center py-8">
            <Text className="text-xl">
              {t("tasks.common.noTasksFound", { ns: "screens" })}
            </Text>
          </View>
        )
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
