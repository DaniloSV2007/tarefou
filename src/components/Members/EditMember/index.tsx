import { useState } from "react";
import { View } from "react-native";
import { Dialog, Menu, Button, Text, Portal } from "react-native-paper";

import { UserType } from "@/app/(logged)/admin/members";
import api from "@/services/api";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useTranslation } from "react-i18next";

type Props = {
  user: UserType | undefined;
  setEditVisible: (state: boolean) => void;
  reflesh: () => void | void;
};

export default function EditMember({ user, setEditVisible, reflesh }: Props) {
  const theme = useAppTheme();
  const { t } = useTranslation();

  const [visible, setVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user?.role);
  const [selected, setSelected] = useState(
    user?.role === "MEMBER" ? "Member" : "Admin"
  );

  const [loading, setLoading] = useState(false);

  const [confirmationVisible, setConfirmationVisible] = useState(false);

  const [changed, setChanged] = useState(false);

  const handleChangeRole = async (selectedOption: string) => {
    setLoading(true);
    if (selectedOption === selected) {
      setLoading(false);
      return;
    }
    const data = {
      role: selectedOption === "Member" ? "MEMBER" : "FAMILY_ADMIN",
    };
    try {
      const res = await api.put("/users/" + user?.username, data);

      if (res.status === 200) {
        setSelected(selectedOption);
        setSelectedRole(
          selectedOption === "Member" ? "MEMBER" : "FAMILY_ADMIN"
        );
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    const data = {
      familyId: null,
    };
    try {
      const res = await api.put("/users/" + user?.username, data);

      if (res.data.code === 200) {
        reflesh();
        setEditVisible(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Dialog
        visible={true}
        dismissable={!loading}
        onDismiss={() => {
          reflesh();
          setEditVisible(false);
        }}
      >
        <Dialog.Title style={{ fontSize: 28 }}>{user?.name}</Dialog.Title>
        <Dialog.Content style={{ gap: 32, paddingBottom: 48 }}>
          <Text
            variant="headlineSmall"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            User Role
          </Text>
          <View style={{ alignItems: "center" }}>
            <Menu
              visible={visible}
              onDismiss={() => setVisible(false)}
              style={{ width: "63%" }}
              anchor={
                <Button
                  mode="outlined"
                  labelStyle={{ color: theme.colors.onBackground }}
                  style={{ borderRadius: 5, minWidth: 256 }}
                  onPress={() => setVisible(true)}
                >
                  {selected}
                </Button>
              }
            >
              {["Admin", "Member"].map((option) => (
                <Menu.Item
                  key={option}
                  title={option}
                  style={{}}
                  onPress={() => {
                    handleChangeRole(option);
                    setVisible(false);
                    setChanged(true);
                  }}
                />
              ))}
            </Menu>
          </View>
        </Dialog.Content>
        <Dialog.Actions style={{ justifyContent: "space-between" }}>
          <Button
            mode="outlined"
            textColor={theme.colors.onBackground}
            onPress={() => {
              changed && reflesh();
              setEditVisible(false);
            }}
            style={{ borderRadius: 12, paddingHorizontal: 5 }}
            disabled={loading}
          >
            Back
          </Button>
          <Button
            mode="contained"
            buttonColor="red"
            textColor="white"
            onPress={() => setConfirmationVisible(true)}
            style={{ borderRadius: 12, paddingHorizontal: 5 }}
            disabled={loading}
            rippleColor={theme.custom.ripple}
          >
            Remove from Family
          </Button>
        </Dialog.Actions>
      </Dialog>

      <Portal>
        <Dialog
          visible={confirmationVisible}
          dismissable={!loading}
          onDismiss={() => setConfirmationVisible(false)}
        >
          <Dialog.Title style={{ fontSize: 28 }}>
            Remove Confirmation
          </Dialog.Title>
          <Dialog.Content style={{ gap: 32 }}>
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              Are you sure to remove {user?.name.split(" ")[0]} from your
              family?
            </Text>
          </Dialog.Content>
          <Dialog.Actions style={{ justifyContent: "space-between" }}>
            <Button
              mode="outlined"
              textColor={theme.colors.onBackground}
              onPress={() => setConfirmationVisible(false)}
              style={{ borderRadius: 12, paddingHorizontal: 5 }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              buttonColor="red"
              textColor="white"
              onPress={handleRemove}
              style={{ borderRadius: 12, paddingHorizontal: 5 }}
              disabled={loading}
              rippleColor={theme.custom.ripple}
            >
              Remove {user?.name.split(" ")[0]}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
