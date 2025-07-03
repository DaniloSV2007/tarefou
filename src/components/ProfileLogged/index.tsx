import ProfileMenu from "@/components/Profile/Menu";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import React from "react";
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StatusBar,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Appbar,
  Avatar,
  Button,
  Card,
  Divider,
  FAB,
  Icon,
  Portal,
  ProgressBar,
  Text,
} from "react-native-paper";
import { useTranslation } from "react-i18next";
import AvatarProfile from "../Profile/Avatar";
import ImageView from "react-native-image-viewing";
import QRCode from "react-native-qrcode-svg";
import TopBar from "../TopBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Brightness from "expo-brightness";
import logoLight from "@/assets/Profile/splash-icon-light.png";
import logoDark from "@/assets/Profile/splash-icon-dark.png";
import { useThemeContext } from "@/context/ThemeContext";
import * as SystemUI from "expo-system-ui";

export default function ProfileLogged() {
  const { t } = useTranslation();

  const [image, setImage] = useState([]);
  const [visible, setIsVisible] = useState(false);

  const [qrVisible, setQrVisible] = useState(false);

  const theme = useAppTheme();
  const { isDark } = useThemeContext();
  const router = useRouter();

  const QrCode = () => {
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
      AsyncStorage.getItem("username").then(setUsername);
    }, []);

    if (!username) return null; // ou um loading spinner, etc.

    return (
      <QRCode
        size={200}
        logo={isDark ? logoDark : logoLight}
        logoSize={30}
        logoBackgroundColor="transparent"
        backgroundColor={theme.colors.background}
        color={theme.colors.onBackground}
        value={`tarefou://tarefou/${username}`}
      />
    );
  };

  function maxBrightness() {
    useEffect(() => {
      if (!qrVisible) {
        (async () => {
          const { granted } = await Brightness.requestPermissionsAsync();
          if (granted) {
            await Brightness.setBrightnessAsync(1);
          }
        })();
      }
    }, [qrVisible]);

    return null;
  }

  useEffect(() => {
    if (qrVisible) {
      let originalBrightness = 1;

      (async () => {
        const { granted } = await Brightness.requestPermissionsAsync();
        if (!granted) return;

        originalBrightness = await Brightness.getBrightnessAsync();
        await Brightness.setBrightnessAsync(1);
      })();

      return () => {
        Brightness.setBrightnessAsync(originalBrightness); // Restaura ao sair
      };
    }
  }, [qrVisible]);

  return (
    <>
      <View
        style={[
          styles.container,
          { backgroundColor: theme.colors.background, flex: 1 },
        ]}
      >
        <AvatarProfile
          setImageProp={setImage}
          setIsVisible={setIsVisible}
          setQrVisible={setQrVisible}
        />

        {qrVisible && (
          <Portal>
            <TopBar
              title={"QR Code"}
              iconButton={"close"}
              iconColor={theme.colors.onBackground}
              buttonSize={32}
              onPressButton={() => setQrVisible(false)}
            />
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.colors.background,
              }}
            >
              <View
                style={{
                  padding: 40,
                  borderRadius: 24,
                  backgroundColor: theme.custom.cardColor,
                }}
              >
                <View
                  style={{
                    padding: 20,
                    borderRadius: 12,
                    backgroundColor: theme.colors.background,
                  }}
                >
                  <QrCode />
                </View>
              </View>
            </View>
          </Portal>
        )}

        <ImageView
          images={image}
          imageIndex={0}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  statisticsCardView: {
    flex: 1,
    width: "100%",
    height: 669,
  },
  cardTitle: {
    fontSize: 60,
    padding: 2,
    color: "white",
  },
  cardText: {
    fontSize: 22,
    height: 30,
    color: "white",
  },
  statisticsCard: {
    padding: 30,
    borderRadius: 30,
    height: "100%",
    borderBottomEndRadius: 0,
    borderBottomLeftRadius: 0,
  },
});
