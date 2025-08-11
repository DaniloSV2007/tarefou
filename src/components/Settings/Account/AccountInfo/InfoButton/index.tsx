import {
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import TopBar from "@/components/TopBar";
import { useRouter } from "expo-router";
import { collection } from "firebase/firestore";
import { db } from "@/services/FirebaseConfig";
import { Icon } from "react-native-paper";

interface OptionProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  chevronIcon?: boolean;
  titleStyle?: StyleProp<TextStyle>;
  titleClassName?: string;
  subtitleStyle?: StyleProp<TextStyle>;
  subtitleClassName?: string;
  style?: StyleProp<ViewStyle>;
  className?: string;
  infoText?: string;
}

export default function InfoButon({
  title,
  subtitle,
  onPress,
  chevronIcon,
  titleStyle,
  titleClassName,
  subtitleStyle,
  subtitleClassName,
  style,
  className,
  infoText,
}: OptionProps) {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const usersCollection = collection(db, "users");

  return (
    <Pressable
      style={[
        {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: 52,
          paddingHorizontal: 12,
          paddingVertical: 12,
        },
        style,
      ]}
      className={className}
      android_ripple={{ color: theme.custom.ripple }}
      onPress={onPress}
    >
      <View className="flex-row items-center" style={{ borderColor: "black" }}>
        <View className="flex flex-col" style={{ minWidth: "45%" }}>
          <Text
            style={[{ color: theme.colors.onBackground }, titleStyle]}
            className={"text-xl" + (titleClassName ?? "")}
          >
            {title}
          </Text>
          <Text
            className={"text-xl" + (subtitleClassName ?? "")}
            style={[{ color: "#888" }, subtitleStyle]}
          >
            {subtitle}
          </Text>
        </View>

        {infoText && (
          <View style={{ maxWidth: "100%" }}>
            <Text style={{ fontSize: 12, maxWidth: "75%", color: "#888" }}>
              <Icon source={"information-outline"} size={20} />
              {infoText}
            </Text>
          </View>
        )}
      </View>

      {chevronIcon && (
        <View>
          <Icon
            source="chevron-right"
            size={24}
            color={theme.colors.onBackground}
          />
        </View>
      )}
    </Pressable>
  );
}
