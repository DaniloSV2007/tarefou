import { View, Text, ActivityIndicator, Pressable, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useLocalSearchParams, useRouter } from "expo-router";
import TopBar from "@/components/TopBar";
import { Button } from "react-native-paper";
import CustomCard from "@/components/GlobalComp/CustomCard";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "../[tasks]";
import api from "@/services/api";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
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
  const [deleting, setDeleting] = useState(false);

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

    const q = query(usersCollection, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return setChanging(false);

    const userData = querySnapshot.docs[0].data();

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
      console.error("Error while sending push notificatio: ", error);
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

  const getDeadlineDate = () => {
    const dl: string | Timestamp | undefined = taskData?.deadline;
    if (!dl) return undefined;
    if (typeof dl === "string") return new Date(dl);
    if (dl?.toDate) return dl.toDate();
    if (typeof dl?.seconds === "number") return new Date(dl.seconds * 1000);
    return undefined;
  };

  const handleDelete = async () => {
    if (!taskData?.id || deleting) return;
    Alert.alert(
      "Excluir tarefa",
      "Tem certeza? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);
              const taskDoc = doc(tasksCollection, taskData.id);
              await deleteDoc(taskDoc);
              router.back();
            } catch (err) {
              console.error("Error deleting task:", err);
              Alert.alert("Erro", "Não foi possível excluir a tarefa.");
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
    );
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
          {/* Responsável */}
          {params?.userFullName && (
            <View className="gap-1 mt-2">
              <Text
                className="text-2xl font-bold"
                style={{ color: theme.colors.onBackground }}
              >
                Responsável:
              </Text>
              <Text
                className="text-xl"
                style={{ color: theme.colors.onBackground, opacity: 0.9 }}
              >
                {params.userFullName}
              </Text>
            </View>
          )}

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

          {/* Status */}
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

          {/* Prazo */}
          {getDeadlineDate() && (
            <View className="gap-1">
              <Text
                className="text-3xl font-bold"
                style={{ color: theme.colors.onBackground }}
              >
                Prazo:
              </Text>
              <Text
                className="text-2xl"
                style={{ color: theme.colors.onBackground }}
              >
                {getDeadlineDate()?.toLocaleDateString()}
              </Text>
            </View>
          )}

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

          {role === "FAMILY_ADMIN" && (
            <Pressable
              android_ripple={{ color: theme.custom.ripple }}
              onPress={handleDelete}
              disabled={deleting}
              className="py-3 rounded-2xl items-center"
              style={{ backgroundColor: theme.colors.error }}
            >
              {!deleting ? (
                <Text style={{ color: "white" }} className="text-2xl">
                  Excluir Tarefa
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
