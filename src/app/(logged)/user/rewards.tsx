import TopBar from "@/components/TopBar";
import { useAppTheme } from "@/hooks/useAppTheme";
import { t } from "i18next";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = -width * 0.3;

export default function Rewards() {
  const theme = useAppTheme();
  const translationX = useSharedValue(0);
  const isSwiped = useSharedValue(false);

  const handleSwipeAction = () => {
    console.log("Swipe action triggered (ex: deletar item)");
    const timer = setTimeout(() => {
      isSwiped.value = true;
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
      if (translationX.value < SWIPE_THRESHOLD) {
        isSwiped.value = true;
        runOnJS(handleSwipeAction)();
        translationX.value = withTiming(-width); // sair da tela
      } else {
        translationX.value = withSpring(0, {
          velocity: 0.2,
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translationX.value }],
    };
  });

  const backgroundStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        translationX.value,
        [0, SWIPE_THRESHOLD],
        ["white", "red"]
      ),
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <TopBar title={t("routes.rewards")} />
        <View className="mx-4 my-2 overflow-hidden rounded-lg">
          <Animated.View
            style={[
              {
                ...StyleSheet.absoluteFillObject,
                justifyContent: "center",
                alignItems: "flex-end",
                paddingRight: 20,
                borderRadius: 24,
              },
              backgroundStyle,
            ]}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Excluir</Text>
          </Animated.View>

          <GestureDetector gesture={gesture}>
            <Animated.View
              style={[
                {
                  backgroundColor: "white",
                  padding: 16,
                  borderRadius: 12,
                  elevation: 2,
                },
                animatedStyle,
              ]}
            >
              <Text>Recompensa: 10 pontos</Text>
            </Animated.View>
          </GestureDetector>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}
