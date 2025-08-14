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
import { use, useEffect, useState } from "react";
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
import {
  addDoc,
  collection,
  setDoc,
  Timestamp,
  doc,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/services/FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const steps = [
  "",
  "register.nameAndUsername.title",
  "register.roleSelection.title",
  "register.familyName.title",
  "register.termsOfService.title",
];

export default function GoogleRegister() {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const [page, setPage] = useState<number>(1);
  const router = useRouter();
  const { expoPushToken } = usePushNotifications();

  const [username, setUsername] = useState("");
  const [age, setAge] = useState(0);
  const [role, setRole] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [doneName, setDoneName] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const usersCollection = collection(db, "users");
  const familiesCollection = collection(db, "families");

  const auth = getAuth();
  const user = auth.currentUser;
  const userGoogle = GoogleSignin.getCurrentUser();

  useEffect(() => {
    async function getAge() {
      try {
        const q = query(
          usersCollection,
          where("email", "==", userGoogle?.user.email)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const data = doc.data();

          const currentAge =
            new Date().getFullYear() -
            new Date(
              data.birthday.seconds * 1000 + data.birthday.nanoseconds / 1000000
            ).getFullYear();

          setAge(currentAge);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getAge();
  }, []);

  useEffect(() => {
    if (page === 0) {
      router.push("/(aux)/login");
    }
  }, [page]);

  const getUserData = async (token: string) => {
    if (!token) return;

    try {
      const q = query(
        usersCollection,
        where("email", "==", userGoogle?.user.email)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();

        await AsyncStorage.setItem("userId", doc.id);

        await login(token, data.role, data.username);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegister = async () => {
    const token = await user?.getIdToken();
    const q = query(
      usersCollection,
      where("email", "==", userGoogle?.user.email)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return;
    const userId = querySnapshot.docs[0].id;
    if (role === "FAMILY_ADMIN") {
      const familyData = {
        name: familyName
          ? familyName.trim()
          : t("register.familyName.value", {
              name: userGoogle?.user.name?.split(" ")[0],
            }),
        createdAt: Timestamp.now(),
        owner: username,
      };
      try {
        const familyRef = await addDoc(familiesCollection, familyData);
        if (!familyRef?.id) {
          throw new Error("Error creating family");
        }

        const data = {
          username,
          createdAt: Timestamp.now(),
          role: "FAMILY_ADMIN",
          familyId: familyRef.id,
          pushToken: expoPushToken?.data,
        };
        const userDoc = doc(usersCollection, userId);

        await updateDoc(userDoc, data);
        if (token) {
          await getUserData(token);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      const data = {
        username,
        createdAt: new Date().toISOString(),
        role,
        familyId: null,
        pushToken: expoPushToken?.data,
      };
      try {
        if (user) {
          const userDoc = doc(usersCollection, userId);

          await updateDoc(userDoc, data);
          if (token) {
            await getUserData(token);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

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
            <View className="flex-1 justify-center px-8 gap-4">
              <Text className="text-4xl mb-4" style={{ fontWeight: 700 }}>
                {t(steps[page] as any)}
              </Text>

              {page === 1 && (
                <NameAndUsername
                  setPage={setPage}
                  username={username}
                  setUsername={setUsername}
                  setDoneName={setDoneName}
                />
              )}
              {page === 2 && (
                <RoleSelection setPage={setPage} setRole={setRole} age={age} />
              )}
              {page === 3 && (
                <FamilyName
                  setPage={setPage}
                  familyName={familyName}
                  setFamilyName={setFamilyName}
                />
              )}
              {page === 4 && (
                <TermsOfService
                  setPage={setPage}
                  onConfirm={handleRegister}
                  isLoading={isLoading}
                />
              )}
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
