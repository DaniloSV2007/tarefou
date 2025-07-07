import Constants from "expo-constants";

export const routes = [
  { key: "home", title: "Home", icon: "home", path: "/user/home" },
  { key: "tasks", title: "Tasks", icon: "notebook", path: "/user/tasks" },

  ...(Constants.appOwnership === "expo"
    ? [
        {
          key: "rewards",
          title: "Rewards",
          icon: "trophy-variant",
          path: "/user/rewards",
        },
      ]
    : []),
  {
    key: "profile",
    title: "Profile",
    icon: "account-circle",
    path: "/user/profile",
  },
];
