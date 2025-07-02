import { CameraView, useCameraPermissions } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import TopBar from "@/components/TopBar";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import api from "@/services/api";
import { ActivityIndicator } from "react-native-paper";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import scan from "@/assets/scan.png";

export default function QRCode() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const theme = useAppTheme();
  const router = useRouter();
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();
  const insets = useSafeAreaInsets();

  const handleQRCode = (qrcode: any) => {
    if (scanned || !qrcode.data) return;

    setScanned(true);
    setIsLoading(true);
    const url = qrcode.data;

    try {
      const path = Linking.parse(url).path;

      if (path) {
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
      const res = await api.get("/users/" + username, {
        headers: {
          Authorization: `${token}`,
        },
      });

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
        <View
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
          ]}
        >
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
        <View style={{ flex: 1, paddingBottom: insets.bottom }}>
          {isFocused && (
            <CameraView
              style={styles.camera}
              onBarcodeScanned={handleQRCode}
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            >
              <Image source={scan} className="w-80 h-80" />
              {isLoading && (
                <View
                  style={{
                    flex: 1,
                    bottom: "46%",
                    right: "43%",
                    position: "absolute",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ActivityIndicator size={64} color="white" />
                </View>
              )}
            </CameraView>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
