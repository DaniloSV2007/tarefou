import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { Appbar, useTheme } from "react-native-paper";

interface Props {
  title: string;
  titleColor?: string;
  iconButton?: string;
  iconColor?: string;
  buttonSize?: number;
  onPressButton?: () => void | void;
  isBackButtonEnable?: boolean;
  backButtonColor?: string;
  barColor?: string;
  backButtonHref?: () => void | void;
}

export default function TopBar({
  title,
  titleColor = "black",
  iconButton = "",
  iconColor = "black",
  buttonSize = 24,
  onPressButton = () => {},
  isBackButtonEnable = false,
  backButtonColor = "black",
  barColor = "white",
  backButtonHref = () => {
    const router = useRouter();
    router.back();
  },
  ...rest
}: Props) {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View>
      <Appbar.Header
        style={{
          backgroundColor: barColor,
          borderBottomColor: theme.colors.surface,
          borderBottomWidth: 1,
        }}
      >
        <Appbar.Content
          title={title}
          titleStyle={{
            fontSize: 30,
            fontWeight: "bold",
            color: titleColor,
            height: 32,
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
