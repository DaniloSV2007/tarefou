import { useState } from "react";
import { View } from "react-native";
import { Dialog, Menu, Button, Text, Portal } from "react-native-paper";
import { UserType } from "@/app/(logged)/admin/members";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useTranslation } from "react-i18next";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/services/FirebaseConfig";

type Props = {
  user: UserType | undefined;
  setEditVisible: (state: boolean) => void;
  reflesh: () => void;
};

export default function EditMember({ user, setEditVisible, reflesh }: Props) {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const usersCollection = collection(db, "users");

  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user?.role ?? "MEMBER");
  const [loading, setLoading] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [changed, setChanged] = useState(false);

  // Define roles com label e value
  const roles = [
    {
      label: t("members.edit.roleAdmin", { ns: "screens" }),
      value: "FAMILY_ADMIN",
    },
    {
      label: t("members.edit.roleMember", { ns: "screens" }),
      value: "MEMBER",
    },
  ];

  const selectedLabel =
    roles.find((r) => r.value === selectedRole)?.label ?? "";

  const handleChangeRole = async (newRole: string) => {
    if (newRole === selectedRole || !user?.username) return;

    setLoading(true);

    try {
      const q = query(usersCollection, where("username", "==", user?.username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDocSnap = querySnapshot.docs[0];
        const userRef = doc(db, "users", userDocSnap.id);
        console.log(userDocSnap.id);

        await updateDoc(userRef, { role: newRole });

        setSelectedRole(newRole);
        setChanged(true);
      } else {
        console.warn("Usuário não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao mudar cargo:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    const data = { familyId: null };

    try {
      const q = query(usersCollection, where("username", "==", user?.username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userId = querySnapshot.docs[0].id;
        const userDoc = doc(db, "users", userId);
        await updateDoc(userDoc, data);

        reflesh();
        setEditVisible(false);
      }
    } catch (error) {
      console.error("Erro ao remover usuário da família:", error);
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
          if (changed) reflesh();
          setEditVisible(false);
        }}
      >
        <Dialog.Title style={{ fontSize: 28 }}>{user?.name}</Dialog.Title>
        <Dialog.Content style={{ gap: 32, paddingBottom: 48 }}>
          <Text
            variant="headlineSmall"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            {t("members.edit.title", { ns: "screens" })}
          </Text>

          <View style={{ alignItems: "center" }}>
            <Menu
              visible={menuVisible}
              style={{ width: "63%" }}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  labelStyle={{ color: theme.colors.onBackground }}
                  style={{ borderRadius: 5, minWidth: 256 }}
                  onPress={() => setMenuVisible(true)}
                >
                  {selectedLabel}
                </Button>
              }
            >
              {roles.map((role) => (
                <Menu.Item
                  key={role.value}
                  title={role.label}
                  onPress={() => {
                    handleChangeRole(role.value);
                    setMenuVisible(false);
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
              if (changed) reflesh();
              setEditVisible(false);
            }}
            style={{ borderRadius: 12, paddingHorizontal: 5 }}
            disabled={loading}
          >
            {t("common.back", { ns: "components" })}
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
            {t("members.edit.removeFamily", { ns: "screens" })}
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
            {t("members.edit.removeConfirmTitle", { ns: "screens" })}
          </Dialog.Title>
          <Dialog.Content style={{ gap: 32 }}>
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              {t("members.edit.removeConfirmText", {
                ns: "screens",
                name: user?.name?.split(" ")[0],
              })}
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
              {t("common.cancel", { ns: "components" })}
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
              {t("members.edit.removeButton", {
                ns: "screens",
                name: user?.name?.split(" ")[0],
              })}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
