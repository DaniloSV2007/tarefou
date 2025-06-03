// app/(auth)/tabs/_layout.tsx
import { Tabs, usePathname, useRouter, useSegments } from "expo-router";
import { BottomNavigation, Icon, Text, useTheme } from "react-native-paper";
import { View } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabBar() {
  const theme = useTheme();
  const { isLoggedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const routes = [
    {
      key: "home",
      title: "Home",
      icon: "home",
      path: "/tabs/home",
    },
    {
      key: "profile",
      title: "Profile",
      icon: "account-circle",
      path: "/tabs/profile",
    },
  ];

  const getTabIndexFromPath = () => {
    const matchedIndex = routes.findIndex((route) =>
      pathname.startsWith(route.path)
    );

    return matchedIndex !== -1 ? matchedIndex : 1;
  };

  const [index, setIndex] = useState(getTabIndexFromPath());

  useEffect(() => {
    const newIndex = getTabIndexFromPath();

    if (newIndex !== index && newIndex) {
      setIndex(newIndex);
      router.replace(routes[newIndex].path);
    }
  }, [pathname]);

  theme.colors.secondaryContainer = "transparent";

  const renderIcon = ({ route, focused }: any) => (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        height: 45,
        width: 45,
        marginTop: focused ? -7 : -5,
        marginLeft: -1,
      }}
    >
      <Icon
        source={route.icon}
        size={focused ? 40 : 35}
        color={focused ? theme.colors.primary : theme.colors.onBackground}
      />
    </View>
  );

  const renderLabel = ({ route, focused }: any) => (
    <Text
      style={{
        fontSize: focused ? 14 : 12,
        textAlign: "center",
        fontWeight: focused ? "bold" : "600",
        color: focused ? theme.colors.primary : theme.colors.onBackground,
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
          setTimeout(() => router.push(routes[newIndex].path), 100);
        }
      }}
      shifting={true}
      labeled={true}
      style={{
        backgroundColor: theme.colors.background,
        borderTopWidth: 1,
        borderTopColor: theme.colors.surface,
        zIndex: 200,
        height: 75 + insets.bottom,
        paddingBottom: insets.bottom,
      }}
      renderIcon={renderIcon}
      renderLabel={renderLabel}
    />
  );
}
