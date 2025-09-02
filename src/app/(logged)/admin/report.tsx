import TopBar from "@/components/TopBar";
import { useAppTheme } from "@/hooks/useAppTheme";
import { RefreshControl, ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { Card } from "react-native-paper";
import ContentLoader, { Circle,  Rect } from "react-content-loader/native";
import CustomCard from "@/components/GlobalComp/CustomCard";
import CardInfo from "@/components/Report/CardInfo";
import { UserTasksType } from "./home";
import { Task } from "../tasks/[tasks]";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "./members";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/services/FirebaseConfig";

export default function Report() {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const usersCollection = collection(db, "users");
  const tasksCollection = collection(db, "tasks");

  const [totalMembersInfo, setTotalMembersInfo] = useState<Task[]>([]);
  const [users, setUsers] = useState<UserTasksType[]>([]);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    setRefreshing(true);
    const familyId = await getFamilyId();

    if (!familyId) {
      setRefreshing(false);
      return;
    }
    try {
      const q = query(usersCollection, where("familyId", "==", familyId));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return;

      const usersData: UserTasksType[] = querySnapshot.docs
        .map((doc) => ({
          ...(doc.data() as UserType),
          tasks: [], // inicia vazio
        }))
        .filter((user) => user.role !== "FAMILY_ADMIN");

      setUsers(usersData); // define usuários

      // Agora busca as tasks de cada um
      const updatedUsers = await Promise.all(
        usersData.map(async (user) => {
          const userId = querySnapshot.docs.find(
            (doc) => doc.data().username === user.username
          )?.id;

          if (!userId) return user;

          const taskQ = query(tasksCollection, where("userId", "==", userId));
          const taskSnapshot = await getDocs(taskQ);

          const tasks: Task[] = taskSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              title: data.title ?? "",
              userId: data.userId ?? "",
              description: data.description,
              createdAt: data.createdAt?.toDate?.() ?? undefined,
              updatedAt: data.updatedAt?.toDate?.() ?? undefined,
              deadline: data.deadline?.toDate?.() ?? undefined,
              isCompleted: data.isCompleted ?? false,
            };
          });

          return { ...user, tasks };
        })
      );

      setUsers(updatedUsers); // define novamente com as tarefas preenchidas
      setTotalMembersInfo([...updatedUsers.flatMap((u) => u.tasks ?? [])]);
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
      <TopBar title={t("report.title", { ns: "screens" })} showNotification />
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
          {!refreshing ? (
            totalMembersInfo.length > 0 && (
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
            )
          ) : (
            <MyLoader />
          )}

          {!refreshing ? (
            users.some((user) => (user.tasks?.length ?? 0) > 0) &&
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
            ))
          ) : (
            <MyLoader />
          )}
        </View>
      </ScrollView>
    </>
  );
}
