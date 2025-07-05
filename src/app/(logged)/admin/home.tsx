import { Link, useRouter } from "expo-router";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Card, FAB, Icon } from "react-native-paper";
import { useAppTheme } from "@/hooks/useAppTheme";
import React, { useCallback, useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import ResumeCard from "@/components/Home/ResumeCard";
import TasksCard from "@/components/Home/TasksCard";
import { useTranslation } from "react-i18next";
import ContentLoader, { Circle, List, Rect } from "react-content-loader/native";
import CustomCard from "@/components/CustomCard";
import CardInfo from "@/components/Report/CardInfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "./members";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Task } from "../tasks/[tasks]";

export interface UserTasksType extends UserType {
  tasks: Task[];
}

export default function Home() {
  const router = useRouter();
  const theme = useAppTheme();
  const { t } = useTranslation();
  const { token } = useAuth();

  const [username, setUsername] = useState("");

  const [loadingUsers, setLoadingUsers] = useState(false);

  const [familyInfo, setFamilyInfo] = useState<any>();
  const [familyEncoded, setFamilyEncoded] = useState<any>();

  const [usersLength, setUsersLength] = useState(0);
  const [users, setUsers] = useState<UserTasksType[]>([]);

  useEffect(() => {
    reflesh();
    const getUsername = async () => {
      const username = await AsyncStorage.getItem("username");
      setUsername(username ?? "");
    };
    getUsername();
  }, []);

  useEffect(() => {
    if (familyInfo) {
      const familyInfoNoAvatars = {
        ...familyInfo,
        users: familyInfo.users.map((user: UserType) => ({
          ...user,
          avatar: "",
        })),
      };
      users.map((user) => {
        getUsersTasks(user.username);
      });

      setFamilyEncoded(encodeURIComponent(JSON.stringify(familyInfoNoAvatars)));
    }
  }, [familyInfo]);

  const filterUsers = async (users: []) => {
    const newUsers = users.filter(
      (user: UserType) => user.role !== "FAMILY_ADMIN"
    );

    await AsyncStorage.setItem("numOfMembersTasks", `${newUsers.length}`);
    setUsersLength(newUsers.length);
    setUsers(newUsers);
  };

  const getUsers = async () => {
    setLoadingUsers(true);
    const familyId = await getFamilyId();

    if (!familyId) {
      await AsyncStorage.setItem("numOfMembersTasks", "0");
      setUsersLength(0);
      setLoadingUsers(false);
      setRefreshing(false);
      return;
    }
    try {
      const res = await api.get("/families/" + familyId, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (res.status === 200) {
        const { users } = res.data;
        await filterUsers(users);
        setFamilyInfo(res.data);
        setLoadingUsers(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  const getFamilyId = async () => {
    const familyId = await AsyncStorage.getItem("familyId");
    if (familyId) {
      return familyId;
    }

    const username = await AsyncStorage.getItem("username");
    try {
      const res = await api.get("/users/" + username, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (res.status === 200) {
        return res.data.familyId;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const membersLength = async () => {
    const lenght = await AsyncStorage.getItem("numOfMembersTasks");
    const lenghtNum = parseInt(lenght ?? "0");
    if (lenghtNum) {
      setUsersLength(lenghtNum);
    }
  };

  const getUsersTasks = async (username: string) => {
    if (!username) throw new Error("User not found");
    try {
      const res = await api.get("/tasks/" + username, {
        headers: { Authorization: token },
      });

      if (res.status === 200) {
        const tasksWithDefaults: Task[] = res.data.map((task: Task) => ({
          ...task,
          deadline: task.deadline ? new Date(task.deadline) : undefined,
        }));
        const newUsers = users.map((user) =>
          user.username === username
            ? { ...user, tasks: tasksWithDefaults }
            : user
        );
        setUsers(newUsers);
      }
    } catch (error) {
      console.log(error);
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

  // const calculateStats = () => {
  //   const totalTasks = members.reduce(
  //     (acc, member) => acc + member.tasks.length,
  //     0
  //   );
  //   const completedTasks = members.reduce(
  //     (acc, member) => acc + member.tasks.filter((task) => task.status).length,
  //     0
  //   );
  //   const completionRate = totalTasks > 0 ? completedTasks / totalTasks : 0;

  //   const weekTotalTasks = 45;
  //   const weekCompletedTasks = 22;
  //   const weekCompletionRate =
  //     weekTotalTasks > 0 ? weekCompletedTasks / weekTotalTasks : 0;

  //   return {
  //     today: {
  //       completedTasks,
  //       totalCompletedTasks: totalTasks,
  //       completionRate,
  //     },
  //     week: {
  //       completedTasks: weekCompletedTasks,
  //       totalCompletedTasks: weekTotalTasks,
  //       completionRate: weekCompletionRate,
  //     },
  //   };
  // };

  // const stats = calculateStats();

  // const handleUpdateTasks = (memberIndex: number, updatedTasks: Task[]) => {
  //   try {
  //     const newMembers = [...members];
  //     if (memberIndex >= 0 && memberIndex < newMembers.length) {
  //       newMembers[memberIndex] = {
  //         ...newMembers[memberIndex],
  //         tasks: updatedTasks,
  //       };
  //       setMembers(newMembers);
  //     }
  //   } catch (error) {
  //     console.error("Error updating tasks:", error);
  //   }
  // };

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
        <TopBar title={t("home.title")} />
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
      <TopBar title={t("home.title")} />
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
      >
        <View style={styles.content}>
          {/* <CustomCard title={t("home.resume.title")}>
            <CardInfo tasksInfo={familyInfo} />
          </CustomCard> */}

          {users &&
            users
              .sort((a, b) => a?.name.localeCompare(b?.name))
              .map((user: UserTasksType) => (
                <TasksCard
                  key={user.username}
                  name={user.name}
                  tasks={user.tasks}
                />
              ))}
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
    bottom: 24,
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
