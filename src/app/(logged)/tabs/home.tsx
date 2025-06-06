import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, FAB, Text } from "react-native-paper";
import Constants from "expo-constants";
import { useAppTheme } from "@/hooks/useAppTheme";
import React, { useState } from "react";
import TopBar from "@/components/TopBar";
import ResumeCard from "@/components/Home/ResumeCard";
import TasksCard from "@/components/Home/TasksCard";

export default function Home() {
  const router = useRouter();
  const theme = useAppTheme();
  const [members, setMembers] = useState<any[]>([
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
          name: "Task 1",
          status: true,
          description: "Task 1 description",
        },
        {
          id: 2,
          name: "Task 2",
          status: false,
          description:
            "A description very long on purpose to test the ellipsis",
        },
      ],
    },
  ]);

  const totalTasks = 20;
  const completedTasks = 15;
  const completionRate = completedTasks / totalTasks;

  const weekCompletedTasks = 22;
  const weekTotalTasks = 45;
  const weekCompletionRate = weekCompletedTasks / weekTotalTasks;

  const totalMembersInfo = {
    danilo: {
      today: {
        completedTasks: completedTasks,
        totalCompletedTasks: totalTasks,
        completionRate: completionRate,
      },
      week: {
        completedTasks: weekCompletedTasks,
        totalCompletedTasks: weekTotalTasks,
        completionRate: weekCompletionRate,
      },
    },
  };

  return (
    <>
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => {}}
        color="white"
      />
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        <TopBar title="Home" />

        <View style={styles.content}>
          <ResumeCard />
          {members.map((member, index) => (
            <TasksCard
              key={member.username}
              name={member.name}
              tasks={member.tasks}
              setTasks={(updatedTasks) => {
                const newMembers = [...members];
                newMembers[index] = {
                  ...newMembers[index],
                  tasks: updatedTasks,
                };
                setMembers(newMembers);
              }}
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
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 16,
    bottom: 16,
    zIndex: 1000,
  },
});
