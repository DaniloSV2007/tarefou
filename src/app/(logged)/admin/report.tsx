import GeneralReportCard from "@/components/Report/GeneralReportCard";
import ReportCard from "@/components/Report/ReportCard";
import TopBar from "@/components/TopBar";
import { useAppTheme } from "@/hooks/useAppTheme";
import { RefreshControl, ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { Card } from "react-native-paper";
import ContentLoader, { Circle, List, Rect } from "react-content-loader/native";
import CustomCard from "@/components/CustomCard";
import CardInfo from "@/components/Report/CardInfo";
import { UserTasksType } from "./home";
import { Task } from "../tasks/[tasks]";
import api from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/AuthContext";
import { UserType } from "./members";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../FirebaseConfig";

export default function Report() {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const { token } = useAuth();
  const usersCollection = collection(db, "users");

  const totalTasks = 20;
  const completedTasks = 15;
  const completionRate = completedTasks / totalTasks;

  const weekCompletedTasks = 22;
  const weekTotalTasks = 45;
  const weekCompletionRate = weekCompletedTasks / weekTotalTasks;

  const [totalMembersInfo, setTotalMembersInfo] = useState<Task[]>([]);
  const [users, setUsers] = useState<UserTasksType[]>([]);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (users.some((user) => !user.tasks || user.tasks.length === 0)) {
      const fetchTasks = async () => {
        if (!users || users.length === 0) return;

        //   const updatedUsers: UserTasksType[] = await Promise.all(
        //     users.map(async (user) => {
        //       try {
        //         const res = await api.get("/tasks/" + user.username, {
        //           headers: { Authorization: `Bearer ${token}` },
        //         });

        //         if (res.status === 200) {
        //           const tasksWithDefaults: Task[] = res.data.map(
        //             (task: Task) => ({
        //               ...task,
        //               deadline: task.deadline
        //                 ? new Date(task.deadline)
        //                 : undefined,
        //             })
        //           );
        //           return { ...user, tasks: tasksWithDefaults };
        //         }
        //       } catch (error) {
        //         console.log("Erro ao buscar tarefas de", user.username, error);
        //       }
        //       return user;
        //     })
        //   );

        //   setUsers(updatedUsers);
        //   setTotalMembersInfo(updatedUsers.map((u) => u.tasks || []).flat());
      };

      fetchTasks();
    }
  }, [users]);

  const filterUsers = async (users: UserType[]) => {
    const newUsers = users
      .filter((user: UserType) => user.role !== "FAMILY_ADMIN")
      .map((user: UserType) => ({ ...user, tasks: [] }));

    setUsers(newUsers);
  };

  const getUsers = async () => {
    setLoadingUsers(true);
    const familyId = await getFamilyId();

    if (!familyId) {
      setLoadingUsers(false);
      setRefreshing(false);
      return;
    }
    try {
      const q = query(usersCollection, where("familyId", "==", familyId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const usersDocs = querySnapshot.docs;
        const users = usersDocs.map((user: any) => user.data());
        await filterUsers(users);
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
      const q = query(usersCollection, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const user = querySnapshot.docs[0];
        const data = user.data();
        return data.familyId;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getUsersTasks = async (username: string) => {
    if (!username) throw new Error("User not found");
    try {
      const res = await api.get("/tasks/" + username, {
        headers: { Authorization: `Bearer ${token}` },
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
      console.error(error);
    }
  };

  const MyLoader = () => (
    <Card
      style={{
        backgroundColor: theme.custom.cardColor,
        width: "90%",
        overflow: "hidden",
        paddingVertical: 12,
        paddingBottom: 0,
        borderRadius: 16,
      }}
    >
      <Card.Content
        style={{ minHeight: 250, alignItems: "center", marginTop: -140 }}
      >
        <ContentLoader
          viewBox="0 0 380 70"
          animate={true}
          speed={2}
          backgroundColor={theme.custom.cardTaskBackground}
          foregroundColor="gray"
          width={476}
          height={364}
        >
          <Circle cx="74" cy="19" r="19" />
          <Rect x="108" y="6" rx="4" ry="4" width="200" height="16" />
          <Rect x="108" y="28" rx="2" ry="2" width="100" height="8" />
          <Rect x="55" y="48" rx="4" ry="4" width="180" height="12" />
          <Rect x="55" y="68" rx="4" ry="4" width="270" height="12" />
          <Rect x="55" y="88" rx="4" ry="4" width="100" height="12" />
          <Rect x="55" y="118" rx="4" ry="4" width="180" height="12" />
          <Rect x="55" y="138" rx="4" ry="4" width="270" height="12" />
          <Rect x="55" y="158" rx="4" ry="4" width="100" height="12" />
        </ContentLoader>
      </Card.Content>
    </Card>
  );

  return (
    <>
      <TopBar title={t("report.title", { ns: "screens" })} />
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            colors={[theme.colors.onBackground]}
            progressBackgroundColor={theme.custom.cardTaskBackground}
            refreshing={refreshing}
            onRefresh={getUsers}
          />
        }
      >
        <View style={{ alignItems: "center", gap: 16, paddingBottom: 12 }}>
          {!refreshing && totalMembersInfo ? (
            <CustomCard title={t("report.general.title", { ns: "screens" })}>
              <View style={{ gap: 16 }}>
                <CardInfo tasksInfo={totalMembersInfo} reflesh={getUsers} />
                <CardInfo
                  tasksInfo={totalMembersInfo}
                  isWeek
                  reflesh={getUsers}
                />
              </View>
            </CustomCard>
          ) : (
            <MyLoader />
          )}

          {users.some((user) => user.tasks && user.tasks.length > 0) &&
            users.map((user) => (
              <CustomCard
                key={user.username}
                contentStyle={{ gap: 16 }}
                title={`${user.name.split(" ")[0]} ${
                  user.name.split(" ").length > 0 &&
                  user.name.split(" ")[user.name.split(" ").length - 1]
                }`}
              >
                <CardInfo tasksInfo={user.tasks ?? []} reflesh={getUsers} />
                <CardInfo
                  tasksInfo={user.tasks ?? []}
                  isWeek
                  reflesh={getUsers}
                />
              </CustomCard>
            ))}
        </View>
      </ScrollView>
    </>
  );
}
