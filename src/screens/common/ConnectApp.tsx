import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppBar } from "~/components";
import AppImages from "~/src/configs/AppImages";
import { AnimatedView } from "~/src/components";
import { useLoading } from "~/src/context";
import {
  getFitnessAppCredentials,
  connectStrava,
  connectFitbit,
  disconnectApp,
  isAppConnected,
  APPS_LIST,
  App,
} from "~/src/services";
import Toast from "react-native-toast-message";

function ConnectAppScreen() {
  const { showLoading, hideLoading } = useLoading();
  const [apps, setApps] = React.useState<App[]>(APPS_LIST);

  // Load saved connections on mount
  React.useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      const updatedApps = await Promise.all(
        apps.map(async (app) => ({
          ...app,
          isConnected: await isAppConnected(app.id),
          description: (await isAppConnected(app.id))
            ? "Connected"
            : `Connect your ${app.name}`,
        }))
      );
      setApps(updatedApps);
    } catch (error) {
      console.error("Error loading connections:", error);
    }
  };

  const handleConnect = async (appId: string) => {
    try {
      showLoading();

      switch (appId) {
        case "strava":
          await connectStrava();
          Toast.show({
            type: "success",
            text1: "Connected!",
            text2: "Strava connected successfully",
          });
          break;

        case "fitbit":
          await connectFitbit();
          Toast.show({
            type: "success",
            text1: "Connected!",
            text2: "Fitbit connected successfully",
          });
          break;

        case "google-fit":
          Alert.alert(
            "Coming Soon",
            "Google Fit integration is coming soon. Install expo-auth-session and expo-web-browser packages."
          );
          break;

        case "apple-health":
          Alert.alert(
            "Coming Soon",
            "Apple Health requires native HealthKit integration. Use react-native-health library."
          );
          break;

        case "samsung-health":
          Alert.alert(
            "Coming Soon",
            "Samsung Health requires native SDK integration."
          );
          break;

        default:
          Alert.alert("Error", "Unknown fitness app");
      }

      await loadConnections();
    } catch (error: any) {
      console.error("Connection error:", error);
      Alert.alert(
        "Connection Failed",
        error.message || "Failed to connect app"
      );
    } finally {
      hideLoading();
    }
  };

  const handleDisconnect = async (appId: string) => {
    Alert.alert(
      "Disconnect App",
      "Are you sure you want to disconnect this app?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Disconnect",
          style: "destructive",
          onPress: async () => {
            try {
              showLoading();
              await disconnectApp(appId);
              await loadConnections();
              Toast.show({
                type: "success",
                text1: "Disconnected",
                text2: "App disconnected successfully",
              });
            } catch (error: any) {
              console.error("Disconnect error:", error);
              Alert.alert("Error", "Failed to disconnect app");
            } finally {
              hideLoading();
            }
          },
        },
      ]
    );
  };

  const connectedCount = apps.filter((app) => app.isConnected).length;

  return (
    <>
      <SafeAreaView
        className="flex-1 bg-white"
        edges={["top", "left", "right"]}
      >
        <View className="flex-1 bg-white">
          <AppBar title={`Connect app`} />
          <View className="flex-1 bg-[#F1F1F3]">
            <KeyboardAwareScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingTop: 20,
                paddingBottom: 140,
              }}
              enableOnAndroid={true}
              extraScrollHeight={20}
              showsVerticalScrollIndicator={false}
            >
              <View className="bg-white rounded-[12px] p-[20px] shadow-none">
                {/* Header */}
                <AnimatedView variant="fade" className="mb-6">
                  <Text className="text-2xl font-bold text-gray-900">
                    Connected Apps ({connectedCount})
                  </Text>
                </AnimatedView>

                {/* Apps List */}
                <View className="gap-4">
                  {apps.map((app, index) => (
                    <AnimatedView
                      key={app.id}
                      variant="slideX"
                      direction="left"
                      delay={index * 100}
                      className={
                        index == apps.length - 1
                          ? ""
                          : "border-b border-gray-200 pb-4"
                      }
                    >
                      <View className="bg-white shadow-none flex-row items-center justify-between">
                        {/* Left: Logo + Info */}
                        <View className="flex-row items-center flex-1">
                          <View className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 items-center justify-center mr-4">
                            <Image
                              source={app.logo}
                              contentFit="contain"
                              style={{ width: 48, height: 48 }}
                            />
                          </View>

                          <View className="flex-1">
                            <Text className="text-lg font-semibold text-gray-900">
                              {app.name}
                            </Text>
                            <Text
                              className={`text-sm mt-1 ${
                                app.isConnected
                                  ? "text-gray-600"
                                  : "text-gray-400"
                              }`}
                            >
                              {app.description}
                            </Text>
                          </View>
                        </View>

                        {/* Right: Action Button */}
                        <TouchableOpacity
                          onPress={() =>
                            app.isConnected
                              ? handleDisconnect(app.id)
                              : handleConnect(app.id)
                          }
                          className={`px-5 py-3 rounded-xl ${
                            app.isConnected ? "bg-gray-200" : "bg-red-500"
                          }`}
                          activeOpacity={0.7}
                        >
                          <Text
                            className={`text-sm font-semibold ${
                              app.isConnected ? "text-gray-700" : "text-white"
                            }`}
                          >
                            {app.isConnected ? "Disconnect" : "Connect"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </AnimatedView>
                  ))}
                </View>
              </View>
            </KeyboardAwareScrollView>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

export default ConnectAppScreen;
