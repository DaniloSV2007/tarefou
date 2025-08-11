import { View, Text, ActivityIndicator, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useLocalSearchParams, useRouter } from "expo-router";
import TopBar from "@/components/TopBar";
import { Button, Card } from "react-native-paper";
import CustomCard from "@/components/GlobalComp/CustomCard";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "../[tasks]";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/services/FirebaseConfig";

export default function TaskDetails() {
  const theme = useAppTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const tasksCollection = collection(db, "tasks");
  const usersCollection = collection(db, "users");

  const params = useLocalSearchParams<{
    userFullName: string;
    task: string;
  }>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [taskData, setTaskData] = useState<Task | null>(null);

  const [role, setRole] = useState("");

  const [changing, setChanging] = useState(false);

  useEffect(() => {
    const getUserRole = async () => {
      const role = await AsyncStorage.getItem("userRole");
      setRole(role ?? "");
    };

    getUserRole();
  }, []);

  const loadTaskData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!params?.userFullName || !params?.task) {
        throw new Error("Missing required parameters");
      }

      const parsed = JSON.parse(decodeURIComponent(params.task));
      const task = Array.isArray(parsed) ? parsed[0] : parsed;

      setTaskData(task);
    } catch (error) {
      console.error("Error loading task data:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTaskData();
  }, []);

  const sendPushNotification = async (username: string, userName: string) => {
    if (!username || !userName) return setChanging(false);
    let userData;
    const q = query(usersCollection, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return setChanging(false);

    userData = querySnapshot.docs[0].data();

    const data = {
      token: userData.pushToken,
      title: `${userName.split(" ")[0]} concluiu uma tarefa!`,
      body: taskData?.title,
      data: {
        href: "/",
      },
    };

    try {
      const res = await api.post("/api/notify", data);
      if (res.status === 200) {
        router.replace("/user/home");
      }
    } catch (error) {
      console.error;
    } finally {
      setChanging(false);
    }
  };

  const changeStatus = async () => {
    if (changing) return;

    setChanging(true);

    const data = {
      isCompleted: true,
      updatedAt: new Date(),
    };
    try {
      const taskDoc = doc(tasksCollection, taskData?.id);
      await updateDoc(taskDoc, data);
      const userDoc = doc(usersCollection, taskData?.userId);
      const userData = (await getDoc(userDoc)).data();

      const familyDoc = doc(db, "families", userData?.familyId);
      const familyData = (await getDoc(familyDoc)).data();

      await sendPushNotification(familyData?.owner, userData?.name);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <TopBar
          title="Loading..."
          isBackButtonEnable
          backButtonHref={() => router.push("/(logged)/admin/home")}
        />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </View>
    );
  }

  if (error || !taskData) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <TopBar title="Error" isBackButtonEnable />
        <View
          style={{
            flex: 1,
            padding: 16,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: theme.colors.error, textAlign: "center" }}>
            {error || "Could not load task data"}
          </Text>
          <Button
            mode="contained"
            onPress={loadTaskData}
            style={{ marginTop: 16 }}
          >
            Tentar novamente
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <TopBar title={taskData.title} isBackButtonEnable />
      <View className="flex-1 gap-4 items-center justify-center py-4">
        <CustomCard
          title={taskData.title}
          titleStyle={{
            color: theme.colors.onBackground,
            fontSize: 28,
            fontWeight: "bold",
          }}
          className="px-2 py-4 "
          cardStyle={{ borderRadius: 24, marginTop: -36 }}
          contentStyle={{ gap: 24 }}
        >
          {taskData.description && (
            <View className="gap-2 mt-6">
              <Text
                className="text-3xl font-bold"
                style={{ color: theme.colors.onBackground }}
              >
                {t("tasks.user.taskInfo.description", { ns: "screens" })}
              </Text>

              <Text
                style={{ color: theme.colors.onBackground }}
                className="text-2xl"
              >
                {taskData.description}
              </Text>
            </View>
          )}

          <View className={"gap-2" + !taskData.description && "mt-6"}>
            <Text
              className="text-3xl font-bold"
              style={{ color: theme.colors.onBackground }}
            >
              {t("tasks.user.taskInfo.status", { ns: "screens" })}
            </Text>
            <Text
              className="text-2xl"
              style={{ color: theme.colors.onBackground }}
            >
              {taskData.isCompleted
                ? `${t("tasks.user.taskInfo.statusDone", { ns: "screens" })}`
                : `${t("tasks.user.taskInfo.statusPending", { ns: "screens" })}`}
            </Text>
          </View>

          {role === "MEMBER" && !taskData.isCompleted && (
            <Pressable
              android_ripple={{ color: theme.custom.ripple }}
              onPress={changeStatus}
              disabled={changing}
              className="py-3 rounded-2xl items-center"
              style={{
                backgroundColor: theme.colors.primary,
              }}
            >
              {!changing ? (
                <Text style={{ color: "white" }} className="text-2xl">
                  {t("tasks.user.taskInfo.markDone", { ns: "screens" })}
                </Text>
              ) : (
                <ActivityIndicator color={"white"} size={32} />
              )}
            </Pressable>
          )}
        </CustomCard>
      </View>
    </View>
  );
}
