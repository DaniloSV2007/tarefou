import { MD3LightTheme as DefaultTheme } from "react-native-paper";

export const lightTheme = {
  ...DefaultTheme,
  myOwnProperty: true,
  colors: {
    ...DefaultTheme.colors,
    primary: "#337eff",
    onPrimary: "#ffffff",
    background: "#fff",
    onBackground: "#000000",
    surface: "#b0b0b0",
    cardColor: "#e3e3e3",
  },
};
