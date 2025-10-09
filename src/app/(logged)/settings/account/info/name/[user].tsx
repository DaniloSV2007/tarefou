import {
  Keyboard,
  Pressable,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useThemeContext } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import TopBar from "@/components/TopBar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Text, TextInput } from "react-native-paper";
import PasswordConfirmation from "@/components/PasswordConfirmation";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/services/FirebaseConfig";
import { UserType } from "@/app/(logged)/admin/members";

export default function ChangeName() {
  const { theme } = useThemeContext();
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [userData, setUserData] = useState<UserType>();

  const [text, setText] = useState("");
  const [updating, setUpdating] = useState(false);

  const [visible, setVisible] = useState(false);

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const getUserDataParams = () => {
    try {
      const userEncrypt = Array.isArray(params.user)
        ? params.user[0]
        : params.user;

      if (!userEncrypt) {
        return;
      }
      const userDecrypt = JSON.parse(decodeURIComponent(userEncrypt));
      setUserData(userDecrypt);
    } catch (error) {
      console.error("Error decrypting: ", error);
    }
  };

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true),
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false),
    );
    getUserDataParams();
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleChangeName = async () => {
    const data = {
      name: text.trim(),
    };
    try {
      const userRef = doc(db, "users", String(auth.currentUser?.uid));
      await updateDoc(userRef, data);

      router.replace("/admin/members");
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setUpdating(false);
      }, 2000);
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
                value={userData?.name}
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
              onPasswordConfirmation={handleChangeName}
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
                disabled={text === userData?.name}
                style={{
                  backgroundColor:
                    text !== userData?.name
                      ? theme.colors.primary
                      : theme.colors.surfaceDisabled,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 999,
                }}
                android_ripple={{ color: theme.colors.ripple }}
              >
                {updating ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text
                    style={{
                      color:
                        text !== userData?.name
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
