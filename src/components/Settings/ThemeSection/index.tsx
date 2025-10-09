import { useThemeContext } from "@/context/ThemeContext";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Card, Divider, Icon, RadioButton, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";

export default function ThemeSection() {
  const { toggleTheme, themePreference, theme } = useThemeContext();
  const { t } = useTranslation();

  return (
    <Card
      mode="contained"
      style={[{ backgroundColor: theme.colors.cardColor }, styles.card]}
    >
      <Card.Title
        title={t("settings.theme.title")}
        titleStyle={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: "-4%",
          color: theme.colors.onBackground,
        }}
        left={() => (
          <Icon source="brush-variant" size={42} color={theme.colors.primary} />
        )}
      />
      <Card.Content style={[{}, styles.cardContent]}>
        <TouchableOpacity
          onPress={() => toggleTheme(0)}
          style={styles.themeContainer}
        >
          <View style={styles.themeContainer}>
            <Icon
              color={theme.colors.onBackground}
              source="theme-light-dark"
              size={32}
            />
            <Text
              style={[styles.themeText, { color: theme.colors.onBackground }]}
            >
              {t("settings.theme.system")}
            </Text>
            <View style={styles.radioButton}>
              <RadioButton
                value="device"
                status={themePreference === 0 ? "checked" : "unchecked"}
                onPress={() => toggleTheme(0)}
              />
            </View>
          </View>
        </TouchableOpacity>

        <Divider style={styles.divider} />

        <TouchableOpacity
          onPress={() => toggleTheme(1)}
          style={styles.themeContainer}
        >
          <View style={styles.themeContainer}>
            <Icon
              color={theme.colors.onBackground}
              source="white-balance-sunny"
              size={32}
            />
            <Text
              style={[styles.themeText, { color: theme.colors.onBackground }]}
            >
              {t("settings.theme.light")}
            </Text>
            <View style={styles.radioButton}>
              <RadioButton
                value="light"
                status={themePreference === 1 ? "checked" : "unchecked"}
                onPress={() => toggleTheme(1)}
              />
            </View>
          </View>
        </TouchableOpacity>

        <Divider style={styles.divider} />

        <TouchableOpacity
          onPress={() => toggleTheme(2)}
          style={styles.themeContainer}
        >
          <View style={styles.themeContainer}>
            <View style={{ transform: [{ rotate: "30deg" }] }}>
              <Icon
                color={theme.colors.onBackground}
                source="moon-waxing-crescent"
                size={32}
              />
            </View>

            <Text
              style={[styles.themeText, { color: theme.colors.onBackground }]}
            >
              {t("settings.theme.dark")}
            </Text>
            <View style={styles.radioButton}>
              <RadioButton
                value="device"
                status={themePreference === 2 ? "checked" : "unchecked"}
                onPress={() => toggleTheme(2)}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    width: "90%",
    borderRadius: 24,
  },
  cardContent: {
    padding: 0,
    borderRadius: 24,
  },
  divider: {
    marginVertical: 10,
  },
  themeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 5,
    borderRadius: 24,
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
