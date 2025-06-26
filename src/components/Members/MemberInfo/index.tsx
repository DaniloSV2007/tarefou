import { useLanguageContext } from "@/context/LanguageContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useRouter } from "expo-router";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
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
  name: string;
  username: string;
  memberSince: string | Date;
  avatar: string;
}

export default function MemberInfo({
  name,
  username,
  memberSince,
  avatar,
  ...rest
}: Props) {
  const theme = useAppTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const userId = "12345";
  const { languagePreference } = useLanguageContext();

  const formatDate = (created: string | Date) => {
    const date = new Date(created);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return languagePreference === 1
      ? `${month}/${day}/${year}`
      : `${day}/${month}/${year}`;
  };

  return (
    <Card
      style={{
        width: "90%",
        paddingVertical: 12,
        paddingBottom: 0,
        borderRadius: 16,
        backgroundColor: theme.custom.cardColor,
      }}
    >
      <TouchableRipple
        onPress={() => router.push(`/member/${userId}`)}
        borderless={false}
        rippleColor={theme.custom.ripple}
      >
        <View>
          <Card.Title
            title={name}
            titleStyle={{
              fontSize: 28,
              marginLeft: 10,
              marginBottom: -6,
              marginTop: 6,
            }}
            subtitle={"@" + username}
            subtitleStyle={{
              fontSize: 14,
              color: theme.colors.onSurfaceVariant,
              marginLeft: 10,
            }}
            left={() => <Avatar.Image source={{ uri: avatar }} size={48} />}
          />
          <Card.Content>
            <Text variant="bodyMedium">
              {t("components:memberCard.placeholder")}
            </Text>
          </Card.Content>
          <Card.Actions>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Text style={{ color: theme.colors.onSurfaceVariant }}>
                {t("components:memberCard.memberSince", {
                  date: formatDate(memberSince),
                })}
              </Text>
            </View>

            <TouchableOpacity onPress={() => {}} activeOpacity={0.7}>
              <Button
                mode="outlined"
                buttonColor={theme.custom.cardTaskBackground}
              >
                <Icon source={"pencil"} size={16} />
                <Text style={{ fontSize: 16 }}>
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
