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
import { Divider, Icon, Portal, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function ProfileMenu({ isMenuOpen, setIsMenuOpen }: any) {
  const router = useRouter();
  const theme = useAppTheme();
  const { isLoggedIn, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [animation, setAnimation] = useState(false);

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setAnimation(isMenuOpen);
  }, [isMenuOpen]);

  useEffect(() => {
    if (animation) {
      Animated.parallel([
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
      ]).start();
    } else {
      Animated.parallel([
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
      ]).start();
    }
  }, [animation]);

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
            onPress={() => {
              setAnimation(false);
              setTimeout(() => {
                setIsMenuOpen(false);
              }, 300);
            }}
          ></TouchableOpacity>
        </Animated.View>
        <Animated.View
          style={[
            styles.buttonSection,
            {
              backgroundColor: theme.custom.cardColor,
              paddingBottom: 24 + insets.bottom,
              transform: [{ translateY }],
            },
          ]}
        >
          <View
            style={{
              height: "20%",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                backgroundColor: theme.colors.onBackground,
                paddingHorizontal: 20,
                paddingVertical: 5,
                borderRadius: 40,
              }}
            ></View>
          </View>
          <Divider style={{ backgroundColor: theme.colors.onBackground }} />
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/profile/appinfo")}
          >
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
              Application Info
            </Text>
          </TouchableOpacity>
          <Divider style={{ backgroundColor: theme.colors.onBackground }} />
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/profile/settings")}
          >
            <Icon source={"cog"} size={25} color={theme.colors.onBackground} />
            <Text
              style={[
                styles.buttonTextMenu,
                { color: theme.colors.onBackground },
              ]}
            >
              Settings
            </Text>
          </TouchableOpacity>
          <Divider style={{ backgroundColor: theme.colors.onBackground }} />
          {isLoggedIn && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                logout();
                setIsMenuOpen(false);
              }}
            >
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
                Log Out
              </Text>
            </TouchableOpacity>
          )}

          <Divider style={{ backgroundColor: theme.colors.onBackground }} />
        </Animated.View>
      </View>
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
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
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
