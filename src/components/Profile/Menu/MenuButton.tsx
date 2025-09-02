import { StyleSheet, View } from "react-native";
import React from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Divider, Icon, Text, TouchableRipple } from "react-native-paper";
import { MenuProps } from ".";

interface MenuButtonProps {
  text: string;
  icon: string;
  onPress: () => void | void;
}

export default function MenuButton({
  close,
  text,
  icon,
  onPress,
}: MenuProps & MenuButtonProps) {
  const theme = useAppTheme();

  return (
    <>
      <TouchableRipple
        style={styles.button}
        rippleColor={theme.custom.ripple}
        onPress={() => {
          onPress();
          close();
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon source={icon} size={25} color={theme.colors.onBackground} />
          <Text
            style={[
              styles.buttonTextMenu,
              { color: theme.colors.onBackground },
            ]}
          >
            {text}
          </Text>
        </View>
      </TouchableRipple>
      <Divider style={{ backgroundColor: theme.colors.surface, height: 0.5 }} />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 40,
    flexDirection: "row",
  },
  buttonTextMenu: {
    fontSize: 25,
    color: "#fff",
    fontWeight: "black",
    marginLeft: 20,
  },
});
