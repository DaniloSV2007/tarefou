import {
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import React from "react";
import { useThemeContext } from "@/context/ThemeContext";
import { Card } from "react-native-paper";

interface CardButton {
  title: string;
  children: React.ReactNode;
  cardStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  className?: string;
}

export default function CustomCard({
  title,
  children,
  cardStyle,
  contentStyle,
  titleStyle,
  className,
}: CardButton) {
  const { theme } = useThemeContext();

  return (
    <Card
      mode="contained"
      style={[
        {
          backgroundColor: theme.colors.cardColor,
        },
        styles.card,
        cardStyle,
      ]}
      className={className}
    >
      <Card.Title
        title={title}
        titleStyle={[
          { fontSize: 28, color: theme.colors.onSurface },
          titleStyle,
        ]}
      />
      <Card.Content style={{ gap: 16 }}>
        <View style={contentStyle}>{children}</View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "90%",
    overflow: "hidden",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginTop: 12,
  },
});
