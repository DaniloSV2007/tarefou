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
import { useTranslation } from "react-i18next";

interface Props {
  title: string;
  username: string;
  memberSince?: string;
}

export default function MemberInfo({
  title,
  username,
  memberSince = "18/02/2025",
  ...rest
}: Props) {
  const theme = useAppTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const userId = "12345";

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
              {t("components:memberCard.placeholder")}
            </Text>
          </Card.Content>
          <Card.Actions>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Text style={{ color: theme.colors.onSurfaceVariant }}>
                {t("components:memberCard.memberSince", { date: memberSince })}
              </Text>
            </View>

            <TouchableOpacity onPress={() => {}} activeOpacity={0.7}>
              <Button mode="elevated">
                <Icon source={"pencil"} size={16} />
                <Text style={{ fontSize: 16 }}>
                  {" "}
                  {t("components:memberCard.actions.edit")}
                </Text>
              </Button>
            </TouchableOpacity>
          </Card.Actions>
        </View>
      </TouchableRipple>
    </Card>
  );
}
const styles = StyleSheet.create({});
