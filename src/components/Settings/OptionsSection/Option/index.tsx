import { Pressable, Text, View } from "react-native";
import React from "react";
import { useThemeContext } from "@/context/ThemeContext";
// import { useAuth } from "@/context/AuthContext";
// import { useTranslation } from "react-i18next";
// import { useRouter } from "expo-router";
// import { collection } from "firebase/firestore";
// import { db } from "@/services/FirebaseConfig";
import { Icon } from "react-native-paper";

interface OptionProps {
  title: string;
  onPress: () => void;
}

export default function Option({ title, onPress }: OptionProps) {
  const { theme } = useThemeContext();
  // const { t } = useTranslation();
  // const router = useRouter();
  // const usersCollection = collection(db, "users");

  return (
    <Pressable
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: 52,
        paddingHorizontal: 12,
        paddingVertical: 20,
      }}
      android_ripple={{ color: theme.colors.ripple }}
      onPress={onPress}
    >
      <Text style={{ color: theme.colors.onBackground }} className="text-2xl">
        {title}
      </Text>
      <View>
        <Icon
          source="chevron-right"
          size={24}
          color={theme.colors.onBackground}
        />
      </View>
    </Pressable>
  );
}
