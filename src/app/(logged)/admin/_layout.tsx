import { Tabs, usePathname } from "expo-router";
import CustomTabBar from "@/components/CustomTabBar";

export default function LoggedTabsLayout() {
  const pathname = usePathname();
  const hideTabBar =
    pathname.startsWith("/admin/teste/") ||
    pathname.startsWith("/admin/profile/") ||
    pathname.startsWith("/admin/home/") ||
    pathname.startsWith("/admin/members/");

  return (
    <Tabs
      tabBar={(props) => !hideTabBar && <CustomTabBar />}
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
