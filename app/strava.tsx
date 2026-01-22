import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

/**
 * Strava OAuth callback handler
 * This screen handles the deep link: myracetime://strava?code=XXX
 */
export default function StravaCallback() {
  const params = useLocalSearchParams();
  const code = params.code as string;
  const error = params.error as string;

  useEffect(() => {
    const handleCallback = async () => {
      if (error) {
        console.log("Strava authorization error:", error);
        // Navigate back with error
        router.replace({
          pathname: "/(drawer)/(tabs)/profile",
          params: { stravaError: error },
        });
        return;
      }

      if (code) {
        console.log("Strava authorization code received:", code);
        // The WebBrowser.openAuthSessionAsync will automatically handle this
        // Just close this screen
        router.replace("/(drawer)/(tabs)/profile");
      }
    };

    handleCallback();
  }, [code, error]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <ActivityIndicator size="large" color="#FC4C02" />
      <Text style={{ marginTop: 16, fontSize: 16, color: "#666" }}>
        Connecting to Strava...
      </Text>
    </View>
  );
}
