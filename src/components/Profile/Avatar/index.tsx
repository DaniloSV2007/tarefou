import { useAppTheme } from "@/hooks/useAppTheme";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, Alert } from "react-native";
import { Text, FAB, Avatar, Portal } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import imagePlaceholder from "@/assets/Profile/user.png";
import ImageSelection from "./ImageSelection";
import * as SystemUI from "expo-system-ui";
import { useThemeContext } from "@/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AvatarProfile() {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const { isDark } = useThemeContext();

  const [image, setImage] = useState<string | null>(null);
  const placeholder = imagePlaceholder;

  const [isSelectionOpen, setIsSelectionOpen] = useState(false);
  const [menuAnimation, setMenuAnimation] = useState(false);

  useEffect(() => {
    getAvatarImage();
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
  }, [image]);

  const getAvatarImage = async () => {
    const imageUri = await AsyncStorage.getItem("image");
    if (!imageUri) {
      AsyncStorage.setItem("image", "null");
    }
    if (imageUri === "null") {
      setImage(null);
    } else {
      setImage(imageUri);
    }
  };

  const changeAvatar = async (mode: Number) => {
    if (mode === 1) {
      try {
        const result = await ImagePicker.launchCameraAsync();

        if (!result.canceled) {
          setImage(result.assets[0].uri);
        }
      } catch (error) {
        console.log(error);
      }
    } else if (mode === 2) {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          quality: 1,
        });
        if (!result.canceled) {
          setImage(result.assets[0].uri);
          console.log(image);
        }
      } catch (error) {
        console.error(error);
      }
    } else if (mode === 3) {
      setImage(null);
    } else {
      Alert.alert("Erro ao trocar imagem");
    }
  };

  return (
    <View style={styles.nameBox}>
      <View>
        {image ? (
          <Avatar.Image
            source={image ? { uri: image } : { uri: placeholder }}
            size={150}
            style={{
              backgroundColor: theme.custom.cardColor,
              borderColor: theme.custom.cardTaskBackground,
              borderWidth: 1,
            }}
          />
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
            onPress={() => setIsSelectionOpen(true)}
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

      <Text
        style={{
          color: theme.colors.onBackground,
          width: "94%",
          fontSize: 24,
          marginTop: -10,
          margin: -20,
          opacity: 0.8,
        }}
      >
        {t("screens:profileLogged.personalInfo.roleAdmin")}
      </Text>
      <Text
        style={{
          fontWeight: "bold",
          color: theme.colors.onBackground,
          fontSize: 24,
        }}
      >
        Danilo Souza Voiski
      </Text>
      {isSelectionOpen && (
        <Portal>
          <ImageSelection
            image={image}
            isSelectionOpen={isSelectionOpen}
            setIsSelectionOpen={setIsSelectionOpen}
            menuAnimation={menuAnimation}
            setMenuAnimation={setMenuAnimation}
            changeAvatar={changeAvatar}
          />
        </Portal>
      )}
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
