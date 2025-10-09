import { Icon, Text } from "react-native-paper";
import { usePathname, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "@/context/ThemeContext";
import { BlurView } from "expo-blur";

type AppRoutes = {
  key: string;
  title: string;
  icon: string;
  path: string;
};

interface TabBarProps {
  routesProps: AppRoutes[];
}

export default function CustomTabBar({ routesProps }: TabBarProps) {
  const { theme } = useThemeContext();
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const { t } = useTranslation();

  const routes = routesProps;

  useEffect(() => {
    const newIndex = routes.findIndex((route) =>
      pathname.startsWith(route.path),
    );
    if (newIndex !== -1) {
      setIndex(newIndex);
    }
  }, [pathname]);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <BlurView
        intensity={theme.dark ? 90 : 60}
        tint={theme.dark ? "dark" : "light"}
        experimentalBlurMethod="dimezisBlurView"
        style={styles.blurView}
      >
        <View style={styles.tabBar}>
          {routes.map((route, i) => {
            const focused = i === index;
            return (
              <Pressable
                key={route.key}
                onPress={() => router.replace(route.path)}
                style={styles.tab}
              >
                <View
                  style={{
                    backgroundColor: focused
                      ? theme.colors.secondaryContainer
                      : "transparent",
                    borderRadius: 16,
                    paddingHorizontal: 20,
                  }}
                >
                  <Icon
                    source={route.icon}
                    size={24}
                    color={
                      focused
                        ? theme.colors.onSecondaryContainer
                        : theme.colors.onSurfaceVariant
                    }
                  />
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: focused ? "bold" : "normal",
                    color: focused
                      ? theme.colors.onSurface
                      : theme.colors.onSurfaceVariant,
                  }}
                >
                  {/*! Do not change*/}
                  {t(("routes." + route.key) as unknown as [])}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  blurView: {
    marginHorizontal: 48,
    borderRadius: 30,
    overflow: "hidden",
  },
  tabBar: {
    flexDirection: "row",
    height: 65,
    alignItems: "center",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
});
