import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";

export default function CustomIcon({
  name,
  size,
  color,
  focused,
  label,
}: {
  name: keyof typeof MaterialCommunityIcons.glyphMap;
  size: number;
  color: string;
  focused: boolean;
  label: string;
}) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: focused ? -5 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: focused ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View style={{ transform: [{ translateY }] }}>
        <MaterialCommunityIcons name={name} size={size} color={color} />
      </Animated.View>

      <Animated.View style={{ opacity, marginTop: 4 }}>
        <Text style={{ fontSize: 12, fontWeight: "bold", color }}>{label}</Text>
      </Animated.View>
    </View>
  );
}
