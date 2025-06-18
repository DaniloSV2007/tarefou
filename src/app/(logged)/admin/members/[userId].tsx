import TopBar from "@/components/TopBar";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";
import {
  Avatar,
  Card,
  Divider,
  FAB,
  Icon,
  ProgressBar,
  Text,
} from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function UserProfile() {
  const theme = useAppTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const memberData = {
    name: "Guilherme Voiski",
    username: "@guilherme2017",
    email: "guilherme@example.com",
    birthday: "2017-01-01",
    joinDate: "2023-01-01",
    role: "Member",
    statistics: {
      tasksCompleted: 45,
      tasksInProgress: 5,
      totalScore: 2430,
      weeklyProgress: 80,
      monthlyProgress: 75,
    },
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingBottom: 20,
        },
      ]}
    >
      <TopBar
        title={t("screens:member.profile.memberName", {
          name: memberData.name.split(" ")[0],
        })}
        isBackButtonEnable={true}
      />

      <View style={styles.content}>
        <Card
          style={[styles.card, { backgroundColor: theme.custom?.cardColor }]}
        >
          <Card.Title
            title={t("screens:member.profile.personalInfo.title")}
            left={(props) => <Icon {...props} source="account" />}
            titleStyle={styles.title}
          />
          <Card.Content>
            <View style={styles.infoRow}>
              <Text variant="labelLarge">
                {t("screens:member.profile.personalInfo.name")}:
              </Text>
              <Text>{memberData.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text variant="labelLarge">
                {t("screens:member.profile.personalInfo.username")}:
              </Text>
              <Text>{memberData.username}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text variant="labelLarge">
                {t("screens:member.profile.personalInfo.email")}:
              </Text>
              <Text>{memberData.email}</Text>
            </View>
          </Card.Content>
        </Card>

        <Card
          style={[styles.card, { backgroundColor: theme.custom?.cardColor }]}
        >
          <Card.Title
            title={t("screens:member.profile.statistics.title")}
            left={(props) => <Icon {...props} source="chart-bar" />}
            titleStyle={styles.title}
          />
          <Card.Content>
            <View style={styles.infoRow}>
              <Text variant="labelLarge">
                {t("screens:member.profile.statistics.tasksCompleted")}:
              </Text>
              <Text>{memberData.statistics.tasksCompleted}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text variant="labelLarge">
                {t("screens:member.profile.statistics.tasksInProgress")}:
              </Text>
              <Text>{memberData.statistics.tasksInProgress}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text variant="labelLarge">
                {t("screens:member.profile.statistics.totalScore")}:
              </Text>
              <Text>{memberData.statistics.totalScore}</Text>
            </View>
          </Card.Content>
        </Card>
      </View>
      <View
        style={{
          height: insets.bottom,
          paddingBottom: insets.bottom,
          width: "100%",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  card: {
    borderRadius: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
  },
});
