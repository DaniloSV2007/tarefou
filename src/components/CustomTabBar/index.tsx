import { BottomNavigation, Icon, Text, useTheme } from "react-native-paper";
import { usePathname, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect, useRef } from "react";
import { View } from "react-native";

const routes = [
  { key: "home", title: "Home", icon: "home", path: "/admin/home" },
  { key: "report", title: "Report", icon: "notebook", path: "/admin/report" },
  {
    key: "members",
    title: "Members",
    icon: "account-group",
    path: "/admin/members",
  },
  {
    key: "profile",
    title: "Profile",
    icon: "account-circle",
    path: "/admin/profile",
  },
];

export default function CustomTabBar() {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const currentRoute = useRef(0);

  useEffect(() => {
    const newIndex = routes.findIndex((route) =>
      pathname.startsWith(route.path)
    );
    if (newIndex !== -1) {
      currentRoute.current = newIndex;
      setIndex(newIndex);
    }
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
      {route.title}
    </Text>
  );

  return (
    <BottomNavigation.Bar
      navigationState={{ index, routes }}
      onTabPress={({ route }: any) => {
        const newIndex = routes.findIndex((r) => r.key === route.key);
        if (newIndex !== -1 && newIndex !== index) {
          setIndex(newIndex);
          router.push(routes[newIndex].path);
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
      }}
    />
  );
}
