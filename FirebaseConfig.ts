// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBzsaa8vx5j8Pv3oCkIxRuUBgReiHnC0nY",
  authDomain: "tarefou-10ff1.firebaseapp.com",
  projectId: "tarefou-10ff1",
  storageBucket: "tarefou-10ff1.firebasestorage.app",
  messagingSenderId: "543165319921",
  appId: "1:543165319921:web:f9b7daced5ad465822b750",
  measurementId: "G-DTNJHKZJR3",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
