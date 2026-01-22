import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppBar } from "~/components";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "~/components/ui/checkbox";
import { CheckIcon } from "~/components/ui/icon";
import { ApiActivityDto } from "~/src/types";
import { useCreate } from "~/src/hooks";
import { useLoading } from "~/src/context";
import Toast from "react-native-toast-message";
import { formatDistanceToNow } from "date-fns";

export default function SelectActivitiesScreen() {
  const { showLoading, hideLoading } = useLoading();
  const {
    activities: activitiesParam,
    eventId,
    appName,
  } = useLocalSearchParams<{
    activities: string;
    eventId: string;
    appName: string;
  }>();

  const activities: ApiActivityDto[] = activitiesParam
    ? JSON.parse(activitiesParam as string)
    : [];

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { mutate: submitActivities } = useCreate<any>("v2/races", [
    [`my_race_activity_details_${eventId}`],
    [`event_race_stats_${eventId}`],
    ["activities_all"],
    ["user_profile_info-with-stats"],
    [`my_race_stats`],
    [`my_race_positions`],
  ]);

  const toggleActivity = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === activities.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(activities.map((a) => a.id)));
    }
  };

  const handleSubmit = () => {
    const selectedActivities = activities.filter((a) => selectedIds.has(a.id));

    if (selectedActivities.length === 0) {
      Toast.show({
        type: "error",
        text1: "No Activities Selected",
        text2: "Please select at least one activity to upload",
      });
      return;
    }

    showLoading();

    const payload = selectedActivities.map((activity) => ({
      ...activity,
      event: eventId,
    }));

    console.log("📤 Submitting", selectedActivities.length, "activities");

    submitActivities(payload, {
      onSuccess: (res) => {
        hideLoading();
        Toast.show({
          type: "success",
          text1: "Success!",
          text2: `${selectedActivities.length} activities submitted successfully`,
        });
        router.back();
      },
      onError: (error) => {
        hideLoading();
        Toast.show({
          type: "error",
          text1: "Submission Failed",
          text2: error.message || "Failed to submit activities",
        });
      },
    });
  };

  const formatActivityDate = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch {
      return dateStr;
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <View className="flex-1 bg-white">
        <AppBar title="Select Activities" />

        <View className="flex-1 bg-[#F1F1F3]">
          {/* Header */}
          <View className="bg-white px-5 py-4 border-b border-gray-200">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-semibold">
                {activities.length} activities from {appName}
              </Text>
              <TouchableOpacity onPress={toggleSelectAll}>
                <Text className="text-red-500 font-medium">
                  {selectedIds.size === activities.length
                    ? "Deselect All"
                    : "Select All"}
                </Text>
              </TouchableOpacity>
            </View>
            <Text className="text-sm text-gray-600">
              {selectedIds.size} selected
            </Text>
          </View>

          {/* Activities List */}
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          >
            {activities.map((activity, index) => (
              <TouchableOpacity
                key={activity.id}
                onPress={() => toggleActivity(activity.id)}
                className="bg-white rounded-xl p-4 mb-3 shadow-none"
                activeOpacity={0.7}
              >
                <View className="flex-row items-start">
                  {/* Checkbox */}
                  <Checkbox
                    value={activity.id}
                    isChecked={selectedIds.has(activity.id)}
                    onChange={() => toggleActivity(activity.id)}
                    className="mr-3 mt-1"
                  >
                    <CheckboxIndicator>
                      <CheckboxIcon as={CheckIcon} />
                    </CheckboxIndicator>
                  </Checkbox>

                  {/* Activity Details */}
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900 mb-1">
                      {activity.name}
                    </Text>

                    <View className="flex-row items-center mb-2">
                      <View className="bg-red-100 px-2 py-1 rounded">
                        <Text className="text-xs text-red-600 font-medium uppercase">
                          {activity.type}
                        </Text>
                      </View>
                      <Text className="text-xs text-gray-500 ml-2">
                        {formatActivityDate(activity.dateLocal)}
                      </Text>
                    </View>

                    <View className="flex-row justify-between">
                      <View>
                        <Text className="text-xs text-gray-500">Distance</Text>
                        <Text className="text-sm font-semibold text-gray-900">
                          {activity.distanceKm.toFixed(2)} km
                        </Text>
                      </View>
                      <View>
                        <Text className="text-xs text-gray-500">Duration</Text>
                        <Text className="text-sm font-semibold text-gray-900">
                          {formatDuration(activity.movingTimeSec)}
                        </Text>
                      </View>
                      {activity.pacePerKm && (
                        <View>
                          <Text className="text-xs text-gray-500">Pace</Text>
                          <Text className="text-sm font-semibold text-gray-900">
                            {activity.pacePerKm.toFixed(2)} min/km
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Bottom Action Bar */}
          <View
            className="absolute bottom-0 left-0 right-0 bg-white px-5 py-4 border-t border-gray-200"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex-1 bg-gray-200 py-4 rounded-full"
              >
                <Text className="text-center text-gray-700 font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={selectedIds.size === 0}
                className={`flex-1 py-4 rounded-full ${
                  selectedIds.size === 0 ? "bg-gray-300" : "bg-red-500"
                }`}
              >
                <Text className="text-center text-white font-semibold">
                  Upload {selectedIds.size > 0 ? `(${selectedIds.size})` : ""}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
