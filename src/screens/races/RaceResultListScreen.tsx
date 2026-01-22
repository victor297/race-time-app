import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppBar } from "~/components";
import { AnimatedView, AppSearch } from "~/src/components";
import { RaceResultDto, RaceResultResponse } from "~/src/types";
import { formatEventDate } from "~/src/utils";
import { useFetch } from "~/src/hooks";
import Toast from "react-native-toast-message";
import { Skeleton } from "moti/skeleton";
import { Constants } from "~/src/utils";

interface RaceResultCardProps {
  race: RaceResultDto;
  onPress: () => void;
}

const RaceResultCard = ({ race, onPress }: RaceResultCardProps) => (
  <AnimatedView variant="scaleY" direction="bottom">
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center bg-white mb-3 shadow-none px-0"
      activeOpacity={0.7}
    >
      {/* Event Image */}
      <View className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-200 mr-4">
        {race.event.imageUrl ? (
          <Image
            source={{ uri: race.event.imageUrl }}
            contentFit="cover"
            style={{ width: 64, height: 64 }}
          />
        ) : (
          <View className="w-full h-full items-center justify-center bg-blue-500">
            <Feather name="award" size={28} color="white" />
          </View>
        )}
      </View>

      {/* Event Details */}
      <View className="flex-1">
        <Text
          className="text-base font-semibold text-gray-900"
          numberOfLines={1}
        >
          {race.event.title}
        </Text>
        <Text className="text-sm text-gray-500 mt-1">
          {race.event.eventLocation}
        </Text>
        <Text className="text-sm text-gray-400 mt-0.5">
          {formatEventDate(race.event.eventDate)}{" "}
          {race.event.eventEndDate && (
            <> - {formatEventDate(race.event.eventEndDate)}</>
          )}
        </Text>
      </View>
    </TouchableOpacity>
  </AnimatedView>
);

const SkeletonRaceCard = () => (
  <View className="flex-row items-center bg-white mb-3 px-0">
    {/* Image skeleton */}
    <View className="mr-4">
      <Skeleton colorMode="light" width={64} height={64} radius={16} />
    </View>

    {/* Text skeleton */}
    <View className="flex-1">
      <Skeleton colorMode="light" width={180} height={16} radius={4} />
      <View className="mt-2">
        <Skeleton colorMode="light" width={140} height={14} radius={4} />
      </View>
      <View className="mt-1">
        <Skeleton colorMode="light" width={160} height={12} radius={4} />
      </View>
    </View>
  </View>
);

const RaceResultListScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading } = useFetch<RaceResultResponse>(
    [`my_races_results`],
    `v2/races/results`,
    {
      forceRefetch: true,
    }
  );

  const filteredRaces = data?.data.data?.filter((race) =>
    race.event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRacePress = (reac: RaceResultDto) => {
    router.push({
      pathname: `/race-results-details`,
      params: { data: JSON.stringify(reac) },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <View className="flex-1 bg-white">
        <AppBar title="Race Result" />

        <View className="flex-1 bg-[#F1F1F3]">
          {/* Search Bar */}
          {/* ✅ Always visible search bar */}
          <View className="py-4 px-2">
            <AppSearch onSearchText={setSearchQuery} placeholder="Search..." />
          </View>

          {/* Race List */}
          <View className="bg-white rounded-2xl py-4 px-6 mx-[8px]">
            <Text className="w-full text-lg font-semibold text-gray-900 mb-4">
              All ({filteredRaces?.length})
            </Text>

            {isLoading && Constants.config.production ? (
              // Skeleton loading state
              Array.from({ length: 5 }).map((_, index) => (
                <SkeletonRaceCard key={`skeleton-${index}`} />
              ))
            ) : (
              <FlatList
                data={filteredRaces}
                keyExtractor={(item) => `result-list-${item.event.id}`}
                renderItem={({ item }) => (
                  <RaceResultCard
                    race={item}
                    onPress={() => handleRacePress(item)}
                  />
                )}
                showsVerticalScrollIndicator={false}
                style={{ paddingHorizontal: 0, marginHorizontal: 0 }}
                contentContainerStyle={{
                  paddingHorizontal: 0,
                  marginHorizontal: 0,
                }}
                ListEmptyComponent={
                  <View className="items-center justify-center py-10 flex-1">
                    <Text className="text-gray-500 text-center w-full">
                      No races found
                    </Text>
                  </View>
                }
              />
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RaceResultListScreen;
