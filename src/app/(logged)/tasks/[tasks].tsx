import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import { useEffect, useState } from "react";
import React from "react";
import TopBar from "@/components/TopBar";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Card, Icon, Searchbar } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { Timestamp } from "firebase/firestore";

export type Task = {
  id: string;
  title: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deadline?: Timestamp;
  isCompleted?: boolean;
  userId: string;
  repeat?: {
    frequency: "DAILY" | "WEEKLY" | "MONTHLY";
    interval: number; // every N units
    endType: "NEVER" | "DATE" | "COUNT";
    endDate?: Date; // when endType === 'DATE'
    endCount?: number; // when endType === 'COUNT'
    createdCount?: number; // how many extra occurrences created
    startDate?: Date; // base reference for next occurrence
  };
};

interface User {
  name: string;
  tasks: Task[];
}

export default function AllTasks() {
  const params = useLocalSearchParams<{ tasks: string }>();
  const theme = useAppTheme();
  const { t } = useTranslation();
  const router = useRouter();

  const [users, setUsers] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    async function fetchTasks() {
      try {
        const usersDecoded = JSON.parse(decodeURIComponent(params.tasks));

        if (usersDecoded.length === 0) {
          setLoading(false);
          return;
        }

        setUsers(usersDecoded[0]);
      } catch (err) {
        console.error(err);
        setError("Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [params.tasks]);

  useEffect(() => {
    if (users?.tasks && users.tasks.length > 0) {
      setTasks(users.tasks);
    }
  }, [users]);

  const handleTaskPress = (task: Task) => {
    if (!task || !task.id) return;

    router.push({
      pathname: "/tasks/[userFullName]/[task]",
      params: {
        userFullName: users?.name,
        task: encodeURIComponent(JSON.stringify(task)),
      },
    });
  };

  if (loading)
    return <ActivityIndicator size="large" color={theme.colors.onBackground} />;

  if (error) return <Text>Error: {error}</Text>;

  return (
    <>
      <TopBar
        title={t("tasks.admin.allTasks.title", {
          ns: "screens",
          name: users?.name.split(" ")[0],
        })}
        isBackButtonEnable={true}
      />
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: 24,
            gap: 16,
            flexGrow: 1,
            backgroundColor: theme.colors.background,
          }}
        >
          <View className="items-center">
            <Searchbar
              value={searchValue}
              placeholder={t("tasks.admin.allTasks.searchPlaceholder", {
                ns: "screens",
              })}
              onChangeText={(text) => setSearchValue(text)}
              style={{
                width: "90%",
                backgroundColor: theme.custom.cardTaskBackground,
              }}
              inputStyle={{ color: theme.colors.onBackground, fontSize: 24 }}
            />
          </View>

          {tasks.length === 0 ? (
            <View className="items-center justify-center">
              <Text className="text-2xl">
                {t("tasks.common.noTasksFound", { ns: "screens" })}.
              </Text>
            </View>
          ) : users?.tasks && users.tasks.length > 0 ? (
            searchValue !== "" ? (
              tasks.filter(
                (task) =>
                  task.title
                    .toLowerCase()
                    .includes(searchValue.toLowerCase()) ||
                  (task.description
                    ?.toLowerCase()
                    .includes(searchValue.toLowerCase()) ??
                    false),
              ).length === 0 ? (
                <View className="items-center">
                  <Text className="text-2xl">
                    {t("tasks.common.noTasksFound", { ns: "screens" })}.
                  </Text>
                </View>
              ) : (
                <View style={{ gap: 16 }}>
                  {tasks
                    .filter(
                      (task) =>
                        task.title
                          .toLowerCase()
                          .includes(searchValue.toLowerCase()) ||
                        (task.description
                          ?.toLowerCase()
                          .includes(searchValue.toLowerCase()) ??
                          false),
                    )
                    .map((task) => (
                      <Card
                        key={task.id}
                        style={[
                          styles.card,
                          {
                            backgroundColor: theme.custom.cardColor,
                            paddingHorizontal: 16,
                            alignSelf: "center",
                          },
                        ]}
                      >
                        <Pressable
                          android_ripple={{ color: theme.custom.ripple }}
                          onPress={() => handleTaskPress(task)}
                        >
                          <Card.Content style={styles.tasksContainer}>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Icon
                                source={task.isCompleted ? "check" : "clock"}
                                size={32}
                                color={
                                  task.isCompleted
                                    ? theme.colors.onSurfaceDisabled
                                    : theme.colors.onBackground
                                }
                              />
                              <Text
                                ellipsizeMode="tail"
                                numberOfLines={1}
                                style={{
                                  fontSize: 24,
                                  fontWeight: "bold",
                                  marginLeft: 8,
                                  color: task.isCompleted
                                    ? theme.colors.onSurfaceDisabled
                                    : theme.colors.onBackground,
                                  maxWidth: "85%",
                                }}
                              >
                                {task.title}
                              </Text>
                            </View>

                            {task.description != "" && (
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                <Text
                                  style={[
                                    { color: theme.colors.onSurface },
                                    styles.textBold,
                                  ]}
                                >
                                  {t("tasks.admin.allTasks.description", {
                                    ns: "screens",
                                  })}{" "}
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
                              </View>
                            )}

                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                position: "absolute",
                                right: 0,
                                top: task.description != "" ? "30%" : undefined,
                              }}
                            >
                              <Icon source="chevron-right" size={32} />
                            </View>
                          </Card.Content>
                        </Pressable>
                      </Card>
                    ))}
                </View>
              )
            ) : (
              <View style={{ gap: 16 }}>
                {tasks.map((task) => (
                  <Card
                    key={task.id}
                    style={[
                      styles.card,
                      {
                        backgroundColor: theme.custom.cardColor,
                        paddingHorizontal: 16,
                        alignSelf: "center",
                      },
                    ]}
                  >
                    <Pressable
                      android_ripple={{ color: theme.custom.ripple }}
                      onPress={() => handleTaskPress(task)}
                    >
                      <Card.Content style={styles.tasksContainer}>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Icon
                            source={task.isCompleted ? "check" : "clock"}
                            size={32}
                            color={
                              task.isCompleted
                                ? theme.colors.onSurfaceDisabled
                                : theme.colors.onBackground
                            }
                          />
                          <Text
                            ellipsizeMode="tail"
                            numberOfLines={1}
                            style={{
                              fontSize: 24,
                              fontWeight: "bold",
                              marginLeft: 8,
                              color: task.isCompleted
                                ? theme.colors.onSurfaceDisabled
                                : theme.colors.onBackground,
                              maxWidth: "85%",
                            }}
                          >
                            {task.title}
                          </Text>
                        </View>

                        {task.description != "" && (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={[
                                { color: theme.colors.onSurface },
                                styles.textBold,
                              ]}
                            >
                              {t("tasks.admin.allTasks.description", {
                                ns: "screens",
                              })}{" "}
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
                          </View>
                        )}

                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            position: "absolute",
                            right: 0,
                            top: task.description != "" ? "30%" : undefined,
                          }}
                        >
                          <Icon source="chevron-right" size={32} />
                        </View>
                      </Card.Content>
                    </Pressable>
                  </Card>
                ))}
              </View>
            )
          ) : (
            <Text>No tasks found.</Text>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "90%",
    paddingVertical: 12,
    gap: 8,
    borderRadius: 16,
  },
  tasksContainer: {
    gap: 8,
    paddingHorizontal: 0,
  },
  descriptionText: {
    fontSize: 20,
    opacity: 0.7,
    flex: 1,
    marginRight: 22,
  },
  textBold: {
    fontWeight: "bold",
    fontSize: 20,
  },
});
