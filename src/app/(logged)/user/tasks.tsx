import { Pressable, RefreshControl, ScrollView, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import TopBar from "@/components/TopBar";
import { useRouter } from "expo-router";
import CustomCard from "@/components/CustomCard";
import { Card, Icon, Searchbar, Text } from "react-native-paper";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/services/api";
import { type Task } from "../tasks/[tasks]";

export default function tasks() {
  const theme = useAppTheme();
  const { token } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  const [searchValue, setSearchValue] = useState("");

  const [refreshing, setRefreshing] = useState(false);

  const [username, setUsername] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const [fullName, setFullName] = useState("second");

  useEffect(() => {
    const getUserFullName = async () => {
      const username = await AsyncStorage.getItem("username");

      try {
        const res = await api.get("/users/" + username, {
          headers: { Authorization: token },
        });
        if (res.status === 200) {
          setFullName(res.data.name);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getUsername();
    reflesh();
    getUserFullName;
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    try {
      reflesh();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const reflesh = () => {
    getTasks();
  };

  const getUsername = async () => {
    const username = await AsyncStorage.getItem("username");
    setUsername(username ?? "");
  };

  const getTasks = async () => {
    const username = await AsyncStorage.getItem("username");

    try {
      const res = await api.get("/tasks/" + username, {
        headers: { Authorization: token },
      });
      if (res.status === 200) {
        const tasksWithParsedDeadline = res.data.map((task: Task) => ({
          ...task,
          deadline: task.deadline ? new Date(task.deadline) : undefined,
        }));
        setTasks(tasksWithParsedDeadline);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  const goToTaksDetails = (task: Task) => {
    const encodedTask = encodeURIComponent(JSON.stringify(task));
    router.push({
      pathname: "/tasks/[userFullName]/[task]",
      params: {
        userFullname: fullName,
        task: encodedTask,
      },
    });
  };

  return (
    <>
      <TopBar title={t("tasks.title", { ns: "translation" })} />
      <View
        className="flex-1"
        style={{ backgroundColor: theme.colors.background }}
      >
        <ScrollView
          style={{ paddingVertical: 16 }}
          contentContainerStyle={{ gap: 16, flex: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              colors={[theme.colors.onBackground]}
              progressBackgroundColor={theme.custom.cardTaskBackground}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
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

          {(() => {
            const filteredTasks = tasks.filter(
              (task) =>
                task.title.toLowerCase().includes(searchValue.toLowerCase()) ||
                (task.description
                  ?.toLowerCase()
                  .includes(searchValue.toLowerCase()) ??
                  false)
            );
            if (filteredTasks.length === 0) {
              return (
                <View className="items-center justify-center flex-1 ">
                  <Text>
                    {t("tasks.common.noTasksFound", { ns: "screens" })}
                  </Text>
                </View>
              );
            }
            return filteredTasks.map((task) => (
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
                  onPress={() => goToTaksDetails(task)}
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
                    {task.deadline && (
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
                          {t("tasks.admin.allTasks.deadline", {
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
                          {`${task.deadline?.getHours()}:${task.deadline?.getMinutes()}, ` +
                            `${task.deadline?.toLocaleDateString()}`}
                        </Text>
                      </View>
                    )}

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
            ));
          })()}
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
