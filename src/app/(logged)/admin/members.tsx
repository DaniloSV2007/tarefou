import MemberInfo from "@/components/Members/MemberInfo";
import { useAppTheme } from "@/hooks/useAppTheme";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TopBar from "@/components/TopBar";
import { useRouter } from "expo-router";
import { ActivityIndicator, Card, FAB } from "react-native-paper";
import { useTranslation } from "react-i18next";
import ContentLoader, { Circle, Rect } from "react-content-loader/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/services/api";
import { useEffect, useState } from "react";
import MemberInfoLoading from "@/components/Members/MemberInfoLoading";

interface User {
  id: string;
  name: string;
  username: string;
  birthday: Date;
  email: string;
  passwordHash: string;
  role: string;
  createdAt?: Date;
  familyId?: string;
}

export default function Members() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersLength, setUsersLength] = useState(0);

  const getUsers = async () => {
    setLoadingUsers(true);
    // const familyId = await getFamilyId();

    try {
      // const res = await api.get("/users/user/" + familyId);
      // if (res.status === 200) {
      //   setUsers(res.data);
      //   await AsyncStorage.setItem("numOfMembers", `${res.data.length}`);
      //   setUsersLength(res.data.length);
      //   setLoadingUsers(false);
      // }
    } catch (error) {
      console.error(error);
    }
  };

  const getFamilyId = async () => {
    const username = await AsyncStorage.getItem("username");
    try {
      const res = await api.get("/users/" + username);

      if (res.status === 200) {
        return res.data.familyId;
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUsers();
    membersLength();
  }, []);

  const membersLength = async () => {
    const lenght = await AsyncStorage.getItem("numOfMembers");
    const lenghtNum = parseInt(lenght ?? "0");
    if (lenghtNum) {
      setUsersLength(lenghtNum);
    }
  };

  if (loadingUsers) {
    return (
      <View
        style={[
          {
            backgroundColor: theme.colors.background,
            flex: 1,
          },
          styles.container,
        ]}
      >
        <TopBar title={t("screens:members.title")} />

        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.background,
            alignItems: "center",
            gap: 16,
            paddingVertical: 16,
          }}
        >
          {usersLength === 0 && (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator size={32} />
            </View>
          )}
          {Array.from({ length: usersLength }).map((_, i) => (
            <MemberInfoLoading key={i} />
          ))}

          <FAB
            icon={"plus"}
            style={[{ backgroundColor: theme.colors.primary }, styles.fab]}
            rippleColor={theme.custom.ripple}
            onPress={() => router.push("/member/new")}
            color="white"
          />
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.background,
          flex: 1,
        },
        styles.container,
      ]}
    >
      <TopBar title={t("screens:members.title")} />

      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          alignItems: "center",
          gap: 16,
          paddingVertical: 16,
        }}
      >
        {users.map((user: User) => (
          <MemberInfo
            key={user.id || user.username}
            name={user.name}
            username={user.username}
            memberSince={user.createdAt ?? ""}
          />
        ))}

        <FAB
          icon={"plus"}
          style={[{ backgroundColor: theme.colors.primary }, styles.fab]}
          rippleColor={theme.custom.ripple}
          onPress={() => router.push("/member/new")}
          color="white"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: 16,
  },
  card: {
    width: "90%",
    paddingVertical: 12,
    paddingBottom: 0,
    borderRadius: 16,
  },
});
