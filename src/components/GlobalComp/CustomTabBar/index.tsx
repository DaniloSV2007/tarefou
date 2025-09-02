import { BottomNavigation, Icon, Text, useTheme } from "react-native-paper";
import { usePathname, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

type AppRoutes = {
  key: string,
  title: string,
  icon:string,
  path:string
}

type TabBarRenderProps = {
  route: AppRoutes,
  focused: boolean
}

interface TabBarProps {
  routesProps: AppRoutes[];
}



export default function CustomTabBar({ routesProps }: TabBarProps) {
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
  }, [pathname]);

  const renderIcon = ({ route, focused }: TabBarRenderProps) => (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        marginTop: focused ? -12 : -12,
      }}
    >
      <Icon
        source={route.icon}
        size={30}
        color={focused ? theme.colors.primary : theme.colors.onSurface}
      />
    </View>
  );
  
  const renderLabel = ({ route, focused }: TabBarRenderProps) => {
    const currentRoute = "routes."+route.key
    return(<Text
      style={{
        fontSize: 12,
        fontWeight: focused ? "bold" : "normal",
        color: focused ? theme.colors.primary : theme.colors.onSurface,
        textAlign: "center",
        marginTop: -16,
      }}
    > 
    {t(currentRoute as unknown as [])}
    </Text>)}
  ;

  return (
    <BottomNavigation.Bar
      navigationState={{ index, routes }}
      onTabPress={({ route }: {
        route:AppRoutes
      }) => {
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
        height: 50 + insets.bottom,
        paddingBottom: insets.bottom,
        borderTopColor: theme.colors.surface,
        borderTopWidth: 0.5,
      }}
    />
  );
}
