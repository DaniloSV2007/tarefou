import { useAuth } from "@/context/AuthContext";
import { StyleSheet, View } from "react-native";
import { Avatar, Button, Text, useTheme } from "react-native-paper";

export default function ProfileNotLogged() {
  const { isLoggedIn, login } = useAuth();
  const theme = useTheme();
  return (
    <>
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.avatar}>
          <Avatar.Icon icon={"account-outline"} size={150} />
        </View>
        <View style={styles.loginButtonArea}>
          <Text
            style={[styles.loginText, { color: theme.colors.onBackground }]}
          >
            You need to an account to manage profile settings
          </Text>
          <Button
            children="Login"
            style={styles.loginButton}
            labelStyle={{
              fontSize: 24,
              justifyContent: "center",
              alignItems: "center",
              height: "60%",
              color: "#fff",
            }}
            onPress={() => login()}
            mode="contained"
            loading={isLoggedIn}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatar: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  loginButtonArea: {
    height: "74%",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    paddingBottom: 128,
  },
  loginButton: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: "#337eff",
    borderRadius: 12,
  },
  loginText: {
    width: "60%",
    fontSize: 20,
  },
});
