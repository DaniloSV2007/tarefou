import { useAuth } from "@/context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Keyboard,
  TouchableWithoutFeedback,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { ActivityIndicator, Button, Card, Text } from "react-native-paper";
import { Link, useRouter } from "expo-router";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useState } from "react";
import React from "react";
import TopBar from "@/components/TopBar";
import GoogleButton from "@/components/GoogleButton";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const theme = useAppTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [linkColor, setLinkColor] = useState(theme.colors.onBackground);

  const handleLogin = () => {
    setIsLoading(true);
    if (email === "" || password === "") {
      setError("Email and password are required");
    } else {
      if (email === "admin" && password === "admin") {
        login();
      } else {
        setError("Email or password is invalid");
      }
    }
    setEmail("");
    setPassword("");
    setIsLoading(false);
  };

  return (
    <>
      <TopBar
        title="Log In"
        iconButton="cog"
        iconColor={theme.colors.onBackground}
        onPressButton={() => router.push("/profile/settings")}
        isBackButtonEnable={true}
        bottomBorder={false}
      />
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Card
                style={[
                  styles.card,
                  { backgroundColor: theme.custom.cardColor },
                ]}
              >
                <Card.Title
                  title="Log In"
                  titleStyle={{ fontSize: 32, fontWeight: "bold" }}
                />
                <Card.Content style={styles.cardContent}>
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
                    placeholder="Email or username"
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
                    placeholder="Password"
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

                  {error && (
                    <Text style={{ color: "red", fontSize: 16 }}>*{error}</Text>
                  )}

                  <Text style={{ fontSize: 16 }}>
                    Don't have an account?{" "}
                    <Link
                      onPressIn={() => setLinkColor(theme.colors.primary)}
                      onPressOut={() => setLinkColor(theme.colors.onBackground)}
                      style={[
                        { color: linkColor },
                        linkColor === theme.colors.primary && {
                          textDecorationLine: "underline",
                        },
                      ]}
                      href="/(aux)/Register"
                    >
                      Register
                    </Link>
                    .
                  </Text>

                  <Button
                    mode="contained"
                    onPress={handleLogin}
                    rippleColor={theme.custom.ripple}
                    style={styles.loginButton}
                  >
                    <View style={styles.loginButtonContent}>
                      {isLoading ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        <Text style={styles.loginButtonText}>Login</Text>
                      )}
                    </View>
                  </Button>

                  <GoogleButton onPress={() => {}} />
                </Card.Content>
              </Card>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    width: "90%",
    padding: 16,
    borderRadius: 24,
  },
  cardContent: {
    width: "100%",
    padding: 16,
    gap: 16,
  },
  input: {
    paddingHorizontal: 12,
    fontSize: 24,
    borderRadius: 8,
    height: 64,
  },
  loginButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    paddingHorizontal: 0,
    marginTop: 16,
  },
  loginButtonContent: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
    fontSize: 24,
    textAlign: "center",
  },
});
