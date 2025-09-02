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
import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import { db } from "@/services/FirebaseConfig";
import { UserType } from "../admin/members";
import { ImageSource } from "react-native-image-viewing/dist/@types";


export default function UserLink() {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const usersCollection = collection(db, "users");

  const params = useLocalSearchParams();
  const { username } = params;
  console.log(username);

  const { languagePreference } = useLanguageContext();

  const [memberData, setMemberData] = useState<UserType>();

  const [age, setAge] = useState(0);

  const [createdAt, setCreatedAt] = useState("");

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (!memberData?.birthday) return;

    const birthDate = new Date(
      memberData.birthday.seconds * 1000 +
        memberData.birthday.nanoseconds / 1000000
    );
    const now = new Date();
    const calculatedAge = now.getFullYear() - birthDate.getFullYear();

    setAge(calculatedAge);

    if (memberData.createdAt) {
      setCreatedAt(formatDate(memberData.createdAt) ?? "");
    }
  }, [memberData]);

  const getUser = async () => {
    try {
      const q = query(usersCollection, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const user = querySnapshot.docs[0].data();

        setMemberData(user as UserType);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [image, setImage] = useState<string | undefined>();
  const [imageArray, setImageArray] = useState<ImageSource[]>([
    { uri: memberData?.avatar ?? undefined },
  ]);
  const [visible, setIsVisible] = useState(false);

  const formatDate = (created: Timestamp) => {
    if (!created) return;
    const date = new Date(
      created.seconds * 1000 + created.nanoseconds / 1000000
    );
    if (isNaN(date.getTime())) return;

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return languagePreference === 1
      ? `${month}/${day}/${year}`
      : `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (memberData?.username) {
      getAvatarImageDatabase();
    }
  }, [memberData]);

  const getAvatarImageDatabase = async () => {
    try {
      const q = query(
        usersCollection,
        where("username", "==", memberData?.username)
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
          name: memberData?.name.split(" ")[0],
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
                {memberData?.name}
              </Text>
              <Text
                style={[
                  { color: theme.colors.onSurfaceDisabled },
                  styles.username,
                ]}
              >
                @{username}
              </Text>
              <Text style={[{ color: theme.colors.onBackground }, styles.text]}>
                {t("members.newMember.userInfo.age", { ns: "screens" })} {age}
              </Text>
              <Text style={[{ color: theme.colors.onBackground }, styles.text]}>
                Email: {memberData?.email}
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
