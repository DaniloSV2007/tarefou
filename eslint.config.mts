import js from "@eslint/js";
import ts from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
// @ts-ignore
import reactNative from "eslint-plugin-react-native";
import importPlugin from "eslint-plugin-import";
import path from "path";

export default ts.config(js.configs.recommended, ...ts.configs.recommended, {
  files: ["**/*.{ts,tsx,js,jsx}"],
  ignores: [
    "node_modules",
    "dist",
    "build",
    ".expo",
    ".expo-shared",
    "src/services/FirebaseConfig.ts",
    "android",
    "ios",
    "./*.{ts,js,json,md}",
    "/src/types/*.{ts.js}",
  ],

  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    parser: ts.parser,
    parserOptions: {
      ecmaFeatures: { jsx: true },
      tsconfigRootDir: path.resolve(__dirname),
    },
  },

  plugins: {
    react,
    "react-hooks": reactHooks,
    "react-native": reactNative,
    import: importPlugin,
  },

  rules: {
    "react/react-in-jsx-scope": "off", // não precisa importar React
    "react/prop-types": "off", // se usa TS, não precisa
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["warn"],
    "@typescript-eslint/ban-ts-comment": "off",
  },

  settings: {
    react: { version: "detect" },
  },
});
