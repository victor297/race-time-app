import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppBar } from "~/components";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from "~/components/ui/select/select-actionsheet";
import { VStack } from "~/components/ui/vstack";
import { AppBtn } from "~/src/components";
import { RaceDetailsCard } from "~/src/components/common/cards";
import ActivityListCard from "~/src/components/profile/ActivityListCard";
import { useCreate, useFetch } from "~/src/hooks";
import {
  App,
  APPS_LIST,
  fetchActivitiesFromApp,
  isAppConnected,
} from "~/src/services";
import {
  ApiActivityDto,
  UserRaceActiviResponse,
  UserRaceStatsResponse,
} from "~/src/types";
import { useLoading } from "~/src/context";
import Toast from "react-native-toast-message";

function RaceDetailsScreen() {
  const { showLoading, hideLoading } = useLoading();
  const { eventId, name, imageUri, target, fullname, location, date } =
    useLocalSearchParams<{
      eventId: string;
      name: string;
      imageUri: string;
      target: string;
      fullname: string;
      location: string;
      date: string;
    }>();

  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const [appList, setAppList] = React.useState<App[]>(APPS_LIST);

  // Load app connection status on mount and when screen refocuses
  React.useEffect(() => {
    loadAppConnections();
  }, []);

  // Reload connections when returning from connect-app screen
  useFocusEffect(
    React.useCallback(() => {
      loadAppConnections();
    }, [])
  );

  const loadAppConnections = async () => {
    const updatedApps = await Promise.all(
      APPS_LIST.map(async (app) => ({
        ...app,
        isConnected: await isAppConnected(app.id),
      }))
    );
    setAppList(updatedApps);
  };

  const handleAdd = () => {
    console.log("Add activity");
    handleOpen();
  };

  const handleView = () => {
    router.push({
      pathname: "/view-event",
      params: { eventId },
    });
  };

  const handleMessage = () => {
    console.log("Open messages");
    router.push({ pathname: "/digital-asset", params: { eventId } });
  };

  const { data: userRaceData, isLoading: userRaceLoading } =
    useFetch<UserRaceStatsResponse>(
      [`event_race_stats_${eventId}`],
      `v2/races/stats/event/${eventId}`,
      {
        forceRefetch: true,
      }
    );

  const {
    data: activityData,
    isLoading: activityLoading,
    refetch,
  } = useFetch<UserRaceActiviResponse>(
    [`my_race_activity_details_${eventId}`],
    `v2/races/activities/event/${eventId}`,
    { forceRefetch: true }
  );

  const { mutate: submitActivities } = useCreate<any>("v2/races", [
    [`my_race_activity_details_${eventId}`],
    [`event_race_stats_${eventId}`],
    ["activities_all"],
    ["user_profile_info-with-stats"],
    [`my_race_stats`, ``],
    [`my_race_positions`],
  ]);
  const handleShare = () => {
    router.replace({
      pathname: "/modal/share-run",
      params: {
        data: JSON.stringify({
          fullname: fullname,
          target: target,
          title: name,
          date: date,
          location,
          result: {
            distance: userRaceData?.data.data.distanceKm,
            pace: userRaceData?.data.data.pace,
            runs: userRaceData?.data.data.noOfRuns,
          },
        }),
      },
    });
    console.log("Share race");
  };
  const handleSubmitRun = async (app: App) => {
    try {
      console.log(
        "🚀 Starting activity submission for:",
        app.name,
        "ID:",
        app.id
      );

      // Check if app is connected
      if (!app.isConnected) {
        console.log("❌ App not connected:", app.id);
        Alert.alert(
          "App Not Connected",
          `${app.name} is not connected. Please connect it in the Connect Apps screen first.`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "GO TO CONNECT APPS",
              onPress: () => {
                router.push("/modal/connect-app");
              },
            },
          ]
        );
        return;
      }

      console.log("✅ App is connected, proceeding...");
      showLoading();
      handleClose();

      // Fetch activities from the selected app
      Toast.show({
        type: "info",
        text1: "Fetching Activities",
        text2: `Pulling data from ${app.name}...`,
      });

      console.log("📥 Fetching activities from app:", app.id);
      const activities = await fetchActivitiesFromApp(app.id);
      console.log("📊 Activities fetched:", activities?.length || 0);

      hideLoading();

      if (!activities || activities.length === 0) {
        console.log("⚠️ No activities found");
        Alert.alert("No Activities", `No activities found in ${app.name}.`);
        return;
      }

      // Navigate to selection screen
      console.log("📋 Navigating to activity selection screen");
      router.push({
        pathname: "/select-activities",
        params: {
          activities: JSON.stringify(activities),
          eventId: eventId,
          appName: app.name,
        },
      });
    } catch (error: any) {
      console.error("💥 Exception in handleSubmitRun:", error);
      console.error("Error stack:", error.stack);
      hideLoading();
      Alert.alert(
        "Error",
        error.message || "Failed to fetch activities from the app"
      );
    }
  };

  const handleOpen = () => setShowActionsheet(true);
  const handleClose = () => setShowActionsheet(false);

  return (
    <>
      <SafeAreaView
        className="flex-1 bg-white"
        edges={["top", "left", "right"]}
      >
        <View className="flex-1 bg-white">
          <AppBar title={name} />
          <View className="flex-1 bg-[#F1F1F3]">
            <KeyboardAwareScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{
                paddingHorizontal: 8,
                paddingTop: 10,
                paddingBottom: 140,
              }}
              enableOnAndroid={true}
              extraScrollHeight={20}
              showsVerticalScrollIndicator={false}
            >
              <View className="py-4 gap-4">
                <RaceDetailsCard
                  onAdd={handleAdd}
                  onView={handleView}
                  onMessage={handleMessage}
                  onShare={handleShare}
                  stats={
                    userRaceData?.data.data ?? {
                      distanceKm: 0,
                      noOfRuns: 0,
                      pace: 0,
                    }
                  }
                  event={{
                    name: name || "",
                    imageUrl: imageUri || "",
                    target: Number(target) || 1,
                  }}
                  isLoading={userRaceLoading}
                />
                <ActivityListCard
                  status="all"
                  isLoading={activityLoading}
                  items={activityData?.data.data ?? []}
                />
              </View>
            </KeyboardAwareScrollView>
          </View>
        </View>
      </SafeAreaView>

      {/* APPS_LIST */}
      <Actionsheet
        isOpen={showActionsheet}
        onClose={handleClose}
        snapPoints={[50]}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent className="bg-white">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator className="bg-gray-500" />
          </ActionsheetDragIndicatorWrapper>
          <VStack className="w-full pt-5">
            <View className="px-6 mb-4">
              <Text className="text-xl font-bold text-gray-900">
                Submit Activities
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                Choose an app to pull your activities from
              </Text>
            </View>
            <ScrollView>
              {appList.map((app: App) => (
                <View
                  key={app.id}
                  className="flex-row justify-between items-center gap-4 mb-6 px-6"
                >
                  <View className="flex-1 items-center flex-row gap-4">
                    <Image
                      source={app.logo}
                      style={{ width: 48, height: 48, borderRadius: 24 }}
                      resizeMode="contain"
                    />
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-900">
                        {app.name}
                      </Text>
                      <Text
                        className={`text-xs ${
                          app.isConnected ? "text-green-600" : "text-gray-400"
                        }`}
                      >
                        {app.isConnected ? "Connected" : "Not connected"}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    className={`p-2 ${
                      app.isConnected ? "bg-red-500" : "bg-gray-300"
                    } ${app.isConnected ? "text-gray-900" : "text-primary-500"} rounded-sm`}
                    onPress={() => handleSubmitRun(app)}
                  >
                    <Text>Submit</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </VStack>
          <ActionsheetItem onPress={handleClose}>
            <ActionsheetItemText>Cancel</ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
}

export default RaceDetailsScreen;
