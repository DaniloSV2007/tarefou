import { useAppTheme } from "@/hooks/useAppTheme";
import { useTranslation } from "react-i18next";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Icon, Text } from "react-native-paper";

interface RoleSelectionProps { // eslint-disable-next-line
  setPage: (page: any) => void;
  setRole: (role: string) => void;
  age: number;
}

export default function RoleSelection({
  setPage,
  setRole,
  age,
}: RoleSelectionProps) {
  const theme = useAppTheme();
  const { t } = useTranslation();

  const handleRoleSelection = (role: string) => {
    setRole(role);
    if (role === "MEMBER") {
      setPage((prev: number) => prev + 2);
    } else {
      setPage((prev: number) => prev + 1);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.card,
            {
              backgroundColor: theme.custom.cardTaskBackground,
              borderColor: theme.colors.primary,
            },
          ]}
          onPress={() => handleRoleSelection("MEMBER")}
        >
          <Icon source="account" size={64} />
          <Text style={styles.cardText}>
            {t("register.roleSelection.card.member")}
          </Text>
        </TouchableOpacity>

        {age >= 18 && (
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.card,
              {
                backgroundColor: theme.custom.cardTaskBackground,
                borderColor: theme.colors.primary,
              },
            ]}
            onPress={() => handleRoleSelection("FAMILY_ADMIN")}
          >
            <Icon source="account-cog" size={64} />
            <Text style={styles.cardText}>
              {t("register.roleSelection.card.familyAdmin")}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            style={[
              styles.backButton,
              { backgroundColor: theme.custom.cardTaskBackground },
            ]}
            labelStyle={[
              styles.buttonText,
              { color: theme.colors.onBackground },
            ]}
            children={t("common.back", { ns: "components" })}
            onPress={() => setPage((prev: number) => prev - 1)}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 16,
  },
  card: {
    borderRadius: 12,
    padding: 4,
    width: 192,
    height: 192,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  cardText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 8,
    alignItems: "baseline",
    marginTop: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderColor: "#666",
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "500",
    color: "white",
  },
});
