import "react-native-paper";

declare module "react-native-paper" {
  interface MD3Colors {
    cardColor?: string;
  }
  interface MD3Theme {
    myOwnProperty?: boolean;
  }
}
