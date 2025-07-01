import TopBar from "@/components/TopBar";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, StyleSheet, Image, Pressable } from "react-native";
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
import ImageView from "react-native-image-viewing";
import { useEffect, useState } from "react";
import { useLanguageContext } from "@/context/LanguageContext";
import React from "react";
import api from "@/services/api";
import { tokens } from "react-native-paper/lib/typescript/styles/themes/v3/tokens";
import { useAuth } from "@/context/AuthContext";

type User = {
  name: string;
  username: string;
  birthday: Date;
  email: string;
  role: string;
  avatar?: string | null;
  createdAt?: Date;
};

export default function UserProfile() {
  const theme = useAppTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { token } = useAuth();

  const params = useLocalSearchParams();
  const { languagePreference } = useLanguageContext();

  const userParam = Array.isArray(params.user) ? params.user[0] : params.user;
  const memberData: User = JSON.parse(decodeURIComponent(userParam));

  const [image, setImage] = useState();
  const [imageArray, setImageArray] = useState<any>([
    { uri: memberData.avatar },
  ]);
  const [visible, setIsVisible] = useState(false);

  const age = memberData.birthday
    ? new Date().getFullYear() - new Date(memberData.birthday).getFullYear()
    : "";

  const formatDate = (created: string | Date) => {
    const date = new Date(created);
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

  useEffect(() => {
    getAvatarImageDatabase();
  }, []);

  const getAvatarImageDatabase = async () => {
    try {
      if (!memberData.username) throw new Error("Username not provided");

      const res = await api.get("/users/" + memberData.username, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (res.status === 200 && res.data) {
        const { avatar } = res.data;
        setImage(avatar);
        setImageArray([{ uri: avatar }]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <TopBar
        title={t("screens:member.profile.memberName", {
          name: memberData.name.split(" ")[0],
        })}
        isBackButtonEnable={true}
      />
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
            paddingBottom: 20,
          },
        ]}
      >
        <View style={styles.content}>
          <Card
            style={[styles.card, { backgroundColor: theme.custom?.cardColor }]}
          >
            <Card.Title
              title={t("screens:member.profile.personalInfo.title")}
              titleStyle={styles.title}
            />
            <Card.Content>
              <View style={styles.avatar}>
                {image ? (
                  <Pressable onPress={() => setIsVisible(true)}>
                    <Avatar.Image
                      source={{
                        uri: image ?? undefined,
                      }}
                      size={150}
                      style={{
                        backgroundColor: theme.custom.cardColor,
                        borderColor: theme.custom.cardTaskBackground,
                        borderWidth: 1,
                      }}
                    />
                  </Pressable>
                ) : (
                  <Avatar.Icon
                    icon={"account"}
                    size={150}
                    style={{
                      backgroundColor: theme.custom.cardColor,
                      borderColor: theme.custom.cardTaskBackground,
                      borderWidth: 1,
                    }}
                  />
                )}
              </View>

              <Text style={[{ color: theme.colors.onBackground }, styles.name]}>
                {memberData.name}
              </Text>
              <Text
                style={[
                  { color: theme.colors.onSurfaceDisabled },
                  styles.username,
                ]}
              >
                @{memberData.username}
              </Text>
              <Text style={[{ color: theme.colors.onBackground }, styles.text]}>
                {t("screens:members.newMember.userInfo.age")} {age}
              </Text>
              <Text style={[{ color: theme.colors.onBackground }, styles.text]}>
                Email: {memberData.email}
              </Text>
              <Text style={[{ color: theme.colors.onBackground }, styles.text]}>
                {t("screens:members.newMember.userInfo.memberSince")}{" "}
                {createdAt}
              </Text>
            </Card.Content>
          </Card>

          {/* {memberData && (
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
      )} */}
          <ImageView
            images={imageArray}
            imageIndex={0}
            visible={visible}
            onRequestClose={() => setIsVisible(false)}
          />
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
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
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 16,
    marginHorizontal: "auto",
  },
  card: {
    borderRadius: 32,
    paddingBottom: 16,
    marginVertical: 16,
    width: "95%",
  },
  content: { gap: 8, paddingBottom: 24 },
  subtitle: {
    fontSize: 18,
  },
  avatar: {
    width: "100%",
    alignItems: "center",
    marginVertical: 24,
  },
  name: {
    fontSize: 32,
  },
  username: {
    fontSize: 18,
    marginTop: -10,
  },
  text: {
    fontSize: 20,
  },
});
