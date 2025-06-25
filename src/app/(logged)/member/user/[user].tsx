import { Pressable, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
  Avatar,
  Button,
  Card,
  Portal,
  Snackbar,
  Text,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import placeholder from "@/assets/Profile/user.png";
import { useLanguageContext } from "@/context/LanguageContext";
import { createdAt } from "expo-updates";
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/services/api";
import { useTranslation } from "react-i18next";
import imagePlaceholder from "@/assets/Profile/user.png";

type User = {
  name: string;
  username: string;
  birthday: Date;
  email: string;
  passwordHash: string;
  role: string;
  avatar?: string;
  createdAt?: Date;
  familyId?: string;
};

export default function User() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ user: string }>();
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const { languagePreference } = useLanguageContext();
  const { t } = useTranslation();

  const [error, setError] = useState("");

  const [image, setImage] = useState<string | null>(null);
  const placeholder = imagePlaceholder;

  const getUserFromParams = () => {
    try {
      const user = JSON.parse(decodeURIComponent(params.user));
      setUserInfo(user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserFromParams();
  }, []);

  const age = userInfo?.birthday
    ? new Date().getFullYear() - new Date(userInfo.birthday).getFullYear()
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

  const createdAt = userInfo?.createdAt ? formatDate(userInfo.createdAt) : "";

  const handleError = (text: string) => {
    setError(text);
    const snackbarhide = setTimeout(() => {
      setError("");
    }, 5000);
    return () => {
      clearTimeout(snackbarhide);
    };
  };

  const getFamilyId = async () => {
    const username = await AsyncStorage.getItem("username");
    if (username === "" || username === null) {
      return;
    }
    try {
      const res = await api.get("/users/" + username);

      if (res.status === 200) {
        return res.data.familyId;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async () => {
    const familyId = await getFamilyId();

    if (!userInfo?.username && !familyId) {
      return;
    }

    const data = { familyId };

    try {
      const res = await api.put("/users/" + userInfo?.username, data);
      if (res.status === 200 && res.data.code === 200) {
        router.replace("/admin/members");
      } else if (res.data.code === 400) {
        handleError(t("screens:members.newMember.userInfo.alreadyExists"));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAvatarImage();
  }, []);

  useEffect(() => {
    if (image !== null) {
      const imageUri = image;
      console.log(image);
      AsyncStorage.setItem("image", imageUri);
    } else {
      AsyncStorage.setItem("image", "null");
    }
  }, [image]);

  const getAvatarImageDatabase = async () => {
    const username = await AsyncStorage.getItem("username");
    if (!username) return console.error("Username not found. Are you logged?");

    try {
      const res = await api.get("/users/" + username);

      if (res.status === 200 && res.data) {
        const { avatar } = res.data;
        setImage(avatar);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAvatarImage = async () => {
    const imageUri = await AsyncStorage.getItem("image");
    if (!imageUri) {
      AsyncStorage.setItem("image", "null");
      getAvatarImageDatabase();
    }
    if (imageUri === "null") {
      getAvatarImageDatabase();
    } else {
      setImage(imageUri);
    }
  };

  return (
    <>
      <TopBar
        title={t("screens:members.newMember.tabBar")}
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
          <Card.Content style={[styles.content, ,]}>
            <View style={styles.avatar}>
              {image ? (
                <Avatar.Image
                  source={image ? { uri: image } : { uri: placeholder }}
                  size={150}
                  style={{
                    backgroundColor: theme.custom.cardColor,
                    borderColor: theme.custom.cardTaskBackground,
                    borderWidth: 1,
                  }}
                />
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
              {userInfo?.name}
            </Text>
            <Text
              style={[
                { color: theme.colors.onSurfaceDisabled },
                styles.username,
              ]}
            >
              @{userInfo?.username}
            </Text>
            <Text style={[{ color: theme.colors.onBackground }, styles.text]}>
              {t("screens:members.newMember.userInfo.age")} {age}
            </Text>
            <Text style={[{ color: theme.colors.onBackground }, styles.text]}>
              Email: {userInfo?.email}
            </Text>
            <Text style={[{ color: theme.colors.onBackground }, styles.text]}>
              {t("screens:members.newMember.userInfo.memberSince")} {createdAt}
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={handleAdd}>
              {t("screens:members.newMember.userInfo.add")}
            </Button>
          </Card.Actions>
        </Card>

        <Snackbar onDismiss={() => setError("")} visible={error !== ""}>
          {error}
        </Snackbar>
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
