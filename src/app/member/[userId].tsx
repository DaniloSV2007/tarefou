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

export default function UserProfile() {
  const theme = useAppTheme();
  const router = useRouter();
  const { t } = useTranslation();

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
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <TopBar
        title={t("screens:member.profile.memberName", {
          name: memberData.name.split(" ")[0],
        })}
        isBackButtonEnable={true}
        backButtonHref={() => router.push("/tabs/members")}
      />

      <View style={styles.content}>
        <Card
          style={[styles.card, { backgroundColor: theme.custom?.cardColor }]}
        >
          <Card.Title
            title={t("screens:member.profile.personalInfo.title")}
            left={(props) => <Icon {...props} source="account" />}
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

        <FAB
          icon="pencil"
          label={t("screens:member.profile.actions.edit")}
          onPress={() => {}}
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        />
      </View>
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
    borderRadius: 12,
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
});
