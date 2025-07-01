import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useTranslation } from "react-i18next";
import { useLocalSearchParams, useRouter } from "expo-router";
import TopBar from "@/components/TopBar";
import { UserType } from "../../admin/members";
import { Avatar, Card, Icon, Text } from "react-native-paper";
import placeholder from "@/assets/Profile/user.png";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import FamilyName from "@/components/Register/FamilyName";

type Family = {
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
  const { token } = useAuth();

  const [familyInfo, setFamilyInfo] = useState<Family | undefined>();
  const [users, setUsers] = useState<UserType[] | undefined>();

  const [clicked, setClicked] = useState(false);

  const familyParams = Array.isArray(params.family)
    ? params.family[0]
    : params.family;
  const familyDecoded = JSON.parse(decodeURIComponent(familyParams));

  useEffect(() => {
    setFamilyInfo(familyDecoded);
  }, []);

  useEffect(() => {
    const fetchAvatars = async () => {
      if (familyInfo) {
        for (const user of familyInfo.users) {
          await getAvatarDatabase(user.username);
        }
        setFamilyInfo({ ...familyInfo });
      }
    };
    fetchAvatars();
  }, [familyInfo]);

  const getAvatarDatabase = async (username: string) => {
    try {
      if (!username) {
        throw new Error("Username not found");
      }
      const res = await api.get("/users/" + username, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (res.data) {
        const { avatar } = res.data;
        const userIndex = familyInfo?.users.findIndex(
          (user: UserType) => user.username === username
        );
        if (userIndex !== undefined && userIndex !== -1 && familyInfo) {
          const user = familyInfo.users[userIndex];
          familyInfo.users[userIndex] = { ...user, avatar };
        }
      }
    } catch (error) {
      console.error(error);
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
      const timer = setTimeout(() => {
        setClicked(false);
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  };

  return (
    <>
      <TopBar title={"Family Settings"} isBackButtonEnable />
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
                  Family Name:
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
                onPress={() => {}}
              >
                <Text
                  className="text-3xl"
                  style={{ color: theme.colors.onBackground }}
                >
                  Owner:
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

              <Text
                className="text-3xl mb-4"
                style={{ color: theme.colors.onBackground }}
              >
                Members:
              </Text>
              <View className="items-center gap-4">
                {familyInfo?.users.map((user: UserType) => (
                  <Pressable
                    key={user.username}
                    className="w-11/12 p-5 rounded-2xl"
                    style={{ backgroundColor: theme.custom.cardTaskBackground }}
                    android_ripple={{ color: theme.custom.ripple }}
                    onPress={() => goToUserInfo(user)}
                  >
                    <View className="flex-row gap-3">
                      <Avatar.Image
                        size={48}
                        source={{ uri: user.avatar ?? placeholder }}
                      />
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
    </>
  );
}
