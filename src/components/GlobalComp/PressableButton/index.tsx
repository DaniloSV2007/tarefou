import {
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { useThemeContext } from "@/context/ThemeContext";
import { Icon } from "react-native-paper";

interface OptionProps {
  title: string;
  onPress?: () => void;
  chevronIcon?: boolean;
  titleStyle?: StyleProp<TextStyle>;
  titleClassName?: string;
  style?: StyleProp<ViewStyle>;
  className?: string;
  leftIcon?: (props: { size: number }) => React.ReactNode;
}

const LEFT_SIZE = 40;

export default function PressableButton({
  title,
  onPress,
  chevronIcon,
  titleStyle,
  titleClassName,
  style,
  className,
  leftIcon,
}: OptionProps) {
  const { theme } = useThemeContext();

  return (
    <Pressable
      style={[
        {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: 52,
          paddingHorizontal: 12,
          paddingVertical: 20,
        },
        style,
      ]}
      className={className}
      android_ripple={{ color: theme.colors.primaryContainer }}
      onPress={onPress}
    >
      <View className="flex-row">
        {leftIcon ? (
          <View className="h-full px-4 items-center justify-center">
            {leftIcon({ size: LEFT_SIZE })}
          </View>
        ) : null}

        <Text
          style={[{ color: theme.colors.onSurface }, titleStyle]}
          className={"text-3xl" + (titleClassName ?? "")}
        >
          {title}
        </Text>
      </View>

      {chevronIcon && (
        <View>
          <Icon
            source="chevron-right"
            size={24}
            color={theme.colors.onSurfaceVariant}
          />
        </View>
      )}
    </Pressable>
  );
}
