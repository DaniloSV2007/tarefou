import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Button, Dialog, Portal, Text } from "react-native-paper";

export default function ConfirmLogout({
  isConfirmation,
  setIsConfirmation,
  setIsMenuOpen,
}: {
  isConfirmation: boolean;
  setIsConfirmation: (isConfirmation: boolean) => void;
  setIsMenuOpen: (isMenuOpen: boolean) => void;
}) {
  const theme = useAppTheme();
  const { logout } = useAuth();
  return (
    <Portal>
      <Dialog
        visible={isConfirmation}
        onDismiss={() => setIsConfirmation(false)}
      >
        <Dialog.Title style={{ color: theme.colors.onBackground }}>
          Logout
        </Dialog.Title>
        <Dialog.Content>
          <Text style={{ color: theme.colors.onBackground, fontSize: 18 }}>
            Are you sure you want to log out?
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
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: theme.colors.primary }}
            labelStyle={{ color: "white" }}
            onPress={() => {
              logout();
              setIsMenuOpen(false);
            }}
          >
            Confirm
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
