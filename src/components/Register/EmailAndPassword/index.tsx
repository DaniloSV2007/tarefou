import React from "react";
import { Pressable, StyleSheet, TextInput } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useState } from "react";
import { Button, IconButton, Text } from "react-native-paper";
import { Link, useRouter } from "expo-router";
import { ActivityIndicator } from "react-native-paper";
import { View } from "react-native";
import GoogleButton from "@/components/GoogleButton";
import { isValidEmail } from "@/utils/isValidEmail";
import { useTranslation } from "react-i18next";
import { useDatabase } from "@/database/useDatabase";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";

interface EmailAndPasswordProps {
  setPage: (page: number) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
}

export default function EmailAndPassword({
  setPage,
  email,
  setEmail,
  password,
  setPassword,
}: EmailAndPasswordProps) {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const usersCollection = collection(db, "users");

  const [error, setError] = useState("");
  const [linkColor, setLinkColor] = useState(theme.colors.onBackground);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const database = useDatabase();
  const { token } = useAuth();
  const auth = getAuth();

  const handleContinue = async () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      setError(t("register.error.fillAllFields"));
      return;
    } else if (!isValidEmail(trimmedEmail)) {
      setError(t("register.error.invalidEmail"));
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      setError("");
      setPage(2);
    } catch (error) {
      setError(t("register.error.emailExists"));
    }
  };

  const passwordHandler = (text: string) => {
    setPassword(text);
    if (text.length === 0 || text.length >= 8) {
      setError("");
    } else {
      setError(t("register.error.passwordLength"));
    }
  };

  const emailHandler = async (text: string) => {
    setEmail(text);
  };
  return (
    <>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.custom.cardTaskBackground,
            color: theme.colors.onBackground,
            borderColor: isFocusedEmail
              ? theme.colors.onBackground
              : theme.custom.inputFocusBorder,
            borderWidth: isFocusedEmail ? 2 : 1,
          },
        ]}
        cursorColor={theme.colors.onBackground}
        placeholder={t("register.emailAndPassword.inputEmail")}
        placeholderTextColor={theme.colors.onSurfaceDisabled}
        onFocus={() => setIsFocusedEmail(true)}
        onBlur={() => setIsFocusedEmail(false)}
        value={email}
        onChangeText={emailHandler}
        autoCapitalize="none"
        autoComplete="email"
      />

      <View>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.custom.cardTaskBackground,
              color: theme.colors.onBackground,
              borderColor: isFocusedPassword
                ? theme.colors.onBackground
                : theme.custom.inputFocusBorder,
              borderWidth: isFocusedPassword ? 2 : 1,
            },
          ]}
          cursorColor={theme.colors.onBackground}
          placeholder={t("register.emailAndPassword.inputPassword")}
          placeholderTextColor={theme.colors.onSurfaceDisabled}
          onFocus={() => setIsFocusedPassword(true)}
          onBlur={() => setIsFocusedPassword(false)}
          value={password}
          onChangeText={passwordHandler}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoComplete="password"
        />
        <IconButton
          icon={showPassword ? "eye-off" : "eye"}
          onPress={() => setShowPassword(!showPassword)}
          style={{ position: "absolute", right: 10, top: 7, zIndex: 1000 }}
        />
      </View>

      {error && <Text style={{ color: "red", fontSize: 16 }}>*{error}</Text>}

      <Text style={{ fontSize: 16 }}>
        {t("register.emailAndPassword.alreadyHaveAccount")}
        <Link
          onPressIn={() => setLinkColor(theme.colors.primary)}
          onPressOut={() => setLinkColor(theme.colors.onBackground)}
          style={[
            { color: linkColor },
            linkColor === theme.colors.primary && {
              textDecorationLine: "underline",
            },
          ]}
          onPress={() => router.back()}
          href={""}
        >
          {" "}
          {t("register.emailAndPassword.login")}
        </Link>
        .
      </Text>

      <View style={{ borderRadius: 32, overflow: "hidden", marginTop: 16 }}>
        <Pressable
          onPress={handleContinue}
          style={[
            styles.loginButton,
            email === "" || password.length < 8
              ? { backgroundColor: theme.colors.surfaceDisabled }
              : { backgroundColor: theme.colors.primary },
          ]}
          android_ripple={{
            color: theme.custom.ripple,
          }}
          disabled={email === "" || password.length < 8}
        >
          <Text
            style={[
              styles.loginButtonText,
              email === "" || password.length < 8
                ? { color: theme.colors.onSurfaceDisabled }
                : { color: "white" },
            ]}
          >
            {t("register.emailAndPassword.continue")}
          </Text>
          {isLoading && <ActivityIndicator color={theme.colors.onBackground} />}
        </Pressable>
      </View>

      <GoogleButton onPress={() => {}} />
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
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 32,
    paddingVertical: 10,
  },
  loginButtonText: {
    fontSize: 24,
    fontWeight: "500",
  },
});
