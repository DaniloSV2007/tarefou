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
  getDoc,
} from "firebase/firestore";
import { db } from "@/services/FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const [page, setPage] = useState<number>(1);
  const router = useRouter();
  const { expoPushToken } = usePushNotifications();

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
  const usersCollection = collection(db, "users");
  const familiesCollection = collection(db, "families");

  const auth = getAuth();
  const user = auth.currentUser;

  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) {
        const token = await user.user.getIdToken();
        getUserData(token);
      }
    } catch (error) {
      console.error("Falha ao logar: ", error);
    }
  };

  const getUserData = async (token: string) => {
    if (!token) return;

    try {
      const uid = auth.currentUser?.uid as string;

      const privateUserData = collection(usersCollection, uid, "private");
      const q = query(privateUserData, where("email", "==", email.trim()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docDb = querySnapshot.docs[0];

        const parentDoc = doc(usersCollection, uid);
        const parentData = (await getDoc(parentDoc)).data();

        await AsyncStorage.setItem("userId", docDb.id);

        await login(token, parentData?.role, parentData?.username);
      }
    } catch (error) {
      console.error("Falha ao pegar os dados para logar: ", error);
    }
  };

  const handleRegister = async () => {
    if (role === "FAMILY_ADMIN") {
      const familyData = {
        name: familyName
          ? familyName.trim()
          : t("register.familyName.value", { name: name.split(" ")[0] }),
        createdAt: Timestamp.now(),
        owner: username,
      };
      try {
        const familyRef = await addDoc(familiesCollection, familyData);
        if (!familyRef?.id) {
          throw new Error("Error creating family");
        }

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const uid = userCredential.user.uid;

        const privateUserData = collection(usersCollection, uid, "private");

        const data = {
          name,
          username,
          birthday: Timestamp.fromDate(new Date(birthday)),
          createdAt: Timestamp.now(),
          role: "FAMILY_ADMIN",
          familyId: familyRef.id,
        };

        const privateData = {
          pushToken: expoPushToken?.data,
          email,
        };

        await setDoc(doc(usersCollection, uid), data);
        await setDoc(doc(privateUserData, "data"), privateData);

        handleLogin(privateData.email, password);
      } catch (error) {
        console.error(error);
      }
    } else {
      const uid = auth.currentUser?.uid;

      const privateUserData = collection(
        usersCollection,
        uid as string,
        "private"
      );

      const data = {
        name,
        username,
        birthday: Timestamp.fromDate(new Date(birthday)),
        createdAt: new Date().toISOString(),
        role,
        familyId: null,
      };

      const privateData = {
        email,
        pushToken: expoPushToken?.data,
      };
      try {
        if (user) {
          await setDoc(doc(usersCollection, uid), data);
          await setDoc(doc(privateUserData, "data"), privateData);

          await handleLogin(privateData.email, password);
        }
      } catch (error) {
        console.error("Falha ao criar o usuário: ", error);
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
            <View className="flex-1 justify-center px-8 gap-4">
              <Text className="text-4xl mb-4" style={{ fontWeight: 700 }}>
                {t(steps[page] as any)}
              </Text>
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
                <RoleSelection setPage={setPage} setRole={setRole} age={age} />
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
