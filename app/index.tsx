import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { useTypedRouter } from "~/src/configs";
import { SplashScreen } from "~/src/screens";
import { useAuthStore } from "~/src/store";

export default function SplashPage() {
  const { replace } = useTypedRouter();
  const setToken = useAuthStore((s) => s.setToken);
  const token = useAuthStore((s) => s.token);
  useEffect(() => {
    const verifyAuth = async () => {
      let storedToken = token;
      console.log(storedToken);
      if (!storedToken) {
        storedToken = await AsyncStorage.getItem("auth_token");
        console.log(storedToken);
        if (storedToken) await setToken(storedToken);
        console.log("storedToken", storedToken);
      }

      if (storedToken) {
        replace("/events");
        return;
      }

      replace("/auth/login");
    };

    verifyAuth();
  }, []);
  return <SplashScreen />;
}
