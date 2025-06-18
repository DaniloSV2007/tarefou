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
import { Card, Icon } from "react-native-paper";
import { useTranslation } from "react-i18next";

type Task = {
  id: string;
  name: string;
  description?: string;
  status: boolean;
};

interface User {
  name: string;
  tasks: Task[];
}

export default function AllTasks() {
  const params = useLocalSearchParams<{ tasks: string }>();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useAppTheme();
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    async function fetchTasks() {
      try {
        const usersDecoded = JSON.parse(decodeURIComponent(params.tasks));

        if (usersDecoded.length === 0) {
          setUsers([]);
          setLoading(false);
          return;
        }

        setUsers(usersDecoded);
      } catch (err) {
        console.error(err);
        setError("Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [params.tasks]);

  const handleTaskPress = (task: Task) => {
    if (!task || !task.id) return;

    router.push({
      pathname: "/admin/home/[userFullName]/[taskId]",
      params: {
        userFullName: users[0].name,
        taskId: task.id.toString(),
      },
    });
  };

  if (loading)
    return <ActivityIndicator size="large" color={theme.colors.onBackground} />;

  if (error) return <Text>Error: {error}</Text>;

  return (
    <>
      <TopBar title="All Tasks" isBackButtonEnable={true} />
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
          {users.length === 0 ? (
            <Text>No tasks found.</Text>
          ) : (
            users.map((user) => (
              <View key={user.name} style={{ gap: 16 }}>
                <Text
                  style={{
                    color: theme.colors.onBackground,
                    fontSize: 24,
                    fontWeight: "bold",
                    marginBottom: 8,
                    marginLeft: 16,
                  }}
                >
                  {user.name}
                </Text>
                {user.tasks.map((task) => (
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
                            source={task.status ? "check" : "clock"}
                            size={32}
                            color={
                              task.status
                                ? theme.colors.onSurfaceDisabled
                                : theme.colors.onBackground
                            }
                          />
                          <Text
                            style={{
                              fontSize: 28,
                              fontWeight: "bold",
                              marginLeft: 8,
                              color: task.status
                                ? theme.colors.onSurfaceDisabled
                                : theme.colors.onBackground,
                            }}
                          >
                            {task.name}
                          </Text>
                        </View>

                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Text
                            style={[
                              { color: theme.colors.onSurface },
                              styles.textBold,
                            ]}
                          >
                            Description:{" "}
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

                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            position: "absolute",
                            right: 0,
                            top: "40%",
                          }}
                        >
                          <Icon source="chevron-right" size={32} />
                        </View>
                      </Card.Content>
                    </Pressable>
                  </Card>
                ))}
              </View>
            ))
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
