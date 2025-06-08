import { StyleSheet, TextInput, View } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useState } from "react";
import React from "react";
import { Button, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";

export default function NameAndUsername({
  setPage,
}: {
  setPage: (page: number) => void;
}) {
  const theme = useAppTheme();
  const [isFocusedName, setIsFocusedName] = useState(false);
  const [isFocusedUsername, setIsFocusedUsername] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { t } = useTranslation();
  const nameHandler = (text: string) => {
    setName(text);
    if (text.length === 0 || text.length >= 3) {
      setError("");
    } else {
      setError(t("register.error.nameLength"));
    }
  };

  const usernameHandler = (text: string) => {
    setUsername(text);
    if (text.length === 0 || text.length >= 3) {
      setError("");
    } else {
      setError(t("register.error.usernameLength"));
    }
  };
  return (
    <>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.custom.cardTaskBackground,
            color: theme.colors.onBackground,
            borderColor: isFocusedName
              ? theme.colors.onBackground
              : theme.custom.inputFocusBorder,
            borderWidth: isFocusedName ? 2 : 1,
          },
        ]}
        cursorColor={theme.colors.onBackground}
        placeholder={t("register.nameAndUsername.inputName")}
        placeholderTextColor={theme.colors.onSurfaceDisabled}
        onFocus={() => setIsFocusedName(true)}
        onBlur={() => setIsFocusedName(false)}
        value={name}
        onChangeText={nameHandler}
      />
      <View>
        <Text
          style={{
            fontSize: 20,
            color: theme.colors.onSurfaceDisabled,
            position: "absolute",
            left: 12,
            top: 16,
            zIndex: 1000,
          }}
        >
          @
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.custom.cardTaskBackground,
              color: theme.colors.onBackground,
              borderColor: isFocusedUsername
                ? theme.colors.onBackground
                : theme.custom.inputFocusBorder,
              borderWidth: isFocusedUsername ? 2 : 1,
              paddingLeft: 32,
            },
          ]}
          placeholder={t("register.nameAndUsername.inputUsername")}
          placeholderTextColor={theme.colors.onSurfaceDisabled}
          onFocus={() => setIsFocusedUsername(true)}
          onBlur={() => setIsFocusedUsername(false)}
          value={username}
          onChangeText={usernameHandler}
          autoCapitalize="none"
        />
      </View>

      {error && <Text style={{ color: "red", fontSize: 16 }}>*{error}</Text>}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 16,
        }}
      >
        <Button
          mode="contained"
          onPress={() => setPage(1)}
          style={[
            styles.backButton,
            { backgroundColor: theme.custom.cardTaskBackground },
          ]}
          labelStyle={[styles.buttonText, { color: theme.colors.onSurface }]}
        >
          {t("register.nameAndUsername.back")}
        </Button>

        <Button
          mode="contained"
          onPress={() => setPage(3)}
          style={[
            styles.button,
            {
              backgroundColor:
                name.length < 3 || username.length < 3 || error !== ""
                  ? theme.colors.surfaceDisabled
                  : theme.colors.primary,
            },
          ]}
          labelStyle={[
            styles.buttonText,
            {
              color:
                name.length < 3 || username.length < 3 || error !== ""
                  ? theme.colors.onSurfaceDisabled
                  : "white",
            },
          ]}
          disabled={name.length < 3 || username.length < 3 || error !== ""}
        >
          {t("register.nameAndUsername.next")}
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
    height: 64,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 32,
    paddingVertical: 5,
    color: "white",
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "500",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderColor: "#666",
    borderWidth: 1,
  },
});
