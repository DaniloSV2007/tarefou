import React from "react";
import { useLanguageContext } from "@/context/LanguageContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { StyleSheet, View } from "react-native";
import {
  Card,
  Divider,
  Icon,
  RadioButton,
  Text,
  TouchableRipple,
  Button,
} from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useTranslations } from "@/hooks/useTranslations";

export default function LanguageSection() {
  const { toggleLanguage, languagePreference } = useLanguageContext();
  const theme = useAppTheme();
  const { t } = useTranslation();
  const { tc, getCurrentLanguage } = useTranslations();
  const currentLang = getCurrentLanguage();

  return (
    <Card style={[{ backgroundColor: theme.custom.cardColor }, styles.card]}>
      <Card.Title
        title={t("settings.language.title")}
        titleStyle={{ fontSize: 28, fontWeight: "bold", marginBottom: "-4%" }}
        left={() => (
          <Icon source="translate" size={42} color={theme.colors.primary} />
        )}
      />
      <Card.Content style={[{}, styles.cardContent]}>
        <TouchableRipple
          rippleColor={theme.custom.ripple}
          onPress={() => toggleLanguage(0)}
          style={styles.languageContainer}
        >
          <View style={styles.languageContainer}>
            <Icon source="devices" size={32} />
            <Text style={styles.languageText}>
              {t("settings.language.system")}
            </Text>
            <View style={styles.radioButton}>
              <RadioButton
                value="device"
                status={languagePreference === 0 ? "checked" : "unchecked"}
                onPress={() => toggleLanguage(0)}
              />
            </View>
          </View>
        </TouchableRipple>

        <Divider style={styles.divider} />

        <TouchableRipple
          rippleColor={theme.custom.ripple}
          onPress={() => toggleLanguage(1)}
          style={styles.languageContainer}
        >
          <View style={styles.languageContainer}>
            <Icon source="flag-variant" size={32} />
            <Text style={styles.languageText}>
              {t("settings.language.english")}
            </Text>
            <View style={styles.radioButton}>
              <RadioButton
                value="english"
                status={languagePreference === 1 ? "checked" : "unchecked"}
                onPress={() => toggleLanguage(1)}
              />
            </View>
          </View>
        </TouchableRipple>

        <Divider style={styles.divider} />

        <TouchableRipple
          rippleColor={theme.custom.ripple}
          onPress={() => toggleLanguage(2)}
          style={styles.languageContainer}
        >
          <View style={styles.languageContainer}>
            <Icon source="flag-variant" size={32} />
            <Text style={styles.languageText}>
              {t("settings.language.portuguese")}
            </Text>
            <View style={styles.radioButton}>
              <RadioButton
                value="portuguese"
                status={languagePreference === 2 ? "checked" : "unchecked"}
                onPress={() => toggleLanguage(2)}
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
    paddingVertical: 8,
    paddingHorizontal: 4,
    width: "90%",
    borderRadius: 16,
    marginTop: 20,
  },
  cardContent: {
    padding: 0,
    borderRadius: 16,
  },
  divider: {
    marginVertical: 10,
  },
  languageContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 5,
    borderRadius: 16,
    overflow: "hidden",
    width: "100%",
  },
  languageText: {
    fontSize: 20,
  },
  radioButton: {
    position: "absolute",
    right: 10,
  },
});
