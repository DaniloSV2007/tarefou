import { View } from "react-native";
import React, { useEffect, useRef } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import TopBar from "@/components/TopBar";
import { useRouter } from "expo-router";
import { db } from "../../../FirebaseConfig";
import { collection } from "firebase/firestore";
import SwipeItem from "@/components/Notifications/SwipeItem";
import { usePushNotifications } from "@/hooks/usePushNotifications";

export default function Notifications() {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const usersCollection = collection(db, "users");
  const { notification } = usePushNotifications();

  const refNotif = useRef<any>(null);

  const getNotif = () => {
    refNotif.current?.getNotifNum();
  };

  useEffect(() => {
    refNotif.current?.getNotifNum();
  }, [notification]);

  return (
    <>
      <TopBar title={"Notifications"} isBackButtonEnable ref={refNotif} />
      <View
        className="flex-1 py-4"
        style={{ backgroundColor: theme.colors.background }}
      >
        <SwipeItem refleshNotif={getNotif} />
      </View>
    </>
  );
}
