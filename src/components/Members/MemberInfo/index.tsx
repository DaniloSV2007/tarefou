import { useAppTheme } from "@/hooks/useAppTheme";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  Text,
  Card,
  Button,
  TouchableRipple,
  Icon,
  Avatar,
} from "react-native-paper";
import { opacity } from "react-native-reanimated/lib/typescript/Colors";

interface Props {
  title: string;
  username: string;
}

export default function MemberInfo({ title, username, ...rest }: Props) {
  const theme = useAppTheme();
  const router = useRouter();
  const userId = "12345";
  return (
    <Card
      style={{
        margin: 10,
        backgroundColor: theme.custom.cardColor,
        width: "90%",
        overflow: "hidden",
        borderRadius: 24,
      }}
    >
      <TouchableRipple
        onPress={() => router.push(`/member/${userId}`)}
        borderless={false}
        rippleColor={theme.custom.ripple}
      >
        <View>
          <Card.Title
            title={title}
            titleStyle={{ fontSize: 28, marginLeft: 10 }}
            subtitle={username}
            subtitleStyle={{
              fontSize: 14,
              color: theme.colors.onSurfaceVariant,
              marginLeft: 10,
            }}
            left={(props) => <Avatar.Icon icon="account" size={48} />}
          />
          <Card.Content>
            <Text variant="bodyMedium">
              This is a placeholder for member information.
            </Text>
          </Card.Content>
          <Card.Actions>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Text style={{ color: theme.colors.onSurfaceVariant }}>
                Member since 18/02/2025
              </Text>
            </View>

            <TouchableOpacity onPress={() => {}} activeOpacity={0.7}>
              <Button mode="elevated">
                <Icon source={"pencil"} size={16} />
                <Text style={{ fontSize: 16 }}> Edit</Text>
              </Button>
            </TouchableOpacity>
          </Card.Actions>
        </View>
      </TouchableRipple>
    </Card>
  );
}
const styles = StyleSheet.create({});
