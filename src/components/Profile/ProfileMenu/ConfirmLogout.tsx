import { useAppTheme } from "@/hooks/useAppTheme";
import { useTranslation } from "react-i18next";
import { Button, Dialog, Portal, Text } from "react-native-paper";

export default function ConfirmLogout({
  isConfirmation,
  setIsConfirmation,
  setIsMenuOpen,
  logout,
}: {
  isConfirmation: boolean;
  setIsConfirmation: (isConfirmation: boolean) => void;
  setIsMenuOpen: (isMenuOpen: boolean) => void;
  logout: () => void;
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
          {t("components:profileMenu.logout")}
        </Dialog.Title>
        <Dialog.Content>
          <Text style={{ color: theme.colors.onBackground, fontSize: 18 }}>
            {t("components:profileMenu.logoutConfirmation")}
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            labelStyle={{ color: theme.colors.onBackground }}
            onPress={() => {
              setIsConfirmation(false);
              setIsMenuOpen(false);
            }}
          >
            {t("components:common.cancel")}
          </Button>
          <Button
            style={{ backgroundColor: theme.colors.primary }}
            labelStyle={{ color: "white" }}
            onPress={() => {
              logout();
              setIsMenuOpen(false);
            }}
          >
            {t("components:profileMenu.logout")}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
