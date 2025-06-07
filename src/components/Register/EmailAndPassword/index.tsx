import React from "react";
import { Pressable, StyleSheet, TextInput } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useState } from "react";
import { Button, Text } from "react-native-paper";
import { Link, useRouter } from "expo-router";
import { ActivityIndicator } from "react-native-paper";
import { View } from "react-native";
import GoogleButton from "@/components/GoogleButton";
import { isValidEmail } from "@/utils/isValidEmail";

export default function EmailAndPassword({
  setPage,
}: {
  setPage: (page: number) => void;
}) {
  const theme = useAppTheme();
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [linkColor, setLinkColor] = useState(theme.colors.onBackground);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = () => {
    setIsLoading(true);
    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }
    if (!isValidEmail(email)) {
      setError("Invalid email address");
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    router.push("/");
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
        placeholder="Type your email"
        placeholderTextColor={theme.colors.onSurface}
        onFocus={() => setIsFocusedEmail(true)}
        onBlur={() => setIsFocusedEmail(false)}
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setError("");
        }}
        autoCapitalize="none"
        autoComplete="email"
      />

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
        placeholder="Create a password"
        placeholderTextColor={theme.colors.onSurface}
        onFocus={() => setIsFocusedPassword(true)}
        onBlur={() => setIsFocusedPassword(false)}
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setError("");
        }}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password"
      />

      {error && <Text style={{ color: "red", fontSize: 16 }}>*{error}</Text>}

      <Text style={{ fontSize: 16 }}>
        Already have an account?{" "}
        <Link
          onPressIn={() => setLinkColor(theme.colors.primary)}
          onPressOut={() => setLinkColor(theme.colors.onBackground)}
          style={[
            { color: linkColor },
            linkColor === theme.colors.primary && {
              textDecorationLine: "underline",
            },
          ]}
          href="/(aux)/Login"
        >
          Login
        </Link>
        .
      </Text>

      <View style={{ borderRadius: 32, overflow: "hidden" }}>
        <Pressable
          onPress={() => setPage(2)}
          style={[
            styles.loginButton,
            { backgroundColor: theme.colors.primary },
          ]}
          android_ripple={{
            color: theme.custom.ripple,
          }}
        >
          <Text style={styles.loginButtonText}>Continue</Text>
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
    height: 64,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 32,
    paddingVertical: 10,
  },
  loginButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "500",
  },
});
