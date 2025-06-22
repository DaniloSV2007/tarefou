import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Divider,
  Snackbar,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import Constants from "expo-constants";
import TopBar from "@/components/TopBar";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import * as Updates from "expo-updates";
import Update from "@/components/Update";

export default function AppInfo() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();

  const { isUpdateAvailable, isDownloading, isRestarting, isUpdatePending } =
    Updates.useUpdates();

  const [isChecking, setIsChecking] = useState(false);
  const [updatedVisible, setUpdatedVisible] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(isUpdateAvailable);

  const checkUpdates = async () => {
    setIsChecking(true);
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        setUpdateAvailable(true);
      } else {
        setUpdatedVisible(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    let hideSnackbar: any;
    if (updatedVisible) {
      hideSnackbar = setTimeout(() => {
        setUpdatedVisible(false);
      }, 5000);
    }
    return () => {
      clearTimeout(hideSnackbar);
    };
  }, [updatedVisible]);

  return (
    <>
      <TopBar
        title={t("appInfo.title")}
        titleColor={theme.colors.onBackground}
        isBackButtonEnable={true}
        backButtonColor={theme.colors.onBackground}
        barColor={theme.colors.background}
      />
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View>
          <Text
            variant="headlineMedium"
            style={[styles.text, { color: theme.colors.onBackground }]}
          >
            {t("appInfo.version")}:
          </Text>
          <Text
            variant="headlineSmall"
            style={[styles.text, { color: theme.colors.onBackground }]}
          >
            {Constants.expoConfig?.version}
          </Text>
          <View style={{ position: "absolute", right: 0, top: "50%" }}>
            <Button
              loading={isChecking}
              onPress={checkUpdates}
              contentStyle={{
                minHeight: 40,
                minWidth: 150,
                alignItems: "center",
                justifyContent: "center",
              }}
              labelStyle={{
                display: isChecking ? "none" : "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {t("appInfo.updateButton")}
            </Button>
          </View>
        </View>

        <Divider style={{ marginVertical: 10 }} />

        <Text
          variant="headlineMedium"
          style={[styles.text, { color: theme.colors.onBackground }]}
        >
          {t("appInfo.madeBy")}:
        </Text>
        <Text
          variant="headlineSmall"
          style={[styles.text, { color: theme.colors.onBackground }]}
        >
          DaniloSV07
        </Text>
      </View>
      <Snackbar onDismiss={() => {}} visible={updatedVisible}>
        {t("appInfo.noUpdateSnackbar")}
      </Snackbar>

      <Update isUpdateAvailable={updateAvailable} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  text: {
    marginLeft: 10,
  },
});
