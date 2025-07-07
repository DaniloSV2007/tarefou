import { View, Text, ActivityIndicator, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useLocalSearchParams, useRouter } from "expo-router";
import TopBar from "@/components/TopBar";
import { Button, Card } from "react-native-paper";
import CustomCard from "@/components/CustomCard";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "../[tasks]";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export default function TaskDetails() {
  const theme = useAppTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { token } = useAuth();
  const params = useLocalSearchParams<{
    userFullName: string;
    task: string;
  }>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [taskData, setTaskData] = useState<Task | null>(null);

  const [role, setRole] = useState("");

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

  const changeStatus = async () => {
    const data = {
      id: taskData?.id,
      isCompleted: true,
      updatedAt: new Date(),
    };
    try {
      const res = await api.put("/tasks/", data, {
        headers: {
          Authorization: token,
        },
      });
      if (res.status === 200) {
        await loadTaskData();
      }
    } catch (error) {
      console.log(error);
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
          title="Task Info"
          className="px-2 py-4 "
          cardStyle={{ borderRadius: 24, marginTop: -36 }}
          contentStyle={{ gap: 24 }}
        >
          <View className="w-full">
            <Text
              style={{ color: theme.colors.onBackground, fontSize: 28 }}
              className="font-bold"
            >
              {taskData.title}
            </Text>
          </View>

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

          {role === "MEMBER" && (
            <Pressable
              android_ripple={{ color: theme.custom.ripple }}
              onPress={changeStatus}
              className="py-3 rounded-2xl items-center"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <Text style={{ color: "white" }} className="text-2xl">
                {t("tasks.user.taskInfo.markDone", { ns: "screens" })}
              </Text>
            </Pressable>
          )}
        </CustomCard>
      </View>
    </View>
  );
}
