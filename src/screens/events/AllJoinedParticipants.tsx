import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, Platform, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "~/components/ui/avatar";
import { getInitials, timeAgo } from "~/src/utils";

interface Participant {
  name: string;
  imageUri: string | null;
  categoryTitle: string;
  createdAt: string;
}

export default function AllJoinedParticipants() {
  const { participants: participantsParam, eventTitle } =
    useLocalSearchParams();

  const participants: Participant[] = React.useMemo(() => {
    try {
      return JSON.parse(participantsParam as string);
    } catch {
      return [];
    }
  }, [participantsParam]);

  const renderParticipant = ({
    item,
    index,
  }: {
    item: Participant;
    index: number;
  }) => {
    const hasValidData = item.name !== "N/A" && item.categoryTitle !== "N/A";

    return (
      <View
        className={`flex-row items-center px-5 py-4 ${
          index !== participants.length - 1 ? "border-b border-gray-100" : ""
        }`}
      >
        {/* Avatar */}
        <Avatar className="w-[52px] h-[52px] mr-3">
          {item.imageUri ? (
            <AvatarImage source={{ uri: item.imageUri }} />
          ) : null}
          <AvatarFallbackText className="text-white">
            {getInitials(item.name)}
          </AvatarFallbackText>
        </Avatar>

        {/* Details */}
        <View className="flex-1">
          <Text
            className={`text-base font-semibold ${
              hasValidData ? "text-black" : "text-gray-400"
            }`}
            numberOfLines={1}
          >
            {item.name}
          </Text>

          {hasValidData && (
            <Text className="text-sm text-gray-600 mt-1">
              joined {item.categoryTitle}
            </Text>
          )}

          <Text className="text-xs text-gray-400 mt-1">
            {timeAgo(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <View className="flex-1">
        {/* Header */}
        <View className="px-5 py-4 border-b border-gray-200">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-4"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {Platform.OS === "ios" ? (
                <MaterialIcons name="arrow-back-ios" size={24} color="black" />
              ) : (
                <FontAwesome6 name="arrow-left" size={24} color="black" />
              )}
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-xl font-bold">
                Participants Who Have Joined
              </Text>
              {eventTitle && (
                <Text className="text-sm text-gray-500 mt-1" numberOfLines={1}>
                  {eventTitle}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Participants Count */}
        <View className="px-5 py-3 bg-gray-50">
          <Text className="text-base font-semibold">
            Participants ({participants.length})
          </Text>
        </View>

        {/* Participants List */}
        {participants.length > 0 ? (
          <FlatList
            data={participants}
            renderItem={renderParticipant}
            keyExtractor={(item, index) => `participant-${index}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <View className="flex-1 justify-center items-center px-5">
            <Text className="text-gray-400 text-base text-center">
              No participants have joined yet
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
