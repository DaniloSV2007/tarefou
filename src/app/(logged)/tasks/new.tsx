import { Pressable, View } from "react-native";
import React, { useState } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useRouter } from "expo-router";
import TopBar from "@/components/TopBar";
import { useTranslation } from "react-i18next";
import CustomCard from "@/components/CustomCard";
import { Text, TextInput } from "react-native-paper";
import { StyleSheet } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

export default function NewTask() {
  const theme = useAppTheme();
  const router = useRouter();
  const { t } = useTranslation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [time, setTime] = useState(new Date());
  const [deadline, setDeadline] = useState(new Date());

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
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
    }
    setShowTime(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <TopBar title={t("home.newTask.title")} isBackButtonEnable={true} />
      <View style={{ flex: 1, padding: 16, alignItems: "center" }}>
        <CustomCard title="New Task">
          <View className="gap-5">
            <View className="gap-5">
              <Text className="text-2xl">Task name:</Text>
              <TextInput
                mode="outlined"
                style={[
                  styles.input,
                  { backgroundColor: theme.custom.cardTaskBackground },
                ]}
                textColor={theme.colors.onBackground}
                value={title}
                onChangeText={(text) => setTitle(text)}
              />
            </View>
            <View className="gap-5">
              <Text className="text-2xl">Task description:</Text>
              <TextInput
                mode="outlined"
                style={[
                  styles.input,
                  { backgroundColor: theme.custom.cardTaskBackground },
                ]}
                textColor={theme.colors.onBackground}
                multiline
                textAlign="left"
                value={description}
                onChangeText={(text) => setDescription(text)}
              />
            </View>
            <Text className="text-2xl">Select a deadline to do:</Text>
            <Pressable
              className="px-6 py-3 bg-gray-800 w-4/6 rounded-lg"
              android_ripple={{ color: theme.custom.ripple }}
              onPress={() => setShowDate(true)}
            >
              <Text className="text-xl">Select date</Text>
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
  );
}

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 0,
    fontSize: 24,
    borderRadius: 8,
    minHeight: 52,
    maxWidth: "auto",
  },
});
