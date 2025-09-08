import { useRouter } from "expo-router";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Card, FAB } from "react-native-paper";
import { useAppTheme } from "@/hooks/useAppTheme";
import React, { useCallback, useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import { useTranslation } from "react-i18next";
import ContentLoader, { Rect } from "react-content-loader/native";
import CustomCard from "@/components/GlobalComp/CustomCard";
import CardInfo from "@/components/Report/CardInfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "./members";
import { Task } from "../tasks/[tasks]";
import { Text } from "react-native-paper";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/services/FirebaseConfig";
import TasksCard from "@/components/Home/TasksCard";
import getUsersInfo from "@/utils/getUsersInfo";
import getFamilyId from "@/utils/getFamilyId";

export interface UserTasksType extends UserType {
  tasks?: Task[] | undefined;
}

export interface Family {
  id: string;
  name: string;
  owner: string;
  users: UserType[];
}

export default function Home() {
  const router = useRouter();
  const theme = useAppTheme();
  const { t } = useTranslation();
  const usersCollection = collection(db, "users");
  const tasksCollection = collection(db, "tasks");

  const [loadingUsers, setLoadingUsers] = useState(false);

  const [familyInfo, setFamilyInfo] = useState<Family | undefined>();

  const [tasks, setTasks] = useState<Task[]>([]);

  const [usersLength, setUsersLength] = useState(0);
  const [users, setUsers] = useState<UserTasksType[]>([]);

  useEffect(() => {
    reflesh();
  }, []);

  useEffect(() => {
    setTasks(users.flatMap((user: UserTasksType) => user.tasks ?? []));
  }, [users]);

  // const filterUsers = async (users: UserType[]) => {
  //   const newUsers = users
  //     .filter((user: UserType) => user.role !== "FAMILY_ADMIN")
  //     .map((user: UserType) => ({ ...user, tasks: [] }));

  //   await AsyncStorage.setItem("numOfMembersTasks", `${newUsers.length}`);
  //   setUsersLength(newUsers.length);
  //   setUsers(newUsers);
  // };

  const getUsers = async () => {
    setLoadingUsers(true);
    const familyId = await getFamilyId();

    if (!familyId) {
      setUsersLength(0);
      setLoadingUsers(false);
      setRefreshing(false);
      return;
    }
    try {
      const usersData = await getUsersInfo(familyId);
      if (usersData) {
        const filteredUsers = usersData
          .filter((user: any) => user.role !== "FAMILY_ADMIN")
          .map((user: any) => ({ ...(user as UserType), tasks: [] }));

        await AsyncStorage.setItem(
          "numOfMembersTasks",
          `${filteredUsers.length}`,
        );
        setUsersLength(filteredUsers.length);

        const userIds = filteredUsers.map((user) => user.id); // Assuming user.id exists and is the userId for tasks
        const allTasks = await fetchTasksForUsers(userIds);

        const usersWithTasks = filteredUsers.map((user) => ({
          ...user,
          tasks: allTasks.filter((task) => task.userId === user.id),
        }));

        setUsers(usersWithTasks);
        getFamilyInfo(familyInfo?.id);
      }
    } catch (error) {
      console.error("Erro while retrieving users: ", error);
    } finally {
      setRefreshing(false);
      setLoadingUsers(false);
    }
  };

  const getFamilyInfo = async (familyId: string | undefined) => {
    if (!familyId) return;

    try {
      const familyDoc = doc(db, "families", familyId);
      const family = await getDoc(familyDoc);

      setFamilyInfo(family.data() as Family);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTasksForUsers = async (userIds: string[]): Promise<Task[]> => {
    if (userIds.length === 0) return [];

    const tasksCollection = collection(db, "tasks");
    let allFetchedTasks: Task[] = [];
    const chunkSize = 10; // Firebase 'in' query limit

    for (let i = 0; i < userIds.length; i += chunkSize) {
      const chunk = userIds.slice(i, i + chunkSize);
      const q = query(tasksCollection, where("userId", "in", chunk));
      const querySnapshot = await getDocs(q);
      const tasksWithDefaults: Task[] = querySnapshot.docs.map((doc) => {
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
        } as Task;
      });
      allFetchedTasks = allFetchedTasks.concat(tasksWithDefaults);
    }
    return allFetchedTasks;
  };

  const membersLength = async () => {
    const lenght = await AsyncStorage.getItem("numOfMembersTasks");
    const lenghtNum = parseInt(lenght ?? "0");
    if (lenghtNum) {
      setUsersLength(lenghtNum);
    }
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    try {
      reflesh();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const reflesh = () => {
    getUsers();
    membersLength();
  };

  const handleAddTask = () => {
    try {
      router.push("/tasks/new");
    } catch (error) {
      console.error("Error navigating to new task:", error);
    }
  };

  const MyLoader = () => (
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
  );

  if (loadingUsers)
    return (
      <>
        <FAB
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          icon="plus"
          onPress={handleAddTask}
          color="white"
        />
        <TopBar title={t("home.title")} showNotification />
        <ScrollView
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
          ]}
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
          <View style={styles.content}>
            {usersLength === 0 && (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator size={32} />
              </View>
            )}
            {Array.from({ length: usersLength }).map((_, i) => (
              <Card
                mode="contained"
                key={i}
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
                  <MyLoader />
                </Card.Content>
              </Card>
            ))}
          </View>
        </ScrollView>
      </>
    );

  return (
    <>
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={handleAddTask}
        color="white"
      />
      <TopBar title={t("home.title")} showNotification />
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            colors={[theme.colors.onBackground]}
            progressBackgroundColor={theme.custom.cardTaskBackground}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={{
          gap: 16,
          alignItems: users.length === 0 ? "center" : undefined,
          paddingBottom: 126,
        }}
      >
        <View style={styles.content}>
          {users.length > 0 && tasks.length > 0 && (
            <CustomCard
              title={t("home.resume.title")}
              cardStyle={{ width: "90%" }}
            >
              <CardInfo tasksInfo={tasks} reflesh={onRefresh} />
            </CustomCard>
          )}

          {users.length > 0 ? (
            users
              .sort((a, b) => a?.name.localeCompare(b?.name))
              .map((user: UserTasksType) => (
                <TasksCard
                  key={user.username}
                  name={user.name}
                  tasks={user.tasks ?? []}
                />
              ))
          ) : (
            <View className="flex-1 items-center px-6 mt-12 justify-center ">
              <Text className="text-xl " style={{ textAlign: "center" }}>
                {t("home.noUserFound")}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
  },
  title: {
    textAlign: "center",
    marginTop: 100,
  },
  content: {
    gap: 16,
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 100,
    zIndex: 1000,
  },
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
