import { useAppTheme } from "@/hooks/useAppTheme";
import { Pressable, StyleSheet, View } from "react-native";
import { Card, Checkbox, Divider, Icon, Text } from "react-native-paper";
import React from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

interface Task {
  id: number;
  name: string;
  status: boolean;
  description: string;
}

interface TasksCardProps {
  name: string;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

export default function TasksCard({ name, tasks, setTasks }: TasksCardProps) {
  const theme = useAppTheme();
  const { t } = useTranslation();

  const handleTaskPress = (task: Task) => {
    try {
      router.push({
        pathname: "/tasks/[userFullName]/[taskId]",
        params: {
          userFullName: name,
          taskId: task.id.toString(),
        },
      });
    } catch (error) {
      console.error("Error navigating to task:", error);
    }
  };

  const handleTaskStatusChange = (taskIndex: number) => {
    try {
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        status: !updatedTasks[taskIndex].status,
      };
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <Card
      style={[styles.card, { backgroundColor: theme.custom.cardColor }]}
      mode="contained"
    >
      <Card.Title
        title={name}
        titleStyle={{
          fontSize: 24,
          fontWeight: "bold",
          color: theme.colors.onBackground,
        }}
      />
      <Card.Content>
        <View style={styles.tasksContainer}>
          {tasks
            .sort((a, b) => {
              if (a.status === b.status) return 0;
              return a.status ? 1 : -1;
            })
            .map((task, index) => (
              <React.Fragment key={task.id}>
                <Pressable
                  style={styles.taskContainer}
                  android_ripple={{ color: theme.custom.ripple }}
                  onPress={() => handleTaskPress(task)}
                >
                  {task.status ? (
                    <Icon source="check" size={24} />
                  ) : (
                    <Icon source="clock" size={24} />
                  )}

                  <Text
                    style={[
                      styles.progressText,
                      {
                        color: task.status
                          ? theme.colors.onSurfaceDisabled
                          : theme.colors.onBackground,
                        textDecorationLine: task.status
                          ? "line-through"
                          : "none",
                        fontWeight: "bold",
                      },
                    ]}
                    numberOfLines={0}
                    ellipsizeMode="tail"
                  >
                    {task.name}
                  </Text>
                  <Text
                    style={[
                      styles.descriptionText,
                      { color: theme.colors.onSurface },
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {task.description}
                  </Text>
                  <View style={{ position: "absolute", right: 0 }}>
                    <Icon
                      source="chevron-right"
                      size={32}
                      color={theme.colors.secondary}
                    />
                  </View>
                </Pressable>
                {index < tasks.length - 1 && (
                  <Divider style={{ backgroundColor: theme.colors.surface }} />
                )}
              </React.Fragment>
            ))}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "90%",
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  tasksContainer: {
    gap: 8,
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  progressText: {
    fontSize: 16,
    flex: 1,
  },
  descriptionText: {
    fontSize: 14,
    opacity: 0.7,
    flex: 1,
    marginRight: 22,
  },
});
