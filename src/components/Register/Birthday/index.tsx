import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Button, Card, Dialog, Portal } from "react-native-paper";
import React, { useState } from "react";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useThemeContext } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";

export default function Birthday({
  setPage,
}: {
  setPage: (page: number) => void;
}) {
  const theme = useAppTheme();
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState<"date" | "time" | "datetime">("date");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [isConfirmation, setIsConfirmation] = useState(false);
  const { isDark } = useThemeContext();
  const { login } = useAuth();
  const router = useRouter();

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "set" && selectedDate) {
      setDate(selectedDate);
    }
    setShow(false);
  };

  const handleConfirm = () => {
    const today = new Date();
    const minDate = new Date(
      today.getFullYear() - 3,
      today.getMonth(),
      today.getDate()
    );

    if (date > minDate) {
      setError("*You must be at least 3 years old.");
      return;
    }

    setError("");
    setIsConfirmation(true);
  };

  return (
    <>
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
          onTouchCancel={() => setShow(false)}
          themeVariant={isDark ? "dark" : "light"}
          maximumDate={
            new Date(new Date().setFullYear(new Date().getFullYear() - 3))
          }
        />
      )}
      <Pressable
        onPress={() => setShow(true)}
        android_ripple={{ color: theme.custom.ripple }}
      >
        <Card style={{ backgroundColor: theme.custom.cardTaskBackground }}>
          <Card.Content>
            <Text style={[styles.text, { color: theme.colors.onBackground }]}>
              {date.toLocaleDateString()}
            </Text>
          </Card.Content>
        </Card>
      </Pressable>
      <Text style={{ color: "red" }}>{error}</Text>
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
            { backgroundColor: theme.custom.cardTaskBackground },
          ]}
          labelStyle={styles.buttonText}
        >
          Back
        </Button>
        <Button
          mode="contained"
          onPress={handleConfirm}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          labelStyle={styles.buttonText}
        >
          Confirm
        </Button>
      </View>
      <Portal>
        <Dialog
          visible={isConfirmation}
          onDismiss={() => setIsConfirmation(false)}
        >
          <Dialog.Title style={{ color: theme.colors.onBackground }}>
            Confirmation
          </Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: theme.colors.onBackground, fontSize: 18 }}>
              Are you sure you want to confirm?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              style={{ backgroundColor: theme.custom.cardColor }}
              labelStyle={{ color: theme.colors.onBackground }}
              onPress={() => setIsConfirmation(false)}
            >
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: theme.colors.primary }}
              labelStyle={{ color: theme.colors.onBackground }}
              onPress={() => {
                login();
                router.push("/");
              }}
            >
              Confirm
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  },
});
