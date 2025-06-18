import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Divider,
  Icon,
  Portal,
  Text,
  TouchableRipple,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ConfirmLogout from "./ConfirmLogout";
import { useTranslation } from "react-i18next";

interface ProfileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  menuAnimation: boolean;
  setMenuAnimation: (value: boolean) => void;
}

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function ProfileMenu({
  isMenuOpen,
  setIsMenuOpen,
  menuAnimation,
  setMenuAnimation,
}: ProfileMenuProps) {
  const router = useRouter();
  const theme = useAppTheme();
  const { isLoggedIn, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [isConfirmation, setIsConfirmation] = useState(false);
  const { t } = useTranslation();

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setMenuAnimation(isMenuOpen);
  }, [isMenuOpen]);

  useEffect(() => {
    let animationSet: Animated.CompositeAnimation | null = null;

    if (menuAnimation) {
      animationSet = Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0.5,
          duration: 400,
          useNativeDriver: false,
        }),
      ]);
      animationSet.start();
    } else {
      animationSet = Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT - 100,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }),
      ]);
      animationSet.start();
    }

    return () => {
      if (animationSet) {
        animationSet.stop();
      }
    };
  }, [menuAnimation]);

  const handleClose = () => {
    setMenuAnimation(false);

    setTimeout(() => {
      setIsMenuOpen(false);
    }, 400);
  };

  return (
    <Portal>
      <View style={styles.menuBoxContainer}>
        <Animated.View
          style={{
            height: "102%",
            backgroundColor: "#000",
            opacity: backdropOpacity,
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={{ width: "100%", height: "100%" }}
            onPress={handleClose}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.buttonSection,
            {
              backgroundColor: theme.custom.cardColor,
              paddingBottom: insets.bottom,
              transform: [{ translateY }],
            },
          ]}
        >
          <View
            style={{
              width: "100%",
              paddingVertical: 12,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: theme.colors.onBackground,
                paddingHorizontal: 20,
                paddingVertical: 3,
                borderRadius: 40,
              }}
            ></View>
          </View>
          <Divider style={{ backgroundColor: theme.colors.onBackground }} />

          <TouchableRipple
            style={styles.button}
            rippleColor={theme.custom.ripple}
            onPress={() => {
              setIsMenuOpen(false);
              router.push("/admin/profile/appinfo");
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon
                source={"information-outline"}
                size={25}
                color={theme.colors.onBackground}
              />
              <Text
                style={[
                  styles.buttonTextMenu,
                  { color: theme.colors.onBackground },
                ]}
              >
                {t("components:profileMenu.appInfo")}
              </Text>
            </View>
          </TouchableRipple>
          <Divider style={{ backgroundColor: theme.colors.onBackground }} />
          <TouchableRipple
            style={styles.button}
            onPress={() => {
              setIsMenuOpen(false);
              router.push("/admin/profile/settings");
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon
                source={"cog"}
                size={25}
                color={theme.colors.onBackground}
              />
              <Text
                style={[
                  styles.buttonTextMenu,
                  { color: theme.colors.onBackground },
                ]}
              >
                {t("components:profileMenu.settings")}
              </Text>
            </View>
          </TouchableRipple>

          <Divider style={{ backgroundColor: theme.colors.onBackground }} />

          {isLoggedIn && (
            <TouchableRipple
              style={styles.button}
              onPress={() => {
                setIsConfirmation(true);
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon
                  source={"logout"}
                  size={25}
                  color={theme.colors.onBackground}
                />
                <Text
                  style={[
                    styles.buttonTextMenu,
                    { color: theme.colors.onBackground },
                  ]}
                >
                  {t("components:profileMenu.logout")}
                </Text>
              </View>
            </TouchableRipple>
          )}

          <Divider style={{ backgroundColor: theme.colors.onBackground }} />
        </Animated.View>
      </View>
      {isConfirmation && (
        <ConfirmLogout
          isConfirmation={isConfirmation}
          setIsConfirmation={setIsConfirmation}
          setIsMenuOpen={setIsMenuOpen}
          logout={logout}
        />
      )}
    </Portal>
  );
}

const styles = StyleSheet.create({
  menuBoxContainer: {
    flex: 1,
    position: "absolute",
    backgroundColor: "transparent",
    height: "100%",
    width: "100%",
  },
  buttonSection: {
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    position: "absolute",
    bottom: 0,
  },
  button: {
    height: 50,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 40,
    flexDirection: "row",
  },
  buttonTextMenu: {
    fontSize: 25,
    color: "#fff",
    fontWeight: "black",
    marginLeft: 20,
  },
});
