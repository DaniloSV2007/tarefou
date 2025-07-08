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
  Alert,
} from "react-native";
import { ActivityIndicator, Button, Card, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useEffect, useState } from "react";
import React from "react";
import TopBar from "@/components/TopBar";
import EmailAndPassword from "@/components/Register/EmailAndPassword";
import NameAndUsername from "@/components/Register/NameAndUsername";
import Birthday from "@/components/Register/Birthday";
import { useTranslation } from "react-i18next";
import RoleSelection from "@/components/Register/RoleSelection";
import FamilyName from "@/components/Register/FamilyName";
import TermsOfService from "@/components/Register/TermsOfService";
import { useDatabase } from "@/database/useDatabase";
import api from "@/services/api";

const steps = [
  "",
  "register.emailAndPassword.title",
  "register.nameAndUsername.title",
  "register.birthday.title",
  "register.roleSelection.title",
  "register.familyName.title",
  "register.termsOfService.title",
];

export default function Register() {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const [page, setPage] = useState(1);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [birthday, setBirthday] = useState("");
  const [age, setAge] = useState(0);
  const [role, setRole] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [doneName, setDoneName] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const database = useDatabase();
  const { login } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    const data = {
      email: email,
      password: password,
    };

    try {
      const res = await api.post("/login", data);
      if (res.status === 200) {
        login(res.data.token, res.data.role, res.data.username);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegister = async () => {
    if (role === "FAMILY_ADMIN") {
      const familyData = {
        name: familyName
          ? familyName.trim()
          : t("register.familyName.value", { name: name.split(" ")[0] }),
        owner: username,
      };
      try {
        const resFamily = await api.post("/families", familyData);
        if (resFamily.status !== 201) {
          throw new Error("Error creating family");
        }

        const data = {
          name,
          username,
          email,
          passwordHash: password,
          birthday,
          createdAt: new Date().toISOString(),
          role,
          familyId: resFamily.data.id,
        };

        const resUser = await api.post("/users", data);
        if (resUser.status !== 201) {
          throw new Error("Error creating user");
        }

        await handleLogin(data.email, data.passwordHash);

        router.replace("/");
      } catch (error) {
        console.error(error);
      }
    } else {
      const data = {
        name,
        username,
        email,
        passwordHash: password,
        birthday,
        createdAt: new Date().toISOString(),
        role,
        familyId: null,
      };
      try {
        const res = await api.post("/users", data);
        if (res.status !== 201) {
          throw new Error("Error creating user");
        }
        await handleLogin(data.email, data.passwordHash);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (name !== "" && doneName) {
      setFamilyName(
        t("register.familyName.value", { name: name.split(" ")[0] })
      );
    }
  }, [name]);

  return (
    <>
      <TopBar
        title={t("register.title")}
        iconButton="cog"
        iconColor={theme.colors.onBackground}
        onPressButton={() => router.push("/settings")}
        bottomBorder={false}
      />
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
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
                  title={t(steps[page] as any)}
                  titleNumberOfLines={3}
                  titleStyle={{
                    fontSize: 32,
                    fontWeight: "bold",
                    lineHeight: 42,
                  }}
                />
                <Card.Content style={styles.cardContent}>
                  {page === 1 && (
                    <EmailAndPassword
                      setPage={setPage}
                      email={email}
                      setEmail={setEmail}
                      password={password}
                      setPassword={setPassword}
                    />
                  )}
                  {page === 2 && (
                    <NameAndUsername
                      setPage={setPage}
                      name={name}
                      setName={setName}
                      username={username}
                      setUsername={setUsername}
                      setDoneName={setDoneName}
                    />
                  )}
                  {page === 3 && (
                    <Birthday
                      setPage={setPage}
                      setBirthday={setBirthday}
                      birthday={birthday}
                      age={age}
                      setAge={setAge}
                    />
                  )}
                  {page === 4 && (
                    <RoleSelection
                      setPage={setPage}
                      setRole={setRole}
                      age={age}
                    />
                  )}
                  {page === 5 && (
                    <FamilyName
                      setPage={setPage}
                      familyName={familyName}
                      setFamilyName={setFamilyName}
                    />
                  )}
                  {page === 6 && (
                    <TermsOfService
                      setPage={setPage}
                      onConfirm={handleRegister}
                      isLoading={isLoading}
                    />
                  )}
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
