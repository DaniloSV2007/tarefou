import { useAppTheme } from "@/hooks/useAppTheme";
import api from "@/services/api";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function RedirectUser() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const theme = useAppTheme();

  const [already, setAlready] = useState(false);

  useEffect(() => {
    getUserInfo(params.user);
  }, []);

  const getUserInfo = async (username: string | string[]) => {
    if (already) return;
    setAlready(true);
    if (!username) return;
    try {
      const res = await api.get("/users/" + username);

      if (res.status === 200 && res.data) {
        const user = encodeURIComponent(JSON.stringify(res.data));
        router.push("/member/user/" + user);
      } else {
        router.back();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      {already && <Redirect href={"/(logged)"} />}
    </View>
  );
}
