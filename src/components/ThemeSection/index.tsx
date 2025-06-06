import { useThemeContext } from "@/context/ThemeContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Card,
  Divider,
  Icon,
  RadioButton,
  Text,
  TouchableRipple,
} from "react-native-paper";

export default function ThemeSection() {
  const [expanded, setExpanded] = useState(false);
  const { toggleTheme, themePreference } = useThemeContext();
  const theme = useAppTheme();

  const handlePress = () => setExpanded(!expanded);
  return (
    <Card style={[{ backgroundColor: theme.custom.cardColor }, styles.card]}>
      <Card.Title
        title="Theme"
        titleStyle={{ fontSize: 28, fontWeight: "bold", marginBottom: "-4%" }}
        left={() => (
          <Icon source="brush-variant" size={42} color={theme.colors.primary} />
        )}
      />
      <Card.Content
        style={[
          { backgroundColor: theme.custom.cardTaskBackground },
          styles.cardContent,
        ]}
      >
        <TouchableRipple
          rippleColor={theme.custom.ripple}
          onPress={() => toggleTheme(0)}
          style={styles.themeContainer}
        >
          <View style={styles.themeContainer}>
            <Icon source="theme-light-dark" size={32} />
            <Text style={styles.themeText}>Device Theme</Text>
            <View style={styles.radioButton}>
              <RadioButton
                value="device"
                status={themePreference === 0 ? "checked" : "unchecked"}
                onPress={() => toggleTheme(0)}
              />
            </View>
          </View>
        </TouchableRipple>

        <Divider style={styles.divider} />

        <TouchableRipple
          rippleColor={theme.custom.ripple}
          onPress={() => toggleTheme(1)}
          style={styles.themeContainer}
        >
          <View style={styles.themeContainer}>
            <Icon source="white-balance-sunny" size={32} />
            <Text style={styles.themeText}>Light Theme</Text>
            <View style={styles.radioButton}>
              <RadioButton
                value="light"
                status={themePreference === 1 ? "checked" : "unchecked"}
                onPress={() => toggleTheme(1)}
              />
            </View>
          </View>
        </TouchableRipple>

        <Divider style={styles.divider} />

        <TouchableRipple
          rippleColor={theme.custom.ripple}
          onPress={() => toggleTheme(2)}
          style={styles.themeContainer}
        >
          <View style={styles.themeContainer}>
            <View style={{ transform: [{ rotate: "30deg" }] }}>
              <Icon source="moon-waxing-crescent" size={32} />
            </View>

            <Text style={styles.themeText}>Dark Theme</Text>
            <View style={styles.radioButton}>
              <RadioButton
                value="device"
                status={themePreference === 2 ? "checked" : "unchecked"}
                onPress={() => toggleTheme(2)}
              />
            </View>
          </View>
        </TouchableRipple>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 10,
    width: "90%",
    borderRadius: 12,
  },
  cardContent: {
    padding: 20,
    borderRadius: 12,
  },
  divider: {
    marginVertical: 10,
  },
  themeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 5,
    borderRadius: 12,
    overflow: "hidden",
    width: "100%",
  },
  themeText: {
    fontSize: 20,
  },
  radioButton: {
    position: "absolute",
    right: 10,
  },
});
