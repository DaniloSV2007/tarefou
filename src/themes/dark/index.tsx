import { MD3DarkTheme as DefaultTheme } from "react-native-paper";

export const darkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#335eff",
    onPrimary: "#ffffff",
    background: "#000",
    onBackground: "#ffffff",
    surface: "#333333",
    cardColor: "#18161c",
    ripple: "rgba(255, 255, 255, .24)",
    cardTaskBackground: "#201e24",
    inputFocusBorder: "#403c49",
  },
};
