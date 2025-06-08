import { AuthProvider, useAuth } from "@/context/AuthContext";
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
  Button,
  Dialog,
  Divider,
  Icon,
  Portal,
  Text,
  TouchableRipple,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ConfirmLogout from "./ConfirmLogout";
import { useTranslation } from "react-i18next";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function ProfileMenu({ isMenuOpen, setIsMenuOpen }: any) {
  const router = useRouter();
  const theme = useAppTheme();
  const { isLoggedIn, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [animation, setAnimation] = useState(false);
  const [isConfirmation, setIsConfirmation] = useState(false);
  const { t } = useTranslation();

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setAnimation(isMenuOpen);
  }, [isMenuOpen]);

  useEffect(() => {
    let animationSet: Animated.CompositeAnimation | null = null;

    if (animation) {
      animationSet = Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0.5,
          duration: 400,
          useNativeDriver: true,
        }),
      ]);
      animationSet.start();
    } else {
      animationSet = Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]);
      animationSet.start();
    }

    return () => {
      if (animationSet) {
        animationSet.stop();
      }
      translateY.setValue(SCREEN_HEIGHT);
      backdropOpacity.setValue(0);
    };
  }, [animation]);

  const handleClose = () => {
    setAnimation(false);
    // Use requestAnimationFrame to ensure animation starts before state update
    requestAnimationFrame(() => {
      setTimeout(() => {
        setIsMenuOpen(false);
      }, 300);
    });
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
              router.push("/profile/appinfo");
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
              router.push("/profile/settings");
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
        <AuthProvider>
          <ConfirmLogout
            isConfirmation={isConfirmation}
            setIsConfirmation={setIsConfirmation}
            setIsMenuOpen={setIsMenuOpen}
          />
        </AuthProvider>
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
