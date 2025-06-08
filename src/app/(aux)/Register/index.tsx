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
import { useRouter } from "expo-router";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useState } from "react";
import React from "react";
import TopBar from "@/components/TopBar";
import EmailAndPassword from "@/components/Register/EmailAndPassword";
import NameAndUsername from "@/components/Register/NameAndUsername";
import Birthday from "@/components/Register/Birthday";
import { useTranslation } from "react-i18next";

export default function Register() {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const [page, setPage] = useState(1);
  const router = useRouter();

  const handleRegister = () => {};

  return (
    <>
      <TopBar
        title={t("register.title")}
        iconButton="cog"
        iconColor={theme.colors.onBackground}
        onPressButton={() => router.push("/profile/settings")}
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
                  title={
                    page === 1
                      ? t("register.emailAndPassword.title")
                      : page === 2
                      ? t("register.nameAndUsername.title")
                      : t("register.birthday.title")
                  }
                  titleNumberOfLines={3}
                  titleStyle={{
                    fontSize: 32,
                    fontWeight: "bold",
                    lineHeight: 42,
                  }}
                />
                <Card.Content style={styles.cardContent}>
                  {page === 1 && <EmailAndPassword setPage={setPage} />}
                  {page === 2 && <NameAndUsername setPage={setPage} />}
                  {page === 3 && <Birthday setPage={setPage} />}
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
});
