import { NotificationItem } from "@/components/Notifications/NotificationItem";
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
import { t } from "i18next";
import { useEffect, useState } from "react";
import { View } from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";
import { db } from "../../../FirebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface notification {
  notificationId: string;
  title: string;
  body?: string;
  createdAt: Timestamp;
  data?: {};
  viewed: boolean;
}

export default function SwipeItem({
  refleshNotif,
}: {
  refleshNotif?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState<notification[] | DocumentData[]>([]);

  const notificationCollections = collection(db, "notifications");

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    const userId = await AsyncStorage.getItem("userId");

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
    }
  };

  const changeViewed = async (id: string, status: boolean) => {
    try {
      const q = query(
        notificationCollections,
        where("notificationId", "==", id)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const notifId = querySnapshot.docs[0].id;
        const notifDoc = doc(notificationCollections, notifId);
        await updateDoc(notifDoc, {
          viewed: status,
        });
        if (typeof refleshNotif === "function") {
          refleshNotif();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNotif = async (id: string) => {
    setNotif((prev) => prev.filter((n) => n.notificationId !== id));

    try {
      const q = query(
        notificationCollections,
        where("notificationId", "==", id)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const notifId = querySnapshot.docs[0].id;
        const notifDoc = doc(notificationCollections, notifId);
        await deleteDoc(notifDoc);
        if (typeof refleshNotif === "function") {
          refleshNotif();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <GestureHandlerRootView>
      <ScrollView className="flex-1" contentContainerClassName="gap-4">
        {!loading &&
          notif
            .sort(
              (a, b) =>
                new Date(
                  b.createdAt.seconds * 1000 + b.createdAt.nanoseconds / 1000000
                ).getTime() -
                new Date(
                  a.createdAt.seconds * 1000 + a.createdAt.nanoseconds / 1000000
                ).getTime()
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
                  n.createdAt.seconds * 1000 + n.createdAt.nanoseconds / 1000000
                ).toISOString()}
                changeViewed={(status: boolean) =>
                  changeViewed(n.notificationId, status)
                }
                deleteNotif={() => deleteNotif(n.notificationId)}
              />
            ))}
      </ScrollView>
    </GestureHandlerRootView>
  );
}
