import { MD3DarkTheme as DefaultTheme } from "react-native-paper";

export const darkTheme = {
  ...DefaultTheme,
  myOwnProperty: true,
  colors: {
    ...DefaultTheme.colors,
    primary: "#335eff",
    onPrimary: "#ffffff",
    background: "#000",
    onBackground: "#ffffff",
    surface: "#333333",
    cardColor: "#18161c",
  },
};
