import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState } from "react";
import TopBar from "@/components/TopBar";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import api from "@/services/api";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";

export default function FindByUsername() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { t } = useTranslation();
  const { token } = useAuth();

  const handlesubmit = async () => {
    setError("");
    if (username.trim() === "") {
      setError(t("screens:members.newMember.findUsername.errors.inputEmpty"));
      return;
    }
    try {
      const usernameNoSpace = username.trim();
      const res = await api.get("/users/" + usernameNoSpace, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (res.status === 200 && res.data !== null) {
        const user = encodeURIComponent(JSON.stringify(res.data));
        router.push({
          pathname: "/member/user/[user]",
          params: {
            user: user.toString(),
          },
        });
      } else {
        setError(
          t("screens:members.newMember.findUsername.errors.userNotExist")
        );
      }
    } catch (error) {
      console.log(error);
      setError(t("screens:members.newMember.findUsername.errors.ops"));
    }
  };

  return (
    <>
      <TopBar
        title={t("screens:members.newMember.tabBar")}
        isBackButtonEnable={true}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
          >
            <View
              style={[
                styles.container,
                {
                  backgroundColor: theme.colors.background,
                  paddingBottom: insets.bottom + 32,
                },
              ]}
            >
              <Text
                style={[{ color: theme.colors.onBackground }, styles.title]}
              >
                {t("screens:members.newMember.findUsername.title")}
              </Text>
              <TextInput
                mode="outlined"
                label={t("screens:members.newMember.findUsername.placeholder")}
                textColor={theme.colors.onBackground}
                cursorColor={theme.colors.onBackground}
                style={{
                  height: 64,
                  fontSize: 24,
                }}
                autoFocus={true}
                textContentType="username"
                onChangeText={(text) => setUsername(text)}
                error={error !== ""}
                autoCapitalize="none"
              />
              <HelperText type="error" visible={error !== ""}>
                {"*" + error}
              </HelperText>
              <View
                style={{ width: "100%", alignItems: "flex-end", marginTop: 48 }}
              >
                <Button mode="contained" onPress={handlesubmit}>
                  {t("components:common.next")}
                </Button>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    fontWeight: "bold",
  },
  selection: {
    gap: 32,
    padding: 24,
    paddingHorizontal: 32,
    minHeight: 400,
    justifyContent: "center",
  },
  subtitle: {
    fontSize: 18,
  },
});
