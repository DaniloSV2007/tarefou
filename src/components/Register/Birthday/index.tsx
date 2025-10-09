import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import React, { useState } from "react";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useThemeContext } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";

interface BirthdayProps {
  setPage: (page: number) => void;
  setBirthday: (birthday: string) => void;
  birthday: string;
  age: number;
  setAge: (age: number) => void;
}

export default function Birthday({
  setPage,
  setBirthday,
  setAge,
}: BirthdayProps) {
  const { theme } = useThemeContext();
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const { t, i18n } = useTranslation();

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "set" && selectedDate) {
      setDate(selectedDate);
    }
    const today = new Date();
    const minDate = new Date(
      today.getFullYear() - 3,
      today.getMonth(),
      today.getDate(),
    );
    if (date > minDate) {
      setError(t("register.error.birthday"));
    }
    setShow(false);
  };

  const handleConfirm = () => {
    const today = new Date();
    const minDate = new Date(
      today.getFullYear() - 3,
      today.getMonth(),
      today.getDate(),
    );

    if (date > minDate) {
      setError(t("register.error.birthday"));
      return;
    }

    setError("");
    setBirthday(date.toISOString().split("T")[0]);
    setAge(new Date().getFullYear() - date.getFullYear());
    setPage(4);
  };

  const minimumAgeDate = new Date();
  minimumAgeDate.setFullYear(minimumAgeDate.getFullYear() - 3);

  const isTooYoung = date > minimumAgeDate;

  return (
    <>
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
          textColor="white"
          onTouchCancel={() => setShow(false)}
          maximumDate={new Date()}
        />
      )}

      <View
        style={{
          backgroundColor: theme.colors.cardTaskBackground,
          borderRadius: 12,
          padding: 4,
        }}
      >
        <Pressable
          onPress={() => setShow(true)}
          android_ripple={{ color: theme.colors.ripple }}
          style={{
            borderRadius: 12,
            padding: 8,
          }}
        >
          <Text
            style={[
              styles.text,
              {
                color:
                  date.toLocaleDateString() === new Date().toLocaleDateString()
                    ? theme.colors.onSurfaceDisabled
                    : theme.colors.onBackground,
              },
            ]}
          >
            {date.toLocaleDateString(
              ["pt", "en"].includes(i18n.language) ? i18n.language : "en",
            )}
          </Text>
        </Pressable>
      </View>

      <Text style={{ color: "red" }}>{error !== "" && "*" + error}</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 16,
        }}
      >
        <Button
          mode="contained"
          onPress={() => setPage(2)}
          style={[
            styles.backButton,
            { backgroundColor: theme.colors.cardTaskBackground },
          ]}
          labelStyle={[styles.buttonText, { color: theme.colors.onBackground }]}
        >
          {t("register.birthday.back")}
        </Button>
        <Button
          mode="contained"
          onPress={handleConfirm}
          style={[
            styles.button,
            {
              backgroundColor: isTooYoung
                ? theme.colors.surfaceDisabled
                : theme.colors.primary,
            },
          ]}
          labelStyle={styles.buttonText}
          disabled={isTooYoung}
        >
          {t("common.next", { ns: "components" })}
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 32,
    paddingVertical: 5,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderColor: "#666",
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "500",
    color: "white",
  },
});
