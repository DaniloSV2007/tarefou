import {
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
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
  Avatar,
  Dialog,
  Icon,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/services/api";
import { Family } from "../[family]";
import { UserType } from "@/app/(logged)/admin/members";
import { Dropdown } from "react-native-element-dropdown";
import placeholder from "@/assets/Profile/user.png";
import PasswordConfirmation from "@/components/PasswordConfirmation";

export default function ChangeFamilyName() {
  const theme = useAppTheme();
  const { token } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const familyName = params.familyName;
  const familyId = params.familyId;

  const [text, setText] = useState<any>([]);
  const [updating, setUpdating] = useState(false);
  const [visible, setVisible] = useState(false);
  const [focus, setIsFocus] = useState(false);
  const [avatarsFetched, setAvatarsFetched] = useState(false);

  const [familyInfo, setFamilyInfo] = useState<Family | undefined>();
  const [users, setUsers] = useState<UserType[] | undefined>();
  const [data, setData] = useState<any[]>([]);

  const familyParams = Array.isArray(params.family)
    ? params.family[0]
    : params.family;
  const familyDecoded = JSON.parse(decodeURIComponent(familyParams));

  useEffect(() => {
    setFamilyInfo(familyDecoded);
    if (familyDecoded?.users && familyDecoded.owner) {
      const nonOwnerUsers = familyDecoded.users.filter(
        (user: UserType) => user.username !== familyDecoded.owner
      );
      setUsers(nonOwnerUsers);
      setData(
        nonOwnerUsers.map((user: UserType) => ({
          label: user.name,
          value: user.username,
          avatar: user.avatar,
          role: user.role,
        }))
      );
    }
  }, []);

  useEffect(() => {
    const fetchAvatars = async () => {
      if (!avatarsFetched && familyInfo?.users) {
        const updatedUsers = await Promise.all(
          familyInfo.users.map(async (user) => {
            const avatar = await getAvatarDatabase(user.username);
            return { ...user, avatar };
          })
        );
        setFamilyInfo({ ...familyInfo, users: updatedUsers });
        setAvatarsFetched(true);
      }
    };
    fetchAvatars();
  }, [familyInfo, avatarsFetched]);

  useEffect(() => {
    if (familyInfo?.users && familyInfo.owner) {
      const nonOwnerUsers = familyInfo.users.filter(
        (user: UserType) => user.username !== familyInfo.owner
      );
      setUsers(nonOwnerUsers);
      setData(
        nonOwnerUsers.map((user: UserType) => ({
          label: user.name,
          value: user.username,
          avatar: user.avatar,
          role: user.role,
        }))
      );
    }
  }, [familyInfo]);

  const getAvatarDatabase = async (username: string): Promise<string> => {
    try {
      const res = await api.get("/users/" + username, {
        headers: { Authorization: `${token}` },
      });
      return res.data?.avatar || "";
    } catch (error) {
      console.error(error);
      return "";
    }
  };

  const handleChangeFamilyOwner = async () => {
    if (!text.value) return;
    try {
      const res = await api.put(
        "/families/" + familyInfo?.id,
        { owner: text.value.trim() },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (res.status === 200) {
        router.replace("/admin/members");
      }
    } catch (error) {
      console.error(error);
    } finally {
      const timer = setTimeout(() => setUpdating(false), 2000);
      return () => clearTimeout(timer);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <TopBar
        title={t("members.changeOwner.title", { ns: "screens" })}
        isBackButtonEnable
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, padding: 16, gap: 5 }}>
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
              value={familyInfo?.owner}
              style={{ backgroundColor: "transparent", fontSize: 24 }}
              disabled
            />
            <Text style={{ fontSize: 20, marginTop: 16 }}>
              {t("common.new", { ns: "components" })}:
            </Text>
            <Dropdown
              data={data}
              labelField="label"
              valueField="value"
              value={text.value}
              placeholder={t("members.changeOwner.selectPlaceholder", {
                ns: "screens",
              })}
              onChange={(item) => setText(item)}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              selectedTextStyle={{
                color: theme.colors.onBackground,
                marginLeft: 12,
                fontSize: 24,
              }}
              placeholderStyle={{ color: theme.colors.onBackground }}
              style={{
                backgroundColor: theme.custom.cardColor,
                paddingVertical: 20,
                paddingHorizontal: 12,
                borderRadius: 12,
                borderBottomEndRadius: focus ? 0 : undefined,
                borderBottomStartRadius: focus ? 0 : undefined,
              }}
              itemTextStyle={{ color: "white" }}
              containerStyle={{
                backgroundColor: theme.custom.cardColor,
                borderWidth: 0,
                marginTop: -2,
                borderBottomEndRadius: 12,
                borderBottomStartRadius: 12,
                paddingBottom: 12,
              }}
              itemContainerStyle={{
                paddingHorizontal: 4,
              }}
              activeColor={theme.custom.cardTaskBackground}
              renderItem={(item) => (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    minHeight: 60,
                    padding: 8,
                  }}
                >
                  <View className="flex-row gap-3">
                    {text.avatar ? (
                      <Avatar.Image
                        size={46}
                        source={
                          item.avatar ? { uri: item.avatar } : placeholder
                        }
                      />
                    ) : (
                      <Avatar.Icon size={46} icon={"account"} color="white" />
                    )}
                    <View>
                      <Text
                        className="text-2xl -mb-1 w-80"
                        style={{ color: theme.colors.onBackground }}
                        ellipsizeMode="tail"
                        numberOfLines={1}
                      >
                        {item.label}
                      </Text>
                      <Text
                        className="pl-6"
                        style={{ color: theme.colors.onSurfaceVariant }}
                      >
                        @{item.value}
                      </Text>
                      <View className="absolute left-0 bottom-0.5">
                        <Icon
                          size={18}
                          source={
                            item.role === "MEMBER" ? "account" : "account-cog"
                          }
                        />
                      </View>
                    </View>
                  </View>
                </View>
              )}
              renderLeftIcon={() =>
                text.avatar && (
                  <Avatar.Image
                    size={46}
                    source={text.avatar ? { uri: text.avatar } : placeholder}
                  />
                )
              }
            />
          </View>

          <PasswordConfirmation
            visible={visible}
            setVisible={setVisible}
            onPasswordConfirmation={handleChangeFamilyOwner}
            updating={updating}
            setUpdating={setUpdating}
          />

          <View
            style={{
              width: "100%",
              padding: 12,
              paddingBottom: 12 + insets.bottom,
              borderTopWidth: 0.5,
              borderColor: "#ccc",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Pressable
              onPress={() => setVisible(true)}
              disabled={!text || !text.value}
              style={{
                backgroundColor:
                  text && text.value !== familyName
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
                      text && text.value !== familyInfo?.owner
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
  );
}
