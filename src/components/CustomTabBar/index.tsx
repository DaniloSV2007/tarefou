import { BottomNavigation, Icon, Text, useTheme } from "react-native-paper";
import { usePathname, useRouter } from "expo-router";
import { useThemeContext } from "@/context/ThemeContext";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CustomTabBar() {
  const { isDark } = useThemeContext();
  const theme = useTheme();
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
      key: "report",
      title: "Report",
      icon: "notebook",
      path: "/tabs/report",
    },
    {
      key: "members",
      title: "Members",
      icon: "account-supervisor-circle",
      path: "/tabs/members",
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

    return matchedIndex !== -1 ? matchedIndex : 3;
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
        position: "absolute",
        borderTopWidth: 1,
        borderTopColor: theme.colors.surface,
        zIndex: 0,
        height: 75 + insets.bottom,
        paddingBottom: insets.bottom,
      }}
      renderIcon={renderIcon}
      renderLabel={renderLabel}
    />
  );
}

// import Home from "@/app/tabs/home";
// import Members from "@/app/tabs/members";
// import Profile from "@/app/tabs/profile";
// import Report from "@/app/tabs/report";
// import { useAuth } from "@/context/AuthContext";
// import { usePathname, router } from "expo-router";
// import { useEffect, useMemo, useState } from "react";
// import { StyleSheet, View } from "react-native";
// import { BottomNavigation, Icon, Text, useTheme } from "react-native-paper";

// export default function BottomNav() {
//   const pathname = usePathname();
//   const theme = useTheme();
//   const { isLoggedIn } = useAuth();

//   const routes = useMemo(() => {
//     const baseRoutes = [
//       { key: "home", title: "Home", icon: "home" },
//       { key: "profile", title: "Profile", icon: "account-circle" },
//     ];

//     if (isLoggedIn) {
//       return [
//         baseRoutes[0],
//         { key: "report", title: "Report", icon: "notebook" },
//         { key: "members", title: "Members", icon: "account-supervisor-circle" },
//         baseRoutes[1],
//       ];
//     }

//     return baseRoutes;
//   }, [isLoggedIn]);

//   // Mapeia path => index, ex: "/tabs/home" => 0
//   const pathToIndex = useMemo(() => {
//     return routes.reduce((acc, route, index) => {
//       acc["/tabs/" + route.key] = index;
//       return acc;
//     }, {} as Record<string, number>);
//   }, [routes]);

//   const [index, setIndex] = useState<number | null>(() => {
//     return pathToIndex[pathname] ?? null;
//   });

//   useEffect(() => {
//     const currentIndex = pathToIndex[pathname];
//     if (currentIndex === undefined) {
//       const fallbackKey = routes[0].key;
//       router.replace("/tabs/" + fallbackKey);
//       setIndex(0);
//     } else if (currentIndex !== index) {
//       setIndex(currentIndex);
//     }
//   }, [pathname, pathToIndex, routes]);

//   if (index === null) {
//     // Rota inválida (como após logout), pode exibir um fallback ou não renderizar
//     return null;
//   }

//   theme.colors.secondaryContainer = "transparent"; // corrigido "transperent"

//   const renderScene = ({ route }: any) => {
//     return (
//       <>
//         <View
//           style={[
//             styles.scene,
//             { display: route.key === routes[index].key ? "flex" : "none" },
//           ]}
//         >
//           {route.key === "home" && <Home />}
//           {route.key === "report" && <Report />}
//           {route.key === "members" && <Members />}
//           {route.key === "profile" && <Profile />}
//         </View>
//       </>
//     );
//   };

//   const renderIcon = ({ route, focused }: any) => (
//     <View
//       style={{
//         alignItems: "center",
//         justifyContent: "center",
//         height: 40,
//         marginTop: focused ? -7 : -5,
//         marginLeft: -1,
//       }}
//     >
//       <Icon
//         source={route.icon}
//         size={focused ? 35 : 30}
//         color={focused ? theme.colors.primary : theme.colors.onBackground}
//       />
//     </View>
//   );

//   const renderLabel = ({ route, focused }: any) => (
//     <Text
//       style={{
//         fontSize: focused ? 14 : 12,
//         textAlign: "center",
//         fontWeight: focused ? "bold" : "600",
//         color: focused ? theme.colors.primary : theme.colors.onBackground,
//       }}
//     >
//       {route.title}
//     </Text>
//   );

//   return (
//     <BottomNavigation
//       navigationState={{ index, routes }}
//       onIndexChange={(newIndex) => {
//         setIndex(newIndex);
//         router.push("/tabs/" + routes[newIndex].key); // sincroniza a URL
//       }}
//       renderScene={renderScene}
//       renderIcon={renderIcon}
//       renderLabel={renderLabel}
//       barStyle={{
//         backgroundColor: theme.colors.background,
//         borderTopWidth: 1,
//         borderTopColor: theme.colors.surface,
//         zIndex: 200,
//         height: 80,
//       }}
//       shifting={false}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   scene: {
//     flex: 1,
//   },
// });
