import { useAppTheme } from "@/hooks/useAppTheme";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, Alert, Pressable } from "react-native";
import { Text, FAB, Avatar, Portal, IconButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import imagePlaceholder from "@/assets/Profile/user.png";
import * as SystemUI from "expo-system-ui";
import { useThemeContext } from "@/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import Menu from "../Menu";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import MenuButton from "../Menu/MenuButton";

export default function AvatarProfile({
  setImageProp,
  setIsVisible,
  setQrVisible,
}: any) {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const { isDark } = useThemeContext();
  const { token } = useAuth();
  const { isLoggedIn } = useAuth();

  //Profile Picture
  const [image, setImage] = useState<string | null>(null);
  const placeholder = imagePlaceholder;

  //Menu State
  const [isSelectionOpen, setIsSelectionOpen] = useState(false);
  const [menuAnimation, setMenuAnimation] = useState(false);

  //User Info
  const [name, setName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const profileMenuState = useRef<BottomSheetModal>(null);

  const openMenu = useCallback(() => {
    profileMenuState.current?.present();
  }, []);

  const closeMenu = useCallback(() => {
    profileMenuState.current?.close();
  }, []);

  useEffect(() => {
    getAvatarImage();
    getNameAndRole();
  }, []);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(isDark ? "#000" : "#fff");
  }, [isDark]);

  useEffect(() => {
    if (isSelectionOpen) {
      SystemUI.setBackgroundColorAsync(theme.custom.cardColor);
    } else {
      SystemUI.setBackgroundColorAsync(theme.colors.background);
    }
  }, [isSelectionOpen, isDark]);

  useEffect(() => {
    if (image !== null) {
      const imageUri = image;
      AsyncStorage.setItem("image", imageUri);
    } else {
      AsyncStorage.setItem("image", "null");
    }
    setImageProp([{ uri: image }]);
  }, [image]);

  //User Name And Role Functions
  const getNameAndRole = async () => {
    const name = await AsyncStorage.getItem("name");
    const role = await AsyncStorage.getItem("role");

    if (!name && !role) {
      getNameAndRoleDb();
    } else {
      setRole(role);
      setName(name);
    }
  };

  const getNameAndRoleDb = async () => {
    const username = await AsyncStorage.getItem("username");
    try {
      const res = await api.get("/users/" + username, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (res.status === 200) {
        const { name, role } = res.data;
        setName(name);
        setRole(role);
        await AsyncStorage.setItem("name", name);
        await AsyncStorage.setItem("role", role);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //User Avatar Functions
  const getAvatarImageDatabase = async () => {
    if (!isLoggedIn) return;
    const username = await AsyncStorage.getItem("username");
    if (!username) return console.error("Username not found. Are you logged?");

    try {
      const res = await api.get("/users/" + username, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (res.status === 200 && res.data) {
        const { avatar } = res.data;
        setImage(avatar);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAvatarImage = async () => {
    const imageUri = await AsyncStorage.getItem("image");
    if (!imageUri) {
      AsyncStorage.setItem("image", "null");
      getAvatarImageDatabase();
    }
    if (imageUri === "null") {
      getAvatarImageDatabase();
    } else {
      setImage(imageUri);
    }
  };

  const saveAvatarDatabase = async (imageUri: string | null) => {
    const username = await AsyncStorage.getItem("username");

    if (!imageUri && !username) {
      return;
    }

    const formData = new FormData();
    if (username) {
      formData.append("username", username);
    }
    if (imageUri && imageUri !== null) {
      formData.append("avatar", {
        uri: imageUri,
        name: "avatar.jpg",
        type: "image/jpeg",
      } as any);
    }
    try {
      const res = await api.post("/users/uploadAvatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${token}`,
        },
      });

      if (res.status === 200) {
        setImage(imageUri);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const changeAvatar = async (mode: Number) => {
    if (mode === 1) {
      try {
        const result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.5,
          base64: true,
        });

        if (!result.canceled) {
          const base64 = result.assets[0].base64;
          const mimeType = result.assets[0].type || "image/jpeg";
          const dataUri = `data:${mimeType};base64,${base64}`;
          saveAvatarDatabase(dataUri);
        }
      } catch (error) {
        console.error(error);
      }
    } else if (mode === 2) {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          quality: 0.5,
          aspect: [1, 1],
          base64: true,
        });
        if (!result.canceled) {
          const base64 = result.assets[0].base64;
          const mimeType = result.assets[0].type || "image/jpeg";
          const dataUri = `data:${mimeType};base64,${base64}`;
          saveAvatarDatabase(dataUri);
        }
      } catch (error) {
        console.error(error);
      }
    } else if (mode === 3) {
      try {
        await saveAvatarDatabase(null);
      } catch (error) {
        console.error(error);
      }
    } else {
      Alert.alert("Erro ao trocar imagem");
    }
  };

  return (
    <View style={styles.nameBox}>
      <View>
        {image ? (
          <Pressable onPress={() => setIsVisible(true)}>
            <Avatar.Image
              source={image ? { uri: image } : { uri: placeholder }}
              size={150}
              style={{
                backgroundColor: theme.custom.cardColor,
                borderColor: theme.custom.cardTaskBackground,
                borderWidth: 1,
              }}
            />
          </Pressable>
        ) : (
          <Avatar.Icon
            icon={"account"}
            size={150}
            style={{
              backgroundColor: theme.custom.cardColor,
              borderColor: theme.custom.cardTaskBackground,
              borderWidth: 1,
            }}
          />
        )}
        <View style={{ position: "absolute", bottom: 0, right: 0, zIndex: 1 }}>
          <FAB
            icon="camera-outline"
            onPress={openMenu}
            rippleColor={theme.custom.ripple}
            color={theme.colors.onBackground}
            mode="flat"
            style={[
              styles.editButton,
              {
                backgroundColor: theme.custom.cardTaskBackground,
              },
            ]}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          width: "85%",
          marginBottom: -18,
        }}
      >
        <Text
          style={{
            color: theme.colors.onBackground,
            fontSize: 24,
            opacity: 0.8,
          }}
        >
          {role === "MEMBER"
            ? t("profileLogged.personalInfo.roleMember", {
                ns: "screens",
              })
            : t("profileLogged.personalInfo.roleAdmin", {
                ns: "screens",
              })}
        </Text>
        <IconButton
          icon={"qrcode"}
          iconColor={theme.colors.onBackground}
          containerColor={theme.custom.cardTaskBackground}
          style={{ borderRadius: 12 }}
          onPress={() => setQrVisible(true)}
        />
      </View>

      <Text
        style={{
          fontWeight: "bold",
          color: theme.colors.onBackground,
          fontSize: 24,
        }}
      >
        {name}
      </Text>

      <Menu ref={profileMenuState} close={closeMenu}>
        <MenuButton
          text={t("menu.takePhoto", { ns: "components" })}
          icon="camera"
          close={closeMenu}
          onPress={() => changeAvatar(1)}
        />
        <MenuButton
          text={t("menu.gallery", { ns: "components" })}
          icon="image"
          close={closeMenu}
          onPress={() => changeAvatar(2)}
        />
        <MenuButton
          text={t("menu.remove", { ns: "components" })}
          icon="image-off"
          close={closeMenu}
          onPress={() => changeAvatar(3)}
        />
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  nameBox: {
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
    marginTop: 30,
    paddingHorizontal: 20,
    position: "absolute",
    top: 0,
  },
  icon: {
    justifyContent: "center",
    marginLeft: 20,
  },
  editButton: {
    borderRadius: 99,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
