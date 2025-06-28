import MemberInfo from "@/components/Members/MemberInfo";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Platform,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TopBar from "@/components/TopBar";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Appbar,
  Badge,
  Button,
  Card,
  FAB,
  Menu,
  Portal,
} from "react-native-paper";
import { useTranslation } from "react-i18next";
import ContentLoader, { Circle, Rect } from "react-content-loader/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/services/api";
import { useCallback, useEffect, useState } from "react";
import MemberInfoLoading from "@/components/Members/MemberInfoLoading";
import EditMember from "@/components/Members/EditMember";
import { Text } from "react-native-paper";
import MenuItem from "react-native-paper/lib/typescript/components/Menu/MenuItem";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export interface UserType {
  name: string;
  username: string;
  birthday: Date;
  email: string;
  role: string;
  avatar: string;
  createdAt?: Date;
  familyId?: string;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function Members() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersLength, setUsersLength] = useState(0);

  const [userInfo, setUserInfo] = useState<UserType>();
  const [editVisible, setEditVisible] = useState<boolean>(false);

  const [familyName, setFamilyName] = useState<string | null>(null);

  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    reflesh();
  }, []);

  const findFamilyOwner = async (users: [], owner: string) => {
    if (!owner) return;

    const ownerIndex = users.findIndex(
      (user: UserType) => user.username === owner
    );
    if (ownerIndex !== -1) {
      const newUsers = [...users];
      newUsers.splice(ownerIndex, 1);
      await AsyncStorage.setItem("numOfMembers", `${newUsers.length}`);
      setUsersLength(newUsers.length);
      setUsers(newUsers);
    }
  };

  const getUsers = async () => {
    setLoadingUsers(true);
    const familyId = await getFamilyId();

    if (!familyId) {
      await AsyncStorage.setItem("numOfMembers", "0");
      setUsersLength(0);
      setLoadingUsers(false);
      setRefreshing(false);
      return;
    }
    try {
      const res = await api.get("/families/" + familyId);
      if (res.status === 200) {
        const { users, owner, name } = res.data;
        findFamilyOwner(users, owner);
        setFamilyName(name);
        setLoadingUsers(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  const getFamilyId = async () => {
    const familyId = await AsyncStorage.getItem("familyId");
    if (familyId) {
      return familyId;
    }

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

  const membersLength = async () => {
    const lenght = await AsyncStorage.getItem("numOfMembers");
    const lenghtNum = parseInt(lenght ?? "0");
    if (lenghtNum) {
      setUsersLength(lenghtNum);
    }
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    try {
      reflesh();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const reflesh = () => {
    getUsers();
    membersLength();
  };

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  async function handleSendNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📬 Você tem uma nova tarefa!",
        body: "Abra o app para ver os detalhes.",
        sound: "default",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
        repeats: false,
      },
    });
  }

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
      <TopBar title={familyName ? familyName : t("screens:members.title")}>
        <View style={styles.iconWithBadge}>
          <Appbar.Action icon="bell-outline" onPress={handleSendNotification} />

          <Badge style={styles.badge} size={8}></Badge>
        </View>

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action
              icon="dots-vertical"
              color="white"
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          <Menu.Item
            title="Configurações da Família"
            onPress={() => {
              setMenuVisible(false);
            }}
          />
        </Menu>
      </TopBar>

      <ScrollView
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          paddingVertical: 16,
        }}
        contentContainerStyle={{ alignItems: "center", gap: 16, flex: 1 }}
        refreshControl={
          <RefreshControl
            colors={[theme.colors.onBackground]}
            progressBackgroundColor={theme.custom.cardTaskBackground}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {users.map((user: UserType) => (
          <MemberInfo
            key={user.username}
            user={user}
            setUserInfo={setUserInfo}
            setEditVisible={setEditVisible}
          />
        ))}
        {usersLength === 0 && (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text>No members found</Text>
          </View>
        )}

        {editVisible && (
          <Portal>
            <EditMember
              user={userInfo}
              setEditVisible={setEditVisible}
              reflesh={reflesh}
            />
          </Portal>
        )}
      </ScrollView>
      <FAB
        icon={"plus"}
        style={[{ backgroundColor: theme.colors.primary }, styles.fab]}
        rippleColor={theme.custom.ripple}
        onPress={() => router.push("/member/new")}
        color="white"
      />
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
  iconWithBadge: {
    position: "relative",
    marginRight: 8,
  },
  badge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#f44336",
    color: "white",
    fontSize: 10,
    zIndex: 1,
  },
});

async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert(
        "Permissão negada",
        "Não foi possível ativar as notificações."
      );
      return;
    }

    // Para notificações push (remotas), você usaria:
    // const token = (await Notifications.getExpoPushTokenAsync()).data;
    // console.log("Token:", token);
  } else {
    Alert.alert(
      "Atenção",
      "Notificações funcionam apenas em dispositivos físicos."
    );
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      sound: "default",
    });
  }
}
