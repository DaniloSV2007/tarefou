import {
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import TopBar from "@/components/TopBar";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Button,
  Card,
  Dialog,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/services/api";
import { Header } from "react-native/Libraries/NewAppScreen";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PasswordConfirmation from "@/components/PasswordConfirmation";
import { collection, doc, updateDoc } from "firebase/firestore";
import { db } from "@/services/FirebaseConfig";

export default function ChangeFamilyName() {
  const theme = useAppTheme();
  const { token } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const familyName = params.familyName;
  const familyId = params.familyId;
  const familiesCollection = collection(db, "families");

  const [text, setText] = useState(`${familyName}`);
  const [updating, setUpdating] = useState(false);

  const [visible, setVisible] = useState(false);

  const [password, setPassword] = useState("");

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleChangeFamilyName = async () => {
    const data = {
      name: text.trim(),
    };
    try {
      if (!familyId) return;
      const familyDoc = doc(db, "families", String(familyId));
      await updateDoc(familyDoc, data);

      router.replace("/admin/members");
    } catch (error) {
      console.error(error);
    } finally {
      const timer = setTimeout(() => {
        setUpdating(false);
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={keyboardVisible ? "padding" : undefined}
      keyboardVerticalOffset={1}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
        }}
      >
        <TopBar
          title={t("members.changeNameTitle", { ns: "screens" })}
          isBackButtonEnable
        />

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                flex: 1,
                padding: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  marginBottom: 8,
                  color: theme.colors.onSurfaceDisabled,
                }}
              >
                {t("common.current", { ns: "components" })}:
              </Text>
              <TextInput
                value={Array.isArray(familyName) ? familyName[0] : familyName}
                style={{ backgroundColor: "transparent", fontSize: 24 }}
                disabled
              />

              <Text style={{ fontSize: 20, marginTop: 16 }}>
                {t("common.new", { ns: "components" })}:
              </Text>
              <TextInput
                value={text}
                onChangeText={setText}
                style={{ backgroundColor: "transparent", fontSize: 24 }}
              />
            </View>

            <PasswordConfirmation
              visible={visible}
              setVisible={setVisible}
              updating={updating}
              setUpdating={setUpdating}
              onPasswordConfirmation={handleChangeFamilyName}
            />

            <View
              style={{
                width: "100%",
                padding: 12,
                paddingBottom: 24,
                borderTopWidth: 0.5,
                borderColor: "#ccc",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Pressable
                onPress={() => setVisible(true)}
                disabled={text === familyName}
                style={{
                  backgroundColor:
                    text !== familyName
                      ? theme.colors.primary
                      : theme.colors.surfaceDisabled,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 999,
                }}
                android_ripple={{ color: theme.custom.ripple }}
              >
                {updating ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text
                    style={{
                      color:
                        text !== familyName
                          ? "white"
                          : theme.colors.onSurfaceDisabled,
                    }}
                  >
                    {t("common.done", { ns: "components" })}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: "space-around",
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  textInput: {
    height: 40,
    borderColor: "#000000",
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  btnContainer: {
    backgroundColor: "white",
    marginTop: 12,
  },
});

{
  /* <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <View
              style={{
                flex: 1,
                padding: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  marginBottom: 8,
                  color: theme.colors.onSurfaceDisabled,
                }}
              >
                Current:
              </Text>
              <TextInput
                value={Array.isArray(familyName) ? familyName[0] : familyName}
                disabled
              />

              <Text style={{ fontSize: 20, marginTop: 16 }}>New:</Text>
              <TextInput
                value={text}
                onChangeText={setText}
                style={{ backgroundColor: "transparent", fontSize: 24 }}
              />
            </View>

            <View
              style={{
                padding: 16,
                borderTopWidth: 0.5,
                borderColor: "#ccc",
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <Pressable
                onPress={() => setVisible(true)}
                disabled={text === familyName}
                style={{
                  backgroundColor:
                    text !== familyName
                      ? theme.colors.primary
                      : theme.colors.surfaceDisabled,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 999,
                }}
                android_ripple={{ color: theme.custom.ripple }}
              >
                {updating ? (
                  <ActivityIndicator />
                ) : (
                  <Text
                    style={{
                      color:
                        text !== familyName
                          ? "white"
                          : theme.colors.onSurfaceDisabled,
                    }}
                  >
                    Done
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback> */
}
