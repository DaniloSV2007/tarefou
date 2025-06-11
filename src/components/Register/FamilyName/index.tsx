import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { Button, Text } from "react-native-paper";
import { useAppTheme } from "@/hooks/useAppTheme";

interface FamilyNameProps {
  setPage: (page: number) => void;
  familyName: string;
  setFamilyName: (familyName: string) => void;
}

export default function FamilyName({
  setPage,
  familyName,
  setFamilyName,
}: FamilyNameProps) {
  const { t } = useTranslation();
  const [isfamilyFocused, setIsFamilyFocused] = useState(false);
  const theme = useAppTheme();

  return (
    <>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.custom.cardTaskBackground,
            color: theme.colors.onBackground,
            borderColor: isfamilyFocused
              ? theme.colors.onBackground
              : theme.custom.inputFocusBorder,
            borderWidth: isfamilyFocused ? 2 : 1,
          },
        ]}
        cursorColor={theme.colors.onBackground}
        placeholder={t("register.familyName.placeholder")}
        placeholderTextColor={theme.colors.onSurfaceDisabled}
        onFocus={() => setIsFamilyFocused(true)}
        onBlur={() => setIsFamilyFocused(false)}
        value={familyName}
        onChangeText={(text) => {
          setFamilyName(text);
        }}
        autoComplete="family-name"
      />

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          style={[
            styles.backButton,
            { backgroundColor: theme.custom.cardTaskBackground },
          ]}
          labelStyle={[styles.buttonText, { color: theme.colors.onBackground }]}
          children={t("components:common.back")}
          onPress={() => setPage(4)}
        />
        <Button
          mode="contained"
          onPress={() => setPage(6)}
          style={[
            styles.button,
            {
              backgroundColor:
                familyName.length === 0
                  ? theme.colors.surfaceDisabled
                  : theme.colors.primary,
            },
          ]}
          labelStyle={styles.buttonText}
          disabled={familyName.length === 0}
        >
          {t("components:common.next")}
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 12,
    fontSize: 24,
    borderRadius: 8,
    height: 65,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 32,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderColor: "#666",
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "500",
    color: "white",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 32,
    paddingVertical: 5,
  },
});
