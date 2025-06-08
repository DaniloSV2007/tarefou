import { View, Text, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useLocalSearchParams, useRouter } from "expo-router";
import TopBar from "@/components/TopBar";

interface Task {
  id: number;
  name: string;
  status: boolean;
  description: string;
}

interface Member {
  name: string;
  username: string;
  tasks: Task[];
}

export default function Task() {
  const theme = useAppTheme();
  const params = useLocalSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [taskData, setTaskData] = useState<{
    taskName: string;
    taskDescription: string;
  } | null>(null);

  const userFullName = params?.userFullName as string;
  const taskId = params?.taskId as string;
  const router = useRouter();

  const members: Member[] = [
    {
      name: "Guilherme Voiski",
      username: "@guilherme2017",
      tasks: [
        {
          id: 1,
          name: "Task 1",
          status: true,
          description: "Task 1 description",
        },
        {
          id: 2,
          name: "Task 2",
          status: false,
          description: "Task 2 description",
        },
      ],
    },
    {
      name: "Danilo Voiski",
      username: "@DaniloSV07",
      tasks: [
        {
          id: 1,
          name: "Find a bug",
          status: true,
          description: "Find a bug in the code",
        },
        {
          id: 2,
          name: "Fix a bug",
          status: false,
          description: "Fix a bug in the code",
        },
      ],
    },
  ];

  useEffect(() => {
    loadTaskData();
  }, [userFullName, taskId]);

  const loadTaskData = () => {
    try {
      setLoading(true);
      setError(null);

      if (!userFullName || !taskId) {
        throw new Error("Missing required parameters");
      }

      const user = members.find(
        (member) => member.name.toLowerCase() === userFullName.toLowerCase()
      );

      if (!user) {
        throw new Error("User not found");
      }

      const task = user.tasks.find((t) => t.id === Number(taskId));
      if (!task) {
        throw new Error("Task not found");
      }

      setTaskData({
        taskName: task.name,
        taskDescription: task.description,
      });
    } catch (error) {
      console.error("Error loading task data:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
      setTaskData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TopBar
        title={taskData?.taskName ?? ""}
        isBackButtonEnable={true}
        backButtonHref={() => router.push("/tabs/home")}
      />
      <View
        style={{
          flex: 1,
          padding: 16,
        }}
      >
        <Text style={{ color: theme.colors.onBackground }}>
          {taskData?.taskDescription ?? ""}
        </Text>
      </View>
    </View>
  );
}
