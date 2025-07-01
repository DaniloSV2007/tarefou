import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "@/hooks/useTranslations";
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

export default function ChangeFamilyName() {
  const theme = useAppTheme();
  const { token } = useAuth();
  const { t } = useTranslations();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const familyName = params.familyName;
  const familyId = params.familyId;
  console.log(params);

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
      const res = await api.put("/families/" + familyId, data, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (res.status === 200) {
        router.replace("/admin/members");
      }
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

  const checkPassword = async () => {
    setVisible(false);
    if (updating) {
      setUpdating(false);
      return;
    }
    setUpdating(true);
    const username = await AsyncStorage.getItem("username");
    if (!username) throw new Error("Username not found");
    try {
      const data = {
        username,
        password,
      };
      const res = await api.post("/login/verify", data);
      if (res.status === 200) {
        await handleChangeFamilyName();
      }
    } catch (error) {
      console.error(error);
      const timer = setTimeout(() => {
        setUpdating(false);
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <TopBar title={"Change Family Name"} isBackButtonEnable />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                  position: "absolute",
                  bottom: keyboardVisible ? 72 : -12,
                  width: "100%",
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
                <Portal>
                  <Dialog
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    style={{ marginBottom: keyboardVisible ? "40%" : 0 }}
                  >
                    <Dialog.Content>
                      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View>
                          <Text style={{ fontSize: 18 }}>
                            Insert your password to proceed:
                          </Text>
                          <TextInput
                            value={password}
                            onChangeText={setPassword}
                            contentStyle={{ fontSize: 20 }}
                            secureTextEntry
                            autoCapitalize="none"
                            style={{ marginTop: 8 }}
                          />
                        </View>
                      </TouchableWithoutFeedback>
                    </Dialog.Content>
                    <Dialog.Actions style={{ justifyContent: "space-between" }}>
                      <Pressable onPress={() => setVisible(false)}>
                        <Text style={{ color: theme.colors.primary }}>
                          Cancel
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
                          <ActivityIndicator />
                        ) : (
                          <Text style={{ color: "white" }}>Done</Text>
                        )}
                      </Pressable>
                    </Dialog.Actions>
                  </Dialog>
                </Portal>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
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
