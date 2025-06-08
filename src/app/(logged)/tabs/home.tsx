import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, FAB, Text } from "react-native-paper";
import Constants from "expo-constants";
import { useAppTheme } from "@/hooks/useAppTheme";
import React, { useState } from "react";
import TopBar from "@/components/TopBar";
import ResumeCard from "@/components/Home/ResumeCard";
import TasksCard from "@/components/Home/TasksCard";
import { useTranslation } from "react-i18next";

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

interface TaskStats {
  completedTasks: number;
  totalCompletedTasks: number;
  completionRate: number;
}

interface MemberStats {
  today: TaskStats;
  week: TaskStats;
}

export default function Home() {
  const router = useRouter();
  const theme = useAppTheme();
  const { t } = useTranslation();

  const [members, setMembers] = useState<Member[]>([
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
        {
          id: 3,
          name: "Task 3",
          status: true,
          description: "Task 3 description",
        },
        {
          id: 4,
          name: "Task 4",
          status: false,
          description: "Task 4 description",
        },
      ],
    },
  ]);

  const calculateStats = () => {
    const totalTasks = members.reduce(
      (acc, member) => acc + member.tasks.length,
      0
    );
    const completedTasks = members.reduce(
      (acc, member) => acc + member.tasks.filter((task) => task.status).length,
      0
    );
    const completionRate = totalTasks > 0 ? completedTasks / totalTasks : 0;

    // Simulated weekly stats - in a real app, these would come from an API or database
    const weekTotalTasks = 45;
    const weekCompletedTasks = 22;
    const weekCompletionRate =
      weekTotalTasks > 0 ? weekCompletedTasks / weekTotalTasks : 0;

    return {
      today: {
        completedTasks,
        totalCompletedTasks: totalTasks,
        completionRate,
      },
      week: {
        completedTasks: weekCompletedTasks,
        totalCompletedTasks: weekTotalTasks,
        completionRate: weekCompletionRate,
      },
    };
  };

  const stats = calculateStats();

  const handleUpdateTasks = (memberIndex: number, updatedTasks: Task[]) => {
    try {
      const newMembers = [...members];
      if (memberIndex >= 0 && memberIndex < newMembers.length) {
        newMembers[memberIndex] = {
          ...newMembers[memberIndex],
          tasks: updatedTasks,
        };
        setMembers(newMembers);
      }
    } catch (error) {
      console.error("Error updating tasks:", error);
      // Here you could show an error message to the user
    }
  };

  const handleAddTask = () => {
    try {
      router.push("/tasks/new");
    } catch (error) {
      console.error("Error navigating to new task:", error);
    }
  };

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
      >
        <View style={styles.content}>
          <ResumeCard stats={stats} />
          {members
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((member, index) => (
              <TasksCard
                key={member.username}
                name={member.name}
                tasks={member.tasks}
                setTasks={(updatedTasks) =>
                  handleUpdateTasks(index, updatedTasks)
                }
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
  },
  title: {
    textAlign: "center",
    marginTop: 100,
  },
  content: {
    gap: 16,
    alignItems: "center",
    paddingBottom: 80, // Add padding to account for FAB
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 16,
    bottom: 16,
    zIndex: 1000,
  },
});
