import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import TopBar from "@/components/TopBar";
import { useRouter } from "expo-router";
import { collection, doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/services/FirebaseConfig";
import InfoButon from "@/components/Settings/Account/AccountInfo/InfoButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLanguageContext } from "@/context/LanguageContext";
import { Button } from "react-native-paper";
import { getAuth, sendEmailVerification } from "firebase/auth";

type User = {
  name: string;
  email: string;
  createdAt: Timestamp;
  birthday: Timestamp;
  familyId?: string;
  role: string;
  username: string;
};

export default function AccountInfo() {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const usersCollection = collection(db, "users");
  const { languagePreference } = useLanguageContext();

  const [userData, setUserData] = useState<User | undefined>();
  const [birthday, setBirthday] = useState<string | undefined>();

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      console.error("No userId found");
      return;
    }
    try {
      const userDoc = doc(usersCollection, userId);
      const docRes = await getDoc(userDoc);
      if (docRes.exists()) {
        const data = docRes.data();
        const bthday = formatDate(data.birthday);
        setUserData(data as User);
        setBirthday(bthday);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const formatDate = (created: Timestamp) => {
    if (!created) return;
    const date = new Date(
      created.seconds * 1000 + created.nanoseconds / 1000000
    );

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return languagePreference === 1
      ? `${month}/${day}/${year}`
      : `${day}/${month}/${year}`;
  };

  const handleVerification = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.warn("Nenhum usuário logado!");
        return;
      }

      await sendEmailVerification(user);

      console.log("E-mail de verificação enviado para:", user.email);
      alert("Verifique sua caixa de entrada!");
    } catch (error) {
      console.error("Erro ao enviar e-mail de verificação:", error);
    }
  };

  return (
    <>
      <TopBar
        title={t("settings.general.account.accountInfo.title")}
        isBackButtonEnable
      />
      <View
        className="flex-1 px-6"
        style={{ backgroundColor: theme.colors.background }}
      >
        <View>
          <InfoButon
            title={t("settings.general.account.accountInfo.name")}
            subtitle={userData?.name}
            chevronIcon
          />
          <InfoButon
            title={t("settings.general.account.accountInfo.username")}
            subtitle={userData?.username}
            chevronIcon
          />
          <InfoButon
            title={t("settings.general.account.accountInfo.email")}
            subtitle={userData?.email}
            chevronIcon
          />
          <InfoButon
            title={t("settings.general.account.accountInfo.birthday")}
            subtitle={birthday}
            chevronIcon
          />
          <InfoButon
            title={t("settings.general.account.accountInfo.role")}
            subtitle={
              userData?.role === "MEMBER"
                ? t("register.roleSelection.card.member")
                : t("register.roleSelection.card.familyAdmin")
            }
            infoText={t("settings.general.account.accountInfo.roleInfo")}
          />

          <Button onPress={handleVerification}>Verificar</Button>
        </View>
      </View>
    </>
  );
}
