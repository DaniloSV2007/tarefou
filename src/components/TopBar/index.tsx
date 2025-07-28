import { useAppTheme } from "@/hooks/useAppTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Appbar, Badge } from "react-native-paper";
import { db } from "../../../FirebaseConfig";

interface Props {
  title?: string;
  titleColor?: string;
  iconButton?: string;
  iconColor?: string;
  buttonSize?: number;
  onPressButton?: () => void;
  isBackButtonEnable?: boolean;
  backButtonColor?: string;
  barColor?: string;
  backButtonHref?: () => void;
  bottomBorder?: boolean;
  children?: any;
  showNotification?: boolean;
  reflesh?: () => void;
}

const TopBar = forwardRef((props: Props, ref) => {
  const router = useRouter();
  const theme = useAppTheme();
  const notificationCollections = collection(db, "notifications");

  const [notifNumber, setNotifNumber] = useState(0);

  const {
    title = "",
    iconButton = "",
    buttonSize = 24,
    onPressButton = () => {},
    isBackButtonEnable = false,
    backButtonHref = () => router.back(),
    bottomBorder = true,
    children,
    showNotification,
  } = props;

  const titleColor = props.titleColor ?? theme.colors.onBackground;
  const iconColor = props.iconColor ?? theme.colors.primary;
  const backButtonColor = props.backButtonColor ?? theme.colors.onBackground;
  const barColor = props.barColor ?? theme.colors.background;

  const getNotificationsNumber = async () => {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) return;

    try {
      const q = query(notificationCollections, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const notifs = querySnapshot.docs.map((n) => n.data());
        const notViewed = notifs.filter((n) => !n.viewed);
        setNotifNumber(notViewed.length);
      } else {
        setNotifNumber(0);
      }
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    }
  };

  useImperativeHandle(ref, () => ({
    getNotifNum: getNotificationsNumber,
  }));

  useFocusEffect(
    useCallback(() => {
      getNotificationsNumber();
    }, [])
  );

  return (
    <View>
      <Appbar.Header
        style={{
          backgroundColor: barColor,
          borderBottomColor: theme.colors.surface,
          borderBottomWidth: bottomBorder ? 0.5 : 0,
          height: 44,
        }}
      >
        <Appbar.Content
          title={title}
          titleStyle={{
            fontSize: 24,
            fontWeight: "bold",
            alignItems: "center",
            color: titleColor,
            height: 30,
            marginLeft: isBackButtonEnable ? -16 : 0,
          }}
        />

        {showNotification && (
          <View style={styles.iconWithBadge}>
            <Appbar.Action
              icon="bell-outline"
              onPress={() => router.push("/notifications")}
              style={{ margin: 0 }}
            />
            {notifNumber > 0 && <Badge size={8} style={styles.badge} />}
          </View>
        )}

        {iconButton !== "" && (
          <TouchableOpacity activeOpacity={0.7}>
            <Appbar.Action
              icon={iconButton}
              color={iconColor}
              size={buttonSize}
              onPress={onPressButton}
            />
          </TouchableOpacity>
        )}

        {isBackButtonEnable && (
          <Appbar.BackAction
            onPress={backButtonHref}
            size={30}
            color={backButtonColor}
          />
        )}

        {children}
      </Appbar.Header>
    </View>
  );
});

const styles = StyleSheet.create({
  iconWithBadge: {
    position: "relative",
    marginRight: 8,
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#f44336",
    color: "white",
    fontSize: 10,
    zIndex: 1,
  },
});

export default TopBar;
