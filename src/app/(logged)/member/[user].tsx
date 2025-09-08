import TopBar from "@/components/TopBar";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useLocalSearchParams } from "expo-router";
import { View, StyleSheet, Pressable } from "react-native";
import { Avatar, Card, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ImageView from "react-native-image-viewing";
import { useEffect, useState } from "react";
import { useLanguageContext } from "@/context/LanguageContext";
import React from "react";
import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "@/services/FirebaseConfig";

export type User = {
  name: string;
  username: string;
  birthday: Date;
  email: string;
  role: string;
  avatar?: string | null;
  createdAt: Date;
};

export type UserRaw = {
  name: string;
  username: string;
  birthday: Timestamp;
  email: string;
  role: string;
  avatar?: string | null;
  createdAt: Timestamp;
};

export default function UserProfile() {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const usersCollection = collection(db, "users");

  const params = useLocalSearchParams();
  const { languagePreference } = useLanguageContext();

  const userParam = Array.isArray(params.user) ? params.user[0] : params.user;

  const memberDataRaw: UserRaw = JSON.parse(decodeURIComponent(userParam));

  // Converte os campos Timestamp para Date, se necessário
  const memberData: User = {
    ...memberDataRaw,
    birthday: new Date(memberDataRaw.birthday.seconds * 1000),
    createdAt: new Date(memberDataRaw.createdAt.seconds * 1000),
  };

  const [image, setImage] = useState<string | undefined>();
  const [imageArray, setImageArray] = useState<{ uri: string | null }[]>([
    { uri: memberData.avatar ?? null },
  ]);
  const [visible, setIsVisible] = useState(false);

  const age = memberData.birthday
    ? new Date().getFullYear() - memberData.birthday.getFullYear()
    : "";

  const formatDate = (created: Date) => {
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

  useEffect(() => {
    getAvatarImageDatabase();
  }, []);

  const getAvatarImageDatabase = async () => {
    try {
      const q = query(
        usersCollection,
        where("username", "==", memberData.username),
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const user = querySnapshot.docs[0];
        const data = user.data();
        const avatar = data?.avatar;
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
        title={t("member.profile.memberName", {
          ns: "screens",
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
            style={[
              styles.card,
              { backgroundColor: theme.custom?.cardColor, minWidth: "90%" },
            ]}
          >
            <Card.Title
              title={t("member.profile.personalInfo.title", { ns: "screens" })}
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
                {t("members.newMember.userInfo.age", { ns: "screens" })} {age}
              </Text>
              <Text style={[{ color: theme.colors.onBackground }, styles.text]}>
                Email: {memberData.email}
              </Text>
              <Text style={[{ color: theme.colors.onBackground }, styles.text]}>
                {t("members.newMember.userInfo.memberSince", {
                  ns: "screens",
                })}{" "}
                {createdAt}
              </Text>
            </Card.Content>
          </Card>

          <ImageView
            images={imageArray as []}
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
  content: { gap: 8, paddingBottom: 24 },
  card: {
    borderRadius: 32,
    paddingBottom: 16,
    marginVertical: 16,
    width: "95%",
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 16,
    marginHorizontal: "auto",
  },
});
