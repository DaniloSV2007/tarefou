import { View, Text, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useLocalSearchParams, useRouter } from "expo-router";
import TopBar from "@/components/TopBar";
import { Button, Card } from "react-native-paper";

interface Task {
  id: string;
  title: string;
  status: boolean;
  description: string;
}

export default function TaskDetails() {
  const theme = useAppTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{
    userFullName: string;
    task: string;
  }>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [taskData, setTaskData] = useState<Task | null>(null);

  const loadTaskData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!params?.userFullName || !params?.task) {
        throw new Error("Missing required parameters");
      }

      const parsed = JSON.parse(decodeURIComponent(params.task));
      const task = Array.isArray(parsed) ? parsed[0] : parsed;

      console.log(task);

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
      <View style={{ flex: 1, padding: 16 }}>
        <Card>
          <Card.Content>
            <Text style={{ color: theme.colors.onBackground }}>
              Task: {taskData.title}
            </Text>
            <Text style={{ color: theme.colors.onBackground }}>
              Description: {taskData.description}
            </Text>
            <Text style={{ color: theme.colors.onBackground }}>
              Status: {taskData.status ? "Completed" : "Pending"}
            </Text>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
}
