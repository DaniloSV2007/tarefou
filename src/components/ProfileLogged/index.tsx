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
  ProgressBar,
  Text,
} from "react-native-paper";
import { useTranslation } from "react-i18next";

export default function ProfileLogged() {
  const [todayProgress, setTodayProgress] = useState(0);
  const [weekProgress, setWeekProgress] = useState(0);
  const { t } = useTranslation();

  const theme = useAppTheme();
  const router = useRouter();

  useEffect(() => {
    setTodayProgress(80);
    setWeekProgress(67);
  }, []);

  return (
    <>
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={{ position: "absolute", top: 140, right: 140, zIndex: 1 }}>
          <FAB
            icon="pencil"
            onPress={() => {}}
            rippleColor={theme.custom.ripple}
            color="white"
            mode="flat"
            style={[
              styles.editButton,
              {
                backgroundColor: theme.custom.cardTaskBackground,
              },
            ]}
          />
        </View>
        <View style={styles.nameBox}>
          <View>
            <Avatar.Text
              label="DS"
              size={150}
              style={{
                backgroundColor: theme.custom.cardColor,
                borderColor: theme.custom.cardTaskBackground,
                borderWidth: 1,
              }}
            />
            <></>
          </View>
          <Text
            style={{
              color: theme.colors.onBackground,
              width: "94%",
              fontSize: 24,
              marginTop: -10,
              margin: -20,
              opacity: 0.8,
            }}
          >
            {t("screens:profileLogged.personalInfo.roleAdmin")}
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              color: theme.colors.onBackground,
              fontSize: 24,
            }}
          >
            Danilo Souza Voiski
          </Text>
        </View>
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
  nameBox: {
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
    marginTop: 30,
    paddingHorizontal: 20,
    position: "absolute",
    top: 0,
  },
  icon: {
    justifyContent: "center",
    marginLeft: 20,
  },
  editButton: {
    borderRadius: 99,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
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
