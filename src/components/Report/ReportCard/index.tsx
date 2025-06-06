import { useAppTheme } from "@/hooks/useAppTheme";
import { StyleSheet, View } from "react-native";
import { Avatar, Card, ProgressBar, Text } from "react-native-paper";
import CardInfo from "../CardInfo";

interface ReportCardProps {
  title: string;
  username: string;
  avatar?: void;
}

export default function ReportCard({
  title,
  username,
  avatar,
}: ReportCardProps) {
  const theme = useAppTheme();

  const completedTasks = 7;
  const totalTasks = 27;
  const completionRate = completedTasks / totalTasks;

  const weekCompletedTasks = 7;
  const weekTotalTasks = 27;
  const weekCompletionRate = weekCompletedTasks / weekTotalTasks;

  const membersInfo = {
    danilo: {
      tasksInfo: {
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
    },
  };
  return (
    <Card
      style={{
        margin: 10,
        backgroundColor: theme.custom.cardColor,
        width: "90%",
        overflow: "hidden",
        borderRadius: 16,
        padding: 10,
      }}
    >
      <Card.Title
        title={title}
        titleStyle={{ fontSize: 28, marginLeft: 10 }}
        subtitle={username}
        subtitleStyle={{
          fontSize: 14,
          color: theme.colors.onSurfaceVariant,
          marginLeft: 10,
        }}
        left={() =>
          avatar && avatar != "" ? (
            <Avatar.Image source={avatar} size={48} />
          ) : (
            <Avatar.Icon icon="account" size={48} />
          )
        }
      />
      <Card.Content>
        <View style={{ gap: 16 }}>
          <CardInfo tasksInfo={membersInfo.danilo.tasksInfo.today} />
          <CardInfo
            tasksInfo={membersInfo.danilo.tasksInfo.week}
            isWeek={true}
          />
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  progressText: {
    marginBottom: 10,
    fontSize: 16,
  },
  percentageText: {
    fontSize: 16,
  },
});
