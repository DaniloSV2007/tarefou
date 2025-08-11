import { Pressable, Text, View } from "react-native";
import React from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import TopBar from "@/components/TopBar";
import { useRouter } from "expo-router";
import { collection } from "firebase/firestore";
import { db } from "@/services/FirebaseConfig";
import { Card, Divider, Icon } from "react-native-paper";

interface OptionsSectionProps {
  children: React.ReactNode;
}

export default function OptionsSection({ children }: OptionsSectionProps) {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const usersCollection = collection(db, "users");

  const childrenArray = React.Children.toArray(children);

  return (
    <Card
      mode="contained"
      style={[
        {
          paddingHorizontal: 4,
          backgroundColor: theme.custom.cardColor,
          width: "90%",
          borderRadius: 24,
        },
      ]}
    >
      <Card.Content className="p-0 rounded-3xl">
        {childrenArray.map((child, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <Divider />}
            {child}
          </React.Fragment>
        ))}
      </Card.Content>
    </Card>
  );
}
