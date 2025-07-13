import { useState, useEffect, useRef } from "react";

import * as Device from "expo-device";
import * as Notification from "expo-notifications";

import Constants from "expo-constants";

import { Platform } from "react-native";

export interface PushNotificationState {
  notification?: Notification.Notification;
  expoPushToken?: Notification.ExpoPushToken;
}

export const usePushNotifications = (): PushNotificationState => {
  Notification.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldSetBadge: false,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState<
    Notification.ExpoPushToken | undefined
  >();

  const [notification, setNotification] = useState<
    Notification.Notification | undefined
  >();

  const notificationListener = useRef<Notification.EventSubscription | null>(
    null
  );
  const responseListener = useRef<Notification.EventSubscription | null>(null);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notification.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notification.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token");
        console.log("Failed to get push token");
        return;
      }

      console.log("Getting Token...");

      const projectId = Constants.expoConfig?.extra?.eas?.projectId;

      const token = await Notification.getExpoPushTokenAsync({
        projectId,
      });

      if (Platform.OS === "android") {
        Notification.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notification.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "ff231f7c",
        });
      }
      console.log(token);
      return token;
    } else {
      console.warn("ERROR: Please use a physical device");
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });

    notificationListener.current = Notification.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    responseListener.current =
      Notification.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  return {
    expoPushToken,
    notification,
  };
};
