import { BottomNavigation, Icon, Text, useTheme } from "react-native-paper";
import { usePathname, useRouter } from "expo-router";
import { useThemeContext } from "@/context/ThemeContext";
import { useEffect } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useTabStore } from "@/store/tabStore";

export default function CustomTabBar() {
  const { isDark } = useThemeContext();
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { index, setIndex } = useTabStore();

  const routes = [
    {
      key: "home",
      title: t("navigation.home"),
      icon: "home",
      path: "/tabs/home",
    },
    {
      key: "report",
      title: t("navigation.report"),
      icon: "notebook",
      path: "/tabs/report",
    },
    {
      key: "members",
      title: t("navigation.members"),
      icon: "account-supervisor-circle",
      path: "/tabs/members",
    },
    {
      key: "profile",
      title: t("navigation.profile"),
      icon: "account-circle",
      path: "/tabs/profile",
    },
  ];

  const getTabIndexFromPath = () => {
    const matchedIndex = routes.findIndex((route) =>
      pathname.startsWith(route.path)
    );
    console.log("matchedIndex", matchedIndex);
    console.log("index", index);
    return matchedIndex !== -1 ? matchedIndex : index;
  };

  useEffect(() => {
    const newIndex = getTabIndexFromPath();
    if (newIndex !== index) {
      setIndex(newIndex);
    }
  }, [pathname]);

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
        height: focused ? 20 : 18,
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
        height: 75 + insets.bottom,
        paddingBottom: insets.bottom,
      }}
      renderIcon={renderIcon}
      renderLabel={renderLabel}
    />
  );
}
