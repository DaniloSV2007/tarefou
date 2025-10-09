import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState } from "react";
import { useThemeContext } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Portal, Dialog, Text, TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
} from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/services/FirebaseConfig";

interface Props {
  visible: boolean;
  setVisible: (state: boolean) => void;
  updating: boolean;
  setUpdating: (state: boolean) => void;
  onPasswordConfirmation: () => void | void;
}

export default function PasswordConfirmation({
  visible,
  setVisible,
  updating,
  setUpdating,
  onPasswordConfirmation,
}: Props) {
  const { theme } = useThemeContext();
  const { t } = useTranslation();
  const usersCollection = collection(db, "users");

  const [focused, setIsFocused] = useState(false);
  const [password, setPassword] = useState("");

  const checkPassword = async () => {
    setVisible(false);
    if (updating) return;
    setUpdating(true);
    const username = await AsyncStorage.getItem("username");
    if (!username) throw new Error("Username not found");
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const q = query(usersCollection, where("username", "==", username));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const email = querySnapshot.docs[0].data().email;
        if (user && password) {
          const credential = EmailAuthProvider.credential(email, password);
          const authenticate = await reauthenticateWithCredential(
            user,
            credential,
          );
          if ((await authenticate.user.getIdToken()) !== "") {
            onPasswordConfirmation();
            setUpdating(false);
          }
        }
      }
    } catch (error) {
      console.error(error);
      const timer = setTimeout(() => setUpdating(false), 2000);
      return () => clearTimeout(timer);
    }
  };

  return (
    <Portal>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <Dialog
          visible={visible}
          onDismiss={() => setVisible(false)}
          style={{
            paddingVertical: 12,
            marginBottom: focused ? "60%" : 0,
          }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Dialog.Content>
              <View>
                <Text style={{ fontSize: 20 }}>
                  {t("passwordConfirmText", { ns: "components" })}
                </Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  contentStyle={{ fontSize: 20 }}
                  secureTextEntry
                  autoCapitalize="none"
                  style={{ marginTop: 8 }}
                  autoFocus
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
              </View>
            </Dialog.Content>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Dialog.Actions style={{ justifyContent: "space-between" }}>
              <Pressable
                onPress={() => setVisible(false)}
                className="py-2 px-2 rounded-lg"
                style={{
                  borderWidth: 1,
                  borderColor: theme.colors.onSurfaceDisabled,
                }}
              >
                <Text style={{ color: theme.colors.onBackground }}>
                  {t("common.cancel", { ns: "components" })}
                </Text>
              </Pressable>
              <Pressable
                disabled={!password}
                onPress={checkPassword}
                style={{
                  backgroundColor: password
                    ? theme.colors.primary
                    : theme.colors.surfaceDisabled,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 999,
                }}
              >
                {updating ? (
                  <ActivityIndicator color={"white"} />
                ) : (
                  <Text style={{ color: "white" }}>
                    {t("common.done", { ns: "components" })}
                  </Text>
                )}
              </Pressable>
            </Dialog.Actions>
          </TouchableWithoutFeedback>
        </Dialog>
      </KeyboardAvoidingView>
    </Portal>
  );
}
