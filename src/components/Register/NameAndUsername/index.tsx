import { StyleSheet, TextInput, View } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useState } from "react";
import React from "react";
import { Button } from "react-native-paper";

export default function NameAndUsername({
  setPage,
}: {
  setPage: (page: number) => void;
}) {
  const theme = useAppTheme();
  const [isFocusedName, setIsFocusedName] = useState(false);
  const [isFocusedUsername, setIsFocusedUsername] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  return (
    <>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.custom.cardTaskBackground,
            color: theme.colors.onBackground,
            borderColor: isFocusedName
              ? theme.colors.onBackground
              : theme.custom.inputFocusBorder,
            borderWidth: isFocusedName ? 2 : 1,
          },
        ]}
        cursorColor={theme.colors.onBackground}
        placeholder="Name"
        placeholderTextColor={theme.colors.onSurface}
        onFocus={() => setIsFocusedName(true)}
        onBlur={() => setIsFocusedName(false)}
        value={name}
        onChangeText={(text) => setName(text)}
      />

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.custom.cardTaskBackground,
            color: theme.colors.onBackground,
            borderColor: isFocusedUsername
              ? theme.colors.onBackground
              : theme.custom.inputFocusBorder,
            borderWidth: isFocusedUsername ? 2 : 1,
          },
        ]}
        placeholder="Username"
        placeholderTextColor={theme.colors.onSurface}
        onFocus={() => setIsFocusedUsername(true)}
        onBlur={() => setIsFocusedUsername(false)}
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 16,
        }}
      >
        <Button
          mode="contained"
          onPress={() => setPage(1)}
          style={[
            styles.backButton,
            { backgroundColor: theme.custom.cardTaskBackground },
          ]}
          labelStyle={[styles.buttonText, { color: theme.colors.onSurface }]}
        >
          Back
        </Button>

        <Button
          mode="contained"
          onPress={() => setPage(3)}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          labelStyle={[styles.buttonText, { color: theme.colors.onBackground }]}
        >
          Next
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 12,
    fontSize: 24,
    borderRadius: 8,
    height: 64,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 32,
    paddingVertical: 5,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "500",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderColor: "#666",
    borderWidth: 1,
  },
});
