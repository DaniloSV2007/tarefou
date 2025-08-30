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
  const auth = getAuth();
  const { languagePreference } = useLanguageContext();

  const [userData, setUserData] = useState<User | undefined>();
  const [birthday, setBirthday] = useState<string | undefined>();

  const [userDataString, setUserDataString] = useState("");

  const provider = auth.currentUser?.providerData[0].providerId;

  console.log(provider);

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      const data = encodeURIComponent(JSON.stringify(userData));
      setUserDataString(data);
    }
  }, [userData]);

  const getUserData = async () => {
    const userId = auth.currentUser?.uid as string;
    if (!userId) {
      console.error("No userId found");
      return;
    }
    try {
      const userRef = doc(usersCollection, userId);
      const privateDataDoc = doc(usersCollection, userId, "private", "data");

      const privateData = await getDoc(privateDataDoc);
      const user = await getDoc(userRef);

      if (user.exists() && privateData.exists()) {
        const userData = user.data();
        const userPrivateData = privateData.data();

        const data = {
          ...userData,
          ...userPrivateData,
        };

        const bthday = formatDate(userData.birthday);

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
            onPress={() =>
              provider === "password"
                ? router.push({
                    pathname: "/(logged)/settings/account/info/name/[user]",
                    params: {
                      user: userDataString,
                    },
                  })
                : {}
            }
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
        </View>
      </View>
    </>
  );
}
