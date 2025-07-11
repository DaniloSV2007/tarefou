import { useThemeContext } from "@/context/ThemeContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Image,
  Pressable,
} from "react-native";
import { Button, TouchableRipple } from "react-native-paper";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
// import * as WebBrowser from "expo-web-browser";
// import * as Google from "expo-auth-session/providers/google";
import { auth } from "../../../FirebaseConfig";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import Constants from "expo-constants";

interface GoogleButtonProps {
  onPress: () => void;
}

// WebBrowser.maybeCompleteAuthSession();

export default function GoogleButton({ onPress }: GoogleButtonProps) {
  const theme = useAppTheme();
  const { isDark } = useThemeContext();
  const { t } = useTranslation();

  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   clientId:
  //     "543165319921-hsshsqs72k3autofjas1jvc1to24fkon.apps.googleusercontent.com",
  //   iosClientId:
  //     "543165319921-hsshsqs72k3autofjas1jvc1to24fkon.apps.googleusercontent.com",
  //   androidClientId:
  //     "543165319921-hsshsqs72k3autofjas1jvc1to24fkon.apps.googleusercontent.com",
  //   webClientId:
  //     "543165319921-hsshsqs72k3autofjas1jvc1to24fkon.apps.googleusercontent.com",
  // });

  // useEffect(() => {
  //   if (response?.type === "success") {
  //     const { idToken } = response.authentication!;
  //     const credential = GoogleAuthProvider.credential(idToken);
  //     signInWithCredential(auth, credential)
  //       .then(() => {
  //         console.log("Usuário autenticado com Google");
  //       })
  //       .catch((error) => {
  //         console.error("Erro ao autenticar:", error);
  //       });
  //   }
  // }, [response]);

  return (
    <View style={{ borderRadius: 32, overflow: "hidden" }}>
      <Pressable
        disabled
        // onPress={() => promptAsync()}
        style={[
          styles.button,
          { backgroundColor: theme.custom.cardTaskBackground },
        ]}
        android_ripple={{
          color: theme.custom.ripple,
        }}
      >
        <Image
          source={{
            uri: "https://img.icons8.com/?size=512&id=17949&format=png",
          }}
          style={styles.logo}
        />
        <Text style={[styles.text, { color: theme.colors.onBackground }]}>
          {t("login.loginWithGoogle")}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#666",
    borderWidth: 1,
    borderRadius: 32,
    paddingVertical: 10,
  },
  logo: {
    width: 42,
    height: 42,
    marginRight: 12,
  },
  text: {
    fontSize: 24,
    fontWeight: "500",
  },
});
