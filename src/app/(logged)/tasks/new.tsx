import {
  Keyboard,
  Pressable,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useRouter } from "expo-router";
import TopBar from "@/components/TopBar";
import { useTranslation } from "react-i18next";
import CustomCard from "@/components/CustomCard";
import {
  ActivityIndicator,
  Avatar,
  Checkbox,
  Icon,
  List,
  Text,
  TextInput,
} from "react-native-paper";
import { StyleSheet } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-element-dropdown";
import placeholder from "@/assets/Profile/user.png";
import api from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "../admin/members";
import { Family } from "../member/familySettings/[family]";
import { useAuth } from "@/context/AuthContext";

interface Task {
  title: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deadline?: Date;
  isCompleted?: boolean;
  userId: string;
}

export default function NewTask() {
  const theme = useAppTheme();
  const router = useRouter();
  const { token } = useAuth();
  const { t } = useTranslation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [time, setTime] = useState(new Date());

  const [deadline, setDeadline] = useState(new Date());
  const [deadlineString, setDeadlineString] = useState("");

  const [focus, setFocus] = useState(false);
  const [selectText, setSelectText] = useState<any>([]);

  const [familyInfo, setFamilyInfo] = useState<Family | undefined>();
  const [users, setUsers] = useState<UserType[] | undefined>();
  const [avatarsFetched, setAvatarsFetched] = useState(false);

  const [data, setData] = useState<any[]>([]);
  const [usersSelected, setUsersSelected] = useState<UserType[]>([]);

  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (date === selectedDate) {
      setShowDate(false);
      return;
    }
    if (event.type === "set" && selectedDate) {
      setDate(selectedDate);
    }
    setShowDate(false);
    setShowTime(true);
  };

  const onChangeTime = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "set" && selectedDate) {
      setTime(selectedDate);
      const deadline = new Date(date);
      deadline.setHours(time.getHours());
      deadline.setMinutes(time.getMinutes());
      deadline.setSeconds(0);
      deadline.setMilliseconds(0);
      setDeadline(deadline);
      const deadlineString = `${deadline.getHours()}:${deadline.getMinutes()}, ${deadline.toLocaleDateString()}`;
      setDeadlineString(deadlineString);
    }
    setShowTime(false);
  };

  useEffect(() => {
    getUsers();
    getRole();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const usersSelected = data.filter((user: any) => user.selected);
      if (usersSelected) {
        setUsersSelected(usersSelected);
      }
    }
  }, [data]);

  useEffect(() => {
    const fetchAvatars = async () => {
      if (!avatarsFetched && familyInfo?.users) {
        const updatedUsers = await Promise.all(
          (users ?? []).map(async (user) => {
            const avatar = await getAvatarDatabase(user.username);
            return { ...user, avatar };
          })
        );
        setFamilyInfo({ ...familyInfo, users: updatedUsers });
        setData(
          updatedUsers.map((user: UserType) => ({
            ...user,
            selected: false,
          }))
        );
        setAvatarsFetched(true);
      }
    };
    fetchAvatars();
  }, [familyInfo, avatarsFetched]);

  const filterUsers = async (users: []) => {
    const newUsers = users.filter(
      (user: UserType) => user.role !== "FAMILY_ADMIN"
    );

    setUsers(newUsers);
  };

  const getRole = async () => {
    const role = await AsyncStorage.getItem("userRole");
    if (!role) {
      router.replace("/(logged)/");
      return;
    }
    setRole(role);
  };

  const getUsers = async () => {
    const familyId = await getFamilyId();

    if (!familyId) {
      throw new Error("Family Id not found");
    }
    try {
      const res = await api.get("/families/" + familyId, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (res.status === 200) {
        const { users } = res.data;
        await filterUsers(users);
        setFamilyInfo(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getFamilyId = async () => {
    const familyId = await AsyncStorage.getItem("familyId");
    if (familyId) {
      return familyId;
    }

    const username = await AsyncStorage.getItem("username");
    try {
      const res = await api.get("/users/" + username, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (res.status === 200) {
        return res.data.familyId;
      }
    } catch (error) {
      console.error(error);
    }
  };

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

  const createTask = async () => {
    setLoading(true);
    if (title === "" || description === "" || usersSelected.length <= 0) {
      setLoading(false);
      return;
    }
    for (let i = 0; i < usersSelected.length; i++) {
      const dataTask = {
        username: usersSelected[i].username,
        task: {
          title,
          description,
          deadline: deadline,
        },
      };
      try {
        const res = await api.post("/tasks/", dataTask, {
          headers: { Authorization: token },
        });
        if (res.status === 201) {
          setLoading(false);
          router.back();
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <TopBar
          title={t("home.newTask.title")}
          isBackButtonEnable={true}
          backButtonHref={() =>
            router.replace(
              `/(logged)/${role === "MEMBER" ? "user" : "admin"}/home`
            )
          }
        />
        <View style={{ flex: 1, padding: 16, alignItems: "center" }}>
          <CustomCard
            title={t("home.newTask.title")}
            cardStyle={{ width: "95%", borderRadius: 24 }}
          >
            <View className="gap-5">
              <View className="gap-5">
                <TextInput
                  mode="outlined"
                  placeholder={t("home.newTask.titlePlaceholder", {
                    ns: "translation",
                  })}
                  placeholderTextColor={theme.colors.onSurfaceDisabled}
                  style={[
                    styles.input,
                    { backgroundColor: theme.custom.cardTaskBackground },
                  ]}
                  textColor={theme.colors.onBackground}
                  value={title}
                  onChangeText={(text) => setTitle(text)}
                  maxLength={20}
                  right={
                    <TextInput.Affix
                      text={`${title.length}/20`}
                      textStyle={{ fontSize: 16 }}
                    />
                  }
                />
              </View>
              <View className="gap-5">
                <TextInput
                  mode="outlined"
                  placeholder={t("home.newTask.descriptionPlaceholder", {
                    ns: "translation",
                  })}
                  placeholderTextColor={theme.colors.onSurfaceDisabled}
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.custom.cardTaskBackground,
                    },
                  ]}
                  textColor={theme.colors.onBackground}
                  multiline={description.length > 20}
                  maxLength={100}
                  right={
                    <TextInput.Affix
                      text={`${description.length}/100`}
                      textStyle={{ fontSize: 16 }}
                    />
                  }
                  value={description}
                  textAlignVertical="bottom"
                  onChangeText={(text) => setDescription(text)}
                />
              </View>
              <Text className="text-2xl">
                {t("home.newTask.selectDeadline", { ns: "translation" })}
              </Text>
              <Pressable
                className="px-6 py-3 min-w-4/6 rounded-lg"
                style={{ backgroundColor: theme.custom.cardTaskBackground }}
                android_ripple={{ color: theme.custom.ripple }}
                onPress={() => setShowDate(true)}
              >
                <Text className="text-xl">
                  {deadlineString !== ""
                    ? deadlineString
                    : t("home.newTask.selectDate", { ns: "translation" })}
                </Text>
              </Pressable>
              <Text className="text-2xl">
                {t("home.newTask.selectmembers", { ns: "translation" })}
              </Text>
              <View
                style={{
                  backgroundColor: theme.custom.cardTaskBackground,
                  borderRadius: 12,
                  paddingVertical: 4,
                  paddingHorizontal: 4,
                }}
              >
                <List.Accordion
                  title={
                    usersSelected.length > 0
                      ? t("home.newTask.selectedNumber", {
                          ns: "translation",
                          number: usersSelected.length,
                        })
                      : t("home.newTask.selectMembersPlaceholder", {
                          ns: "translation",
                        })
                  }
                  style={{
                    backgroundColor: theme.custom.cardTaskBackground,
                  }}
                >
                  {data.map((user, i) => (
                    <View key={user.username || i}>
                      <List.Item
                        style={{ paddingLeft: 8 }}
                        title={user.name}
                        left={() =>
                          user.avatar ? (
                            <Avatar.Image
                              size={40}
                              source={{ uri: user.avatar }}
                            />
                          ) : (
                            <Avatar.Icon size={40} icon="account" />
                          )
                        }
                        onPress={() => {
                          setData((prevData) =>
                            prevData.map((u, idx) =>
                              idx === i ? { ...u, selected: !u.selected } : u
                            )
                          );
                        }}
                      />
                      <Pressable
                        className="absolute bottom-1/4 right-2"
                        onPress={() => {
                          setData((prevData) =>
                            prevData.map((u, idx) =>
                              idx === i ? { ...u, selected: !u.selected } : u
                            )
                          );
                        }}
                      >
                        <Checkbox
                          status={user.selected ? "checked" : "unchecked"}
                        />
                      </Pressable>
                    </View>
                  ))}
                </List.Accordion>
              </View>
              <Pressable
                disabled={loading}
                className="items-center py-2 rounded-lg"
                style={{ backgroundColor: theme.colors.primary }}
                onPress={createTask}
              >
                {loading ? (
                  <ActivityIndicator color="white" size={24} />
                ) : (
                  <Text className="text-xl" style={{ color: "white" }}>
                    {t("home.newTask.createTask", { ns: "translation" })}
                  </Text>
                )}
              </Pressable>
            </View>
            {showDate && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChangeDate}
                textColor="white"
                onTouchCancel={() => setShowDate(false)}
                minimumDate={new Date()}
              />
            )}
            {showTime && (
              <DateTimePicker
                value={time}
                mode="time"
                display="default"
                onChange={onChangeTime}
                textColor="white"
                onTouchCancel={() => setShowDate(false)}
              />
            )}
          </CustomCard>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  input: {
    fontSize: 24,
    borderRadius: 8,
    minHeight: 52,
    maxWidth: "auto",
  },
});
