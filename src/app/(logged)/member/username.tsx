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
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../FirebaseConfig";

export default function FindByUsername() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { t } = useTranslation();
  const usersCollection = collection(db, "users");

  const handlesubmit = async () => {
    setError("");
    if (username.trim() === "") {
      setError(
        t("members.newMember.findUsername.errors.inputEmpty", { ns: "screens" })
      );
      return;
    }
    try {
      const usernameNoSpace = username.trim();
      const q = query(
        usersCollection,
        where("username", "==", usernameNoSpace)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data();
        const user = encodeURIComponent(JSON.stringify(userDoc));
        router.push({
          pathname: "/member/user/[user]",
          params: {
            user: user.toString(),
          },
        });
      } else {
        setError(
          t("members.newMember.findUsername.errors.userNotExist", {
            ns: "screens",
          })
        );
      }
    } catch (error) {
      console.error(error);
      setError(
        t("members.newMember.findUsername.errors.ops", { ns: "screens" })
      );
    }
  };

  return (
    <>
      <TopBar
        title={t("members.newMember.tabBar", { ns: "screens" })}
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
                {t("members.newMember.findUsername.title", { ns: "screens" })}
              </Text>
              <TextInput
                mode="outlined"
                label={t("members.newMember.findUsername.placeholder", {
                  ns: "screens",
                })}
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
                  {t("common.next", { ns: "components" })}
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
