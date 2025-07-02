import { useAppTheme } from "@/hooks/useAppTheme";
import { useRouter } from "expo-router";
import { Children } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Appbar, Badge, useTheme } from "react-native-paper";

interface Props {
  title: void | string;
  titleColor?: void | string;
  iconButton?: void | string;
  iconColor?: void | string;
  buttonSize?: number;
  onPressButton?: () => void | void;
  isBackButtonEnable?: boolean;
  backButtonColor?: void | string;
  barColor?: void | string;
  backButtonHref?: () => void | void;
  bottomBorder?: boolean;
  children?: any;
  showNotification?: boolean;
}

export default function TopBar(props: Props) {
  const router = useRouter();
  const theme = useAppTheme();

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
              onPress={() => {}}
              style={{ margin: 0 }}
            />
            <Badge style={styles.badge} size={8}></Badge>
          </View>
        )}

        {iconButton != "" && (
          <TouchableOpacity activeOpacity={0.7}>
            <Appbar.Action
              icon={iconButton}
              color={iconColor}
              size={buttonSize ?? 20}
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
}

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
