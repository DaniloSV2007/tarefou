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
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../FirebaseConfig";

export default function UserHome() {
  const router = useRouter();
  const theme = useAppTheme();
  const { t } = useTranslation();
  const usersCollection = collection(db, "users");
  const tasksCollection = collection(db, "tasks");

  const [refreshing, setRefreshing] = useState(true);

  const [tasks, setTasks] = useState<Task[]>([]);

  const [fullName, setFullName] = useState("");

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

        const tasks = tasksQuerySnapshot.docs;

        const tasksWithDefaults: Task[] = tasks.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title ?? "",
            userId: data.userId ?? "",
            description: data.description,
            createdAt: data.createdAt
              ? new Date(
                  data.createdAt.seconds * 1000 +
                    data.createdAt.nanoseconds / 1000000
                )
              : undefined,
            updatedAt: data.updatedAt
              ? new Date(
                  data.updatedAt.seconds * 1000 +
                    data.updatedAt.nanoseconds / 1000000
                )
              : undefined,
            deadline: data.deadline
              ? new Date(
                  data.deadline.seconds * 1000 +
                    data.deadline.nanoseconds / 1000000
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

  // const goToTaksDetails = (task: Task) => {
  //   const encodedTask = encodeURIComponent(JSON.stringify(task));
  //   router.push({
  //     pathname: "/tasks/[userFullName]/[task]",
  //     params: {
  //       userFullname: fullName,
  //       task: encodedTask,
  //     },
  //   });
  // };

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
            {tasks.filter((task: Task) => {
              if (!task.deadline || task.isCompleted) return false;
              const date = new Date();
              const isCloseToDeadline = new Date(task.deadline);
              isCloseToDeadline.setDate(isCloseToDeadline.getDate() - 2);
              if (date >= isCloseToDeadline) return true;

              return false;
            }).length > 0 && (
              <TasksCard
                name={fullName}
                tasks={tasks}
                isMember
                deadlineCloseList
              />
            )}
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
