import CustomTabBar from "@/components/CustomTabBar";
import { routes } from "@/routes/userRoutes";
import { Tabs, usePathname } from "expo-router";

export default function UserLayout() {
  const pathname = usePathname();
  const hideTabBar =
    pathname.startsWith("/user/profile/") ||
    pathname.startsWith("/user/home/") ||
    pathname.startsWith("/user/rewards/") ||
    pathname.startsWith("/user/tasks/");

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
