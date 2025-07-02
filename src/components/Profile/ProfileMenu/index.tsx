import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useRouter } from "expo-router";
import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useMemo,
  useCallback,
} from "react";
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
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

export type Ref = BottomSheetModal;

interface ProfileMenuProps {
  isAdmin?: boolean;
  close: () => void | void;
}

export const ProfileMenu = forwardRef<Ref, ProfileMenuProps>(
  function ProfileMenu({ isAdmin = false, close }, ref) {
    const router = useRouter();
    const theme = useAppTheme();
    const { isLoggedIn, logout } = useAuth();
    const insets = useSafeAreaInsets();
    const [isConfirmation, setIsConfirmation] = useState(false);
    const { t } = useTranslation();

    const snapPoints = useMemo(() => ["23%"], []);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          appearsOnIndex={1}
          disappearsOnIndex={-1}
          {...props}
        />
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: theme.custom.cardColor,
          paddingBottom: insets.bottom,
          borderTopStartRadius: 32,
          borderTopEndRadius: 32,
        }}
        handleIndicatorStyle={{ height: 8 }}
        handleStyle={{ padding: 12 }}
      >
        <BottomSheetView>
          <Divider
            style={{ backgroundColor: theme.colors.surface, height: 0.5 }}
          />

          <TouchableRipple
            style={styles.button}
            rippleColor={theme.custom.ripple}
            onPress={() => {
              close();
              if (isAdmin) {
                router.push("/appinfo");
              } else {
                router.push("/appinfo");
              }
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
                {t("profileMenu.appInfo", { ns: "components" })}
              </Text>
            </View>
          </TouchableRipple>
          <Divider
            style={{ backgroundColor: theme.colors.surface, height: 0.5 }}
          />
          <TouchableRipple
            style={styles.button}
            onPress={() => {
              close();
              if (isAdmin) {
                router.push("/settings");
              } else {
                router.push("/settings");
              }
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
                {t("profileMenu.settings", { ns: "components" })}
              </Text>
            </View>
          </TouchableRipple>

          <Divider
            style={{ backgroundColor: theme.colors.surface, height: 0.5 }}
          />

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
                  {t("profileMenu.logout", { ns: "components" })}
                </Text>
              </View>
            </TouchableRipple>
          )}

          <Divider
            style={{ backgroundColor: theme.colors.surface, height: 0.5 }}
          />
          {isConfirmation && (
            <ConfirmLogout
              isConfirmation={isConfirmation}
              setIsConfirmation={setIsConfirmation}
              logout={logout}
              close={close}
            />
          )}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default ProfileMenu;

const styles = StyleSheet.create({
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
