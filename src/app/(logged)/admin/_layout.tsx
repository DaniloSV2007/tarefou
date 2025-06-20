import { Tabs, usePathname } from "expo-router";
import CustomTabBar from "@/components/CustomTabBar";
import { routes } from "@/routes/adminRoutes";

export default function AdminLayout() {
  const pathname = usePathname();
  const hideTabBar =
    pathname.startsWith("/admin/teste/") ||
    pathname.startsWith("/admin/profile/") ||
    pathname.startsWith("/admin/home/") ||
    pathname.startsWith("/admin/members/");

  return (
    <Tabs
      tabBar={(props) => (
        <CustomTabBar routesProps={routes} hideTabBar={hideTabBar} />
      )}
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
