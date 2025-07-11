import { useLanguageContext } from "@/context/LanguageContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useRouter } from "expo-router";
import {
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Text,
  Card,
  Button,
  TouchableRipple,
  Icon,
  Avatar,
} from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import ImageView from "react-native-image-viewing";
import React from "react";
import { UserType } from "@/app/(logged)/admin/members";

interface Props {
  user: UserType;
  setUserInfo: (user: UserType) => void;
  setEditVisible: (state: boolean) => void;
}

type User = {
  name: string;
  username: string;
  birthday: Date;
  email: string;
  role: string;
  avatar?: string | null;
  createdAt?: Date;
};

function isTimestamp(obj: any): obj is { toDate: () => Date } {
  return obj && typeof obj.toDate === "function";
}

export default function MemberInfo({
  user,
  setUserInfo,
  setEditVisible,
  ...rest
}: Props) {
  const theme = useAppTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { languagePreference } = useLanguageContext();

  const userWithoutAvatar: UserType = { ...user, avatar: "" };

  // Converte os campos Timestamp para Date, se necessário
  const memberData: User = {
    ...userWithoutAvatar,
    birthday: isTimestamp(userWithoutAvatar.birthday)
      ? userWithoutAvatar.birthday.toDate()
      : userWithoutAvatar.birthday,
    createdAt: isTimestamp(userWithoutAvatar.createdAt)
      ? userWithoutAvatar.createdAt.toDate()
      : userWithoutAvatar.createdAt,
  };

  const [imageArray, setImageArray] = useState<any>([{ uri: user.avatar }]);
  const [visible, setIsVisible] = useState(false);

  const formatDate = (created: any | Date) => {
    if (!created) return;
    const date = new Date(created);
    if (isNaN(date.getTime())) return;

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return languagePreference === 1
      ? `${month}/${day}/${year}`
      : `${day}/${month}/${year}`;
  };

  const createdAt = memberData.createdAt
    ? formatDate(memberData.createdAt)
    : "";

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
        onPress={() =>
          router.push(
            `/member/${encodeURIComponent(JSON.stringify(userWithoutAvatar))}`
          )
        }
        borderless={false}
        rippleColor={theme.custom.ripple}
      >
        <View>
          <Card.Title
            title={user.name}
            titleStyle={{
              fontSize: 28,
              marginLeft: 10,
              marginBottom: -6,
              marginTop: 6,
            }}
            subtitle={
              <>
                {user.role === "MEMBER" ? (
                  <Icon
                    source={"account"}
                    color={theme.colors.onSurfaceVariant}
                    size={14}
                  />
                ) : (
                  <Icon
                    source={"account-cog"}
                    color={theme.colors.onSurfaceVariant}
                    size={14}
                  />
                )}{" "}
                @{user.username}
              </>
            }
            subtitleStyle={{
              fontSize: 14,
              color: theme.colors.onSurfaceVariant,
              marginLeft: 10,
            }}
            left={(props) =>
              user.avatar ? (
                <Pressable
                  android_ripple={{ color: theme.custom.ripple }}
                  onPress={() => setIsVisible(true)}
                >
                  <Avatar.Image
                    {...props}
                    source={{ uri: user.avatar ?? undefined }}
                  />
                </Pressable>
              ) : (
                <Avatar.Icon {...props} icon={"account"} color="white" />
              )
            }
          />
          <Card.Content>
            <Text variant="bodyMedium">
              {t("memberCard.placeholder", { ns: "components" })}
            </Text>
            <ImageView
              images={imageArray}
              imageIndex={0}
              visible={visible}
              onRequestClose={() => setIsVisible(false)}
            />
          </Card.Content>
          <Card.Actions>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Text style={{ color: theme.colors.onSurfaceVariant }}>
                {t("memberCard.memberSince", {
                  date: createdAt,
                  ns: "components",
                })}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                setUserInfo(user);
                setEditVisible(true);
              }}
              activeOpacity={0.7}
            >
              <Button
                mode="outlined"
                buttonColor={theme.custom.cardTaskBackground}
              >
                <Icon source={"pencil"} size={16} />
                <Text style={{ fontSize: 16 }}>
                  {t("memberCard.actions.edit", { ns: "components" })}
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
