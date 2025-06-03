import "react-native-paper";

// Estende o tema para aceitar propriedades customizadas

declare module "react-native-paper" {
  interface MD3Colors {
    cardColor?: string;
  }
  interface MD3Theme {
    myOwnProperty?: boolean;
  }
}
