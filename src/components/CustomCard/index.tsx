import { StyleSheet, View } from "react-native";
import React from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Card } from "react-native-paper";

interface CardButton {
  title: string;
  children: any;
}

export default function CustomCard({ title, children }: CardButton) {
  const theme = useAppTheme();

  return (
    <Card
      style={[
        {
          backgroundColor: theme.custom.cardColor,
        },
        styles.card,
      ]}
    >
      <Card.Title
        //   t("home.resume.title")
        title={title}
        titleStyle={{ fontSize: 28 }}
      />
      <Card.Content style={{ gap: 16 }}>
        <View>
          {children}
          {/* <CardInfo tasksInfo={stats.today} /> */}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "90%",
    overflow: "hidden",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginTop: 12,
  },
});
