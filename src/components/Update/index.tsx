import {
  ActivityIndicator,
  Button,
  Dialog,
  Portal,
  ProgressBar,
  Text,
} from "react-native-paper";
import * as Updates from "expo-updates";
import { useState } from "react";
import { View } from "react-native";

interface UpdateProps {
  isUpdateAvailable: boolean;
  isDownloading: boolean;
  isRestarting: boolean;
  isUpdatePending: boolean;
}

export default function Update({
  isDownloading,
  isRestarting,
  isUpdateAvailable,
  isUpdatePending,
}: UpdateProps) {
  const [updateAvailable, setUpdateAvailable] = useState(isUpdateAvailable);
  const [restartNeeded, setRestartNeeded] = useState(false);

  return (
    <Portal>
      <Dialog dismissable={false} visible={updateAvailable}>
        <Dialog.Title>Update Available</Dialog.Title>
        <Dialog.Content>
          <Text>A new update is available and needs to be downloaded. </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              Updates.fetchUpdateAsync(), setUpdateAvailable(false);
              setRestartNeeded(true);
            }}
          >
            Download
          </Button>
        </Dialog.Actions>
      </Dialog>
      <Dialog visible={isDownloading}>
        <Dialog.Title>Downloading</Dialog.Title>
        <Dialog.Content
          style={{
            justifyContent: "center",
            minHeight: "10%",
          }}
        >
          <View>
            <ProgressBar indeterminate={true} />
          </View>
        </Dialog.Content>
      </Dialog>
      <Dialog dismissable={false} visible={restartNeeded}>
        <Dialog.Title>Restart Pending</Dialog.Title>
        <Dialog.Content>
          <Text>
            The update has been succesfully downloaded. The app needs to be
            restarted.
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              Updates.reloadAsync();
              setRestartNeeded(false);
            }}
          >
            Restart
          </Button>
        </Dialog.Actions>
      </Dialog>
      <Dialog visible={isRestarting}>
        <Dialog.Title>Restarting</Dialog.Title>
        <Dialog.Content
          style={{
            justifyContent: "center",
            minHeight: "10%",
          }}
        >
          <View>
            <ProgressBar indeterminate={true} />
          </View>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}
