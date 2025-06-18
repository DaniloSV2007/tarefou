import { useAppTheme } from "@/hooks/useAppTheme";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { Appbar, useTheme } from "react-native-paper";

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
          height: 60,
        }}
      >
        <Appbar.Content
          title={title}
          titleStyle={{
            fontSize: 30,
            fontWeight: "bold",
            alignItems: "center",
            color: titleColor,
            height: 32,
            marginLeft: isBackButtonEnable ? -16 : 0,
          }}
        />
        {iconButton != "" && (
          <TouchableOpacity activeOpacity={0.7}>
            <Appbar.Action
              icon={iconButton}
              color={iconColor}
              size={30}
              onPress={onPressButton}
            />
          </TouchableOpacity>
        )}
        {isBackButtonEnable && (
          <Appbar.BackAction
            onPress={backButtonHref}
            size={35}
            color={backButtonColor}
          />
        )}
      </Appbar.Header>
    </View>
  );
}
