import {
  NotifDataType,
  NotificationItem,
} from "@/components/Notifications/NotificationItem";
import TopBar from "@/components/TopBar";
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { RefreshControl, Text, View } from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { Button } from "react-native-paper";
import { db } from "@/services/FirebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAnimatedRef } from "react-native-reanimated";
import { useThemeContext } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { usePushNotifications } from "@/hooks/usePushNotifications";

interface notification {
  notificationId: string;
  title: string;
  body?: string;
  createdAt: Timestamp;
  data?: NotifDataType;
  viewed: boolean;
}

export default function Notifications() {
  const { theme } = useThemeContext();
  const { t } = useTranslation();
  const { notification } = usePushNotifications();

  const refNotif = useRef<{ getNotifNum: () => void } | null>(null);

  const getNotif = () => {
    refNotif.current?.getNotifNum();
  };

  useEffect(() => {
    getNotif();
    getNotifications();
  }, [notification]);

  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState<notification[] | DocumentData[]>([]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      getNotif();
      await getNotifications();
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const notificationCollections = collection(db, "notifications");

  const scrollRef = useAnimatedRef<ScrollView>() as RefObject<ScrollView>;

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    const userId = await AsyncStorage.getItem("userId");
    if (loading) return;
    setLoading(true);

    if (!userId) return;
    try {
      const q = query(notificationCollections, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const notifs = querySnapshot.docs.map((n) => n.data());
        setNotif(notifs);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
      setTimeout(() => {
        setLoading(false);
      }, 1);
    }
  };

  const changeViewed = async (id: string, status: boolean) => {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) return;

    console.log(status, id);
    try {
      const q = query(
        notificationCollections,
        where("notificationId", "==", id),
        where("userId", "==", userId), // Add userId filter here
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const notifId = querySnapshot.docs[0].id;
        const notifDoc = doc(notificationCollections, notifId);
        await updateDoc(notifDoc, {
          viewed: status,
        });
        getNotif();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNotif = async (id: string) => {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) return;

    setNotif((prev) => prev.filter((n) => n.notificationId !== id));

    try {
      const q = query(
        notificationCollections,
        where("notificationId", "==", id),
        where("userId", "==", userId), // Add userId filter here
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const notifId = querySnapshot.docs[0].id;
        const notifDoc = doc(notificationCollections, notifId);
        await deleteDoc(notifDoc);
        onRefresh();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const notifsNotRead = notif.filter((n) => !n.viewed);

      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return;

      for (const n of notifsNotRead) {
        const q = query(
          notificationCollections,
          where("notificationId", "==", n.notificationId),
          where("userId", "==", userId), // Add userId filter here
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const notifId = querySnapshot.docs[0].id;
          const notifDoc = doc(notificationCollections, notifId);
          await updateDoc(notifDoc, {
            viewed: true,
          });
        }
      }
      onRefresh();
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1);
    }
  };

  return (
    <>
      <TopBar
        title={t("notifications.title")}
        isBackButtonEnable
        ref={refNotif}
      />

      <GestureHandlerRootView>
        <ScrollView
          className="flex-1 pb-12"
          contentContainerStyle={{
            gap: 16,
            flexGrow: 1,
            minHeight: "100%",
            paddingVertical: 16,
            paddingBottom: 32,
          }}
          ref={scrollRef}
          style={{ backgroundColor: theme.colors.background }}
          refreshControl={
            <RefreshControl
              colors={[theme.colors.onBackground]}
              progressBackgroundColor={theme.colors.cardTaskBackground}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <View
            className="flex-row w-full px-2"
            style={{ justifyContent: "space-between" }}
          >
            <Button onPress={onRefresh}>{t("notifications.update")}</Button>
            {notif.length > 0 && (
              <Button onPress={markAllAsRead}>
                {t("notifications.markRead")}
              </Button>
            )}
          </View>

          {notif.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Text
                className="text-2xl"
                style={{ color: theme.colors.onBackground }}
              >
                {t("notifications.notFound")}
              </Text>
            </View>
          ) : (
            !loading &&
            notif
              .sort(
                (a, b) =>
                  new Date(
                    b.createdAt.seconds * 1000 +
                      b.createdAt.nanoseconds / 1000000,
                  ).getTime() -
                  new Date(
                    a.createdAt.seconds * 1000 +
                      a.createdAt.nanoseconds / 1000000,
                  ).getTime(),
              )
              .sort((a, b) => Number(a.viewed) - Number(b.viewed))
              .map((n, i) => (
                <NotificationItem
                  key={i}
                  title={n.title}
                  body={n.body}
                  viewed={n.viewed}
                  data={n.data}
                  createAt={new Date(
                    n.createdAt.seconds * 1000 +
                      n.createdAt.nanoseconds / 1000000,
                  ).toISOString()}
                  changeViewed={(status: boolean) =>
                    changeViewed(n.notificationId, status)
                  }
                  deleteNotif={() => deleteNotif(n.notificationId)}
                  scrollGestureRef={scrollRef}
                />
              ))
          )}
        </ScrollView>
      </GestureHandlerRootView>
    </>
  );
}
