import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { AnimatedView, AppIcon } from "../../ui";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { UserRaceStatsDto } from "~/src/types";
import { Skeleton } from "moti/skeleton";
import { Icon } from "~/components/ui/icon";
import { InboxIcon } from "lucide-react-native";
import StatItem from "./StatItem";

interface RaceDetailsCardProps {
  stats: UserRaceStatsDto;
  event: {
    name: string;
    imageUrl: string;
    target: number;
  };
  isLoading?: boolean;
  onAdd?: () => void;
  onView?: () => void;
  onMessage?: () => void;
  onShare?: () => void;
}

export default function RaceDetailsCard({
  stats,
  event,
  isLoading,
  onAdd,
  onView,
  onMessage,
  onShare,
}: RaceDetailsCardProps) {
  const progressPercent =
    event.target > 0 ? (stats.distanceKm / event.target) * 100 : 0;

  const completedKm = stats.distanceKm.toFixed(2);
  const targetKm = event.target.toFixed(2);
  const isCompleted = progressPercent >= 100;

  // Determine progress bar color based on percentage
  const getProgressColor = () => {
    const p = Math.round(progressPercent);
    if (p <= 20) return "bg-gray-500";
    if (p <= 40) return "bg-orange-500";
    if (p <= 60) return "bg-yellow-500";
    if (p <= 80) return "bg-blue-500";
    return "bg-green-500";
  };

  if (isLoading) {
    // Dedicated skeleton layout preserving final structure
    return (
      <View className="bg-white rounded-2xl p-5 shadow-none">
        <View className="items-center mb-4">
          <Skeleton colorMode="light" width={114} height={114} radius={999} />
        </View>
        <View className="h-px bg-gray-200 mb-4" />
        <View className="flex-row justify-around mb-6 px-2">
          {[1, 2, 3].map((i) => (
            <View key={i} className="items-center">
              <Skeleton colorMode="light" width={58} height={58} radius={999} />
              <View className="mt-1">
                <Skeleton colorMode="light" width={72} height={14} radius={4} />
              </View>
              <View className="mt-1">
                <Skeleton colorMode="light" width={60} height={12} radius={4} />
              </View>
            </View>
          ))}
        </View>
        <View className="h-px bg-gray-200 mb-4" />
        <View className="mb-5">
          <View className="flex-row justify-between items-center mb-2">
            <Skeleton colorMode="light" width={140} height={14} radius={4} />
            <Skeleton colorMode="light" width={90} height={18} radius={4} />
          </View>
          <View className="flex w-full gap-1 flex-row items-center">
            <Skeleton colorMode="light" width={"100%"} height={16} radius={8} />
            <Skeleton colorMode="light" width={40} height={16} radius={4} />
          </View>
        </View>
        <View className="flex-row justify-between gap-3">
          {[1, 2, 3, 4].map((i) => (
            <View key={i} className={i < 3 ? "flex-1" : ""}>
              <Skeleton
                colorMode="light"
                width={i < 3 ? "100%" : 56}
                height={48}
                radius={16}
              />
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-2xl p-5 shadow-none">
      {/* Event Badge/Image */}
      <AnimatedView variant="scale" className="items-center mb-4">
        <View className="w-[114px] h-[114px] rounded-full bg-gray-200 items-center justify-center overflow-hidden">
          {event.imageUrl ? (
            <Image
              source={{ uri: event.imageUrl }}
              contentFit="cover"
              style={{ width: 114, height: 114 }}
            />
          ) : (
            <View className="w-[114px] h-[114px] rounded-full bg-blue-500 items-center justify-center">
              <Feather name="award" size={60} color="white" />
            </View>
          )}
        </View>
      </AnimatedView>
      <View className="h-px bg-gray-200 mb-4" />
      {/* Stats Row */}
      <View className="flex-row justify-between mb-6">
        <StatItem
          value={`${completedKm} KM`}
          label="Distance(km)"
          iconBgColor={stats.distanceKm > 0 ? "#4A90E2" : "#C8D1E1"}
          icon={<AppIcon name="distance" type="svg" size={24} color="white" />}
        />
        <StatItem
          value={`${stats.pace.toFixed(2)} KM`}
          label="Pace"
          iconBgColor={stats.pace > 0 ? "#00D68F" : "#C8D1E1"}
          icon={
            <MaterialCommunityIcons
              name="speedometer"
              size={24}
              color="white"
            />
          }
        />
        <StatItem
          value={stats.noOfRuns}
          label="No. of Runs"
          iconBgColor={stats.noOfRuns > 0 ? "#FF6B9D" : "#C8D1E1"}
          icon={
            <AppIcon
              name="running"
              type="FontAwesome5"
              size={24}
              color="white"
            />
          }
        />
      </View>

      {/* Divider */}
      <View className="h-px bg-gray-200 mb-4" />

      {/* Progress Section */}
      <View className="mb-5">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-10px font-medium text-gray-900">
            {completedKm} KM of {targetKm} KM
          </Text>
          <Text
            className={`text-base font-semibold ${
              isCompleted ? "text-green-500" : "text-blue-500"
            }`}
          >
            {isCompleted ? "Completed" : "In Progress"}
          </Text>
        </View>

        {/* Progress Bar */}
        <View className="flex w-full gap-1 flex-row">
          <View className="h-4 bg-gray-100 rounded-full overflow-hidden flex-1">
            <AnimatedView
              variant="slideX"
              direction="left"
              className={`h-full ${getProgressColor()} rounded-lg items-end justify-center pr-3`}
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            ></AnimatedView>
          </View>
          <Text className="text-xs font-medium text-gray-700 ">
            {Math.round(progressPercent)}%
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-between gap-3">
        <TouchableOpacity
          onPress={onAdd}
          className="flex-row items-center justify-center bg-gray-100 rounded-2xl py-3 px-5 flex-1"
          activeOpacity={0.7}
        >
          <Text className="text-base font-semibold text-gray-900 mr-2">
            Add
          </Text>
          <Feather name="plus" size={20} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onView}
          className="flex-row items-center justify-center bg-gray-100 rounded-2xl py-3 px-5 flex-1"
          activeOpacity={0.7}
        >
          <Text className="text-base font-semibold text-gray-900 mr-2">
            View
          </Text>
          <Feather name="arrow-right" size={20} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onMessage}
          className="items-center justify-center bg-gray-100 rounded-2xl py-3 px-4"
          activeOpacity={0.7}
        >
          <Icon as={InboxIcon} size={20} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={stats.distanceKm > 0 ? onShare : undefined}
          className="items-center justify-center bg-gray-100 rounded-2xl py-3 px-4"
          activeOpacity={0.7}
        >
          <Feather name="share-2" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
