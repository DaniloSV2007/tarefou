import { CameraView, useCameraPermissions } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import TopBar from "@/components/TopBar";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import api from "@/services/api";
import { ActivityIndicator } from "react-native-paper";
import React from "react";

export default function QRCode() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const theme = useAppTheme();
  const router = useRouter();
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);

  const handleQRCode = (qrcode: any) => {
    if (scanned || !qrcode.data) return;

    setScanned(true);
    setIsLoading(true);
    const url = qrcode.data;

    try {
      const path = Linking.parse(url).path;

      if (path) {
        console.log(path);
        getUserInfo(path);
      } else {
        console.warn("QR inválido");

        setIsLoading(false);
      }
    } catch (err) {
      console.error("Erro ao processar QR", err);
      setIsLoading(false);
    }

    // Permitir novo scan após 3s
    setTimeout(() => setScanned(false), 3000);
  };

  const getUserInfo = async (username: string) => {
    if (username === "") {
      return null;
    }
    try {
      const res = await api.get("/users/" + username);

      if (res.status === 200) {
        const user = encodeURIComponent(JSON.stringify(res.data));
        setIsLoading(false);
        router.push("/member/user/" + user);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <>
        <TopBar title="Scan QRCode" isBackButtonEnable />
        <View style={styles.container}>
          <Text>We need permission to access the camera</Text>
          <Button title="Grant" onPress={requestPermission} />
        </View>
      </>
    );
  }

  return (
    <>
      <TopBar title="Scan QRCode" isBackButtonEnable />
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={{ height: 300, width: 300 }}>
          {isFocused && (
            <CameraView
              style={styles.camera}
              onBarcodeScanned={handleQRCode}
              zoom={0.3}
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            />
          )}
          {isLoading && (
            <View
              style={{
                flex: 1,
                bottom: "45.5%",
                right: "45.5%",
                position: "absolute",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator size={32} />
            </View>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  camera: { flex: 1, borderWidth: 1, borderColor: "gray" },
});
