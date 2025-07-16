import TopBar from "@/components/TopBar";
import { t } from "i18next";
import React from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Icon } from "react-native-paper";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolateColor,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD_LEFT = -width * 0.3;
const SWIPE_THRESHOLD_RIGHT = width * 0.3;

export default function SwipeItem() {
  const translationX = useSharedValue(0);

  const handleDelete = () => {
    console.log("🗑️ Item excluído!");
    const timer = setTimeout(() => {
      translationX.value = withTiming(0);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  };

  const handleMarkAsRead = () => {
    console.log("📩 Item marcado como lido!");
    const timer = setTimeout(() => {
      translationX.value = withTiming(0);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  };

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translationX.value = event.translationX;
    })
    .onEnd(() => {
      if (translationX.value < SWIPE_THRESHOLD_LEFT) {
        runOnJS(handleDelete)();
        translationX.value = withTiming(-width);
      } else if (translationX.value > SWIPE_THRESHOLD_RIGHT) {
        runOnJS(handleMarkAsRead)();
        translationX.value = withTiming(width);
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
      ["red", "white", "dodgerblue"]
    ),
  }));

  const leftActionTextStyle = useAnimatedStyle(() => ({
    opacity: translationX.value < -30 ? 1 : 0,
  }));

  const rightActionTextStyle = useAnimatedStyle(() => ({
    opacity: translationX.value > 30 ? 1 : 0,
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1, padding: 16 }}>
      <TopBar title={t("routes.rewards")} />
      <View style={styles.container}>
        {/* Fundo com ações */}
        <Animated.View style={[styles.background, backgroundStyle]}>
          <Animated.View style={[styles.leftActionText, leftActionTextStyle]}>
            <Icon source={"email-open"} size={24} color="white" />
          </Animated.View>
          <Animated.View style={[styles.rightActionText, rightActionTextStyle]}>
            <Icon source={"email-open"} size={24} color="white" />
          </Animated.View>
        </Animated.View>

        {/* Item arrastável */}
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.card, animatedStyle]}>
            <Text style={{ fontSize: 16 }}>Recompensa: 10 pontos</Text>
          </Animated.View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  leftActionText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: -40,
    marginRight: 0,
  },
  rightActionText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: "-95%",
  },
  card: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 2,
  },
});
