export default {
  name: "Tarefou!",
  slug: "checklistapp",
  version: "1.1.8",
  scheme: "tarefou",
  icon: "./assets/adaptive-icon.png",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  notification: {
    icon: "./assets/icon-notification.png",
    color: "#ffffff",
  },
  web: {
    bundler: "metro",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.placeholder.appid",
  },
  android: {
    googleServicesFile: process.env.GOOGLE_SERVICES,
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      monochromeImage: "./assets/adaptive-icon-monochrome.png",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
    package: "com.danilosv07.tarefou",
  },
  extra: {
    eas: {
      projectId: "01ceaca2-f8cc-4c37-ace3-6cdcd37403b8",
    },
    router: {},
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/splash-icon-light.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          image: "./assets/splash-icon-dark.png",
          resizeMode: "contain",
          backgroundColor: "#000000",
        },
      },
    ],
    [
      "expo-quick-actions",
      {
        androidIcons: {
          new_task: {
            foregroundImage: "./assets/new-task-icon.png",
            monochromeImage: "./assets/new-task-icon.png",
            backgroundColor: "#fff",
          },
        },
      },
    ],
    "expo-localization",
    "expo-sqlite",
    "expo-web-browser",
  ],
  androidNavigationBar: {
    backgroundColor: "#00000000",
  },
  platforms: ["ios", "android"],
  runtimeVersion: {
    policy: "appVersion",
  },
  updates: {
    url: "https://u.expo.dev/01ceaca2-f8cc-4c37-ace3-6cdcd37403b8",
    checkAutomatically: "ON_ERROR_RECOVERY",
  },
};
