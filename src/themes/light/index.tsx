import { MD3LightTheme as DefaultTheme } from "react-native-paper";

type CustomColors = {
  cardColor: string;
};

export const lightTheme = {
  ...DefaultTheme,
  custom: {
    cardColor: "#e3e3e3",
    ripple: "rgba(0, 0, 0, .24)",
  },
  colors: {
    ...DefaultTheme.colors,
    primary: "#337eff",
    onPrimary: "#ffffff",
    background: "#fff",
    onBackground: "#000000",
    surface: "#b0b0b0",
  },
};
