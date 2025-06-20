import { BottomNavigation, Icon, Text, useTheme } from "react-native-paper";
import { usePathname, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

interface TabBarProps {
  routesProps: any[];
  hideTabBar: boolean;
}

export default function CustomTabBar({ routesProps, hideTabBar }: TabBarProps) {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const currentRoute = useRef(0);
  const { t } = useTranslation();

  const routes = routesProps;

  useEffect(() => {
    const newIndex = routes.findIndex((route) =>
      pathname.startsWith(route.path)
    );
    if (newIndex !== -1) {
      currentRoute.current = newIndex;
      setIndex(newIndex);
    }
    console.log(index);
  }, [pathname]);

  const renderIcon = ({ route, focused }: any) => (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        marginTop: focused ? -8 : -4,
      }}
    >
      <Icon
        source={route.icon}
        size={focused ? 34 : 28}
        color={focused ? theme.colors.primary : theme.colors.onSurface}
      />
    </View>
  );

  const renderLabel = ({ route, focused }: any) => (
    <Text
      style={{
        fontSize: focused ? 13 : 12,
        fontWeight: focused ? "bold" : "normal",
        color: focused ? theme.colors.primary : theme.colors.onSurface,
        textAlign: "center",
        marginTop: focused ? -8 : 0,
      }}
    >
      {t(`routes.${route.key}`)}
    </Text>
  );

  return (
    <BottomNavigation.Bar
      navigationState={{ index, routes }}
      onTabPress={({ route }: any) => {
        const newIndex = routes.findIndex((r) => r.key === route.key);
        if (newIndex !== -1 && newIndex !== index) {
          setIndex(newIndex);
          router.replace(routes[newIndex].path);
        }
      }}
      shifting={true}
      labeled={true}
      renderIcon={renderIcon}
      renderLabel={renderLabel}
      style={{
        backgroundColor: theme.colors.background,
        height: 65 + insets.bottom,
        paddingBottom: insets.bottom,
        borderTopColor: theme.colors.surface,
        borderTopWidth: 0.5,
        display: hideTabBar ? "none" : "flex",
      }}
    />
  );
}
