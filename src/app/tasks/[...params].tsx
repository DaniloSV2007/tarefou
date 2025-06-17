import { View, Text, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useLocalSearchParams, useRouter } from "expo-router";
import TopBar from "@/components/TopBar";

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

export default function Task() {
  const theme = useAppTheme();
  const params = useLocalSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [taskData, setTaskData] = useState<{
    taskName: string;
    taskDescription: string;
    taskStatus: string;
  } | null>(null);

  const userFullName = params?.userFullName as string;
  const taskId = params?.taskId as string;
  const router = useRouter();

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

      const task = user.tasks.find((t) => t.id === taskId);
      if (!task) {
        throw new Error("Task not found");
      }

      setTaskData({
        taskName: task.name,
        taskDescription: task.description,
        taskStatus: task.status ? "Completed" : "In Progress",
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
      <TopBar title={taskData?.taskName ?? ""} isBackButtonEnable={true} />
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
