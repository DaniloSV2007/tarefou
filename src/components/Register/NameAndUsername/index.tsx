import { StyleSheet, TextInput, View } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useState, useEffect } from "react";
import React from "react";
import { Button, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useDatabase } from "@/database/useDatabase";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
interface NameAndUsernameProps {
  setPage: (page: number) => void;
  name: string;
  setName: (name: string) => void;
  username: string;
  setUsername: (username: string) => void;
  setDoneName: (doneName: boolean) => void;
}

export default function NameAndUsername({
  setPage,
  name,
  setName,
  username,
  setUsername,
  setDoneName,
}: NameAndUsernameProps) {
  const theme = useAppTheme();
  const [isFocusedName, setIsFocusedName] = useState(false);
  const [isFocusedUsername, setIsFocusedUsername] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslation();
  const database = useDatabase();
  const [success, setSuccess] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    if (name.length > 0 && name.length < 3) {
      setError(t("register.error.nameLength"));
    } else if (username.length > 0 && username.length < 3) {
      setError(t("register.error.usernameLength"));
    } else {
      setError("");
    }
  }, [name, username, t]);

  const nameHandler = (text: string) => {
    setName(text);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setError("");
      setSuccess("");
      if (username.length > 2) {
        usernameHandler(username);
      }
    }, 2000); // espera 800ms após parar de digitar

    return () => clearTimeout(delayDebounce);
  }, [username]);

  const usernameHandler = async (text: string) => {
    if (text.trim() === "") {
      setError("");
      setSuccess("");
      return;
    }

    try {
      const res = await api.get(`/users/${text}/exists`);

      const usernameExists = res.data.username;
      console.log(usernameExists);
      if (res.status === 200 && usernameExists && usernameExists !== "") {
        setError(t("register.error.usernameExists"));
      } else {
        setSuccess(t("register.nameAndUsername.usernameAvailable"));
      }
    } catch (error) {
      console.error("Error checking username:", error);
      setError(t("register.error.checkingUsername"));
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
          onChangeText={(text) => setUsername(text)}
          autoCapitalize="none"
        />
      </View>

      {error && <Text style={{ color: "red", fontSize: 16 }}>*{error}</Text>}

      {success && error === "" && (
        <Text style={{ color: "green", fontSize: 16 }}>*{success}</Text>
      )}

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
          onPress={() => {
            setPage(3);
          }}
          style={[
            styles.button,
            {
              backgroundColor:
                name.length < 3 ||
                username.length < 3 ||
                error !== "" ||
                success === ""
                  ? theme.colors.surfaceDisabled
                  : theme.colors.primary,
            },
          ]}
          labelStyle={[
            styles.buttonText,
            {
              color:
                name.length < 3 ||
                username.length < 3 ||
                error !== "" ||
                success === ""
                  ? theme.colors.onSurfaceDisabled
                  : "white",
            },
          ]}
          disabled={
            name.length < 3 ||
            username.length < 3 ||
            error !== "" ||
            success === ""
          }
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
