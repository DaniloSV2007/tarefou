import { Pressable, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Avatar, Button, Card, Snackbar, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useLanguageContext } from "@/context/LanguageContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import imagePlaceholder from "@/assets/Profile/user.png";
import ImageView from "react-native-image-viewing";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "@/services/FirebaseConfig";
import { ImageSource } from "react-native-image-viewing/dist/@types";
import { User, UserRaw } from "../[user]";

export default function UserAdd() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ user: string }>();
  const { languagePreference } = useLanguageContext();
  const { t } = useTranslation();
  const usersCollection = collection(db, "users");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState<string | null>(null);
  const placeholder = imagePlaceholder;

  const [imageArray, setImageArray] = useState<ImageSource[]>([]);
  const [visible, setIsVisible] = useState(false);

  const userParam = Array.isArray(params.user) ? params.user[0] : params.user;

  const memberDataRaw: UserRaw = JSON.parse(decodeURIComponent(userParam));

  // Converte os campos Timestamp para Date, se necessário
  const memberData: User = {
    ...memberDataRaw,
    birthday: new Date(memberDataRaw.birthday.seconds * 100),
    createdAt: new Date(memberDataRaw.createdAt?.seconds * 1000),
  };

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

  const handleError = (text: string) => {
    setError(text);
  };

  const getFamilyId = async () => {
    const familyId = await AsyncStorage.getItem("familyId");
    if (familyId) {
      return familyId;
    }

    const username = await AsyncStorage.getItem("username");
    try {
      const q = query(usersCollection, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const user = querySnapshot.docs[0];
        const userRef = user.ref;

        const userPrivateRef = doc(userRef, "private", "data");
        const userPrivate = await getDoc(userPrivateRef);
        const userPrivateData = userPrivate.data();

        return userPrivateData?.familyId;
      }
    } catch (error) {
      console.error("getFamilyId Error:", error);
    }
  };

  const handleAdd = async () => {
    const familyId = await getFamilyId();

    console.log(auth.currentUser?.uid);

    if (loading) return;
    setLoading(true);

    if (!memberData.username && !familyId) {
      return;
    }

    const data = { familyId };

    try {
      const q = query(
        usersCollection,
        where("username", "==", memberData.username),
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const user = querySnapshot.docs[0];
        const userDoc = doc(usersCollection, user.id);
        console.log(userDoc);
        const userData = user.data();

        if (userData?.familyId === familyId) {
          handleError(
            t("members.newMember.userInfo.alreadyExists", { ns: "screens" }),
          );
          router.replace("/admin/members");
          return;
        }

        await updateDoc(userDoc, data);

        router.replace("/admin/members");
      }
    } catch (error) {
      console.error("Error while adding user to famiy: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAvatarImageDatabase();
  }, []);

  useEffect(() => {
    setImageArray([{ uri: image as string }]);
  }, [image]);

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
        title={t("members.newMember.tabBar", { ns: "screens" })}
        isBackButtonEnable={true}
      />
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
            paddingBottom: insets.bottom + 32,
          },
        ]}
      >
        <Card
          style={[styles.card, { backgroundColor: theme.custom.cardColor }]}
        >
          <Card.Content style={[styles.content]}>
            <View style={styles.avatar}>
              {image ? (
                <Pressable onPress={() => setIsVisible(true)}>
                  <Avatar.Image
                    source={image ? { uri: image } : { uri: placeholder }}
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
              {t("members.newMember.userInfo.memberSince", { ns: "screens" })}{" "}
              {createdAt}
            </Text>
          </Card.Content>
          <Card.Actions style={{ justifyContent: "space-between" }}>
            <Button
              mode="outlined"
              textColor={theme.colors.onBackground}
              onPress={() => router.replace("/admin/members")}
            >
              {t("common.cancel", { ns: "components" })}
            </Button>
            <Button
              mode="contained"
              onPress={handleAdd}
              loading={loading}
              disabled={loading}
            >
              {!loading &&
                t("members.newMember.userInfo.add", { ns: "screens" })}
            </Button>
          </Card.Actions>
        </Card>

        <Snackbar
          action={{
            label: t("common.close", { ns: "components" }),
            onPress: () => setError(""),
          }}
          onDismiss={() => setError("")}
          visible={error !== ""}
          duration={5000}
        >
          {error}
        </Snackbar>
        <ImageView
          images={imageArray}
          imageIndex={0}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    borderRadius: 32,
    paddingBottom: 16,
    width: "90%",
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
