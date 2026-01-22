import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppBar } from "~/components";
import { AnimatedView } from "~/src/components";
import { RaceResultDto, ScoreBoardDto } from "~/src/types";
import { useLoading } from "~/src/context";
import { ca } from "zod/v4/locales";
import { useCreate } from "~/src/hooks";
import Toast from "react-native-toast-message";

interface InfoRowProps {
  label: string;
  value: string | number;
}

const InfoRow = ({ label, value }: InfoRowProps) => (
  <View className="flex-row justify-between items-center py-3 ">
    <Text className="text-sm text-gray-500">{label}</Text>
    <Text className="text-sm font-semibold text-black/75">{value}</Text>
  </View>
);

const AthleteResultScreen = () => {
  const { showLoading, hideLoading } = useLoading();
  const { event, score } = useLocalSearchParams<{
    event: string;
    score: string;
  }>();
  const race: RaceResultDto = React.useMemo(() => {
    try {
      return JSON.parse(event as string);
    } catch {
      return null;
    }
  }, [event]);
  const scoreBoard: ScoreBoardDto = React.useMemo(() => {
    try {
      return JSON.parse(score as string);
    } catch {
      return null;
    }
  }, [score]);
  const handleShare = () => {
    router.push({
      pathname: "/modal/share-achievement",
      params: {
        event: JSON.stringify(race),
        score: JSON.stringify(scoreBoard),
      },
    });
  };
  const { mutate } = useCreate<any>("v2/races/claim-result");

  const handleClaimResult = () => {
    Alert.alert("Claim result", "Are you sure you want to claim this result?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Claim",
        onPress: () => performClaim(),
      },
    ]);
  };
  const performClaim = () => {
    try {
      showLoading();
      const formData = {
        eventId: race.event.id,
        participantId: scoreBoard.user.id,
        distanceKm: scoreBoard.stats.distanceKm,
        bibNumber: scoreBoard.user.bibNumber,
        fullName: scoreBoard.user.fullName,
        gender: scoreBoard.user.gender,
        distanceCategory: scoreBoard.category.title,
        startTime: scoreBoard.time.finishTime,
        completionTime: scoreBoard.time.completionTime,
        completed: scoreBoard.stats.completed,
        averagePace: scoreBoard.stats.pace,
        rank: scoreBoard.rankings.overall,
        categoryRank: scoreBoard.rankings.category,
        genderRank: scoreBoard.rankings.gender,
      };
      try {
        mutate(formData, {
          onSuccess: async (res) => {
            console.log("Response", res);
            Toast.show({
              type: "success",
              text1: "Claimed!",
              text2: res.data.message ?? res.message,
            });
            hideLoading();
          },
          onError: (error) => {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: error.message,
            });
            hideLoading();
          },
        });
      } catch (err: any) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: err.message,
        });
        hideLoading();
      }
    } catch (error) {
      hideLoading();
      console.error("Error processing image:", error);
      Alert.alert("Error", "Failed to process the image");
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <View className="flex-1 bg-white">
        <AppBar title={race.event.title ?? ""} />
        <View className="flex-1 bg-[#F1F1F3]">
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              paddingHorizontal: 8,
              paddingVertical: 16,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View className="bg-white rounded-2xl p-5 shadow-none">
              {/* Event Header */}
              <AnimatedView variant="scale" className="mb-6">
                <View className="flex-row items-center">
                  {/* Event Badge */}
                  <View className="w-20 h-20 rounded-full bg-blue-500 items-center justify-center mr-4">
                    {race.event.imageUrl ? (
                      <Image
                        source={{ uri: race.event.imageUrl }}
                        contentFit="cover"
                        style={{ width: 80, height: 80, borderRadius: 40 }}
                      />
                    ) : (
                      <Feather name="award" size={40} color="white" />
                    )}
                  </View>

                  {/* Event Details */}
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-black">
                      {race.event.title}
                    </Text>
                    <Text className="text-xs text-black/50 mt-1">
                      {race.event.eventLocation}
                    </Text>
                    <Text className="text-xs text-black/50 mt-0.5">
                      {race.event.eventDate}{" "}
                      {race.event.eventEndDate && (
                        <> - {race.event.eventEndDate} </>
                      )}
                    </Text>
                  </View>
                </View>
              </AnimatedView>

              {/* Divider */}
              <View className="h-px bg-gray-200 mb-4" />

              {/* Athlete Information */}
              <AnimatedView variant="fade">
                <InfoRow label="Athlete" value={scoreBoard.user.fullName} />
                <InfoRow label="Bib Number" value={scoreBoard.user.bibNumber} />
                <InfoRow label="Time" value={scoreBoard.time.completionTime} />
                <InfoRow
                  label="Distance (KM)"
                  value={`${scoreBoard.stats.distanceKm} KM`}
                />
                <InfoRow label="Pace" value={`${scoreBoard.stats.pace} /KM`} />
                <InfoRow label="Category" value={scoreBoard.category.title} />
                <InfoRow label="Gender" value={scoreBoard.user.gender} />
                <InfoRow
                  label="Overall Rank"
                  value={`${scoreBoard.rankings.overall}${
                    scoreBoard.rankings.overall === 1
                      ? "st"
                      : scoreBoard.rankings.overall === 2
                        ? "nd"
                        : scoreBoard.rankings.overall === 3
                          ? "rd"
                          : "th"
                  }`}
                />
                <InfoRow
                  label="Gender Rank"
                  value={`${scoreBoard.rankings.gender}${
                    scoreBoard.rankings.gender === 1
                      ? "st"
                      : scoreBoard.rankings.gender === 2
                        ? "nd"
                        : scoreBoard.rankings.gender === 3
                          ? "rd"
                          : "th"
                  }`}
                />
                <InfoRow
                  label="Category Rank"
                  value={`${scoreBoard.rankings.category}${
                    scoreBoard.rankings.category === 1
                      ? "st"
                      : scoreBoard.rankings.category === 2
                        ? "nd"
                        : scoreBoard.rankings.category === 3
                          ? "rd"
                          : "th"
                  }`}
                />
              </AnimatedView>

              {/* Divider */}
              <View className="h-px bg-gray-200 my-6" />

              {/* Action Buttons */}
              <AnimatedView variant="scaleY" direction="bottom">
                {/* Share Button */}
                <TouchableOpacity
                  onPress={handleShare}
                  className="bg-gray-100 rounded-2xl py-4 flex-row items-center justify-center mb-3"
                  activeOpacity={0.7}
                >
                  <Text className="text-base font-semibold text-gray-900 mr-2">
                    Share Achievements
                  </Text>
                  <Feather name="upload" size={20} color="#000" />
                </TouchableOpacity>

                {/* Claim Result Button */}
                {scoreBoard.user.isMyResult && (
                  <TouchableOpacity
                    onPress={handleClaimResult}
                    className="bg-red-500 rounded-2xl py-4 flex-row items-center justify-center"
                    activeOpacity={0.7}
                  >
                    <Text className="text-base font-semibold text-white mr-2">
                      Claim Result
                    </Text>
                    <Feather name="check-circle" size={20} color="#FFF" />
                  </TouchableOpacity>
                )}
              </AnimatedView>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AthleteResultScreen;
