import { useAppTheme } from "@/hooks/useAppTheme";
import { RefreshControl, StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import React, { useCallback, useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";
import CustomCard from "@/components/CustomCard";
import CardInfo from "@/components/Report/CardInfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ContentLoader, { Rect } from "react-content-loader/native";
import TasksCard from "@/components/Home/TasksCard";
import { Task } from "../tasks/[tasks]";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../FirebaseConfig";
import NetInfo from "@react-native-community/netinfo";
import { useDatabase } from "@/database/useDatabase";
import uuid from "react-native-uuid";
import { useRouter } from "expo-router";

export default function UserHome() {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const database = useDatabase();
  const usersCollection = collection(db, "users");
  const tasksCollection = collection(db, "tasks");
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(true);

  const [tasks, setTasks] = useState<Task[]>([]);

  const [fullName, setFullName] = useState("");

  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? true);
    });
    reflesh();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isConnected) {
      getTasksLocalDb();
    }
  }, [isConnected]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (isConnected) {
      try {
        reflesh();
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        getTasksLocalDb();
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  const reflesh = () => {
    if (!isConnected) return;
    getTasks();
  };

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

        const taskIsoString: any[] = tasks.map((doc) => {
          const data = doc.data();
          const createdAt = data.createdAt
            ? new Date(
                data.createdAt.seconds * 1000 +
                  data.createdAt.nanoseconds / 1000000
              )
            : undefined;

          const updatedAt = data.updatedAt
            ? new Date(
                data.updatedAt.seconds * 1000 +
                  data.updatedAt.nanoseconds / 1000000
              )
            : undefined;

          const deadline = data.deadline
            ? new Date(
                data.deadline.seconds * 1000 +
                  data.deadline.nanoseconds / 1000000
              )
            : undefined;

          return {
            id: uuid.v4(),
            title: data.title ?? "",
            userId: data.userId,
            description: data.description ?? "",
            createdAt: createdAt?.toISOString(),
            updatedAt: updatedAt?.toISOString(),
            deadline: deadline?.toISOString() ?? null,
            isCompleted: data.isCompleted ? 1 : 0,
          };
        });

        setTasks(tasksWithDefaults);

        await saveLocalDb(taskIsoString, userId);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  const saveLocalDb = async (tasksDb: any[], userId: string) => {
    if (tasksDb.length <= 0) return;

    const db = await database.getDatabase();

    const stmt = await db.prepareAsync(`
      INSERT INTO Task (
        id, title, description, createdAt, updatedAt,
        deadline, isCompleted, userId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    try {
      for (const task of tasksDb) {
        await stmt.executeAsync([
          task.id,
          task.title,
          task.description ?? null,
          task.createdAt,
          task.updatedAt ?? null,
          task.deadline ?? null,
          task.isCompleted ?? 0,
          userId,
        ]);
      }
    } finally {
      await stmt.finalizeAsync();
    }
  };

  const getTasksLocalDb = async () => {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) return;

    try {
      const res = await database.getTasksByUser(userId);
      if (Array.isArray(res)) {
        const tasks = res as Task[];
        setTasks(tasks);
        console.log(tasks);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
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
        <TopBar
          title={t("home.title", { ns: "translation" })}
          showNotification
        />
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
      <TopBar title={t("home.title", { ns: "translation" })} showNotification />
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

        <Button onPress={() => router.push("/userLink/DaniloSV07")}>
          Teste
        </Button>
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
