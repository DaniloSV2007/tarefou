import { useAppTheme } from "@/hooks/useAppTheme";
import { StyleSheet, View } from "react-native";
import { Card, Checkbox, Divider, Icon, Text } from "react-native-paper";
import React from "react";

interface TasksCardProps {
  name: string;
  tasks: any[];
  setTasks: (tasks: any[]) => void;
}

export default function TasksCard({ name, tasks, setTasks }: TasksCardProps) {
  const theme = useAppTheme();
  return (
    <Card style={[styles.card, { backgroundColor: theme.custom.cardColor }]}>
      <Card.Title title={`${name}'s Tasks`} titleStyle={{ fontSize: 24 }} />
      <Card.Content
        style={[
          styles.cardContent,
          { backgroundColor: theme.custom.cardTaskBackground },
        ]}
      >
        {tasks.length === 0 ? (
          <Text>No tasks found.</Text>
        ) : (
          <>
            {tasks.map((task, index) => (
              <React.Fragment key={task.id}>
                <View style={styles.taskContainer}>
                  <Checkbox
                    status={task.status ? "checked" : "unchecked"}
                    onPress={() => {
                      setTasks(
                        tasks.map((t) =>
                          t.id === task.id ? { ...t, status: !t.status } : t
                        )
                      );
                    }}
                  />
                  <Text
                    style={[
                      styles.progressText,
                      {
                        color: theme.colors.onBackground,
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
                </View>

                {index < tasks.length - 1 && (
                  <Divider
                    style={{
                      marginVertical: 12,
                      backgroundColor: theme.colors.onBackground,
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  progressText: {
    fontSize: 16,
  },
  descriptionText: {
    fontSize: 16,
    maxWidth: "50%",
  },
  percentageText: {
    fontSize: 16,
  },
  card: {
    padding: 10,
    borderRadius: 12,
    width: "90%",
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardContent: {
    borderRadius: 12,
    padding: 20,
  },
});
