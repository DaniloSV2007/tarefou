import { Pressable, ScrollView, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useTranslation } from "react-i18next";
import { useLocalSearchParams, useRouter } from "expo-router";
import TopBar from "@/components/TopBar";
import { UserType } from "../../admin/members";
import { Avatar, Card, Icon, Text } from "react-native-paper";
import placeholder from "@/assets/Profile/user.png";
import { useAuth } from "@/context/AuthContext";
import PasswordConfirmation from "@/components/PasswordConfirmation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../../FirebaseConfig";

export type Family = {
  id: string;
  name: string;
  owner: string;
  users: UserType[];
};

export default function FamilySettings() {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const usersCollection = collection(db, "users");

  const [familyInfo, setFamilyInfo] = useState<Family | undefined>();
  const [clicked, setClicked] = useState(false);

  const [updating, setUpdating] = useState(false);
  const [visible, setVisible] = useState(false);

  const familyParams = Array.isArray(params.family)
    ? params.family[0]
    : params.family;

  useEffect(() => {
    const init = async () => {
      const decoded: Family = JSON.parse(decodeURIComponent(familyParams));

      const updatedUsers = await Promise.all(
        decoded.users.map(async (user) => {
          const avatar = await getAvatarFromServer(user.username);
          return { ...user, avatar };
        })
      );

      setFamilyInfo({ ...decoded, users: updatedUsers });
    };

    init();
  }, []);

  const getAvatarFromServer = async (username: string) => {
    try {
      const q = query(usersCollection, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const user = querySnapshot.docs[0];
        const data = user.data();
        return data?.avatar;
      }
    } catch (error) {
      console.error(error);
      return "";
    }
  };

  const goToUserInfo = (user: UserType) => {
    if (clicked) return;

    setClicked(true);
    try {
      const userNoAvatar: UserType = { ...user, avatar: "" };
      const userEncoded = encodeURIComponent(JSON.stringify(userNoAvatar));
      router.push(`/member/${userEncoded}`);
    } finally {
      setTimeout(() => setClicked(false), 1000);
    }
  };

  return (
    <>
      <TopBar
        title={t("members.familySettings.title", { ns: "screens" })}
        isBackButtonEnable
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: theme.colors.background }}
      >
        <View className="flex-1 items-center">
          <Card
            className="rounded-s-3xl rounded-e-3xl w-[91%] mt-5 py-4"
            style={{ backgroundColor: theme.custom.cardColor }}
          >
            <Card.Content className="gap-2">
              <Pressable
                android_ripple={{ color: theme.custom.ripple }}
                onPress={() =>
                  router.push({
                    pathname:
                      "/member/familySettings/name/[familyName,familyId]",
                    params: {
                      familyName: familyInfo?.name,
                      familyId: familyInfo?.id,
                    },
                  })
                }
              >
                <Text
                  className="text-3xl"
                  style={{ color: theme.colors.onBackground }}
                >
                  {t("members.familySettings.familyName", { ns: "screens" })}
                </Text>
                <Text
                  className="text-xl my-2"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  {familyInfo?.name}
                </Text>
                <View className="absolute bottom-1/4 right-2">
                  <Icon source={"chevron-right"} size={28} />
                </View>
              </Pressable>

              <Pressable
                android_ripple={{ color: theme.custom.ripple }}
                onPress={() =>
                  router.push({
                    pathname: "/member/familySettings/owner/[family]",
                    params: {
                      family: familyParams,
                    },
                  })
                }
              >
                <Text
                  className="text-3xl"
                  style={{ color: theme.colors.onBackground }}
                >
                  {t("members.familySettings.owner", { ns: "screens" })}
                </Text>
                <Text
                  className="text-xl my-2"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  @{familyInfo?.owner}
                </Text>
                <View className="absolute bottom-1/4 right-2">
                  <Icon source={"chevron-right"} size={28} />
                </View>
              </Pressable>

              {/* <View className="w-full items-center">
                <Pressable
                  className="px-4 py-4 rounded-2xl bg-red-500 flex-row"
                  android_ripple={{ color: theme.custom.ripple }}
                  onPress={() => setVisible(true)}
                >
                  {updating ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <>
                      <Icon source={"trash-can"} color="white" size={24} />
                      <Text className="text-xl" style={{ color: "white" }}>
                        {t("members.familySettings.deleteFamily", {
                          ns: "screens",
                        })}
                      </Text>
                    </>
                  )}
                </Pressable>
              </View> */}

              <Text
                className="text-3xl mb-4"
                style={{ color: theme.colors.onBackground }}
              >
                {t("members.familySettings.members", { ns: "screens" })}
              </Text>
              <View className="items-center gap-4">
                {familyInfo?.users.map((user) => (
                  <Pressable
                    key={user.username}
                    className="w-full p-5 rounded-2xl"
                    style={{
                      backgroundColor: theme.custom.cardTaskBackground,
                    }}
                    android_ripple={{ color: theme.custom.ripple }}
                    onPress={() => goToUserInfo(user)}
                  >
                    <View className="flex-row gap-3">
                      {user.avatar ? (
                        <Avatar.Image
                          size={48}
                          source={
                            user.avatar ? { uri: user.avatar } : placeholder
                          }
                        />
                      ) : (
                        <Avatar.Icon size={48} icon={"account"} />
                      )}

                      <View>
                        <Text
                          className="text-2xl -mb-1 w-60"
                          style={{ color: theme.colors.onBackground }}
                          ellipsizeMode="tail"
                          numberOfLines={1}
                        >
                          {user.name}
                        </Text>
                        <Text
                          className="pl-6"
                          style={{ color: theme.colors.onSurfaceVariant }}
                        >
                          @{user.username}
                        </Text>
                        <View className="absolute left-0 bottom-1.5">
                          <Icon
                            size={18}
                            source={
                              familyInfo.owner === user.username
                                ? "account-wrench"
                                : user.role === "MEMBER"
                                  ? "account"
                                  : "account-cog"
                            }
                          />
                        </View>
                      </View>
                    </View>
                    <View className="absolute bottom-1/2 right-2">
                      <Icon source={"chevron-right"} size={28} />
                    </View>
                  </Pressable>
                ))}
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
      <PasswordConfirmation
        visible={visible}
        setVisible={setVisible}
        updating={updating}
        setUpdating={setUpdating}
        onPasswordConfirmation={() => {}}
      />
    </>
  );
}
