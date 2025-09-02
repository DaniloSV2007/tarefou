import { Button, Dialog, Portal, ProgressBar, Text } from "react-native-paper";
import * as Updates from "expo-updates";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

type UpdateStatus =
  | "idle"
  | "available"
  | "downloading"
  | "downloaded"
  | "restarting";

interface UpdateProps {
  isUpdateAvailable: boolean;
}

export default function Update({ isUpdateAvailable }: UpdateProps) {
  const [status, setStatus] = useState<UpdateStatus>("idle");
  const { t } = useTranslation();

  const startUpdate = async () => {
    try {
      setStatus("downloading");
      await changedUpdateOtaNumber();
      await Updates.fetchUpdateAsync();
      setStatus("downloaded");
    } catch (err) {
      console.error("Failed to fetch update:", err);
      setStatus("idle");
    }
  };

  const restartApp = async () => {
    try {
      setStatus("restarting");
      await Updates.reloadAsync();
    } catch (err) {
      console.error("Failed to reload app:", err);
      setStatus("idle");
    }
  };

  useEffect(() => {
    if (isUpdateAvailable) {
      setStatus("available");
    }
  }, [isUpdateAvailable]);

  const checkIsNewBuild = async (): Promise<boolean> => {
    const currentVersion = Constants.expoConfig?.version ?? "1.0.0";
    const savedVersion = await AsyncStorage.getItem("appVersion");

    if (!savedVersion || savedVersion !== currentVersion) {
      await AsyncStorage.setItem("appVersion", currentVersion);
      return true;
    }

    return false;
  };

  const changedUpdateOtaNumber = async () => {
    const isNewBuild = await checkIsNewBuild();
    if (isNewBuild) {
      await AsyncStorage.setItem("updateOtaNumber", "0");
      return;
    }

    const previous = await AsyncStorage.getItem("updateOtaNumber");
    const next = previous ? parseInt(previous) + 1 : 0;
    await AsyncStorage.setItem("updateOtaNumber", `${next}`);
    console.log("Update OTA count:", next);
  };

  return (
    <Portal>
      <Dialog visible={status === "available"} dismissable={false}>
        <Dialog.Title>{t("update.needDownload.title")}</Dialog.Title>
        <Dialog.Content>
          <Text>{t("update.needDownload.content")}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={startUpdate}>
            {t("update.needDownload.download")}
          </Button>
        </Dialog.Actions>
      </Dialog>

      <Dialog visible={status === "downloading"}>
        <Dialog.Title>{t("update.downloading")}</Dialog.Title>
        <Dialog.Content style={{ minHeight: "10%" }}>
          <ProgressBar indeterminate />
        </Dialog.Content>
      </Dialog>

      <Dialog visible={status === "downloaded"} dismissable={false}>
        <Dialog.Title>{t("update.needRestart.title")}</Dialog.Title>
        <Dialog.Content>
          <Text>{t("update.needRestart.content")}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={restartApp}>
            {t("update.needRestart.restart")}
          </Button>
        </Dialog.Actions>
      </Dialog>

      <Dialog visible={status === "restarting"}>
        <Dialog.Title>{t("update.restarting")}</Dialog.Title>
        <Dialog.Content style={{ minHeight: "10%" }}>
          <ProgressBar indeterminate />
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}
