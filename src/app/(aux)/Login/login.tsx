import { useAuth } from "@/context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  TextInput,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  Icon,
  Text,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useState } from "react";
import TopBar from "@/components/TopBar";

export default function Login() {
  const { login } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useAppTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    setIsLoading(true);
    if (email === "" || password === "") {
      setError("Email e senha são obrigatórios");
    } else {
      if (email === "admin" && password === "admin") {
        login();
      } else {
        setError("Email ou senha inválidos");
      }
    }
    setIsLoading(false);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[styles.container, { paddingTop: 0 }]}>
        <TopBar
          title="Go back"
          iconButton={"cog"}
          iconColor={theme.colors.onBackground}
          onPressButton={() => router.push("/profile/settings")}
          isBackButtonEnable={true}
        />

        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Card style={styles.card}>
            <Card.Title
              title="Login"
              titleStyle={{ fontSize: 32, fontWeight: "bold" }}
            />
            <Card.Content style={styles.cardContent}>
              <View></View>
              <TextInput
                style={[
                  {
                    backgroundColor: theme.custom.cardTaskBackground,
                    color: theme.colors.onBackground,
                    paddingHorizontal: 12,
                    fontSize: 24,
                    borderRadius: 8,
                    height: 64,
                  },
                  isFocusedEmail
                    ? {
                        borderColor: theme.colors.onBackground,
                        borderWidth: 1,
                      }
                    : {
                        borderColor: theme.custom.inputFocusBorder,
                        borderWidth: 1,
                      },
                ]}
                cursorColor={theme.colors.onBackground}
                placeholder="Email"
                placeholderTextColor={theme.colors.onSurface}
                onFocus={() => setIsFocusedEmail(true)}
                onBlur={() => setIsFocusedEmail(false)}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoComplete="username"
              />
              <TextInput
                style={[
                  {
                    backgroundColor: theme.custom.cardTaskBackground,
                    color: theme.colors.onBackground,
                    paddingHorizontal: 12,
                    fontSize: 24,
                    borderRadius: 8,
                    height: 64,
                  },
                  isFocusedPassword
                    ? {
                        borderColor: theme.colors.onBackground,
                        borderWidth: 1,
                      }
                    : {
                        borderColor: theme.custom.inputFocusBorder,
                        borderWidth: 1,
                      },
                ]}
                cursorColor={theme.colors.onBackground}
                placeholder="Senha"
                onFocus={() => setIsFocusedPassword(true)}
                onBlur={() => setIsFocusedPassword(false)}
                placeholderTextColor={theme.colors.onSurface}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                autoComplete="password"
              />
              {error && (
                <Text style={{ color: "red", fontSize: 16 }}>*{error}</Text>
              )}
              <Button
                mode="contained"
                onPress={() => handleLogin()}
                rippleColor={theme.custom.ripple}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 24,
                  paddingHorizontal: 0,
                  marginTop: 16,
                }}
              >
                <View
                  style={{
                    width: "90%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text
                      style={{
                        color: "white",
                        fontSize: 24,
                        width: "80%",
                        textAlign: "center",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      Login
                    </Text>
                  )}
                </View>
              </Button>
            </Card.Content>
          </Card>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  settingsButton: {
    position: "absolute",
    top: 46,
    right: 32,
    zIndex: 1000,
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
});
