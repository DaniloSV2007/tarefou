import { View, Text, ActivityIndicator } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useLocalSearchParams, useRouter } from "expo-router";
import TopBar from "@/components/TopBar";
import { Button, Card, Icon } from "react-native-paper";

interface Task {
  id: string;
  name: string;
  status: boolean;
  description: string;
}

interface Member {
  name: string;
  username: string;
  tasks: Task[];
}

export default function TaskDetails() {
  const theme = useAppTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{
    userFullName: string;
    taskId: string;
  }>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [taskData, setTaskData] = useState<{
    taskName: string;
    taskDescription: string;
    taskStatus: string;
  } | null>(null);

  const members: Member[] = [
    {
      name: "Guilherme Voiski",
      username: "@guilherme2017",
      tasks: [],
    },
    {
      name: "Danilo Voiski",
      username: "@DaniloSV07",
      tasks: [
        {
          id: "1",
          name: "Find a bug",
          status: true,
          description: "Find a bug in the code",
        },
        {
          id: "2",
          name: "Fix a bug",
          status: false,
          description: "Fix a bug in the code",
        },
        {
          id: "3",
          name: "Task 3",
          status: true,
          description: "Task 3 description",
        },
        {
          id: "4",
          name: "Task 4",
          status: false,
          description: "Task 4 description",
        },
        {
          id: "5",
          name: "Task 5",
          status: false,
          description: "Task 5 description",
        },
        {
          id: "6",
          name: "Task 6",
          status: false,
          description: "Task 6 description",
        },
        {
          id: "7",
          name: "Task 7",
          status: false,
          description: "Task 7 description",
        },
        {
          id: "8",
          name: "Task 8",
          status: false,
          description: "Task 8 description",
        },
      ],
    },
  ];

  const loadTaskData = useCallback(() => {
    try {
      setLoading(true);
      setError(null);

      if (!params?.userFullName || !params?.taskId) {
        throw new Error("Missing required parameters");
      }

      const userFullName = params.userFullName.trim();
      const taskId = params.taskId;

      const user = members.find(
        (member) => member.name.toLowerCase() === userFullName.toLowerCase()
      );

      if (!user) {
        throw new Error(`User "${userFullName}" not found`);
      }

      const task = user.tasks.find((t) => t.id === taskId);
      if (!task) {
        throw new Error(`Task with ID "${taskId}" not found`);
      }

      setTaskData({
        taskName: task.name || "Untitled Task",
        taskDescription: task.description || "No description available",
        taskStatus: task.status ? "Completed" : "In Progress",
      });
    } catch (error) {
      console.error("Error loading task data:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
      setTaskData(null);
    } finally {
      setLoading(false);
    }
  }, [params?.userFullName, params?.taskId]);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        await loadTaskData();
      } catch (error) {
        if (isMounted) {
          setError("Failed to load task data");
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [loadTaskData]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <TopBar
          title="Loading..."
          isBackButtonEnable={true}
          backButtonHref={() => router.push("/(logged)/tabs/home")}
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
        <TopBar title="Error" isBackButtonEnable={true} />
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
      <TopBar title={taskData.taskName} isBackButtonEnable={true} />
      <View style={{ flex: 1, padding: 16 }}>
        <Card>
          <Card.Content>
            <View>
              <Text style={{ color: theme.colors.onBackground }}>
                Task: {taskData?.taskName ?? ""}
              </Text>
              <Text style={{ color: theme.colors.onBackground }}>
                Description: {taskData?.taskDescription ?? ""}
              </Text>
              <Text style={{ color: theme.colors.onBackground }}>
                Status: {taskData?.taskStatus ?? ""}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
}
