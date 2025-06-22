import {
  ActivityIndicator,
  Button,
  Dialog,
  Portal,
  ProgressBar,
  Text,
} from "react-native-paper";
import * as Updates from "expo-updates";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

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
      await Updates.fetchUpdateAsync();
      setStatus("downloaded");
    } catch (err) {
      console.error(err);
      setStatus("idle"); // ou exibir erro ao usuário
    }
  };

  const restartApp = async () => {
    try {
      setStatus("restarting");
      await Updates.reloadAsync();
    } catch (err) {
      console.error(err);
      setStatus("idle");
    }
  };

  useEffect(() => {
    if (isUpdateAvailable) {
      setStatus("available");
    }
  }, [isUpdateAvailable]);

  return (
    <Portal>
      {/* Dialog - Atualização disponível */}
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

      {/* Dialog - Baixando atualização */}
      <Dialog visible={status === "downloading"}>
        <Dialog.Title>{t("update.downloading")}</Dialog.Title>
        <Dialog.Content style={{ minHeight: "10%" }}>
          <ProgressBar indeterminate />
        </Dialog.Content>
      </Dialog>

      {/* Dialog - Atualização baixada, precisa reiniciar */}
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

      {/* Dialog - Reiniciando */}
      <Dialog visible={status === "restarting"}>
        <Dialog.Title>{t("update.restarting")}</Dialog.Title>
        <Dialog.Content style={{ minHeight: "10%" }}>
          <ProgressBar indeterminate />
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}
