import ProfileMenu from "@/components/Profile/ProfileMenu";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import React from "react";
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
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

export default function ProfileLogged() {
  const [todayProgress, setTodayProgress] = useState(0);
  const [weekProgress, setWeekProgress] = useState(0);
  const { t } = useTranslation();

  const [image, setImage] = useState([]);
  const [visible, setIsVisible] = useState(false);

  const [qrVisible, setQrVisible] = useState(false);

  const theme = useAppTheme();
  const router = useRouter();

  useEffect(() => {
    setTodayProgress(80);
    setWeekProgress(67);
  }, []);

  const QrCode = () => {
    const username = AsyncStorage.getItem("username");
    return <QRCode size={300} value={`tarefou://tarefou/${username}`} />;
  };

  function ForcarBrilhoMaximo() {
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
              <QrCode />
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
