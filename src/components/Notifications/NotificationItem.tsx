import React, { useEffect, useState } from "react";
import { Text, StyleSheet, Dimensions } from "react-native";
import {
  Gesture,
  GestureDetector,
  Pressable,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolateColor,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Icon } from "react-native-paper";
import { useAppTheme } from "@/hooks/useAppTheme";
import { View } from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD_LEFT = -width * 0.15;
const SWIPE_THRESHOLD_RIGHT = width * 0.15;

export function NotificationItem({
  title,
  body,
  viewed,
  createAt,
  changeViewed,
  deleteNotif,
  data,
}: {
  title: string;
  body?: string | undefined;
  viewed: boolean;
  createAt: string;
  changeViewed: (status: boolean) => void;
  deleteNotif: () => void;

  data: any;
}) {
  const translationX = useSharedValue(0);
  const height = useSharedValue(80);
  const theme = useAppTheme();
  const router = useRouter();

  const [viewedStatus, setViewedStatus] = useState<boolean>(
    viewed ? true : false
  );

  const handleDelete = () => {
    translationX.value = withTiming(-width);
    height.value = withTiming(0, { duration: 400 }, () => {
      runOnJS(deleteNotif)();
      translationX.value = 0;
    });
  };

  const handleMarkAsRead = () => {
    translationX.value = withTiming(width);
    height.value = withTiming(0, { duration: 400 }, () => {
      translationX.value = 0;
      height.value = withTiming(80, { duration: 600 });
      runOnJS(changeView)();
    });
  };
  const changeView = () => {
    setViewedStatus((prev) => !prev);
    changeViewed(viewedStatus);
  };

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translationX.value = event.translationX;
    })
    .onEnd(() => {
      if (translationX.value < SWIPE_THRESHOLD_LEFT) {
        runOnJS(handleDelete)();
      } else if (translationX.value > SWIPE_THRESHOLD_RIGHT) {
        runOnJS(handleMarkAsRead)();
      } else {
        translationX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translationX.value }],
  }));

  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      translationX.value,
      [SWIPE_THRESHOLD_LEFT, 0, SWIPE_THRESHOLD_RIGHT],
      ["red", theme.custom.cardColor, "dodgerblue"]
    ),
  }));

  const leftIconStyle = useAnimatedStyle(() => ({
    opacity: translationX.value > 30 ? 1 : 0,
  }));

  const rightIconStyle = useAnimatedStyle(() => ({
    opacity: translationX.value < -30 ? 1 : 0,
  }));

  const animatedContainerStyle = useAnimatedStyle(() => ({
    height: height.value,
    opacity: height.value === 0 ? 0 : 1,
  }));

  const getTime = (time: string) => {
    const dateNow = new Date();
    const createdDate = new Date(time);
    const diff = Math.floor((dateNow.getTime() - createdDate.getTime()) / 1000);
    if (diff >= 3600) return `Há ${Math.floor(diff / 3600)}h`;
    if (diff >= 60) return `Há ${Math.floor(diff / 60)}m`;
    return `Há ${diff}s`;
  };

  const handleNotifPress = () => {
    if (!data) return;
    setViewedStatus(true);
    changeViewed(true);
    const href = data.href;
    if (!href) return;
    router.push(href);
  };

  return (
    <Animated.View style={[styles.notification, animatedContainerStyle]}>
      <Animated.View style={[styles.background, backgroundStyle]}>
        <Animated.View style={[styles.leftIcon, leftIconStyle]}>
          <Icon
            source={viewedStatus ? "email" : "email-open"}
            size={28}
            color="white"
          />
        </Animated.View>
        <Animated.View style={[styles.rightIcon, rightIconStyle]}>
          <Icon source="trash-can-outline" size={28} color="white" />
        </Animated.View>
      </Animated.View>

      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            styles.card,
            animatedStyle,
            {
              backgroundColor: viewedStatus
                ? theme.custom.cardColor
                : theme.custom.cardTaskBackground,
            },
          ]}
        >
          <Pressable
            android_ripple={{ color: theme.custom.ripple }}
            onPress={handleNotifPress}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 12,
              flex: 1,
            }}
          >
            <View className="flex-row w-full justify-between">
              <View style={{ width: "75%" }}>
                <Text
                  style={{
                    color: theme.colors.onBackground,
                    opacity: viewedStatus ? 0.5 : undefined,
                  }}
                  className="text-xl font-bold"
                >
                  {title}
                </Text>
              </View>

              <View
                style={{
                  width: "25%",
                  alignItems: "flex-end",
                }}
              >
                <Text
                  style={{
                    color: theme.colors.onBackground,
                    opacity: viewedStatus ? 0.5 : undefined,
                  }}
                >
                  {getTime(createAt)}
                </Text>
              </View>
            </View>
            <Text
              style={{
                color: theme.colors.onBackground,
                opacity: viewedStatus ? 0.5 : undefined,
              }}
              className={"line-clamp-2"}
            >
              {body}
            </Text>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  notification: {
    borderRadius: 16,
    overflow: "hidden",
    marginHorizontal: 16,
    elevation: 6,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  leftIcon: {
    justifyContent: "center",
    alignItems: "center",
  },
  rightIcon: {
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    flex: 1,
    borderRadius: 16,
    elevation: 2,
  },
});
