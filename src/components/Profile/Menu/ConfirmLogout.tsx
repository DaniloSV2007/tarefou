import { useAppTheme } from "@/hooks/useAppTheme";
import { useTranslation } from "react-i18next";
import { Button, Dialog, Portal, Text } from "react-native-paper";

export default function ConfirmLogout({
  isConfirmation,
  setIsConfirmation,
  logout,
  close,
}: {
  isConfirmation: boolean;
  setIsConfirmation: (isConfirmation: boolean) => void;
  logout: () => void;
  close: () => void | void;
}) {
  const theme = useAppTheme();
  const { t } = useTranslation();
  return (
    <Portal>
      <Dialog
        visible={isConfirmation}
        onDismiss={() => setIsConfirmation(false)}
      >
        <Dialog.Title style={{ color: theme.colors.onBackground }}>
          {t("menu.logout", { ns: "components" })}
        </Dialog.Title>
        <Dialog.Content>
          <Text style={{ color: theme.colors.onBackground, fontSize: 18 }}>
            {t("menu.logoutConfirmation", { ns: "components" })}
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            labelStyle={{ color: theme.colors.onBackground }}
            onPress={() => {
              setIsConfirmation(false);
              close();
            }}
          >
            {t("common.cancel", { ns: "components" })}
          </Button>
          <Button
            style={{
              backgroundColor: theme.colors.primary,
              paddingHorizontal: 10,
            }}
            labelStyle={{ color: "white" }}
            onPress={() => {
              logout();
              close();
            }}
          >
            {t("menu.logout", { ns: "components" })}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
