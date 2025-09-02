import { useTranslation } from "react-i18next";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button,  Text } from "react-native-paper";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Checkbox, ActivityIndicator } from "react-native-paper";
import { useState } from "react";

interface TermsOfServiceProps {
  onConfirm?: () => void;
  isLoading?: boolean; // eslint-disable-next-line
  setPage: (page: any) => void;
}

export default function TermsOfService({
  onConfirm,
  isLoading,
  setPage,
}: TermsOfServiceProps) {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const [isTermsChecked, setIsTermsChecked] = useState(false);

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.content, { color: theme.colors.onBackground }]}>
        {t("register.termsOfService.content")}
      </Text>
      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <Checkbox.Item
          label={t("register.termsOfService.checkbox")}
          status={isTermsChecked ? "checked" : "unchecked"}
          position="leading"
          onPress={() => setIsTermsChecked((prev) => !prev)}
          labelStyle={{ color: theme.colors.onBackground }}
        />
      </View>
      <View style={styles.actions}>
        <Button
          labelStyle={{ color: theme.colors.onBackground }}
          onPress={() => {
            setPage(1);
          }}
        >
          {t("common.cancel", {ns:'components'})}
        </Button>
        <Button
          style={
            isTermsChecked
              ? { backgroundColor: theme.colors.primary }
              : { backgroundColor: theme.colors.surfaceDisabled }
          }
          labelStyle={{ color: "white", fontSize: 20 }}
          contentStyle={{
            alignItems: "center",
            justifyContent: "center",
            minWidth: 75,
          }}
          onPress={onConfirm}
          disabled={!isTermsChecked || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" size={20} />
          ) : (
            t("common.confirm",{ns:'components'})
          )}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    padding: 12,
    backgroundColor: "transparent",
    borderRadius: 12,
  },
  content: {
    fontSize: 20,
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 8,
  },
});
