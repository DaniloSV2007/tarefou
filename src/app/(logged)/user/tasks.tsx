import {
  Keyboard,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useThemeContext } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import TopBar from "@/components/TopBar";
import { useRouter } from "expo-router";
import { Card, Icon, Searchbar, Text } from "react-native-paper";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/services/api";
import { type Task } from "../tasks/[tasks]";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/services/FirebaseConfig";

export default function tasks() {
  const { theme } = useThemeContext();
  const { t } = useTranslation();
  const router = useRouter();
  const usersCollection = collection(db, "users");
  const tasksCollection = collection(db, "tasks");

  const [searchValue, setSearchValue] = useState("");

  const [isFocus, setIsFocus] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);

  const [fullName, setFullName] = useState("second");

  useEffect(() => {
    console.log(Keyboard.isVisible());
  }, [Keyboard.isVisible()]);

  useEffect(() => {
    reflesh();
  }, []);

  const getTasks = async () => {
    const username = await AsyncStorage.getItem("username");

    try {
      const q = query(usersCollection, where("username", "==", username));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userId = querySnapshot.docs[0].id;
        const fullName = querySnapshot.docs[0].data().name;

        setFullName(fullName);

        const taskQ = query(tasksCollection, where("userId", "==", userId));
        const tasksQuerySnapshot = await getDocs(taskQ);
        if (querySnapshot.empty) return;

        const tasksDocs = tasksQuerySnapshot.docs;

        const tasksWithDefaults: Task[] = tasksDocs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            title: data.title ?? "",
            userId: data.userId ?? "",
            description: data.description,
            createdAt: data.createdAt
              ? new Date(
                  data.createdAt.seconds * 1000 +
                    data.createdAt.nanoseconds / 1000000,
                )
              : undefined,
            updatedAt: data.updatedAt
              ? new Date(
                  data.updatedAt.seconds * 1000 +
                    data.updatedAt.nanoseconds / 1000000,
                )
              : undefined,
            deadline: data.deadline
              ? new Date(
                  data.deadline.seconds * 1000 +
                    data.deadline.nanoseconds / 1000000,
                )
              : undefined,
            isCompleted: data.isCompleted ?? false,
          };
        });

        setTasks(tasksWithDefaults);
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

  return (
    <>
      <TopBar
        title={t("tasks.title", { ns: "translation" })}
        showNotification
      />
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
              progressBackgroundColor={theme.colors.cardTaskBackground}
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
                backgroundColor: theme.colors.cardTaskBackground,
              }}
              inputStyle={{ color: theme.colors.onBackground, fontSize: 24 }}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
            />
          </View>

          {(() => {
            const filteredTasks = tasks.filter(
              (task) =>
                task.title.toLowerCase().includes(searchValue.toLowerCase()) ||
                (task.description
                  ?.toLowerCase()
                  .includes(searchValue.toLowerCase()) ??
                  false),
            );
            if (filteredTasks.length === 0) {
              return (
                <View
                  className={`items-center flex-1 ${
                    !isFocus && "justify-center"
                  }`}
                >
                  <Text className={`text-2xl`} style={{ marginTop: 32 }}>
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
                    backgroundColor: theme.colors.cardColor,
                    paddingHorizontal: 16,
                    alignSelf: "center",
                  },
                ]}
              >
                <Pressable
                  android_ripple={{ color: theme.colors.ripple }}
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
                        source={
                          task.isCompleted
                            ? "check"
                            : new Date() >= new Date(task.deadline ?? 0)
                              ? "clock-alert"
                              : "clock"
                        }
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
function isTimestamp(created: any): boolean {
  throw new Error("Function not implemented.");
}
