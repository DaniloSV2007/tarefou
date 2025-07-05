import { useAppTheme } from "@/hooks/useAppTheme";
import { Link, useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { Card, Checkbox, Divider, Icon, Text } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Task } from "@/app/(logged)/tasks/[tasks]";

interface TasksCardProps {
  name?: string;
  tasks: Task[];
  isMember?: boolean;
  deadlineCloseList?: boolean;
}

export default function TasksCard({
  name,
  tasks,
  isMember = false,
  deadlineCloseList = false,
}: TasksCardProps) {
  const theme = useAppTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const [linkColor, setLinkColor] = useState(theme.colors.onBackground);

  const [tasksCloseToDeadline, setTasksCloseToDeadline] = useState<Task[]>([]);

  useEffect(() => {
    const tasksIsCloseToDeadline = tasks.filter((task) => {
      if (!task.deadline) return false;
      const date = new Date();
      const isCloseToDeadline = new Date(task.deadline);
      isCloseToDeadline.setDate(isCloseToDeadline.getDate() - 2);
      if (date >= isCloseToDeadline) return true;

      return false;
    });
    setTasksCloseToDeadline(tasksIsCloseToDeadline);
  }, []);

  const handleTaskPress = (task: Task) => {
    if (!task || !task.id) {
      console.error("Invalid task data");
      return;
    }
    try {
      router.push({
        pathname: "/tasks/[userFullName]/[task]",
        params: {
          userFullName: name,
          task: encodeURIComponent(JSON.stringify(tasks)),
        },
      });
    } catch (error) {
      console.error("Error navigating to task:", error);
    }
  };

  if (!Array.isArray(tasks) || tasks.length === 0) {
    return (
      <Card
        style={[
          styles.card,
          {
            backgroundColor: theme.custom.cardColor,
            paddingBottom: 12,
          },
        ]}
      >
        <Card.Title
          title={t("taskCard.title", {
            name: name?.split(" ")[0],
            ns: "components",
          })}
          titleStyle={{
            fontSize: 24,
            fontWeight: "bold",
            color: theme.colors.onBackground,
          }}
        />
        <Card.Content
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: 100,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              position: "absolute",
              top: "38%",
              left: 64,
              flex: 1,
            }}
          >
            <Icon source="magnify" size={24} />
          </View>
          <Text
            style={{
              color: theme.colors.onSurface,
              fontSize: 16,
              marginLeft: 24,
            }}
          >
            {t("taskCard.noTasks", { ns: "components" })}
          </Text>
        </Card.Content>
      </Card>
    );
  }

  const user = [
    {
      name,
      tasks: tasks,
    },
  ];

  const json = encodeURIComponent(JSON.stringify(user));

  if (isMember)
    return (
      <Card
        style={[styles.card, { backgroundColor: theme.custom.cardColor }]}
        mode="elevated"
      >
        <Card.Title
          title={deadlineCloseList ? "Prazo quase acabando" : "Tarefas à fazer"}
          titleStyle={{
            fontSize: 24,
            fontWeight: "bold",
            color: theme.colors.onBackground,
          }}
        />
        <Card.Content>
          <View style={styles.tasksContainer}>
            {deadlineCloseList
              ? tasksCloseToDeadline.map((task, index) => (
                  <React.Fragment key={task.id}>
                    <Pressable
                      style={styles.taskContainer}
                      android_ripple={{ color: theme.custom.ripple }}
                      onPress={() => handleTaskPress(task)}
                    >
                      {task.isCompleted ? (
                        <Icon source="check" size={24} />
                      ) : (
                        <Icon source="clock" size={24} />
                      )}

                      <Text
                        style={[
                          styles.progressText,
                          {
                            color: task.isCompleted
                              ? theme.colors.onSurfaceDisabled
                              : theme.colors.onBackground,
                            textDecorationLine: task.isCompleted
                              ? "line-through"
                              : "none",
                            fontWeight: "bold",
                          },
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {task.title}
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
                      <Divider
                        style={{ backgroundColor: theme.colors.surface }}
                      />
                    )}
                  </React.Fragment>
                ))
              : tasks
                  .filter((task) => !task.isCompleted)
                  .map((task, index) => (
                    <React.Fragment key={task.id}>
                      <Pressable
                        style={styles.taskContainer}
                        android_ripple={{ color: theme.custom.ripple }}
                        onPress={() => handleTaskPress(task)}
                      >
                        {task.isCompleted ? (
                          <Icon source="check" size={24} />
                        ) : (
                          <Icon source="clock" size={24} />
                        )}

                        <Text
                          style={[
                            styles.progressText,
                            {
                              color: task.isCompleted
                                ? theme.colors.onSurfaceDisabled
                                : theme.colors.onBackground,
                              textDecorationLine: task.isCompleted
                                ? "line-through"
                                : "none",
                              fontWeight: "bold",
                            },
                          ]}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {task.title}
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
                        <Divider
                          style={{ backgroundColor: theme.colors.surface }}
                        />
                      )}
                    </React.Fragment>
                  ))}
          </View>
          <Link
            href={`/tasks/${json}`}
            onPressIn={() => setLinkColor(theme.colors.onSurfaceDisabled)}
            onPressOut={() => setLinkColor(theme.colors.onSurface)}
            style={[
              { color: linkColor, paddingTop: 4 },
              linkColor === theme.colors.primary && {
                textDecorationLine: "underline",
              },
            ]}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Text style={{ color: linkColor }}>
                {t("taskCard.viewAll", { ns: "components" })}
              </Text>

              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 3,
                }}
              >
                <Icon source="chevron-right" size={24} color={linkColor} />
              </View>
            </View>
          </Link>
        </Card.Content>
      </Card>
    );

  return (
    <Card
      style={[styles.card, { backgroundColor: theme.custom.cardColor }]}
      mode="elevated"
    >
      <Card.Title
        title={t("taskCard.title", {
          name: name?.split(" ")[0],
          ns: "components",
        })}
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
              if (a.isCompleted === b.isCompleted) return 0;
              return a.isCompleted ? 1 : -1;
            })
            .slice(0, 4)
            .map((task, index) => (
              <React.Fragment key={task.id}>
                <Pressable
                  style={styles.taskContainer}
                  android_ripple={{ color: theme.custom.ripple }}
                  onPress={() => handleTaskPress(task)}
                >
                  {task.isCompleted ? (
                    <Icon source="check" size={24} />
                  ) : (
                    <Icon source="clock" size={24} />
                  )}

                  <Text
                    style={[
                      styles.progressText,
                      {
                        color: task.isCompleted
                          ? theme.colors.onSurfaceDisabled
                          : theme.colors.onBackground,
                        textDecorationLine: task.isCompleted
                          ? "line-through"
                          : "none",
                        fontWeight: "bold",
                      },
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {task.title}
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
        <Link
          href={`/tasks/${json}`}
          onPressIn={() => setLinkColor(theme.colors.onSurfaceDisabled)}
          onPressOut={() => setLinkColor(theme.colors.onSurface)}
          style={[
            { color: linkColor, paddingTop: 4 },
            linkColor === theme.colors.primary && {
              textDecorationLine: "underline",
            },
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Text style={{ color: linkColor }}>
              {t("taskCard.viewAll", { ns: "components" })}
            </Text>

            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 3,
              }}
            >
              <Icon source="chevron-right" size={24} color={linkColor} />
            </View>
          </View>
        </Link>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "90%",
    paddingVertical: 12,
    paddingBottom: 0,
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
