import { useAppTheme } from "@/hooks/useAppTheme";
import { useRouter } from "expo-router";
import { RefreshControl, StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import React, { useCallback, useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { ScrollView } from "react-native-gesture-handler";
import CustomCard from "@/components/CustomCard";
import CardInfo from "@/components/Report/CardInfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/services/api";
import ContentLoader, { Circle, List, Rect } from "react-content-loader/native";
import TasksCard from "@/components/Home/TasksCard";
import { Task } from "../tasks/[tasks]";

export default function UserHome() {
  const router = useRouter();
  const theme = useAppTheme();
  const { token } = useAuth();
  const { t } = useTranslation();

  const [refreshing, setRefreshing] = useState(true);

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

  const [username, setUsername] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const getUserFullName = async () => {
      const username = await AsyncStorage.getItem("username");

      try {
        const res = await api.get("/users/" + username, {
          headers: { Authorization: `Bearer ${token}` },
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
    getUserFullName();
  }, []);

  const getUsername = async () => {
    const username = await AsyncStorage.getItem("username");
    setUsername(username ?? "");
  };

  const getTasks = async () => {
    const username = await AsyncStorage.getItem("username");

    try {
      const res = await api.get("/tasks/" + username, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        const tasksWithParsedDeadline: Task[] = res.data.map((task: Task) => ({
          ...task,
          deadline: task.deadline ? new Date(task.deadline) : undefined,
          isCompleted: task.isCompleted ?? false,
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

  const MyLoader = () => (
    <Card
      style={[
        styles.card,
        {
          backgroundColor: theme.custom.cardColor,
          marginBottom: 16,
          paddingBottom: 12,
          paddingTop: 0,
        },
      ]}
    >
      <Card.Content style={{ alignItems: "center", marginTop: -24 }}>
        <ContentLoader
          viewBox="0 0 380 70"
          animate={true}
          speed={2}
          backgroundColor={theme.custom.cardTaskBackground}
          foregroundColor="gray"
          width={476}
          height={152}
          style={{ borderWidth: 1, borderColor: "#FFF" }}
        >
          <Rect x="55" y="0" rx="4" ry="4" width="200" height="16" />
          <Rect x="55" y="32" rx="8" ry="8" width="270" height="64" />
        </ContentLoader>
      </Card.Content>
    </Card>
  );

  if (refreshing)
    return (
      <>
        <TopBar title={t("home.title", { ns: "translation" })} />
        <ScrollView
          style={{ paddingVertical: 16 }}
          contentContainerStyle={{ gap: 16, flex: 1, alignItems: "center" }}
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
          <MyLoader />
        </ScrollView>
      </>
    );

  return (
    <>
      <TopBar title={t("home.title", { ns: "translation" })} />
      <ScrollView
        style={{ paddingVertical: 16 }}
        contentContainerStyle={{ gap: 16, flex: 1, alignItems: "center" }}
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
        {tasks.length > 0 && (
          <CustomCard title={t("home.resume.title")}>
            <CardInfo tasksInfo={tasks} isMember reflesh={onRefresh} />
          </CustomCard>
        )}
        {tasks.length > 0 &&
        tasks.filter((task) => !task.isCompleted).length > 0 ? (
          <>
            <TasksCard
              name={fullName}
              tasks={tasks}
              isMember
              deadlineCloseList
            />
            <TasksCard name={fullName} tasks={tasks} isMember />
          </>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text
              className="text-2xl"
              style={{ color: theme.colors.onBackground }}
            >
              Oba! Nenhuma tarefa para fazer!
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "90%",
    paddingVertical: 12,
    paddingBottom: 0,
    borderRadius: 16,
  },
});
